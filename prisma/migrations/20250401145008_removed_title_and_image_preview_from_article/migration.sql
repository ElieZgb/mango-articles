/*
  Warnings:

  - You are about to drop the column `header_image` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Article` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "header_image",
DROP COLUMN "title";
