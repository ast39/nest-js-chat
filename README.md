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
npm run start:dev

# Запуск сидов
npm run prisma:seed

# Запуск проекта на сервере со всеми миграциями
npm run start:prod

# Тестовый токен
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNiYWY1MzljLTAzOTYtNGM2My04YjdjLWJhMDFmYWY1MzJhNyIsIm5hbWUiOiJEZW1vIHVzZXIgMSIsImF2YXRhciI6bnVsbCwiaWF0IjoxNzE5NDk5NjU4LCJleHAiOjE3MTk1ODYwNTh9.bJtT6NOIs-S7YYwOgJHUfQSG4BUulcrrpZmNwH5VqKo
```

### Управление Prisma ORM

```
# Обновление Prisma Client по схеме  
npx prisma generate

# Создание миграции
npx prisma migrate dev --name init

# Обновление базы данных по файлам миграции в режиме разработки
npx prisma migrate dev

# Обновление базы данных по неисполненным миграциям в прод. режиме
npx prisma migrate deploy

# Запуск сидов, заполняющих таблицы тестовыми данными
npx prisma db seed

# Устранение проблем с миграциями базы данных
npx prisma migrate resolve
```

### О проекте

Микро сервис, созданный в рамках экосистемы "Взнания"

### Авторы

- Author - [ASt](https://github.com/ast39)
- Telegram - [@ASt39](https://t.me/ASt39)

### Лицензия
Взнания

### Модуль дампов БД

---
#### Структура:

- dumps
- - postgres
- - - 2024-04-21T11:00:00_pmp_postgres.sql
- - - ...
- - - 2024-04-23T11:00:00_pmp_postgres.sql
- .env
- db_dumper.sh

---
#### Файл .env
```dotenv
### Container

POSTGRES_CONTAINER=pmp_postgres
POSTGRES_DUMP_PATH=dumps/postgres


### Database

POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=qwerty
POSTGRES_DB=postgres
```

---
#### Настроить права на файловую систему
```bash
# Восстановить структуру каталогов
mkdir dumps
cd dumps
mkdir postgres
 
# права на выполнение скрипта
chmod +x db_dumper.sh

# права на выполнение скрипта восстановления
chmod +x db_recoverer.sh

# права на сохранение дампов
chmod +w -R dumps/postgres
```

---
Команды
```bash
# Запуск докера
docker-compose up -d

# Создание дампа
./db_dumper.sh

# Восстановление из дампа
./db_recoverer.sh {DUMP_NAME}

# Пример восстановления:
./db_recoverer.sh 2024-04-23T13-52-14_tp_postgres.sql

# Заархивировать накопишиеся логи
./archivator.sh
```
---
