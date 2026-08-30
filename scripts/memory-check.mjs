#!/usr/bin/env node
/**
 * Замер утечек памяти клиента через Chrome DevTools Protocol.
 *
 * Гоняет браузер по страницам (react-router монтирует
 * и размонтирует страницы), после каждой итерации принудительно вызывает GC
 * и снимает метрики Performance.getMetrics. Рост JSHeapUsedSize после GC
 * между 2-й и последней итерацией < 10% считается нормой.
 *
 * Запуск: yarn memory:check [флаги]
 *   (предварительно поднять клиент: npm run dev/yarn dev --scope=client)
 *
 * Флаги (перекрывают env):
 *   --browser=chrome      — какой браузер искать: chrome, chromium,
 *                           либо абсолютный путь к бинарнику
 *                           (default: env CHROME_PATH, затем chrome)
 *   --url=http://...      — базовый URL приложения (default: env MEMORY_CHECK_URL
 *                           или http://localhost:3000)
 *   --iterations=5        — число циклов навигации (default: env MEMORY_CHECK_ITERATIONS или 5)
 *   --login=.. --password=..  — креды пользователя, включают авторизацию
 *                           и приватные страницы (default: env MEMORY_CHECK_LOGIN/PASSWORD)
 *   --metrics=A,B,C       — дополнительные метрики Performance.getMetrics для вывода
 *                           (default: Nodes,JSEventListeners,Documents, --list-metrics — все доступные)
 *   --list-browsers       — показать известные браузеры и выйти
 *   --list-metrics        — показать метрики, которые отдаёт браузер, и выйти
 */
