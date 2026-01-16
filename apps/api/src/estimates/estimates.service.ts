import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEstimateDto } from './dto/create-estimate.dto';
import { UpdateEstimateDto } from './dto/update-estimate.dto';
import { PrismaService } from '../prisma.service';
import { PricingEngine, Recipe, PricingContext } from '@repo/calc';

@Injectable()
export class EstimatesService {
  constructor(private prisma: PrismaService) { }

  create(createEstimateDto: CreateEstimateDto) {
    return this.prisma.estimate.create({
      data: createEstimateDto as any,
    });
  }

  findAll(jobId?: string) {
    return this.prisma.estimate.findMany({
      where: jobId ? { jobId } : undefined,
      include: { lines: true }
    });
  }

  findOne(id: string) {
    return this.prisma.estimate.findUnique({
      where: { id },
      include: {
        lines: { include: { lineItem: true } },
        measurementSet: true,
        markupProfile: true
      }
    });
  }

  async getJobContext(jobId: string) {
    return this.prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true }
    });
  }
  // ... rest of the file (addLine, updateLine, etc. same as before)

  update(id: string, updateEstimateDto: UpdateEstimateDto) {
    return this.prisma.estimate.update({
      where: { id },
      data: updateEstimateDto,
    });
  }

  // --- Lines ---
  async addLine(estimateId: string, lineItemId: string, quantity: number) {
    return this.prisma.estimateLine.create({
      data: {
        estimateId,
        lineItemId,
        quantity,
        unitPrice: 0,
        extended: 0,
        material: 0,
        labor: 0,
        equipment: 0
      }
    });
  }

  async updateLine(lineId: string, quantity: number) {
    return this.prisma.estimateLine.update({
      where: { id: lineId },
      data: { quantity }
    });
  }

  async removeLine(lineId: string) {
    return this.prisma.estimateLine.delete({
      where: { id: lineId }
    });
  }

  async calculatePricing(id: string) {
    const estimate = await this.findOne(id); // Now includes measurementSet
    if (!estimate) throw new NotFoundException('Estimate not found');

    // Check if job exists and get company context
    const job = await this.prisma.job.findUnique({ where: { id: estimate.jobId } }); // Reuse getJobContext?
    if (!job) throw new NotFoundException('Job not found');

    const companyId = job.companyId;

    const materialSkus = await this.prisma.materialSku.findMany({ where: { companyId } });
    const laborRoles = await this.prisma.laborRole.findMany({ where: { companyId } });
    const equipmentRates = await this.prisma.equipmentRate.findMany({ where: { companyId } });

    const context: PricingContext = {
      materialPrices: Object.fromEntries(
        materialSkus.map((m: any) => [m.skuCode, { price: Number(m.purchasePackagePrice), unitsPerPack: Number(m.unitsPerPackage) }])
      ),
      laborRates: Object.fromEntries(
        laborRoles.map((l: any) => [l.code, Number(l.hourlyRate)])
      ),
      equipmentRates: Object.fromEntries(
        equipmentRates.map((e: any) => [e.code, Number(e.rate)])
      )
    };

    const processedLines = [];
    for (const line of estimate.lines) {
      // Safe cast
      let recipe: Recipe | null = null;
      if (line.lineItem && line.lineItem.recipe) {
        recipe = line.lineItem.recipe as unknown as Recipe;
      }

      const result = PricingEngine.calculateLineItem(Number(line.quantity), recipe, context);

      await this.prisma.estimateLine.update({
        where: { id: line.id },
        data: {
          material: result.materialCost,
          labor: result.laborCost,
          equipment: result.equipmentCost,
          unitPrice: result.unitPrice,
          extended: result.extendedPrice,
          breakdown: result.breakdown
        }
      });
      processedLines.push(result);
    }

    const totals = PricingEngine.calculateEstimateTotal(processedLines);

    // MVP: 10% O&P
    const overhead = totals.subtotal * 0.10;
    const profit = (totals.subtotal + overhead) * 0.10;

    return this.prisma.estimate.update({
      where: { id },
      data: {
        totalMaterial: totals.material,
        totalLabor: totals.labor,
        totalEquipment: totals.equipment,
        subtotal: totals.subtotal,
        totalOverhead: overhead,
        totalProfit: profit,
        grandTotal: totals.total + overhead + profit
      },
      include: { lines: { include: { lineItem: true } } }
    });
  }
}
