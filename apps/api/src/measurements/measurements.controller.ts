import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { MeasurementsService } from './measurements.service';
import { CreateMeasurementSetDto } from './dto/create-measurement.dto';
import { AuthGuard } from '../auth.guard';

@Controller('measurements')
@UseGuards(AuthGuard)
export class MeasurementsController {
  constructor(private readonly measurementsService: MeasurementsService) { }

  @Post()
  create(@Body() dto: CreateMeasurementSetDto) {
    return this.measurementsService.create(dto);
  }

  @Get()
  findAll(@Query('jobId') jobId: string) {
    return this.measurementsService.findAll(jobId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.measurementsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.measurementsService.update(id, dto);
  }
}
