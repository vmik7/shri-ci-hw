# shri-ci-hw

## Запуск

Сервер:

```bash
cd server && npm run build && npm start
```

Клиент:

```bash
cd client && npm start
```

## Переменные окружения

Для доступа к [shri.yandex/hw/api](https://shri.yandex/hw/api/index.html) нужен токен. Считывается сервером из переменной окружения `KEY`.

Для удобства, установил пакет [dotenv](https://www.npmjs.com/package/dotenv), токен можно задать в файле `server/.env`:

```bash
KEY="Bearer your_token_here"
```

## Api

Клиент и сервер используют общие типы, которые описаны в файле `common/api-types.ts`.
Однако из-за особенностей сборки (клиент - CRA, сервер - TypeScript) невозможно подключить этот файл, так как он лежит вне source директории.
Типы скопирован в `client/src/api/types.ts` и `server/src/api/types.ts`. Планируется сделать Server Side Rendering, тогда эта проблема исчезнет.
