import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) { }

  create(createJobDto: CreateJobDto) {
    return this.prisma.job.create({
      data: createJobDto,
    });
  }

  findAll(companyId?: string) {
    return this.prisma.job.findMany({
      where: companyId ? { companyId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { estimates: true, measurements: true }
        }
      }
    });
  }

  findOne(id: string) {
    return this.prisma.job.findUnique({
      where: { id },
      include: {
        measurements: true,
        estimates: true
      }
    });
  }

  update(id: string, updateJobDto: UpdateJobDto) {
    return this.prisma.job.update({
      where: { id },
      data: updateJobDto,
    });
  }

  remove(id: string) {
    return this.prisma.job.delete({
      where: { id },
    });
  }
}
