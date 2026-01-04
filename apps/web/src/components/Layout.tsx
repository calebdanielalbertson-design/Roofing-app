import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, LogOut, Menu, User, BookOpen } from 'lucide-react';
import { useState } from 'react';

export function Layout() {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const navItems = [
        { icon: LayoutDashboard, label: 'Jobs', path: '/jobs' },
        { icon: BookOpen, label: 'Catalog', path: '/catalog' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    const isActive = (path: string) => location.pathname.startsWith(path);

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Sidebar */}
            <aside
                className={`bg-slate-900 text-white transition-all duration-300 flex flex-col fixed inset-y-0 left-0 z-20
                ${sidebarOpen ? 'w-64' : 'w-20'}`}
            >
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="bg-blue-600 p-1.5 rounded-lg shrink-0">
                            <FileText size={20} className="text-white" />
                        </div>
                        <span className={`font-bold text-lg tracking-tight whitespace-nowrap transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                            RoofPro
                        </span>
                    </div>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group
                            ${isActive(item.path)
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                        >
                            <item.icon size={20} className="shrink-0" />
                            <span className={`whitespace-nowrap transition-all duration-300 overflow-hidden ${sidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
                                {item.label}
                            </span>
                            {!sidebarOpen && (
                                <div className="absolute left-16 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button className="flex items-center gap-3 text-slate-400 hover:text-white w-full px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors">
                        <LogOut size={20} className="shrink-0" />
                        <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${sidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
                            Sign Out
                        </span>
                    </button>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-10 px-6 flex items-center justify-between">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                    >
                        <Menu size={20} />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-medium text-gray-900">Demo User</div>
                                <div className="text-xs text-gray-500">Administrator</div>
                            </div>
                            <div className="h-9 w-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 border border-slate-200">
                                <User size={18} />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
