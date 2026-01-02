import { PartialType } from '@nestjs/mapped-types';
import { CreateMeasurementSetDto } from './create-measurement.dto';

export class UpdateMeasurementSetDto extends PartialType(CreateMeasurementSetDto) { }
