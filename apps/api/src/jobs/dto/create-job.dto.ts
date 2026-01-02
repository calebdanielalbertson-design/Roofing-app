export class CreateJobDto {
    companyId: string;
    customerName: string;
    address: string;
    city?: string;
    state?: string;
    zip?: string;
    carrierName?: string;
    claimNumber?: string;
}
