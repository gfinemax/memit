'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Layers, Plus, Archive, History } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function MobileBottomNav() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    // Show on main dashboard, community, and settings pages
    const showNav = ['/dashboard', '/dashboard/services', '/dashboard/community', '/dashboard/settings', '/dashboard/storage'].includes(pathname);

    if (!showNav) {
        return null;
    }

    return (
        <nav className="fixed bottom-0 w-full bg-background-light dark:bg-background-dark border-t border-slate-100 dark:border-white/5 px-6 py-3 flex justify-between items-center z-50 pb-safe">
            <Link href="/dashboard" className={`flex flex-col items-center gap-1 w-12 transition-colors ${isActive('/dashboard') ? 'text-primary' : 'text-slate-400 dark:text-slate-500 hover:text-primary'}`}>
                <Home className="w-6 h-6" />
                <span className="text-[10px] font-medium">홈</span>
            </Link>

            <Link href="/dashboard/services" className={`flex flex-col items-center gap-1 w-12 transition-colors ${isActive('/dashboard/services') ? 'text-primary' : 'text-slate-400 dark:text-slate-500 hover:text-primary'}`}>
                <Layers className="w-6 h-6" />
                <span className="text-[10px] font-medium">서비스</span>
            </Link>

            <div className="relative -top-6">
                <button
                    onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="h-14 w-14 rounded-full bg-primary shadow-lg shadow-primary/40 flex items-center justify-center text-white transform active:scale-95 transition-transform"
                >
                    <Plus className="w-8 h-8" />
                </button>
            </div>

            <Link href="/dashboard/storage" className={`flex flex-col items-center gap-1 w-12 transition-colors ${isActive('/dashboard/storage') ? 'text-primary' : 'text-slate-400 dark:text-slate-500 hover:text-primary'}`}>
                <Archive className="w-6 h-6" />
                <span className="text-[10px] font-medium">보관함</span>
            </Link>

            <Link href="/dashboard/community" className={`flex flex-col items-center gap-1 w-12 transition-colors ${isActive('/dashboard/community') ? 'text-primary' : 'text-slate-400 dark:text-slate-500 hover:text-primary'}`}>
                <History className="w-6 h-6" />
                <span className="text-[10px] font-medium">기록/커뮤니티</span>
            </Link>
        </nav>
    );
}
