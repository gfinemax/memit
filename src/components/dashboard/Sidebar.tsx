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
    ChevronDown,
    Settings,
    Lock,
    Handshake,
    Mic,
    ShoppingCart,
    Zap,
    LayoutGrid
} from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    const navItems = [
        { icon: LayoutDashboard, label: '대시보드', href: '/dashboard' },
        { icon: FolderOpen, label: '내 기억 저장소', href: '/dashboard/storage' },
        { icon: LayoutGrid, label: '기억 도우미', href: '/dashboard/services' },
    ];

    const serviceItems = [
        { icon: Lock, label: '보안 & 금융', href: '/dashboard/security' },
        { icon: Handshake, label: '인맥 & 비즈니스', href: '/dashboard/networking' },
        { icon: GraduationCap, label: '학습 & 지식', href: '/dashboard/learning' },
        { icon: Mic, label: '발표 & 스피치', href: '/dashboard/speech' },
        { icon: ShoppingCart, label: '일상 & 생활', href: '/dashboard/daily' },
        { icon: Brain, label: '두뇌 트레이닝', href: '/dashboard/training' },
    ];

    const communityItems = [
        { icon: Users, label: '기억 공유', href: '/dashboard/community' },
    ];

    return (
        <aside className="w-20 bg-[#020617] border-r border-slate-800 flex flex-col justify-between py-6 transition-all duration-300 z-20 shrink-0 group lg:hover:w-64 overflow-hidden">
            <div className="px-4 lg:px-6 flex items-center justify-center lg:justify-start gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[#8B5CF6] flex items-center justify-center text-white shadow-lg shadow-primary/20">
                    <Brain className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold tracking-tight hidden group-hover:block bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-display whitespace-nowrap">
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
                        <span className="hidden group-hover:block font-medium whitespace-nowrap">{item.label}</span>
                    </Link>
                ))}

                <p className="hidden group-hover:block px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-6 mb-2 font-display whitespace-nowrap">
                    상황별 기억
                </p>

                {serviceItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all group ${isActive(item.href)
                            ? 'bg-primary/20 text-white border border-primary/20'
                            : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                    >
                        <item.icon className={`w-5 h-5 lg:w-5 lg:h-5 ${isActive(item.href) ? 'text-white' : ''}`} />
                        <span className="hidden group-hover:block text-sm font-medium whitespace-nowrap">{item.label}</span>
                    </Link>
                ))}

                <p className="hidden group-hover:block px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-6 mb-2 font-display whitespace-nowrap">
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
                        <span className="hidden group-hover:block font-medium whitespace-nowrap">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="px-3 lg:px-4 mt-auto border-t border-slate-800 pt-6">
                <Link
                    href="/dashboard/settings"
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${isActive('/dashboard/settings')
                        ? 'bg-primary/20 text-white border border-primary/20'
                        : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                >
                    <Settings className={`w-5 h-5 lg:w-6 lg:h-6 ${isActive('/dashboard/settings') ? 'text-white' : ''}`} />
                    <span className="hidden group-hover:block font-medium whitespace-nowrap">설정</span>
                </Link>
            </div>
        </aside>
    );
}
