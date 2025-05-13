/*
  Warnings:

  - You are about to drop the column `commenter` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `reactor` on the `Reaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[travelLogId,userId]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Reaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Reaction_travelLogId_reactor_key";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "commenter",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Reaction" DROP COLUMN "reactor",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_travelLogId_userId_key" ON "Reaction"("travelLogId", "userId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
