-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "StatusViagem" AS ENUM ('PLANEJADA', 'EM_VIAGEM', 'ENTREGUE', 'FINALIZADA');

-- CreateEnum
CREATE TYPE "FormaPagamento" AS ENUM ('PIX', 'DINHEIRO', 'TRANSFERENCIA', 'BOLETO', 'OUTRO');

-- CreateTable
CREATE TABLE "Carga" (
    "id" TEXT NOT NULL,
    "numero" SERIAL NOT NULL,
    "data" DATE NOT NULL,
    "cliente" TEXT NOT NULL,
    "origem" TEXT NOT NULL,
    "destino" TEXT NOT NULL,
    "produto" TEXT,
    "pesoKg" INTEGER,
    "valorFrete" INTEGER NOT NULL,
    "status" "StatusViagem" NOT NULL DEFAULT 'PLANEJADA',
    "observacoes" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Carga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recebimento" (
    "id" TEXT NOT NULL,
    "cargaId" TEXT NOT NULL,
    "data" DATE NOT NULL,
    "valor" INTEGER NOT NULL,
    "formaPagamento" "FormaPagamento" NOT NULL,
    "observacao" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recebimento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Carga_numero_key" ON "Carga"("numero");

-- CreateIndex
CREATE INDEX "Carga_data_idx" ON "Carga"("data");

-- CreateIndex
CREATE INDEX "Recebimento_cargaId_idx" ON "Recebimento"("cargaId");

-- AddForeignKey
ALTER TABLE "Recebimento" ADD CONSTRAINT "Recebimento_cargaId_fkey" FOREIGN KEY ("cargaId") REFERENCES "Carga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

