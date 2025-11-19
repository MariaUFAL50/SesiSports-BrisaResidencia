-- CreateEnum
CREATE TYPE "public"."TipoUsuario" AS ENUM ('TECNICO', 'ADMIN', 'CLIENTE');

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('ATIVO', 'INATIVO');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tipo" "public"."TipoUsuario" NOT NULL DEFAULT 'CLIENTE',
    "password" TEXT,
    "status" "public"."UserStatus" NOT NULL DEFAULT 'ATIVO',
    "cpfCnpj" TEXT,
    "phoneNumber" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "complement" TEXT,
    "street" TEXT NOT NULL,
    "number" INTEGER,
    "fotoUrl" TEXT,
    "googleId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_cpfCnpj_key" ON "public"."User"("cpfCnpj");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "public"."User"("googleId");
