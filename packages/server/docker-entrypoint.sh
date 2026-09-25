#!/bin/sh
set -e

# На чистой БД (или после добавления новой миграции) таблицы форума должны
# появиться до того, как сервер начнёт принимать запросы - иначе первый же
# запрос к /forum/* упадёт с ошибкой "таблица не существует". Раскатываем
# миграции здесь, а не в отдельном сервисе/job, чтобы не плодить лишний образ
# только под однократную команду.
#
# SKIP_DB_MIGRATIONS=true позволяет пропустить этот шаг (например, если
# миграции применяются отдельным пайплайном перед деплоем).
if [ "$SKIP_DB_MIGRATIONS" != "true" ]; then
  echo "[entrypoint] Running database migrations..."
  (cd /app/packages/server && npx --no-install sequelize-cli db:migrate)
else
  echo "[entrypoint] SKIP_DB_MIGRATIONS=true, пропускаем миграции"
fi

exec "$@"
