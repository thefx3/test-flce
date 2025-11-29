/*
  Warnings:

  - You are about to drop the column `mediaUrl` on the `Question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "mediaUrl",
ADD COLUMN     "videoId" INTEGER;

-- CreateTable
CREATE TABLE "Video" (
    "videoId" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("videoId")
);

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("videoId") ON DELETE CASCADE ON UPDATE CASCADE;
