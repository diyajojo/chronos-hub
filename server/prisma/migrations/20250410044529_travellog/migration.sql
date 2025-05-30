-- CreateTable
CREATE TABLE "TravelLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "yearVisited" INTEGER NOT NULL,
    "story" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TravelLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TravelLog" ADD CONSTRAINT "TravelLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
