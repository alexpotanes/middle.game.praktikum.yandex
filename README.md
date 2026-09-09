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

Кнопка «Войти через Яндекс» есть на `/signin` и `/signup`. Логика на клиенте - в `utils/oauth.ts`, `api/oauth-api.ts` и двух thunk'ах в `thunks/auth-thunks.ts`:

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
