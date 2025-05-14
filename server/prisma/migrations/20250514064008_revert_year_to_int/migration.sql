/*
  Warnings:

  - You are about to alter the column `yearVisited` on the `TravelLog` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "TravelLog" ALTER COLUMN "yearVisited" SET DATA TYPE INTEGER;
