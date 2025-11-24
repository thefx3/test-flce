/*
  Warnings:

  - You are about to drop the column `profileId` on the `AuPairFamily` table. All the data in the column will be lost.
  - You are about to drop the column `profileId` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `profileId` on the `Test` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `AuPairFamily` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Test` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AuPairFamily" DROP CONSTRAINT "AuPairFamily_profileId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_profileId_fkey";

-- DropForeignKey
ALTER TABLE "Test" DROP CONSTRAINT "Test_profileId_fkey";

-- DropIndex
DROP INDEX "AuPairFamily_profileId_key";

-- DropIndex
DROP INDEX "Profile_profileId_key";

-- DropIndex
DROP INDEX "Test_profileId_key";

-- AlterTable
ALTER TABLE "AuPairFamily" DROP COLUMN "profileId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "profileId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Test" DROP COLUMN "profileId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuPairFamily" ADD CONSTRAINT "AuPairFamily_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
