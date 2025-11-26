/*
  Warnings:

  - The values [MANUAL_GRADED] on the enum `TestStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TestStatus_new" AS ENUM ('IN_PROGRESS', 'SUBMITTED', 'AUTO_GRADED', 'CORRECTED');
ALTER TABLE "public"."Test" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Test" ALTER COLUMN "status" TYPE "TestStatus_new" USING ("status"::text::"TestStatus_new");
ALTER TYPE "TestStatus" RENAME TO "TestStatus_old";
ALTER TYPE "TestStatus_new" RENAME TO "TestStatus";
DROP TYPE "public"."TestStatus_old";
ALTER TABLE "Test" ALTER COLUMN "status" SET DEFAULT 'IN_PROGRESS';
COMMIT;
