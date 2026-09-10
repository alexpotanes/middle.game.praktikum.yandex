### Как запускать?

1. Убедитесь что у вас установлен `node` и `docker`
2. На данный момент нужно перейти на ветку dev
3. Выполнить команду `yarn install` для установки зависимостей
4. Выполнить команду `yarn bootstrap`
5. Выполнить команду `yarn workspace @warchest/shared build` для сборки shared части
6. Выполнить команду `docker compose up` для поднятия контейнеров докера
7. Запустить проект командой `yarn dev`
8. Перейти http://localhost:3000/

Чтобы запустить только клиент выполните команду `yarn dev --scope=client`
Чтобы запустить только server выполните команду `yarn dev --scope=server`

### Страницы

Публичные страницы:

- `/` - главная
- `/rules` - как играть

Страницы для неавторизованного пользователя:

- `/signin` - логин
- `/signup` - регистрация

Страницы для авторизованного пользователя:

- `/profile` - профиль
- `/game` - игра
- `/leaderboard` - лидерборд
- `/forum` - форум
- `/forum/:topicId` - топик форума

Страницы ошибок:

- `/400` - некорректный запрос
- `/500` - ошибка на сервере

Невалидный роут ведёт на страницу 404.

### Проверка авторизации

Состояние сессии живёт в `authSlice` (`isAuthenticated`, `sessionChecked`, `status`, `error`). При старте приложения `main.tsx` диспатчит `fetchCurrentUserThunk`, пока запрос не завершился — `sessionChecked` равен `false`.

Читать это состояние напрямую через селекторы в компонентах не нужно, для этого есть хук и два HOC:

- `hooks/useAuth.ts` — хук, единственная точка доступа к состоянию сессии. Отдаёт `isAuthenticated`, `sessionChecked`, `status`, `error` и производный `isLoading`. Используется в `Header` (какое меню показать), `ProfileContent`, `SignIn` и `SignUp` (ошибка запроса и состояние кнопки)
- `hocs/withAuth.tsx` — HOC для приватных страниц. Внутри `AuthGate`: пока сессия не проверена — `Loader`, если гость — редирект на `/signin` с сохранением текущего пути в `location.state.from`, иначе рендерит страницу
- `hocs/withGuest.tsx` — HOC для `/signin` и `/signup`. Зеркальная логика: авторизованного возвращает на `from` (или на `/`), чтобы он не видел формы входа

Оба HOC применяются в одном месте — `router/routes.tsx`, где приватные роуты обёрнуты в `withAuth`, а гостевые в `withGuest`. Сами страницы про авторизацию ничего не знают.

### OAuth через Яндекс

Кнопка «Войти через Яндекс» есть на `/signin` и `/signup`. Логика на клиенте - в `utils/oauth.ts`, `api/oauthApi.ts` и двух thunk'ах в `thunks/authThunks.ts`:

- `startYandexOAuthThunk` - по клику запрашивает `service_id` и готовый `auth_url` (`GET /oauth/yandex/service-id`) и делает `document.location.href` на полученный `auth_url`
- `loginWithYandexThunk` - при возврате с `code` в query отправляет его на `POST /oauth/yandex`, затем подтягивает пользователя через `authApi.getUser()`

Как и остальные `/auth/*` запросы, оба OAuth-запроса идут не напрямую на `ya-praktikum.tech`, а через наш собственный сервер (`packages/server`), который проксирует их на API Практикума и пробрасывает/переписывает куки - см. `server/routes/oauth.ts`, `server/controllers/oauthController.ts`, `server/services/oauthService.ts` (по образцу уже существующих `auth`-роутов). В отличие от простого 1-в-1 проксирования, сервер здесь берёт на себя часть OAuth-логики:

- адрес провайдера (`oauth.yandex.ru/authorize`) и сборка `auth_url` целиком на сервере (`oauthService.ts`) - клиент про конкретного провайдера ничего не знает, поэтому смена провайдера/окружения не требует правок клиента и пересборки
- `redirect_uri`, который присылает клиент, - это часть security-контракта OAuth, поэтому сервер не доверяет ему безусловно: `utils/validators.ts` сверяет origin с allow-list'ом из `OAUTH_ALLOWED_REDIRECT_ORIGINS` (через запятую; по умолчанию - `http://localhost:${CLIENT_PORT}`)
- тело `POST /oauth/yandex` валидируется на уровне контроллера (наличие `code`, валидный и разрешённый `redirect_uri`) до похода во внешний API - ошибка валидации возвращается клиенту как понятная 400-ка через общий `errorHandler`, а не проксируется наружу
- весь `/oauth` защищён `express-rate-limit` (`middleware/rateLimiter.ts`), чтобы прокси не использовали для неограниченного числа запросов к API Практикума

