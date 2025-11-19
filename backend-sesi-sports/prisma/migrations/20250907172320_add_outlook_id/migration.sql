/*
  Warnings:

  - A unique constraint covering the columns `[outlookId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "outlookId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_outlookId_key" ON "public"."User"("outlookId");
