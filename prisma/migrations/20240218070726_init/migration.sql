/*
  Warnings:

  - Changed the type of `telegram_id` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "telegram_id",
ADD COLUMN     "telegram_id" BIGINT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_telegram_id_key" ON "User"("telegram_id");