`redirect_uri` во всех запросах - это `window.location.origin` (без пути и без слеша в конце), он же передаётся при первом запросе `service_id`. `App.tsx` при монтировании проверяет `code` в query параметрах текущего адреса (`AuthBootstrap`), если он есть - логинится; `code` убирается из URL только при успешном логине (через `router.navigate(..., { replace: true })` из `utils/oauth.ts`, а не напрямую через `window.history`, чтобы не расходиться с состоянием роутера) - если обмен `code` завершится ошибкой, он остаётся в адресной строке, и обновление страницы повторит попытку.

### Валидация форм

Правила полей собраны в `utils/validation.ts`: объект `validators`, где на каждое поле приходится функция `(value) => string | undefined`. Возвращённая строка — текст ошибки, `undefined` — поле валидно. Покрыты `first_name`, `second_name`, `login`, `email`, `password`, `phone`, `oldPassword`, `newPassword`.

Работу с формой берёт на себя хук `hooks/useForm.ts`:

- поля описываются как `Partial<Record<ValidatorKey, string>>` — форме нужны только свои поля, а не все существующие
- `handleBlur` помечает поле как `touched` и валидирует его; `handleChange` показывает ошибку на лету только после первого blur, чтобы не ругаться на поле, которое ещё заполняют
- `handleSubmit` перед отправкой прогоняет все поля через `validate()`, подсвечивает все ошибки сразу и вызывает колбэк только если форма валидна
- `isValid` считается по текущим значениям и используется для блокировки кнопки отправки
- `setFormValues` подставляет значения с сервера (профиль) и сбрасывает ошибки и `touched`

Хук используют `SignIn`, `SignUp`, `ProfileDetailsForm` и `PasswordForm`.

### Игровой движок (Canvas API)

Движок лежит в `packages/client/src/game/` и не зависит от React — подключается к любому `<canvas>`.

- `core` — `Game` (точка входа: canvas, цикл, сцены, `destroy()`), `GameLoop` (`requestAnimationFrame` + delta time), `Scene` и `GameObject` (базовые классы: `update(dt, input)` + `render(renderer)`, zIndex)
- `input` — `InputManager`: клавиатура (`isKeyDown`, `wasKeyPressed`) и мышь (позиция в логических координатах, клики), покадровые флаги
- `render` — `Renderer`: обёртка над Canvas 2D (`fillRect`, `drawPolygon`, `drawText`, `drawImage`)
- `math` — `Vector2` и `Rect` с `intersects()` для обнаружения столкновений
- `hex` — гексагональная сетка: axial-координаты, `HexGrid` с hit-test'ом клика, соседями и дистанцией (основа поля War Chest)
- `animation` — `Animator` (спрайтовые клипы) и `Tween`/`TweenManager` (плавные перемещения)

### Архитектура игры

Партия 1 на 1 по WebSocket, сервер — источник истины. Три пакета:

- `packages/shared` (`@warchest/shared`) — общие правила: типы состояния, редьюсер ходов, тактики юнитов, драфт, протокол сообщений. Используется и сервером (валидация и применение ходов), и клиентом (подсветка доступных действий)
- `packages/server/ws` — `ws`-сервер на `/ws`: `MatchmakingQueue` (очередь 1v1), `MatchSession` (сессия партии: драфт → игра → финиш, обработка сдачи и дисконнекта)
- `packages/client/src/game` — движок + `GameClient` (соединение, очередь сообщений до reconnect) + `scenes/WarChestScene` (вся игровая отрисовка на canvas)

#### Как проходит партия

