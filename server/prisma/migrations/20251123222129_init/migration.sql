-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "civility" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "phone" INTEGER NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "birthplace" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "photoPath" TEXT NOT NULL,
    "firstregister" BOOLEAN NOT NULL,
    "aupair" BOOLEAN NOT NULL,
    "address" TEXT NOT NULL,
    "arrivaldate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuPairFamily" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER NOT NULL,
    "familyname1" TEXT NOT NULL,
    "familyname2" TEXT,
    "email" TEXT NOT NULL,
    "phone" INTEGER NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "AuPairFamily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Test" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER NOT NULL,
    "pa1" BOOLEAN NOT NULL,
    "pa2" BOOLEAN NOT NULL,
    "pa3" BOOLEAN NOT NULL,
    "pa4" BOOLEAN NOT NULL,
    "pa5" BOOLEAN NOT NULL,
    "pa6" BOOLEAN NOT NULL,
    "pa7" BOOLEAN NOT NULL,
    "pa8" BOOLEAN NOT NULL,
    "pa9" BOOLEAN NOT NULL,
    "pa10" BOOLEAN NOT NULL,
    "pa11" BOOLEAN NOT NULL,
    "pa12" BOOLEAN NOT NULL,
    "pa13" BOOLEAN NOT NULL,
    "pa14" BOOLEAN NOT NULL,
    "pa15" BOOLEAN NOT NULL,
    "pa16" BOOLEAN NOT NULL,
    "pa17" BOOLEAN NOT NULL,
    "pa18" BOOLEAN NOT NULL,
    "pa19" BOOLEAN NOT NULL,
    "pa20" BOOLEAN NOT NULL,
    "pb1" BOOLEAN NOT NULL,
    "pb2" BOOLEAN NOT NULL,
    "pb4" BOOLEAN NOT NULL,
    "pb5" BOOLEAN NOT NULL,
    "pb6" BOOLEAN NOT NULL,
    "pb7" TEXT NOT NULL,
    "pc1" TEXT NOT NULL,
    "pc2" TEXT NOT NULL,
    "pc3" TEXT NOT NULL,
    "pc4" TEXT NOT NULL,
    "pc5" TEXT NOT NULL,
    "pc6" TEXT NOT NULL,
    "pc7" TEXT NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AuPairFamily_profileId_key" ON "AuPairFamily"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "Test_profileId_key" ON "Test"("profileId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuPairFamily" ADD CONSTRAINT "AuPairFamily_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
