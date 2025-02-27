-- CreateEnum
CREATE TYPE "chat_status_enum" AS ENUM ('active', 'blocked');

-- CreateEnum
CREATE TYPE "message_status_enum" AS ENUM ('active', 'blocked');

-- CreateEnum
CREATE TYPE "user_type_enum" AS ENUM ('buyer', 'seller', 'admin');

-- CreateTable
CREATE TABLE "chats" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "seller_id" INTEGER NOT NULL,
    "buyer_id" INTEGER NOT NULL,
    "title" VARCHAR(128),
    "status" "chat_status_enum" DEFAULT 'active',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "reply_to" INTEGER,
    "chat_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "user_type" "user_type_enum" NOT NULL DEFAULT 'buyer',
    "content" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "status" "message_status_enum" DEFAULT 'active',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_versions" (
    "id" SERIAL NOT NULL,
    "message_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chats_is_deleted_idx" ON "chats"("is_deleted");

-- CreateIndex
CREATE UNIQUE INDEX "chats_order_id_seller_id_buyer_id_key" ON "chats"("order_id", "seller_id", "buyer_id");

-- CreateIndex
CREATE INDEX "messages_is_deleted_idx" ON "messages"("is_deleted");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_reply_to_fkey" FOREIGN KEY ("reply_to") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_versions" ADD CONSTRAINT "message_versions_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
