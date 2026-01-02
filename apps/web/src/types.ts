export interface Job {
    id: string;
    customerName: string;
    address: string;
    city?: string;
    state?: string;
    carrierName?: string;
    claimNumber?: string;
    measurements: MeasurementSet[];
    estimates: Estimate[];
    createdAt: string;
}

export interface MeasurementSet {
    id: string;
    jobId: string;
    name: string;
    totalRoofAreaSqFt: number;
    ridgeLf: number;
    hipLf: number;
    valleyLf: number;
    eaveLf: number;
    rakeLf: number;
    stories: number;
    pitch: string | null;
}

export interface EstimateLine {
    id: string;
    lineItemId: string;
    quantity: number;
    lineItem: LineItemCatalog; // Now this depends on LineItemCatalog being defined
    unitPrice: number;
    extended: number;
    material: number;
    labor: number;
    equipment: number;
    breakdown?: any;
}

export interface Estimate {
    id: string;
    jobId: string;
    status: 'DRAFT' | 'FINAL';
    lines: EstimateLine[];
    grandTotal: number;
    totalMaterial: number;
    totalLabor: number;
    totalEquipment: number;
    subtotal: number;
    totalOverhead: number;
    totalProfit: number;
}

export interface LineItemCatalog {
    id: string;
    code: string;
    name: string;
    unit: string;
    category?: string;
    description?: string;
}

export interface Job {
    id: string;
    companyId: string;
    customerName: string;
    address: string;
    city?: string;
    state?: string;
    zip?: string;
    carrierName?: string;
    claimNumber?: string;
    measurements: MeasurementSet[];
    estimates: Estimate[];
    createdAt: string;
}
