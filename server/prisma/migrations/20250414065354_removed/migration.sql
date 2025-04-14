/*
  Warnings:

  - A unique constraint covering the columns `[travelLogId,reactor]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Reaction_travelLogId_type_key";

-- AlterTable
ALTER TABLE "Reaction" ALTER COLUMN "reactor" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_travelLogId_reactor_key" ON "Reaction"("travelLogId", "reactor");
