import { Injectable } from '@nestjs/common';
import { CreateLineItemDto, CreateMaterialDto, CreateLaborDto, CreateEquipmentDto } from './dto/create-catalog.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) { }

  // --- Line Items ---
  createLineItem(dto: CreateLineItemDto) {
    return this.prisma.lineItemCatalog.create({ data: dto });
  }

  findAllLineItems(companyId: string) {
    return this.prisma.lineItemCatalog.findMany({
      where: { companyId },
      orderBy: { code: 'asc' }
    });
  }

  // --- Materials ---
  createMaterial(dto: CreateMaterialDto) {
    return this.prisma.materialSku.create({ data: dto });
  }

  findAllMaterials(companyId: string) {
    return this.prisma.materialSku.findMany({ where: { companyId } });
  }

  // --- Labor ---
  createLabor(dto: CreateLaborDto) {
    return this.prisma.laborRole.create({ data: dto });
  }

  findAllLabor(companyId: string) {
    return this.prisma.laborRole.findMany({ where: { companyId } });
  }

  // --- Equipment ---
  createEquipment(dto: CreateEquipmentDto) {
    return this.prisma.equipmentRate.create({ data: dto });
  }

  findAllEquipment(companyId: string) {
    return this.prisma.equipmentRate.findMany({ where: { companyId } });
  }
}