import { spawn, spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { parseArgs } from 'node:util'
import WebSocket from 'ws'

const BROWSERS = {
  chrome: {
    binaries: ['google-chrome', 'google-chrome-stable', 'chrome'],
    paths: [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    ],
  },
  chromium: {
    binaries: ['chromium', 'chromium-browser'],
    paths: [
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      '/Applications/Arc.app/Contents/MacOS/Arc',
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
    ],
  },
}

const DEFAULT_METRICS = ['Nodes', 'JSEventListeners', 'Documents']
const HEAP_METRIC = 'JSHeapUsedSize'
const GROWTH_THRESHOLD_PERCENT = 10

const PUBLIC_ROUTES = ['/', '/rules', '/signin', '/signup']
const PRIVATE_ROUTES = ['/game', '/profile', '/leaderboard', '/forum']
const NAV_PAUSE_MS = 400
const APP_READY_TIMEOUT_MS = 30000
const APP_READY_SELECTOR = `document.getElementById('root')?.children.length > 0`

const { values: args } = parseArgs({
  options: {
    browser: { type: 'string' },
    url: { type: 'string' },
    iterations: { type: 'string' },
    login: { type: 'string' },
    password: { type: 'string' },
    metrics: { type: 'string' },
    'list-browsers': { type: 'boolean' },
    'list-metrics': { type: 'boolean' },
    help: { type: 'boolean', short: 'h' },
  },
})

if (args.help) {
  console.log(readFileSync(new URL(import.meta.url), 'utf8').match(/\/\*\*([\s\S]*?)\*\//)[1])
  process.exit(0)
}

if (args['list-browsers']) {
  console.log(`Известные браузеры: ${Object.keys(BROWSERS).join(', ')}`)
  console.log('Также можно передать абсолютный путь к бинарнику: --browser=/path/to/browser')
  process.exit(0)
}

const BASE_URL = args.url || process.env.MEMORY_CHECK_URL || 'http://localhost:3000'
const ITERATIONS = Number(args.iterations || process.env.MEMORY_CHECK_ITERATIONS) || 5
const LOGIN = args.login || process.env.MEMORY_CHECK_LOGIN
const PASSWORD = args.password || process.env.MEMORY_CHECK_PASSWORD
const EXTRA_METRICS = (args.metrics?.split(',').map(m => m.trim()).filter(Boolean)) ?? DEFAULT_METRICS

const which = binary => {
  const command = process.platform === 'win32' ? 'where' : 'which'
  const result = spawnSync(command, [binary], { encoding: 'utf8' })
  if (result.status !== 0) {
    return null
  }
  return result.stdout.split('\n')[0].trim() || null
}

const findBrowser = name => {
  if (existsSync(name)) {
    return name
  }
  const spec = BROWSERS[name]
  if (!spec) {
    throw new Error(
      `Неизвестный браузер "${name}". Известные: ${Object.keys(BROWSERS).join(', ')}, ` +
        'либо передайте абсолютный путь к бинарнику.'
    )
  }
  for (const binary of spec.binaries) {
    const found = which(binary)
    if (found) {
      return found
    }
  }
  const local = spec.paths?.find(p => existsSync(p))
  if (local) {
    return local
  }
  throw new Error(
    `Браузер "${name}" не найден: нет в PATH (${spec.binaries.join(', ')}) ` +
      `и по типовым путям. Выберите другой через --browser (список: --list-browsers).`
  )
}

class CdpConnection {
  constructor(wsUrl) {
    this.nextId = 1
    this.pending = new Map()
    this.consoleErrors = []
    this.ws = new WebSocket(wsUrl, { maxPayload: 256 * 1024 * 1024 })
    this.ws.on('message', raw => {
      const msg = JSON.parse(raw.toString())
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id)
        this.pending.delete(msg.id)
        if (msg.error) {
          reject(new Error(`${msg.error.message} (${msg.error.code})`))
        } else {
          resolve(msg.result)
        }
      } else if (msg.method === 'Runtime.exceptionThrown') {
        this.consoleErrors.push(
          msg.params.exceptionDetails?.exception?.description ??
            msg.params.exceptionDetails?.text ??
            'unknown exception'
        )
      } else if (
        msg.method === 'Runtime.consoleAPICalled' &&
        msg.params.type === 'error'
      ) {
        this.consoleErrors.push(
          msg.params.args
            .map(a => a.value ?? a.description ?? '')
            .join(' ')
            .slice(0, 300)
        )
      }
    })
  }

  open() {
    return new Promise((resolve, reject) => {
      this.ws.once('open', resolve)
      this.ws.once('error', reject)
    })
  }

  send(method, params = {}, sessionId) {
    const id = this.nextId++
    const payload = { id, method, params }
    if (sessionId) {
      payload.sessionId = sessionId
    }
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject })
      this.ws.send(JSON.stringify(payload))
    })
  }

  close() {
    this.ws.close()
  }
}

const launchBrowser = async browserPath => {
  const userDataDir = mkdtempSync(path.join(tmpdir(), 'memory-check-'))
  const browser = spawn(
    browserPath,
    [
      '--headless=new',
      '--remote-debugging-port=0',
      `--user-data-dir=${userDataDir}`,
      '--no-first-run',
      '--disable-extensions',
      '--mute-audio',
      'about:blank',
    ],
    { stdio: 'ignore' }
  )

  const portFile = path.join(userDataDir, 'DevToolsActivePort')
  let port = null
  for (let i = 0; i < 50; i += 1) {
    try {
      port = Number(readFileSync(portFile, 'utf8').split('\n')[0])
      if (port) break
    } catch {
      // файл ещё не появился
    }
    await delay(200)
  }
  if (!port) {
    browser.kill('SIGKILL')
    throw new Error('Браузер не сообщил порт отладки (DevToolsActivePort)')
  }

  const version = await (
    await fetch(`http://127.0.0.1:${port}/json/version`)
  ).json()
  return { browser, userDataDir, wsUrl: version.webSocketDebuggerUrl }
}

const evaluate = (cdp, sessionId, expression) =>
  cdp
    .send('Runtime.evaluate', { expression, returnByValue: true }, sessionId)
    .then(r => r.result.value)

