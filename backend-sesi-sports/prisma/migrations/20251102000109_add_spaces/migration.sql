/*
  Warnings:

  - You are about to drop the column `googleId` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('DISPONIVEL', 'OCUPADO', 'MANUTENCAO');

-- CreateEnum
CREATE TYPE "SpaceType" AS ENUM ('QUADRA', 'CAMPO', 'PISCINA', 'ARENA', 'ESTADIO', 'GINASIO', 'SALA', 'OUTRO');

-- CreateEnum
CREATE TYPE "SportType" AS ENUM ('POLIESPORTIVO', 'FUTEBOL', 'BASQUETE', 'VOLEI', 'TENIS', 'NATACAO', 'FUTSAL', 'HANDBALL', 'BEACHTENIS', 'OUTRO');

-- CreateEnum
CREATE TYPE "WeekDay" AS ENUM ('SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO');

-- DropIndex
DROP INDEX "public"."User_googleId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "googleId";

-- CreateTable
CREATE TABLE "SpacePhoto" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "spaceId" INTEGER NOT NULL,

    CONSTRAINT "SpacePhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Space" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "hourPrice" DECIMAL(10,2) NOT NULL,
    "spaceType" "SpaceType"[],
    "sportType" "SportType" NOT NULL,
    "spaceStatus" "Status" NOT NULL,
    "openingHour" TEXT NOT NULL,
    "closingHour" TEXT NOT NULL,
    "availableDays" "WeekDay"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" VARCHAR(400) NOT NULL,

    CONSTRAINT "Space_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SpacePhoto" ADD CONSTRAINT "SpacePhoto_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
