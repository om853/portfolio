import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CustomCursor from '../components/CustomCursor';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        document.documentElement.classList.add('dark');
        return () => document.documentElement.classList.remove('dark');
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const sidebarLinks = [
        { name: 'Overview', path: '/dashboard', icon: 'dashboard' },
        { name: 'Projects', path: '/dashboard/projects', icon: 'deployed_code' },
        { name: 'Skills', path: '/dashboard/skills', icon: 'bolt' },
        { name: 'Experience', path: '/dashboard/experiences', icon: 'timeline' },
        { name: 'Messages', path: '/dashboard/messages', icon: 'mail' },
        { name: 'Testimonials', path: '/dashboard/testimonials', icon: 'reviews' },
        { name: 'Leads', path: '/dashboard/leads', icon: 'leaderboard' },
        { name: 'Team', path: '/dashboard/team', icon: 'group' },
        { name: 'API Keys', path: '/dashboard/api-keys', icon: 'key' },
        { name: 'Settings', path: '/dashboard/settings', icon: 'settings' },
    ];

    const SidebarContent = () => (
        <>
            <div className="p-6">
                <div className="text-xl font-black tracking-tighter text-white uppercase mb-8">OMAR ADMIN</div>
                <nav className="space-y-1">
                    {sidebarLinks.map((link) => (
                        <Link 
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                location.pathname === link.path 
                                    ? 'bg-white text-gray-900' 
                                    : 'text-[#adaaaa] hover:bg-white/8 hover:text-white'
                            }`}
                        >
                            <span className="material-symbols-outlined text-lg">{link.icon}</span>
                            {link.name}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="mt-auto p-6">
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-[#ff6e84] hover:bg-[#ff6e84]/10 transition-all cursor-pointer"
                >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    Sign Out
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen admin-bg text-white flex">
            <CustomCursor />
            {/* Desktop Sidebar */}
            <aside className="w-64 admin-sidebar flex-col hidden lg:flex border-r border-white/5">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 z-50 w-64 admin-sidebar flex-col lg:hidden left-0 border-r border-white/5"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 sm:h-20 admin-header backdrop-blur-md border-b border-white/5 px-4 sm:px-8 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden p-2 text-[#adaaaa] hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                            aria-label="Toggle menu"
                        >
                            <span className="material-symbols-outlined text-xl">menu</span>
                        </button>
                        <h2 className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#adaaaa]">
                            {sidebarLinks.find(l => l.path === location.pathname)?.name || 'Dashboard'}
                        </h2>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:block text-right">
                            <p className="text-xs font-bold text-white">{user?.name}</p>
                            <p className="text-[0.6rem] text-[#adaaaa] uppercase tracking-tighter">Administrator</p>
                        </div>
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-white text-sm shrink-0">
                            {user?.name?.charAt(0)}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 text-left">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;