const waitFor = async (cdp, sessionId, expression, timeoutMs, label) => {
  const startedAt = Date.now()
  while (Date.now() - startedAt < timeoutMs) {
    if (await evaluate(cdp, sessionId, expression)) {
      return
    }
    await delay(500)
  }
  throw new Error(`Таймаут ожидания: ${label}`)
}

const navigateInSpa = async (cdp, sessionId, route) => {
  await evaluate(
    cdp,
    sessionId,
    `(() => {
      const link = document.querySelector('a[href="${route}"]')
      if (link) { link.click(); return }
      history.pushState({}, '', '${route}')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })()`
  )
  await delay(NAV_PAUSE_MS)
}

const setReactInputValue = (name, value) => `(() => {
  const input = document.querySelector('input[name="${name}"]')
  if (!input) return false
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
  setter.call(input, ${JSON.stringify(value)})
  input.dispatchEvent(new Event('input', { bubbles: true }))
  input.dispatchEvent(new Event('blur', { bubbles: true }))
  return true
})()`

const login = async (cdp, sessionId) => {
  await navigateInSpa(cdp, sessionId, '/signin')
  await waitFor(cdp, sessionId, `!!document.querySelector('input[name="login"]')`, APP_READY_TIMEOUT_MS, 'форма входа')
  await evaluate(cdp, sessionId, setReactInputValue('login', LOGIN))
  await evaluate(cdp, sessionId, setReactInputValue('password', PASSWORD))
  await delay(300)
  await evaluate(
    cdp,
    sessionId,
    `document.querySelector('button[type="submit"]')?.click()`
  )
  try {
    await waitFor(
      cdp,
      sessionId,
      `location.pathname !== '/signin'`,
      15000,
      'редирект после входа'
    )
    return true
  } catch {
    return false
  }
}

const getMetrics = async (cdp, sessionId, names) => {
  const { metrics } = await cdp.send('Performance.getMetrics', {}, sessionId)
  return Object.fromEntries(
    names.map(name => [name, metrics.find(m => m.name === name)?.value ?? null])
  )
}

const collectMetrics = async (cdp, sessionId, names) => {
  await cdp.send('HeapProfiler.collectGarbage', {}, sessionId)
  await delay(200)
  return getMetrics(cdp, sessionId, names)
}

const formatMetric = (name, value) => {
  if (value === null) {
    return 'n/a'
  }
  return name.endsWith('Size') ? (value / 1024 / 1024).toFixed(1) : String(Math.round(value))
}

