/*
  Warnings:

  - You are about to drop the column `dayOfWeek` on the `LevelSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `LevelSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `LevelSchedule` table. All the data in the column will be lost.
  - Added the required column `label` to the `LevelSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `LevelSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LevelSchedule" DROP COLUMN "dayOfWeek",
DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "label" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "LevelScheduleSession" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "LevelScheduleSession_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LevelScheduleSession" ADD CONSTRAINT "LevelScheduleSession_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "LevelSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
