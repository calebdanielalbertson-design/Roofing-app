import { PartialType } from '@nestjs/mapped-types';
import { CreateLineItemDto } from './create-catalog.dto';

export class UpdateCatalogDto extends PartialType(CreateLineItemDto) { }
