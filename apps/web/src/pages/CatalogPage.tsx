import { useState } from 'react';
import { api } from '../lib/api';
import { useQuery } from '@tanstack/react-query';

export function CatalogPage() {
    const [activeTab, setActiveTab] = useState<'materials' | 'labor' | 'equipment'>('materials');

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Cost Book & Catalog</h1>

            <div className="flex gap-4 mb-6 border-b">
                <button onClick={() => setActiveTab('materials')} className={`pb-2 ${activeTab === 'materials' ? 'border-b-2 border-blue-600 font-bold' : ''}`}>Materials</button>
                <button onClick={() => setActiveTab('labor')} className={`pb-2 ${activeTab === 'labor' ? 'border-b-2 border-blue-600 font-bold' : ''}`}>Labor Rates</button>
                <button onClick={() => setActiveTab('equipment')} className={`pb-2 ${activeTab === 'equipment' ? 'border-b-2 border-blue-600 font-bold' : ''}`}>Equipment</button>
            </div>

            {activeTab === 'materials' && <MaterialsTable />}
            {activeTab === 'labor' && <LaborTable />}
            {activeTab === 'equipment' && <EquipmentTable />}
        </div>
    );
}

function MaterialsTable() {
    const { data: items } = useQuery({ queryKey: ['materials'], queryFn: () => api.get('/catalog/materials').then(r => r.data) });
    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead>
                <tr>
                    <th className="text-left py-2">SKU</th>
                    <th className="text-left py-2">Description</th>
                    <th className="text-right py-2">Package Price</th>
                    <th className="text-right py-2">Units/Pack</th>
                </tr>
            </thead>
            <tbody>
                {items?.map((item: any) => (
                    <tr key={item.id}>
                        <td className="py-2">{item.skuCode}</td>
                        <td className="py-2">{item.description}</td>
                        <td className="py-2 text-right">${Number(item.purchasePackagePrice).toFixed(2)}</td>
                        <td className="py-2 text-right">{Number(item.unitsPerPackage)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

function LaborTable() {
    const { data: items } = useQuery({ queryKey: ['labor'], queryFn: () => api.get('/catalog/labor').then(r => r.data) });
    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead>
                <tr>
                    <th className="text-left py-2">Code</th>
                    <th className="text-left py-2">Description</th>
                    <th className="text-right py-2">Hourly Rate</th>
                </tr>
            </thead>
            <tbody>
                {items?.map((item: any) => (
                    <tr key={item.id}>
                        <td className="py-2">{item.code}</td>
                        <td className="py-2">{item.description}</td>
                        <td className="py-2 text-right">${Number(item.hourlyRate).toFixed(2)} /hr</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

function EquipmentTable() {
    const { data: items } = useQuery({ queryKey: ['equipment'], queryFn: () => api.get('/catalog/equipment').then(r => r.data) });
    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead>
                <tr>
                    <th className="text-left py-2">Code</th>
                    <th className="text-left py-2">Description</th>
                    <th className="text-right py-2">Rate</th>
                </tr>
            </thead>
            <tbody>
                {items?.map((item: any) => (
                    <tr key={item.id}>
                        <td className="py-2">{item.code}</td>
                        <td className="py-2">{item.description}</td>
                        <td className="py-2 text-right">${Number(item.rate).toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
