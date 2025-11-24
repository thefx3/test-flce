/*
  Warnings:

  - You are about to drop the column `lastname` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'SUPERADMIN';

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "lastname",
DROP COLUMN "name";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastname" TEXT,
ADD COLUMN     "name" TEXT;
