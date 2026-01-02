-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'ADMIN', 'ESTIMATOR');

-- CreateEnum
CREATE TYPE "EstimateStatus" AS ENUM ('DRAFT', 'FINAL');

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'ESTIMATOR',
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "carrierName" TEXT,
    "claimNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeasurementSet" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Initial Measurements',
    "totalRoofAreaSqFt" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalPitchedAreaSqFt" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "ridgeLf" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "hipLf" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "valleyLf" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "eaveLf" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "rakeLf" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "stories" INTEGER NOT NULL DEFAULT 1,
    "pitch" TEXT,
    "wastePct" DECIMAL(65,30) NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MeasurementSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialSku" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "skuCode" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "purchasePackagePrice" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "unitsPerPackage" DECIMAL(65,30) NOT NULL DEFAULT 1,
    "defaultMargin" DECIMAL(65,30) NOT NULL DEFAULT 0.30,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaterialSku_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LaborRole" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "hourlyRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LaborRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentRate" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EquipmentRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LineItemCatalog" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "unit" TEXT NOT NULL,
    "category" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "recipe" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LineItemCatalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostBook" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Standard Pricing',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CostBook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostComponent" (
    "id" TEXT NOT NULL,
    "lineItemId" TEXT NOT NULL,
    "materialUnitCost" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "laborUnitCost" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "equipmentUnitCost" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CostComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarkupProfile" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Default',
    "materialMarkup" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "laborMarkup" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "equipmentMarkup" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "overhead" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "profit" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "MarkupProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Estimate" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "measurementSetId" TEXT,
    "costBookId" TEXT,
    "markupProfileId" TEXT,
    "status" "EstimateStatus" NOT NULL DEFAULT 'DRAFT',
    "name" TEXT,
    "totalMaterial" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalLabor" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalEquipment" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "subtotal" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalOverhead" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalProfit" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "grandTotal" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Estimate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstimateLine" (
    "id" TEXT NOT NULL,
    "estimateId" TEXT NOT NULL,
    "lineItemId" TEXT NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "unitPrice" DECIMAL(65,30) NOT NULL,
    "material" DECIMAL(65,30) NOT NULL,
    "labor" DECIMAL(65,30) NOT NULL,
    "equipment" DECIMAL(65,30) NOT NULL,
    "extended" DECIMAL(65,30) NOT NULL,
    "breakdown" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EstimateLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "estimateId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MaterialSku_companyId_skuCode_key" ON "MaterialSku"("companyId", "skuCode");

-- CreateIndex
CREATE UNIQUE INDEX "LaborRole_companyId_code_key" ON "LaborRole"("companyId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "EquipmentRate_companyId_code_key" ON "EquipmentRate"("companyId", "code");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeasurementSet" ADD CONSTRAINT "MeasurementSet_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialSku" ADD CONSTRAINT "MaterialSku_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaborRole" ADD CONSTRAINT "LaborRole_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentRate" ADD CONSTRAINT "EquipmentRate_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineItemCatalog" ADD CONSTRAINT "LineItemCatalog_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostBook" ADD CONSTRAINT "CostBook_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostComponent" ADD CONSTRAINT "CostComponent_lineItemId_fkey" FOREIGN KEY ("lineItemId") REFERENCES "LineItemCatalog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarkupProfile" ADD CONSTRAINT "MarkupProfile_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estimate" ADD CONSTRAINT "Estimate_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estimate" ADD CONSTRAINT "Estimate_measurementSetId_fkey" FOREIGN KEY ("measurementSetId") REFERENCES "MeasurementSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estimate" ADD CONSTRAINT "Estimate_costBookId_fkey" FOREIGN KEY ("costBookId") REFERENCES "CostBook"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estimate" ADD CONSTRAINT "Estimate_markupProfileId_fkey" FOREIGN KEY ("markupProfileId") REFERENCES "MarkupProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstimateLine" ADD CONSTRAINT "EstimateLine_estimateId_fkey" FOREIGN KEY ("estimateId") REFERENCES "Estimate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstimateLine" ADD CONSTRAINT "EstimateLine_lineItemId_fkey" FOREIGN KEY ("lineItemId") REFERENCES "LineItemCatalog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_estimateId_fkey" FOREIGN KEY ("estimateId") REFERENCES "Estimate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
