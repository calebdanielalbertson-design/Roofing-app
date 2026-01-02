import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // 1. Create Default Company
    const company = await prisma.company.create({
        data: {
            name: 'Demo Roofing Co.',
            users: {
                create: {
                    email: 'admin@demo.com',
                    name: 'Admin User',
                    role: 'ADMIN'
                }
            }
        }
    });

    console.log('Created Company:', company.id);

    // 2. Create Catalog Items (Materials)
    // Shingles
    await prisma.materialSku.create({
        data: {
            companyId: company.id,
            skuCode: '#00S',
            description: 'Laminated Shingles (Bundle)',
            unit: 'BDL',
            purchasePackagePrice: 35.00,
            unitsPerPackage: 1, // 1 bundle
        }
    });

    // Nails
    await prisma.materialSku.create({
        data: {
            companyId: company.id,
            skuCode: 'NAIL1.25RF',
            description: '1 1/4" Coil Nails (Box)',
            unit: 'BOX',
            purchasePackagePrice: 45.00,
            unitsPerPackage: 1 // 1 box
        }
    });

    // Drip Edge
    await prisma.materialSku.create({
        data: {
            companyId: company.id,
            skuCode: 'DRIP',
            description: 'Drip Edge (10ft)',
            unit: 'PC',
            purchasePackagePrice: 8.50,
            unitsPerPackage: 1
        }
    });

    // 3. Labor Roles
    await prisma.laborRole.createMany({
        data: [
            { companyId: company.id, code: 'RFG', description: 'Roofer', hourlyRate: 45.00 },
            { companyId: company.id, code: 'LAB', description: 'General Labor', hourlyRate: 30.00 }
        ]
    });

    // 4. Equipment
    await prisma.equipmentRate.create({
        data: {
            companyId: company.id,
            code: 'DMP',
            description: 'Dumpster',
            rate: 450.00,
            unit: 'LOAD'
        }
    });

    // 5. Line Item Formulas (Recipes)
    // Shingle Removal
    await prisma.lineItemCatalog.create({
        data: {
            companyId: company.id,
            code: '300S',
            name: 'Tear Off Shingles',
            description: 'Remove existing shingles to deck.',
            unit: 'SQ',
            recipe: {
                materials: [],
                labor: [{ code: 'RFG', quantity: 1.5 }], // 1.5 hrs per SQ
                equipment: [{ code: 'DMP', quantity: 0.05 }] // partial dumpster per SQ
            } as any
        }
    });

    // Shingle Install
    await prisma.lineItemCatalog.create({
        data: {
            companyId: company.id,
            code: '#00S',
            name: 'Install Laminated Shingles',
            description: 'Install new arch shingles.',
            unit: 'SQ',
            recipe: {
                materials: [
                    { skuCode: '#00S', quantity: 3 }, // 3 bundles per SQ
                    { skuCode: 'NAIL1.25RF', quantity: 0.05 } // 1 box covers 20 SQ?
                ],
                labor: [{ code: 'RFG', quantity: 1.2 }],
                equipment: []
            } as any
        }
    });

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
