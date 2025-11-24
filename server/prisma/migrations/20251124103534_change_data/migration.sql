-- DropForeignKey
ALTER TABLE "AuPairFamily" DROP CONSTRAINT "AuPairFamily_profileId_fkey";

-- DropForeignKey
ALTER TABLE "Test" DROP CONSTRAINT "Test_profileId_fkey";

-- AddForeignKey
ALTER TABLE "AuPairFamily" ADD CONSTRAINT "AuPairFamily_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
