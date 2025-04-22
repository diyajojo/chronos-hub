/*
  Warnings:

  - You are about to drop the column `badgeId` on the `UserBadge` table. All the data in the column will be lost.
  - You are about to drop the `Badge` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,badgeName]` on the table `UserBadge` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `badgeName` to the `UserBadge` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserBadge" DROP CONSTRAINT "UserBadge_badgeId_fkey";

-- DropForeignKey
ALTER TABLE "UserBadge" DROP CONSTRAINT "UserBadge_userId_fkey";

-- DropIndex
DROP INDEX "UserBadge_userId_badgeId_key";

-- AlterTable
ALTER TABLE "UserBadge" DROP COLUMN "badgeId",
ADD COLUMN     "badgeName" TEXT NOT NULL;

-- DropTable
DROP TABLE "Badge";

-- CreateIndex
CREATE UNIQUE INDEX "UserBadge_userId_badgeName_key" ON "UserBadge"("userId", "badgeName");

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
