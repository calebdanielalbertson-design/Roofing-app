import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Job } from '../types';
import { useNavigate } from 'react-router-dom';
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

    if (isLoading) return (
        <div className="flex items-center justify-center h-64 text-gray-500 gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            Loading jobs...
        </div>
    );

    if (isError) return (
        <div className="p-6 bg-red-50 text-red-700 rounded-lg border border-red-200">
            <h3 className="font-bold flex items-center gap-2">Error Loading Data</h3>
            <p>{(error as Error).message}</p>
            <p className="text-sm mt-2 text-red-600">Please verify the backend server is running.</p>
        </div>
    );

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Jobs</h1>
                    <p className="text-gray-500 mt-1">Manage and track all roofing projects</p>
                </div>
                <button
                    onClick={() => navigate('/jobs/new')}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 transition shadow-sm hover:shadow-md active:scale-95"
                >
                    <PlusCircle size={20} /> New Job
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Carrier</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {jobs?.map((job) => (
                                <tr
                                    key={job.id}
                                    className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                                    onClick={() => navigate(`/jobs/${job.id}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900 group-hover:text-blue-700">{job.customerName}</div>
                                        <div className="text-xs text-gray-400">ID: {job.id.slice(0, 8)}...</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm max-w-xs truncate">
                                        {job.address}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {job.carrierName ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                {job.carrierName}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 text-sm">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                                        {new Date(job.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                                            Active
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <span className="text-blue-600 hover:text-blue-900 opacity-0 group-hover:opacity-100 transition-opacity">
                                            View
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {jobs?.length === 0 && (
                    <div className="p-12 text-center">
                        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 mb-4">
                            <PlusCircle className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No jobs yet</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating your first roofing project.</p>
                        <div className="mt-6">
                            <button
                                onClick={() => navigate('/jobs/new')}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <PlusCircle className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                Create Job
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
