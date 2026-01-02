import { useState } from 'react';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';

export function CreateJobPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        customerName: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        carrierName: '',
        claimNumber: '',
        companyId: '' // Will be handled by backend usually or inferred
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // For MVP, we need a companyId. In real app, derived from User.
        // We'll fetch the first company or just send dummy if backend handles it
        // Wait, backend requires companyId in DTO if not inferred. The Guard mocks user but doesn't set companyId automatically in Body.
        // We should fetch company first? Or backend MockUser has companyId?
        // Let's assume we need to pass a valid UUID.
        // For MVP speed: hardcode the one from seed if possible, or fetch companies list.
        const companies = await api.get('/companies');
        const companyId = companies.data[0]?.id;

        if (!companyId) {
            alert("Please run seed or create a company first.");
            return;
        }

        try {
            await api.post('/jobs', { ...formData, companyId });
            navigate('/jobs');
        } catch (err) {
            console.error(err);
            alert('Failed to save job');
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">New Job Intake</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                        required
                        value={formData.customerName}
                        onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                        required
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Carrier</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                            value={formData.carrierName}
                            onChange={e => setFormData({ ...formData, carrierName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Claim #</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                            value={formData.claimNumber}
                            onChange={e => setFormData({ ...formData, claimNumber: e.target.value })}
                        />
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={() => navigate('/jobs')} className="px-4 py-2 border rounded text-gray-700">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700">Create Job</button>
                </div>
            </form>
        </div>
    );
}
