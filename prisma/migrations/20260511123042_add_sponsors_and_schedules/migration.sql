/*
  Warnings:

  - You are about to drop the column `createdAt` on the `RequestedLevel` table. All the data in the column will be lost.
  - You are about to drop the column `assignedAt` on the `StudentLevel` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "LearningMode" AS ENUM ('ONLINE', 'IN_PERSON', 'BOTH');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "SponsorType" AS ENUM ('INDIVIDUAL', 'ORGANIZATION', 'FOUNDATION', 'FAMILY', 'OTHER');

-- CreateEnum
CREATE TYPE "SponsorStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- DropForeignKey
ALTER TABLE "RequestedLevel" DROP CONSTRAINT "RequestedLevel_studentId_fkey";

-- DropForeignKey
ALTER TABLE "StudentLevel" DROP CONSTRAINT "StudentLevel_studentId_fkey";

-- DropIndex
DROP INDEX "Level_trackType_levelOrder_key";

-- DropIndex
DROP INDEX "RequestedLevel_studentId_trackType_key";

-- DropIndex
DROP INDEX "StudentLevel_studentId_trackType_key";

-- AlterTable
ALTER TABLE "RequestedLevel" DROP COLUMN "createdAt",
ADD COLUMN     "scheduleId" TEXT;

-- AlterTable
ALTER TABLE "StudentLevel" DROP COLUMN "assignedAt",
ADD COLUMN     "scheduleId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "learningMode" "LearningMode",
ADD COLUMN     "sponsorId" TEXT,
ADD COLUMN     "telegramUsername" TEXT;

-- CreateTable
CREATE TABLE "Sponsor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "SponsorType" NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "notes" TEXT,
    "status" "SponsorStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sponsor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LevelSchedule" (
    "id" TEXT NOT NULL,
    "levelId" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "mode" "LearningMode" NOT NULL,
    "location" TEXT,

    CONSTRAINT "LevelSchedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "Sponsor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LevelSchedule" ADD CONSTRAINT "LevelSchedule_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestedLevel" ADD CONSTRAINT "RequestedLevel_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestedLevel" ADD CONSTRAINT "RequestedLevel_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "LevelSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentLevel" ADD CONSTRAINT "StudentLevel_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentLevel" ADD CONSTRAINT "StudentLevel_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "LevelSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
