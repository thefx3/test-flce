/*
  Warnings:

  - You are about to drop the column `aupair` on the `Profile` table. All the data in the column will be lost.
  - Added the required column `aupair` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "aupair";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "aupair" BOOLEAN NOT NULL;
