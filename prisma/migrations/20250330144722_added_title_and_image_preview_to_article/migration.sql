-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "header_image" TEXT NOT NULL DEFAULT 'Image',
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'Title';
