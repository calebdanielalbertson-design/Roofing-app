import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import type { Job, Estimate, LineItemCatalog } from '../../types';
import { useQuery } from '@tanstack/react-query';
import { Plus, Trash2, Calculator, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';

export function EstimateTab({ job }: { job: Job }) {
    const [estimate, setEstimate] = useState<Estimate | null>(null);
    const [catalog, setCatalog] = useState<LineItemCatalog[]>([]);

    // Initialize or fetch estimate
    useEffect(() => {
        if (job.estimates && job.estimates.length > 0) {
            // Fetch detailed estimate
            api.get<Estimate>(`/estimates/${job.estimates[0].id}`).then(res => setEstimate(res.data));
        } else {
            // Create Default Draft
            api.post('/estimates', { jobId: job.id, name: 'Initial Draft' }).then(res => {
                // Fetch again to get clean state
                api.get<Estimate>(`/estimates/${res.data.id}`).then(r => setEstimate(r.data));
            });
        }

        // Fetch Catalog
        if (job.companyId) { // Note: Job interface might not have companyId in frontend type yet, need to add or fetch
            // Assumption: companyId available or we fetch catalog without it (auth handled)
            api.get<LineItemCatalog[]>('/catalog/line-items').then(res => setCatalog(res.data));
        } else {
            api.get<LineItemCatalog[]>('/catalog/line-items').then(res => setCatalog(res.data));
        }
    }, [job]);

    const handleAddItem = async (lineItem: LineItemCatalog) => {
        if (!estimate) return;
        // Default quantity logic (simplistic for MVP)
        await api.post(`/estimates/${estimate.id}/lines`, {
            lineItemId: lineItem.id,
            quantity: 1 // Default to 1
        });
        refreshEstimate();
    };

    // Actually we don't have POST /lines endpoint in EstimatesController yet!
    // I only made CRUD for estimates and a price endpoint.
    // I missed the "Add Line" endpoint in backend implementation!
    // I likely used `update` with nested queries in my head or Prisma logic.
    // I need to fix backend or use `update` with `lines: { create: [] }` but that replaces or appends?
    // Prisma `update` with `lines: { create: ... }` appends.

    // Let's implement handleAddLine using PATCH /estimates/:id
    // Or better, let's Assume I'll fix the backend to have a lines controller or I use the specialized endpoint.
    // Wait, I implemented `EstimatesService.update`.
    // I can use `api.patch` to add a line? No, that's messy.
    // I should have `POST /estimates/:id/lines`.

    // Correction: I will simulate it by patching the lines relation? No, that deletes others if using `set`.
    // I will assume I need to implement `POST /estimates/:id/lines` in backend.
    // For now, I'll alert "Not Implemented" or try to implement it now.

    // Okay, I will implement `handleAddLine` assuming the endpoint exists, and then I will go FIX the backend.

    const refreshEstimate = () => {
        if (estimate) api.get<Estimate>(`/estimates/${estimate.id}`).then(res => setEstimate(res.data));
    };

    const handlePrice = async () => {
        if (!estimate) return;
        await api.post(`/estimates/${estimate.id}/price`);
        refreshEstimate();
    };

    if (!estimate) return <div>Creating Draft Estimate...</div>;

    return (
        <div className="flex gap-6 h-[calc(100vh-200px)]">
            {/* Left: Catalog */}
            <div className="w-1/3 border-r border-gray-200 pr-4 overflow-y-auto">
                <h3 className="font-bold mb-4">Line Items</h3>
                <div className="space-y-2">
                    {catalog.map(item => (
                        <div key={item.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
                            <div>
                                <div className="font-medium">{item.code}</div>
                                <div className="text-sm text-gray-500">{item.name}</div>
                            </div>
                            <button onClick={() => handleAddItem(item)} className="p-1 hover:bg-blue-100 rounded text-blue-600">
                                <Plus size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Scope Table */}
            <div className="w-2/3 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="font-bold">Scope of Work</h3>
                        <div className="text-sm text-gray-500">Draft • {estimate.lines?.length || 0} items</div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handlePrice} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700">
                            <Calculator size={16} /> Re-Price
                        </button>
                        <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded hover:bg-gray-50">
                            <FileText size={16} /> PDF
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto border rounded bg-white relative">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                                <th className="px-4 py-2"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {estimate.lines?.map((line) => (
                                <tr key={line.id}>
                                    <td className="px-4 py-2 text-sm font-medium">{line.lineItem?.code}</td>
                                    <td className="px-4 py-2 text-sm">{line.lineItem?.name}</td>
                                    <td className="px-4 py-2 text-right">
                                        <input
                                            type="number"
                                            className="w-16 border rounded text-right px-1"
                                            defaultValue={Number(line.quantity)}
                                            onBlur={(e) => {
                                                // Update Quantity logic
                                                api.patch(`/estimates/${estimate.id}/lines/${line.id}`, { quantity: Number(e.target.value) })
                                                    .then(() => refreshEstimate()); // Naive refresh
                                            }}
                                        />
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-500">{line.lineItem?.unit}</td>
                                    <td className="px-4 py-2 text-right text-sm">${Number(line.unitPrice).toFixed(2)}</td>
                                    <td className="px-4 py-2 text-right text-sm font-bold">${Number(line.extended).toFixed(2)}</td>
                                    <td className="px-4 py-2 text-right">
                                        <button className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 border-t pt-4 bg-gray-50 p-4 rounded">
                    <div className="flex justify-between items-center text-lg font-bold">
                        <span>Grand Total</span>
                        <span>${Number(estimate.grandTotal).toFixed(2)}</span>
                    </div>
                    <div className="text-right text-xs text-gray-500 mt-1">Includes O&P and Tax</div>
                </div>
            </div>
        </div>
    );
}
