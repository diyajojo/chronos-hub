-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "travelLogId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reaction" (
    "id" TEXT NOT NULL,
    "travelLogId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_travelLogId_type_key" ON "Reaction"("travelLogId", "type");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_travelLogId_fkey" FOREIGN KEY ("travelLogId") REFERENCES "TravelLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_travelLogId_fkey" FOREIGN KEY ("travelLogId") REFERENCES "TravelLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
