'use client';

import React from 'react';
import { Home, Search, Bell, Settings } from 'lucide-react';

export default function Header() {
    return (
        <header className="h-16 flex items-center justify-between px-6 lg:px-10 border-b border-slate-800/50 backdrop-blur-sm z-10 transition-colors">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Home className="w-5 h-5 text-slate-400" />
                <span className="text-slate-400">/</span>
                <span>대시보드</span>
            </h1>

            <div className="flex items-center gap-4">
                <div className="relative group hidden sm:block">
                    <input
                        type="text"
                        placeholder="기억 검색 (Ctrl+K)..."
                        className="w-64 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all pl-10 text-slate-200 placeholder-slate-500"
                    />
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                </div>

                <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <button className="p-2 text-slate-400 hover:text-white transition-colors">
                    <Settings className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
}
