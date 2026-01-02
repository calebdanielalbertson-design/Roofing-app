import { Outlet, Link } from 'react-router-dom';

export function Layout() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-6">
                    <Link to="/" className="text-xl font-bold tracking-tight text-blue-600">RoofPro</Link>
                    <nav className="flex gap-4 text-sm font-medium text-gray-600">
                        <Link to="/jobs" className="hover:text-gray-900">Jobs</Link>
                        <Link to="/catalog" className="hover:text-gray-900">Catalog</Link>
                    </nav>
                </div>
                <div className="text-sm text-gray-500">Demo User</div>
            </header>
            <main className="p-6 max-w-7xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
}
