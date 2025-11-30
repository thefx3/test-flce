/*
  Warnings:

  - You are about to drop the column `comment` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "comment";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "comment" TEXT;
