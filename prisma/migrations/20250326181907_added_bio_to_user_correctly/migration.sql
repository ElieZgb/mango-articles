/*
  Warnings:

  - You are about to drop the column `bio` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "bio";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT;