const main = async () => {
  let browser
  let userDataDir
  let cdp
  try {
    const browserPath = findBrowser(args.browser || process.env.CHROME_PATH || 'chrome')

    if (args['list-metrics']) {
      const launched = await launchBrowser(browserPath)
      browser = launched.browser
      userDataDir = launched.userDataDir
      cdp = new CdpConnection(launched.wsUrl)
      await cdp.open()
      const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' })
      const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true })
      await cdp.send('Performance.enable', {}, sessionId)
      const { metrics } = await cdp.send('Performance.getMetrics', {}, sessionId)
      console.log('Метрики Performance.getMetrics:')
      for (const m of metrics) {
        console.log(`  ${m.name}`)
      }
      return
    }

    await fetch(BASE_URL, { method: 'HEAD' }).catch(() => {
      throw new Error(
        `Приложение недоступно на ${BASE_URL}. Сначала запустите: yarn dev --scope=client`
      )
    })

    const metricNames = [HEAP_METRIC, ...EXTRA_METRICS.filter(m => m !== HEAP_METRIC)]

    const launched = await launchBrowser(browserPath)
    browser = launched.browser
    userDataDir = launched.userDataDir

    cdp = new CdpConnection(launched.wsUrl)
    await cdp.open()

    const { targetId } = await cdp.send('Target.createTarget', {
      url: BASE_URL,
    })
    const { sessionId } = await cdp.send('Target.attachToTarget', {
      targetId,
      flatten: true,
    })

    await cdp.send('Page.enable', {}, sessionId)
    await cdp.send('Runtime.enable', {}, sessionId)
    await cdp.send('Performance.enable', {}, sessionId)
    await cdp.send('HeapProfiler.enable', {}, sessionId)
    await waitFor(cdp, sessionId, APP_READY_SELECTOR, APP_READY_TIMEOUT_MS, 'монтирование приложения')

    let routes = PUBLIC_ROUTES
    if (LOGIN && PASSWORD) {
      const loggedIn = await login(cdp, sessionId)
      if (loggedIn) {
        console.log('Авторизация прошла, добавляю приватные страницы в обход.')
        routes = [...PUBLIC_ROUTES, ...PRIVATE_ROUTES]
      } else {
        console.log(
          'Авторизация НЕ прошла (остались на /signin) — обхожу только публичные страницы.'
        )
      }
    }

    const available = await getMetrics(cdp, sessionId, metricNames)
    const missing = metricNames.filter(name => available[name] === null)
    if (missing.length > 0) {
      console.log(
        `Внимание: метрики недоступны в этом браузере и будут пропущены: ${missing.join(', ')}`
      )
    }
    const activeMetrics = metricNames.filter(name => available[name] !== null)

    for (const route of routes) {
      await navigateInSpa(cdp, sessionId, route)
    }

    const rows = []
    for (let i = 0; i < ITERATIONS; i += 1) {
      for (const route of routes) {
        await navigateInSpa(cdp, sessionId, route)
      }

      await navigateInSpa(cdp, sessionId, '/')
      rows.push(await collectMetrics(cdp, sessionId, activeMetrics))
    }

    console.log(`\nЗамер памяти: ${BASE_URL} (браузер: ${browserPath})`)
    console.log(`Маршруты за цикл: ${routes.join(' → ')}`)
    const header = ['Итерация', ...activeMetrics.map(m => (m.endsWith('Size') ? `${m}, МБ` : m))]
    console.log(`\n| ${header.join(' | ')} |`)
    console.log(`| ${header.map(() => '---').join(' | ')} |`)
    rows.forEach((row, i) => {
      const cells = activeMetrics.map(name => formatMetric(name, row[name]))
      console.log(`| ${i + 1} | ${cells.join(' | ')} |`)
    })

    const last = rows[rows.length - 1]
    const totalGrowth =
      ((last[HEAP_METRIC] - rows[0][HEAP_METRIC]) / rows[0][HEAP_METRIC]) * 100

    const baseline = rows.length > 1 ? rows[1] : rows[0]
    const growthPercent =
      ((last[HEAP_METRIC] - baseline[HEAP_METRIC]) / baseline[HEAP_METRIC]) * 100
    console.log(
      `\nРост heap 1 → ${ITERATIONS}: ${totalGrowth.toFixed(1)}%, ` +
        `без учёта прогрева (2 → ${ITERATIONS}): ${growthPercent.toFixed(1)}%`
    )

    if (cdp.consoleErrors.length > 0) {
      console.log(
        `\nОшибки в консоли за время прогона (${cdp.consoleErrors.length}):`
      )
      for (const err of cdp.consoleErrors.slice(0, 10)) {
        console.log(`  - ${err}`)
      }
    }

    if (growthPercent < GROWTH_THRESHOLD_PERCENT) {
      console.log(
        `Вердикт: утечек не обнаружено (рост со 2-й итерации < ${GROWTH_THRESHOLD_PERCENT}%).`
      )
    } else {
      console.log(
        `Вердикт: heap растёт быстрее порога ${GROWTH_THRESHOLD_PERCENT}% — проверьте вручную в DevTools.`
      )
      process.exitCode = 1
    }
  } finally {
    cdp?.close()
    browser?.kill('SIGKILL')
    if (userDataDir) {
      rmSync(userDataDir, { recursive: true, force: true })
    }
  }
}

main().catch(err => {
  console.error(`Ошибка: ${err.message}`)
  process.exitCode = 1
})
