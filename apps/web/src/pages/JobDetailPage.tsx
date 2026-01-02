import { useParams, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Job } from '../types';
import { MeasurementTab } from './tabs/MeasurementTab';
import { EstimateTab } from './tabs/EstimateTab';
import { cn } from '../lib/utils';

export function JobDetailPage() {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const { data: job, isLoading } = useQuery({
        queryKey: ['job', id],
        queryFn: async () => {
            const res = await api.get<Job>(`/jobs/${id}`);
            return res.data;
        }
    });

    if (isLoading) return <div>Loading...</div>;
    if (!job) return <div>Job not found</div>;

    const tabs = [
        { name: 'Measurements', path: '' }, // Default
        { name: 'Estimate & Scope', path: 'estimate' },
        { name: 'Documents', path: 'documents' },
    ];

    const currentPath = location.pathname.split('/').pop();
    const isDefault = currentPath === id;

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold">{job.customerName}</h1>
                <p className="text-gray-500">{job.address} • {job.carrierName}</p>
            </div>

            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => {
                        const to = tab.path ? `/jobs/${id}/${tab.path}` : `/jobs/${id}`;
                        const active = tab.path === '' ? isDefault : currentPath === tab.path;
                        return (
                            <Link
                                key={tab.name}
                                to={to}
                                className={cn(
                                    active
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                                )}
                            >
                                {tab.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <Routes>
                <Route path="/" element={<MeasurementTab job={job} />} />
                <Route path="/estimate" element={<EstimateTab job={job} />} />
                <Route path="/documents" element={<div className="p-4">Documents coming soon...</div>} />
            </Routes>
        </div>
    );
}
