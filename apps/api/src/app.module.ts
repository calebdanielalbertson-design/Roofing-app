import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompaniesModule } from './companies/companies.module';
import { JobsModule } from './jobs/jobs.module';
import { EstimatesModule } from './estimates/estimates.module';
import { CatalogModule } from './catalog/catalog.module';
import { MeasurementsModule } from './measurements/measurements.module';
import { PdfModule } from './pdf/pdf.module';

@Module({
  imports: [CompaniesModule, JobsModule, EstimatesModule, CatalogModule, MeasurementsModule, PdfModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