1. «Найти игру» → `queue.join`, сервер матчит двоих и создаёт `MatchSession`
2. Драфт: общий пул из 15 юнитов, игроки по очереди выбирают по 4 юнита (взятое недоступно другому) — сообщения `draft.state` / `draft.pick`
3. После 8 пиков сервер собирает `MatchState` из выбранных юнитов (`createInitialMatch`) и шлёт `match.start`
4. Ходы: клиент шлёт `match.action`, сервер прогоняет `applyAction` из shared и рассылает новое состояние `match.state`. Раунд: 3 монеты из мешка в руку → использованные в сброс → мешок пуст — сброс перемешивается
5. Победа: все 6 маркеров контроля на локациях, уничтожение всех фишек противника, сдача или дисконнект → `match.end`

#### Правила и тактики (shared)

- `reducer.ts` — `applyAction`/`validateAction`: все действия (deploy, bolster, move, attack, control, recruit, pass, claimInitiative, tactic) с проверками и кодами ошибок
- `tactics/` — класс на каждую тактику (15 юнитов): пассивные хуки (`moveRange`, `deployAnywhere`, `protectsAdjacentAllies`, `counterattacks`, `onAttackKilled`) опрашивает редьюсер, активные (`activeTargets`/`validateActive`/`applyActive`) тратят монету из руки
- `hex.ts` — axial-геометрия (соседи, дистанция, прямые линии), `setup.ts` — сборка стартового состояния, `draft.ts` — правила драфта

#### Игровой UI (клиент)

- `WarChestScene` — поле, руки, резерв, мешок/сброс. Цветовая подсветка целей: жёлтое — ход, красное — атака, фиолетовое — тактика; кнопки в клетке (З — захват, А — атака, Т — тактика). Модалка «колода» с карточками юнитов
- Экраны — React-компоненты в `src/components/game/`: `IdleScreen`, `SearchingScreen`, `DraftScreen` , `GameScreen` (HUD), `EndScreen`. Переключение по статусу в `matchSlice` (Redux)

### Форум

Бэкенд форума лежит в `packages/server` и использует Sequelize (PostgreSQL) - модели и миграции в `packages/server/models` и `packages/server/migrations`.

Сущности:

- `Topic` - топик форума
- `Comment` - комментарий/ответ на комментарий (одна таблица с self-reference `parentId`, дерево неограниченной глубины)
- `Reaction` - заготовка таблицы под эмодзи-реакции на комментарии (структура БД есть, бизнес-логика реализуется отдельной задачей)

После `yarn bootstrap` (или при первом поднятии Postgres) накатите миграции:

```
yarn db:migrate
```

Откатить последнюю миграцию - `yarn db:migrate:undo`, откатить все - `yarn db:migrate:undo:all`.

В Docker (`docker compose up`) миграции применяются автоматически: `Dockerfile.server` кладёт в прод-образ `.sequelizerc`, `config/` и `migrations/`, а `packages/server/docker-entrypoint.sh` перед запуском сервера выполняет `sequelize-cli db:migrate` - на чистой БД таблицы форума появятся сами, отдельный migration-job не нужен. Пропустить этот шаг (например, если миграции раскатываются отдельным пайплайном) - переменная окружения `SKIP_DB_MIGRATIONS=true`.

Все ручки `/forum/*` закрыты авторизацией: без валидной сессии (кука, проверяемая через API Практикума) сервер отвечает 403. Автором топика/комментария становится текущий авторизованный пользователь. Ответы API Практикума, которые не подтверждают невалидность сессии (429, 5xx, сетевые ошибки) - это сбой upstream-сервиса, а не наш 403: `requireAuth` пробрасывает такие статусы как 429/502, а не подменяет их на "нужна авторизация".

`/forum/*` также ограничен `express-rate-limit` (`middleware/rateLimiter.ts`, по образцу `/oauth`) - лимитер стоит перед проверкой авторизации, чтобы флуд не долбил заодно и API Практикума: чтение (списки/топики) - 300 запросов/15 мин, создание топиков/комментариев/ответов — 30 запросов/15 мин.

Целостность дерева комментариев (`topicId`/`parentId`) закреплена не только в контроллере, но и составным `FOREIGN KEY (topicId, parentId) REFERENCES comments (topicId, id)` в миграции `create-comments` - у ответа `topicId` физически не может отличаться от `topicId` родителя, даже если запись попадёт в таблицу не через `createReply` (сиды, импорт, другой эндпоинт).

