<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

### Описание

Микро сервис для переписки пользователей проекта "Prodavato"

https://gitlab.versh.store/bodymap/services/message

### Установка

```
# Копирование шаблона для env настроек проекта 
cp .env.example .env
```

### Запуск приложения в Docker

```
# Запуск контейнеров проекта в первый раз
docker-compose up -d --build

# Запуск контейнеров проекта в последующие разы
docker-compose up -d

# Остановка контейнеров проекта
docker-compose down

# Просмотр запущенных контейнеров
docker ps

# Открытие консоли приложения (CONTAINER_ID берем из docker ps)
docker logs {CONTAINER_ID}
```

### Запуск приложения без Docker-а

```
# Установка пакетов
yarn install

# Запуск проекта локально со всеми миграциями
yarn start:dev

# Запуск сидов
yarn prisma:seed

# Запуск проекта на сервере со всеми миграциями
yarn start:prod
```

# Тестовый токен
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6Ikl2YW4iLCJwb3NpdGlvbiI6IlBVQkxJU0hFUiIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE3NDEwNzM1OTMsImV4cCI6MTc3MjYzMTE5M30.sVBC6BcDxFgGZZ6KuZXk5GKgV9IfwvzJYDlQvPZjNSM
```

### Управление Prisma ORM

```
# Обновление Prisma Client по схеме  
yarn prisma generate

# Создание миграции без выполнения
yarn prisma migrate dev --name init

# Обновление базы данных по неисполненным миграциям
yarn prisma migrate deploy

# Запуск сидов, заполняющих таблицы тестовыми данными
yarn prisma db seed

# Устранение проблем с миграциями базы данных
yarn prisma migrate resolve
```

### О проекте

Микро сервис, созданный в рамках экосистемы "Телепост"

### Авторы

- Author - [ASt](https://github.com/ast39)
- Telegram - [@ASt39](https://t.me/ASt39)

### Лицензия
Телепост

---
#### Файл .env
```dotenv
### Container
# Названия контейнеров в докере
API_CONTAINER=tp_chat_service_api
POSTGRES_CONTAINER=tp_chat_service_pgsql

### Database
# Креды подключения к БД
POSTGRES_HOST=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=tp_chat
POSTGRES_PORT=5432

### OUTER_PORTS
# Внешние порты для подключения к сервисам внутри контейнера
OUTER_APP_PORT=3030
OUTER_POSTGRES_PORT=5435
```