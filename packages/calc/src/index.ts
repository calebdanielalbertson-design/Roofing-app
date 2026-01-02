export interface PricingContext {
    materialPrices: Record<string, { price: number; unitsPerPack: number }>;
    laborRates: Record<string, number>;
    equipmentRates: Record<string, number>;
}

export interface Recipe {
    materials: Array<{ skuCode: string; quantity?: number; divisor?: number; multiplier?: number }>;
    labor: Array<{ code: string; quantity?: number; unitsPerHour?: number }>;
    equipment: Array<{ code: string; quantity?: number; divisor?: number }>;
}

export interface LineItemResult {
    materialCost: number;
    laborCost: number;
    equipmentCost: number;
    unitPrice: number;
    extendedPrice: number;
    breakdown: any;
}

export class PricingEngine {
    static calculateLineItem(
        quantity: number,
        recipe: Recipe | null,
        context: PricingContext
    ): LineItemResult {
        if (!recipe) {
            return { materialCost: 0, laborCost: 0, equipmentCost: 0, unitPrice: 0, extendedPrice: 0, breakdown: {} };
        }

        let unitMaterial = 0;
        let unitLabor = 0;
        let unitEquipment = 0;

        for (const mat of recipe.materials) {
            const sku = context.materialPrices[mat.skuCode];
            if (sku) {
                const baseUnitCost = sku.price / sku.unitsPerPack;
                let amount = 0;
                if (mat.quantity !== undefined) {
                    amount = mat.quantity;
                } else {
                    amount = (mat.multiplier ?? 1) / (mat.divisor ?? 1);
                }
                unitMaterial += baseUnitCost * amount;
            }
        }

        for (const lab of recipe.labor) {
            const rate = context.laborRates[lab.code] || 0;
            if (lab.unitsPerHour) {
                unitLabor += rate / lab.unitsPerHour;
            } else if (lab.quantity) {
                unitLabor += rate * lab.quantity;
            }
        }

        for (const eq of recipe.equipment) {
            const rate = context.equipmentRates[eq.code] || 0;
            let amount = 0;
            if (eq.quantity !== undefined) {
                amount = eq.quantity;
            } else {
                amount = 1 / (eq.divisor ?? 1);
            }
            unitEquipment += rate * amount;
        }

        const materialExtended = unitMaterial * quantity;
        const laborExtended = unitLabor * quantity;
        const equipmentExtended = unitEquipment * quantity;
        const totalExtended = materialExtended + laborExtended + equipmentExtended;
        const unitPrice = quantity > 0 ? totalExtended / quantity : 0;

        return {
            materialCost: materialExtended,
            laborCost: laborExtended,
            equipmentCost: equipmentExtended,
            unitPrice,
            extendedPrice: totalExtended,
            breakdown: {
                unitMaterial,
                unitLabor,
                unitEquipment
            }
        };
    }

    static calculateEstimateTotal(lines: { materialCost: number; laborCost: number; equipmentCost: number }[]) {
        const totals = lines.reduce((acc, line) => ({
            material: acc.material + line.materialCost,
            labor: acc.labor + line.laborCost,
            equipment: acc.equipment + line.equipmentCost,
            total: acc.total + line.materialCost + line.laborCost + line.equipmentCost
        }), { material: 0, labor: 0, equipment: 0, total: 0 });

        return {
            ...totals,
            subtotal: totals.total
        };
    }
}