На клиенте (`packages/client/src/pages/Forum*`, `components/forum-*`) UI подключён к настоящему API, а не к моку: список топиков и страница топика с комментариями хранятся в Redux (`slices/forumSlice.ts`), запросы - в `api/forumApi.ts` через общий `request()` (`api/http.ts`), побочные эффекты - в `thunks/forumThunks.ts` (по образцу `auth`). Автор топика/комментария на клиенте не передаётся - сервер сам берёт его из сессии, поэтому после отправки формы в интерфейсе отображается реальный `authorLogin`. Комментарии сервер возвращает деревом (`replies`), но форма добавления комментария создаёт только комментарии верхнего уровня - UI для ответа на конкретный комментарий (`POST /forum/comments/:id/replies`) не реализован.

Модели проверяются unit-тестами на sqlite in-memory (`sequelize.sync()`, обычный `yarn test`) - они быстрые, но не видят реальную Postgres-схему и её constraint'ы. Отдельно есть смоук-тест реальных миграций на настоящем Postgres - `yarn test:integration` (см. `packages/server/__tests__/forumMigrations.integration.test.ts`, запускается вручную, в CI не подключён): он накатывает `migrations/` через `sequelize-cli` и проверяет каскадные удаления и составной FK выше. Не запускайте его на БД с реальными данными - тест откатывает/накатывает все миграции и чистит таблицы форума между кейсами.

### Утечки памяти

При аудите утечек памяти в коде сначала использовался поиск по коду, в рамках которого было найдено следующее:

#### Аудит кода

| Источник                             | Как закрыт                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Listeners клавиатуры/мыши            | `InputManager.attach()` / `detach()` снимает все пять слушателей, вызывается из `Game.destroy()` (`game/input/InputManager.ts`, `game/core/Game.ts`)                                                                                                                                                                                                          |
| Игровой цикл `requestAnimationFrame` | `GameLoop.stop()` вызывает `cancelAnimationFrame` (`game/core/GameLoop.ts`). Цепочка размонтирования: cleanup `useEffect` на `GamePage` -> `game.destroy()` (`pages/GamePage.tsx`)                                                                                                                                                                            |
| WebSocket и reconnect-таймер         | `GameClient.disconnect()` закрывает сокет, чистит очередь сообщений и снимает таймер через `clearTimeout` (`game/net/GameClient.ts`), вызывается в cleanup `useEffect` при уходе со страницы вместе с `resetMatch()` (`pages/GamePage.tsx`). Обработчики назначаются через `socket.on*` свойства, а не `addEventListener`, поэтому старый сокет собирается GC |
| Твины/анимации                       | `TweenManager.update` фильтрует завершённые твины каждый кадр (`game/animation/Tween.ts`). После `Game.destroy()` сцена со всеми замыканиями становится недостижимой и собирается GC                                                                                                                                                                          |
| Listener `fullscreenchange`          | Снимается в cleanup `useEffect` (`components/Header/FullscreenButton.tsx`)                                                                                                                                                                                                                                                                                    |
| Redux (`matchSlice` и др.)           | Состояние матча заменяется целиком, а не дописывается в массив, `resetMatch` возвращает `initialState`. Накапливающихся структур нет                                                                                                                                                                                                                          |
| `setInterval` / Audio API            | Не используются в клиенте                                                                                                                                                                                                                                                                                                                                     |

Единственный неснимаемый listener — `window 'load'` в `utils/serviceWorker.ts`: одноразовая регистрация service worker на всё время жизни приложения, утечкой не является.

На основании этой информации - утечек кода не обнаружено, нужно переходить к практической части с проверкой утечек

#### Практический замер

Для практической проверки был написан [скрипт](./scripts/memory-check.mjs), который гоняет браузер по страницам через Chrome DevTools Protocol.
По дефолту - используется 5 циклов SPA-навигации, после каждого цикла — принудительный GC и замер метрик. Навигация идёт кликами по ссылкам,
происходит монтирование и размонтирование страницы.

Полезные флаги (полный список — `node scripts/memory-check.mjs --help`):

- `--browser=chrome` — какой браузер искать (`chrome`, `chromium`, или `--browser` с абсолютный путь к бинарнику). Поиск идёт через `which`/`where` и типовые пути установки
- `--metrics=Nodes,JSEventListeners,Documents` — какие метрики выводить дополнительно к JS heap (`--list-metrics` показывает все, что отдаёт браузер)
- `--iterations=10` — число циклов навигации

