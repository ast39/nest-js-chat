-- CreateTable
CREATE TABLE "tickets" (
    "id" INTEGER NOT NULL,
    "status" "ticket_status_enum" DEFAULT 'open',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_messages" (
    "id" SERIAL NOT NULL,
    "reply_to" INTEGER,
    "ticket_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "user_type" "user_type_enum" NOT NULL DEFAULT 'client',
    "content" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "status" "message_status_enum" DEFAULT 'active',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ticket_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_message_versions" (
    "id" SERIAL NOT NULL,
    "message_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_message_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tickets_is_deleted_idx" ON "tickets"("is_deleted");

-- CreateIndex
CREATE INDEX "ticket_messages_is_deleted_idx" ON "ticket_messages"("is_deleted");

-- AddForeignKey
ALTER TABLE "ticket_messages" ADD CONSTRAINT "ticket_messages_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_messages" ADD CONSTRAINT "ticket_messages_reply_to_fkey" FOREIGN KEY ("reply_to") REFERENCES "ticket_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_message_versions" ADD CONSTRAINT "ticket_message_versions_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "ticket_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
