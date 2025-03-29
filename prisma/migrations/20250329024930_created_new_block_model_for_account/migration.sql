/*
  Warnings:

  - You are about to drop the column `content` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `header_image` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Article` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ArticleBlockType" AS ENUM ('text', 'title', 'image', 'separator', 'codeblock', 'videolink');

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "content",
DROP COLUMN "header_image",
DROP COLUMN "title";

-- CreateTable
CREATE TABLE "ArticleBlock" (
    "id" TEXT NOT NULL,
    "type" "ArticleBlockType" NOT NULL,
    "textValue" TEXT,
    "className" TEXT,
    "placeholder" TEXT,
    "imageFile" TEXT,
    "imagePreview" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "articleId" TEXT NOT NULL,

    CONSTRAINT "ArticleBlock_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ArticleBlock" ADD CONSTRAINT "ArticleBlock_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
