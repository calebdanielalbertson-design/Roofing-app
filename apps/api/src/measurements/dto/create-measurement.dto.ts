export class CreateMeasurementSetDto {
    jobId: string;
    name?: string;
    totalRoofAreaSqFt: number;
    totalPitchedAreaSqFt?: number;
    ridgeLf?: number;
    hipLf?: number;
    valleyLf?: number;
    eaveLf?: number;
    rakeLf?: number;
    stories?: number;
    pitch?: string;
    wastePct?: number;
}
