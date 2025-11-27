/*
  Warnings:

  - The primary key for the `AuPairFamily` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `AuPairFamily` table. All the data in the column will be lost.
  - The primary key for the `Profile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Profile` table. All the data in the column will be lost.
  - The primary key for the `Question` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Question` table. All the data in the column will be lost.
  - The primary key for the `Test` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Test` table. All the data in the column will be lost.
  - The primary key for the `TestResponse` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `TestResponse` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `AuPairFamily` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Test` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "AuPairFamily" DROP CONSTRAINT "AuPairFamily_userId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Test" DROP CONSTRAINT "Test_userId_fkey";

-- DropForeignKey
ALTER TABLE "TestResponse" DROP CONSTRAINT "TestResponse_questionId_fkey";

-- DropForeignKey
ALTER TABLE "TestResponse" DROP CONSTRAINT "TestResponse_testId_fkey";

-- AlterTable
ALTER TABLE "AuPairFamily" DROP CONSTRAINT "AuPairFamily_pkey",
DROP COLUMN "id",
ADD COLUMN     "familyId" SERIAL NOT NULL,
ALTER COLUMN "phone" SET DATA TYPE TEXT,
ADD CONSTRAINT "AuPairFamily_pkey" PRIMARY KEY ("familyId");

-- AlterTable
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_pkey",
DROP COLUMN "id",
ADD COLUMN     "profileId" SERIAL NOT NULL,
ADD CONSTRAINT "Profile_pkey" PRIMARY KEY ("profileId");

-- AlterTable
ALTER TABLE "Question" DROP CONSTRAINT "Question_pkey",
DROP COLUMN "id",
ADD COLUMN     "questionId" SERIAL NOT NULL,
ADD CONSTRAINT "Question_pkey" PRIMARY KEY ("questionId");

-- AlterTable
ALTER TABLE "Test" DROP CONSTRAINT "Test_pkey",
DROP COLUMN "id",
ADD COLUMN     "testId" SERIAL NOT NULL,
ADD CONSTRAINT "Test_pkey" PRIMARY KEY ("testId");

-- AlterTable
ALTER TABLE "TestResponse" DROP CONSTRAINT "TestResponse_pkey",
DROP COLUMN "id",
ADD COLUMN     "responseId" SERIAL NOT NULL,
ADD CONSTRAINT "TestResponse_pkey" PRIMARY KEY ("responseId");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "userId" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AuPairFamily_userId_key" ON "AuPairFamily"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Test_userId_key" ON "Test"("userId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuPairFamily" ADD CONSTRAINT "AuPairFamily_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestResponse" ADD CONSTRAINT "TestResponse_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("testId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestResponse" ADD CONSTRAINT "TestResponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("questionId") ON DELETE CASCADE ON UPDATE CASCADE;
