/*
  Warnings:

  - You are about to drop the column `survivalChances` on the `TravelLog` table. All the data in the column will be lost.
  - Added the required column `title` to the `TravelLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserBadge" DROP CONSTRAINT "UserBadge_userId_fkey";

-- AlterTable
ALTER TABLE "TravelLog" DROP COLUMN "survivalChances",
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserBadge" ALTER COLUMN "badgeName" SET DEFAULT '';

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
