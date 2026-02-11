'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Brain,
    LayoutDashboard,
    FolderOpen,
    GraduationCap,
    BarChart2,
    Users,
    ChevronDown
} from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    const navItems = [
        { icon: LayoutDashboard, label: '대시보드', href: '/dashboard' },
        { icon: FolderOpen, label: '내 기억 저장소', href: '/dashboard/storage' },
        { icon: GraduationCap, label: '학습 모드', href: '/dashboard/study' },
        { icon: BarChart2, label: '분석 리포트', href: '/dashboard/analytics' },
    ];

    const communityItems = [
        { icon: Users, label: '기억 공유', href: '/dashboard/community' },
    ];

    return (
        <aside className="w-20 lg:w-64 bg-[#020617] border-r border-slate-800 flex flex-col justify-between py-6 transition-all duration-300 z-20 shrink-0">
            <div className="px-4 lg:px-6 flex items-center justify-center lg:justify-start gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[#8B5CF6] flex items-center justify-center text-white shadow-lg shadow-primary/20">
                    <Brain className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold tracking-tight hidden lg:block bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-display">
                    MEMIT
                </span>
            </div>

            <nav className="flex-1 px-3 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${isActive(item.href)
                                ? 'bg-primary/20 text-white border border-primary/20'
                                : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                    >
                        <item.icon className={`w-5 h-5 lg:w-6 lg:h-6 ${isActive(item.href) ? 'text-white' : ''}`} />
                        <span className="hidden lg:block font-medium">{item.label}</span>
                    </Link>
                ))}

                <p className="hidden lg:block px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-6 mb-2 font-display">
                    커뮤니티
                </p>

                {communityItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${isActive(item.href)
                                ? 'bg-primary/20 text-white border border-primary/20'
                                : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                    >
                        <item.icon className="w-5 h-5 lg:w-6 lg:h-6" />
                        <span className="hidden lg:block font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="px-3 lg:px-4">
                <button className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800 transition-colors text-left group">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full border-2 border-slate-700 bg-slate-800 overflow-hidden">
                            {/* Placeholder for user avatar */}
                            <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">U</div>
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#020617] rounded-full"></div>
                    </div>
                    <div className="hidden lg:block overflow-hidden">
                        <p className="text-sm font-semibold truncate text-white group-hover:text-primary transition-colors">User Name</p>
                        <p className="text-xs text-slate-500 truncate">Free Plan</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400 ml-auto hidden lg:block" />
                </button>
            </div>
        </aside>
    );
}
