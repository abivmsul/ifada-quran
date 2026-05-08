-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fromAyah" INTEGER,
ADD COLUMN     "homework" TEXT,
ADD COLUMN     "isRevision" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "kitabBook" TEXT,
ADD COLUMN     "kitabChapter" TEXT,
ADD COLUMN     "surah" TEXT,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "toAyah" INTEGER,
ADD COLUMN     "topic" TEXT;

-- CreateIndex
CREATE INDEX "Lesson_studentId_date_idx" ON "Lesson"("studentId", "date");

-- CreateIndex
CREATE INDEX "Lesson_trackType_date_idx" ON "Lesson"("trackType", "date");
