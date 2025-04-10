/*
  Warnings:

  - Added the required column `survivalChances` to the `TravelLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TravelLog" ADD COLUMN     "survivalChances" INTEGER NOT NULL;
