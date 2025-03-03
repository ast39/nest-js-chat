-- CreateEnum
CREATE TYPE "ticket_status_enum" AS ENUM ('open', 'progress', 'close');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "user_type_enum" ADD VALUE 'support';
ALTER TYPE "user_type_enum" ADD VALUE 'client';
