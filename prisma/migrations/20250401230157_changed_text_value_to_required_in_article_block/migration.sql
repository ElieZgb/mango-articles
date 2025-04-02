/*
  Warnings:

  - Made the column `textValue` on table `ArticleBlock` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ArticleBlock" ALTER COLUMN "textValue" SET NOT NULL,
ALTER COLUMN "textValue" SET DEFAULT '';
