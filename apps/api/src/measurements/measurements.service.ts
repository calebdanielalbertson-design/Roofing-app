import { Injectable } from '@nestjs/common';
import { CreateMeasurementSetDto } from './dto/create-measurement.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MeasurementsService {
  constructor(private prisma: PrismaService) { }

  create(dto: CreateMeasurementSetDto) {
    return this.prisma.measurementSet.create({
      data: dto
    });
  }

  findAll(jobId: string) {
    return this.prisma.measurementSet.findMany({
      where: { jobId },
      orderBy: { createdAt: 'desc' }
    });
  }

  findOne(id: string) {
    return this.prisma.measurementSet.findUnique({ where: { id } });
  }

  update(id: string, dto: any) {
    return this.prisma.measurementSet.update({
      where: { id },
      data: dto
    });
  }

  remove(id: string) {
    return this.prisma.measurementSet.delete({ where: { id } });
  }
}
