<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

### Описание

Микро сервис для переписки пользователей проекта "Prodavato"

https://gitlab.versh.store/bodymap/services/message

### Установка

```
# Установка пакетов
yarn install

# Копирование шаблона для env настроек проекта 
cp .env.example .env
```

### Запуск приложения

```
# Запуск проекта локально со всеми миграциями
yarn start:dev

# Запуск сидов
yarn prisma:seed

# Запуск проекта на сервере со всеми миграциями
yarn start:prod

# Тестовый токен
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkRlbW8gVXNlciIsImlhdCI6MTcyODU3OTkzNywiZXhwIjoxODg2MjU5OTM3fQ.8oLSrmoD-dDBMqKpZQNSC8wiPSFEbuJopHF1on_aAx4
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

### Модуль дампов БД

---
#### Структура:

- dumps
- - postgres
- - - 2025-02-27T11:00:00_tp_postgres.sql
- - - ...
- - - 2025-02-25T11:00:00_tp_postgres.sql
- .env
- db_dumper.sh

---
#### Файл .env
```dotenv
### Container

API_CONTAINER=tp_chat_service_api
POSTGRES_CONTAINER=tp_chat_service_pgsql
POSTGRES_DUMP_PATH=dumps/pgsql


### Database

POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=qwerty
POSTGRES_DB=postgres
```