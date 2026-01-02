import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import type { Job, MeasurementSet } from '../../types';

export function MeasurementTab({ job }: { job: Job }) {
    const [measurements, setMeasurements] = useState<MeasurementSet | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        totalRoofAreaSqFt: 0,
        ridgeLf: 0,
        hipLf: 0,
        valleyLf: 0,
        eaveLf: 0,
        rakeLf: 0,
        pitch: '6/12',
        stories: 1
    });

    useEffect(() => {
        if (job.measurements && job.measurements.length > 0) {
            const last = job.measurements[0];
            setMeasurements(last);
            setFormData({
                totalRoofAreaSqFt: Number(last.totalRoofAreaSqFt),
                ridgeLf: Number(last.ridgeLf),
                hipLf: Number(last.hipLf || 0),
                valleyLf: Number(last.valleyLf),
                eaveLf: Number(last.eaveLf),
                rakeLf: Number(last.rakeLf || 0),
                pitch: '6/12', // Placeholder
                stories: 1 // Placeholder
            });
        } else {
            setIsEditing(true);
        }
    }, [job]);

    const handleSave = async () => {
        try {
            const payload = {
                jobId: job.id,
                name: 'Initial Measurements',
                ...formData,
                // Ensure numbers
                totalRoofAreaSqFt: Number(formData.totalRoofAreaSqFt),
                ridgeLf: Number(formData.ridgeLf),
                valleyLf: Number(formData.valleyLf),
                eaveLf: Number(formData.eaveLf)
            };

            if (measurements) {
                await api.patch(`/measurements/${measurements.id}`, payload);
            } else {
                const res = await api.post('/measurements', payload);
                setMeasurements(res.data);
            }
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            alert('Failed to save measurements');
        }
    };

    if (isEditing) {
        return (
            <div className="bg-white p-6 rounded shadow border border-blue-100">
                <h2 className="text-lg font-bold mb-4">Edit Measurements</h2>
                <div className="grid grid-cols-2 gap-4 max-w-lg">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Total Roof Area (Sq Ft)</label>
                        <input type="number" className="border p-2 rounded w-full" value={formData.totalRoofAreaSqFt} onChange={e => setFormData({ ...formData, totalRoofAreaSqFt: e.target.valueAsNumber })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ridge LF</label>
                        <input type="number" className="border p-2 rounded w-full" value={formData.ridgeLf} onChange={e => setFormData({ ...formData, ridgeLf: e.target.valueAsNumber })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Valley LF</label>
                        <input type="number" className="border p-2 rounded w-full" value={formData.valleyLf} onChange={e => setFormData({ ...formData, valleyLf: e.target.valueAsNumber })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Eave LF (Drip Edge)</label>
                        <input type="number" className="border p-2 rounded w-full" value={formData.eaveLf} onChange={e => setFormData({ ...formData, eaveLf: e.target.valueAsNumber })} />
                    </div>
                </div>
                <div className="mt-4 flex gap-2">
                    <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">Save Measurements</button>
                    {measurements && <button onClick={() => setIsEditing(false)} className="border px-4 py-2 rounded">Cancel</button>}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Dimensions</h2>
                <button onClick={() => setIsEditing(true)} className="text-blue-600 font-medium">Edit</button>
            </div>

            <div className="bg-white rounded border border-gray-200">
                <div className="grid grid-cols-4 divide-x divide-gray-200">
                    <div className="p-4 text-center">
                        <div className="text-2xl font-bold text-gray-900">{measurements?.totalRoofAreaSqFt}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Sq Ft</div>
                    </div>
                    <div className="p-4 text-center">
                        <div className="text-2xl font-bold text-gray-900">{measurements?.ridgeLf}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Ridge LF</div>
                    </div>
                    <div className="p-4 text-center">
                        <div className="text-2xl font-bold text-gray-900">{measurements?.valleyLf}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Valley LF</div>
                    </div>
                    <div className="p-4 text-center">
                        <div className="text-2xl font-bold text-gray-900">{measurements?.eaveLf}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Eave LF</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