Для обхода приватных страниц (`/game`, `/profile`, `/leaderboard`, `/forum`) скрипту нужно передать креды пользователя — он сам логинится через форму:

```bash
yarn memory:check --login=логин --password=пароль
```

### Результат проверки

Замер всех страниц от 24.08.2026:

```bash
yarn run v1.22.22
$ node scripts/memory-check.mjs --login=test-testov6 --password=Qwerty123456
Авторизация прошла, добавляю приватные страницы в обход.

Замер памяти: http://localhost:3000 (браузер: /Applications/Google Chrome.app/Contents/MacOS/Google Chrome)
Маршруты за цикл: / → /rules → /signin → /signup → /game → /profile → /leaderboard → /forum
```

| Итерация | JSHeapUsedSize, МБ | Nodes | JSEventListeners | Documents |
| -------- | ------------------ | ----- | ---------------- | --------- |
| 1        | 9 .2               | 165   | 163              | 1         |
| 2        | 9.3                | 165   | 163              | 1         |
| 3        | 9.3                | 165   | 163              | 1         |
| 4        | 9.4                | 165   | 163              | 1         |
| 5        | 9.5                | 165   | 163              | 1         |

```bash
Рост heap 1 → 5: 2.8%, без учёта прогрева (2 → 5): 2.0%
Вердикт: утечек не обнаружено (рост со 2-й итерации < 10%).
✨  Done in 32.54s.
```

Рост heap без учёта прогрева движка (итерации 2 → 5): **2.8%** при пороге 10%, число DOM-узлов и слушателей событий стабильно. Утечек не обнаружено.

#### Ручная проверка в DevTools

1. Открыть приложение, DevTools → вкладка **Memory**
2. Сделать heap snapshot, походить по страницам, вернуться на главную
3. Нажать «Собрать мусор» и сделать второй snapshot
4. Сравнение не должно показывать растущее число экземпляров компонентов/слушателей, вкладка **Performance Monitor** — график JS heap возвращается к базовому уровню после GC

### Как добавить зависимости?

В этом проекте используется `monorepo` на основе [`lerna`](https://github.com/lerna/lerna)

Чтобы добавить зависимость для клиента
`yarn lerna add {your_dep} --scope client`

Для сервера
`yarn lerna add {your_dep} --scope server`

И для клиента и для сервера
`yarn lerna add {your_dep}`

Если вы хотите добавить dev зависимость, проделайте то же самое, но с флагом `dev`
`yarn lerna add {your_dep} --dev --scope server`

### Тесты

Для клиента используется [`react-testing-library`](https://testing-library.com/docs/react-testing-library/intro/)

`yarn test`

### Линтинг

`yarn lint`

### Форматирование prettier

`yarn format`

### Production build

`yarn build`

И чтобы посмотреть что получилось

`yarn preview --scope client`
`yarn preview --scope server`

## Хуки

Установка lefthook hooks - `yarn lefthook install`
В проекте используется [lefthook](https://github.com/evilmartians/lefthook)
Пропустить pre-commit hook (в самом крайнем случае, лучше не пользоваться) - `git commit -m "message" --no-verify`
Пропустить pre-push hook (в самом крайнем случае, лучше не пользоваться) - `git push --no-verify`

## Автодеплой статики на vercel

Зарегистрируйте аккаунт на [vercel](https://vercel.com/)
Следуйте [инструкции](https://vitejs.dev/guide/static-deploy.html#vercel-for-git)
В качестве `root directory` укажите `packages/client`

Все ваши PR будут автоматически деплоиться на vercel. URL вам предоставит деплоящий бот

## Production окружение в докере

Перед первым запуском выполните `node init.js`

`docker compose up` - запустит три сервиса

1. node.js, обслуживающий SSR и клиентскую статику (client)
2. node, ваш сервер (server)
3. postgres, вашу базу данных (postgres)

Если вам понадобится только один сервис, просто уточните какой в команде
`docker compose up {service_name}`, например `docker compose up server` (база запустится вместе с ним).

Проверить состояние сервисов можно командой `docker compose ps`. Данные PostgreSQL сохраняются в `./tmp/pgdata`.

### Переключение темы

API тем, схема PostgreSQL, миграции и проверка переключателя описаны в
[docs/themes.md](docs/themes.md).
