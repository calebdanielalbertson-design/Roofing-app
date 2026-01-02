import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateLineItemDto, CreateMaterialDto, CreateLaborDto, CreateEquipmentDto } from './dto/create-catalog.dto';
import { AuthGuard } from '../auth.guard';

@Controller('catalog')
@UseGuards(AuthGuard)
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) { }

  @Post('line-items')
  createLineItem(@Body() dto: CreateLineItemDto) {
    return this.catalogService.createLineItem(dto);
  }

  @Get('line-items')
  findAllLineItems(@Query('companyId') companyId: string) {
    return this.catalogService.findAllLineItems(companyId);
  }

  @Post('materials')
  createMaterial(@Body() dto: CreateMaterialDto) {
    return this.catalogService.createMaterial(dto);
  }

  @Get('materials')
  findAllMaterials(@Query('companyId') companyId: string) {
    return this.catalogService.findAllMaterials(companyId);
  }

  @Post('labor')
  createLabor(@Body() dto: CreateLaborDto) {
    return this.catalogService.createLabor(dto);
  }

  @Get('labor')
  findAllLabor(@Query('companyId') companyId: string) {
    return this.catalogService.findAllLabor(companyId);
  }

  @Post('equipment')
  createEquipment(@Body() dto: CreateEquipmentDto) {
    return this.catalogService.createEquipment(dto);
  }

  @Get('equipment')
  findAllEquipment(@Query('companyId') companyId: string) {
    return this.catalogService.findAllEquipment(companyId);
  }
}
