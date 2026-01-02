export class CreateLineItemDto {
    companyId: string;
    code: string;
    name: string;
    description?: string;
    unit: string;
    category?: string;
    recipe?: any; // JSON
}

export class CreateMaterialDto {
    companyId: string;
    skuCode: string;
    description: string;
    unit: string;
    purchasePackagePrice: number;
    unitsPerPackage: number;
    defaultMargin?: number;
}

export class CreateLaborDto {
    companyId: string;
    code: string;
    description: string;
    hourlyRate: number;
}

export class CreateEquipmentDto {
    companyId: string;
    code: string;
    description: string;
    rate: number;
    unit: string;
}
