import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Res } from '@nestjs/common';
import type { Response } from 'express';
import { EstimatesService } from './estimates.service';
import { CreateEstimateDto } from './dto/create-estimate.dto';
import { UpdateEstimateDto } from './dto/update-estimate.dto';
import { AuthGuard } from '../auth.guard';
import { PdfService } from '../pdf/pdf.service';

@Controller('estimates')
@UseGuards(AuthGuard)
export class EstimatesController {
  constructor(
    private readonly estimatesService: EstimatesService,
    private readonly pdfService: PdfService
  ) { }

  @Post()
  create(@Body() createEstimateDto: CreateEstimateDto) {
    return this.estimatesService.create(createEstimateDto);
  }

  @Get()
  findAll(@Query('jobId') jobId?: string) {
    return this.estimatesService.findAll(jobId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estimatesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEstimateDto: UpdateEstimateDto) {
    return this.estimatesService.update(id, updateEstimateDto);
  }

  @Post(':id/price')
  pricing(@Param('id') id: string) {
    return this.estimatesService.calculatePricing(id);
  }

  // --- Lines ---
  @Post(':id/lines')
  addLine(@Param('id') id: string, @Body() body: { lineItemId: string; quantity: number }) {
    return this.estimatesService.addLine(id, body.lineItemId, body.quantity);
  }

  @Patch(':id/lines/:lineId')
  updateLine(@Param('lineId') lineId: string, @Body() body: { quantity: number }) {
    return this.estimatesService.updateLine(lineId, body.quantity);
  }

  @Delete(':id/lines/:lineId')
  removeLine(@Param('lineId') lineId: string) {
    return this.estimatesService.removeLine(lineId);
  }

  // --- PDF ---
  @Post(':id/pdf')
  async generatePdf(@Param('id') id: string, @Res() res: Response) {
    const estimate = await this.estimatesService.findOne(id);
    if (!estimate) return res.status(404).send('Estimate not found');

    const job = await this.estimatesService.getJobContext(estimate.jobId);

    const buffer = await this.pdfService.generateTransparencyPdf(estimate, job);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="estimate-${id}.pdf"`,
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }
}
