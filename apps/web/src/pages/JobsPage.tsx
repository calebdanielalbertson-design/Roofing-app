import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Job } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

export function JobsPage() {
    const navigate = useNavigate();
    const { data: jobs, isLoading, isError, error } = useQuery({
        queryKey: ['jobs'],
        queryFn: async () => {
            const res = await api.get<Job[]>('/jobs');
            return res.data;
        }
    });

    if (isLoading) return <div className="p-8">Loading jobs...</div>;
    if (isError) return <div className="p-8 text-red-600">Error loading jobs: {(error as Error).message}. Check if Backend is running.</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Jobs</h1>
                <button
                    onClick={() => navigate('/jobs/new')}
                    className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
                >
                    <PlusCircle size={18} /> New Job
                </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carrier</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {jobs?.map((job) => (
                            <tr key={job.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/jobs/${job.id}`)}>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{job.customerName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{job.address}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{job.carrierName || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(job.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {jobs?.length === 0 && <div className="p-8 text-center text-gray-500">No jobs found. Create one to get started.</div>}
            </div>
        </div>
    );
}
