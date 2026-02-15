'use client';

import React from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function MobileHeader() {
    const router = useRouter();
    const pathname = usePathname();

    // Only show on the main dashboard page
    if (pathname !== '/memit') {
        return null;
    }

    return (
        <header className="pt-8 pb-4 px-6 flex flex-col items-start justify-end bg-background-light dark:bg-background-dark sticky top-0 z-20 shadow-sm dark:shadow-none dark:border-b dark:border-white/5">
            <div className="flex w-full justify-between items-center mb-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                </button>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push('/memit/settings')}
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                    >
                        <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                    <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/20 cursor-pointer">
                        <span className="text-primary font-bold">U</span>
                    </div>
                </div>
            </div>

            <div className="space-y-1">
                <span className="text-primary font-semibold text-xs uppercase tracking-wider">MEMIT SERVICE</span>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">메밋 상황별 기억 도우미</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">MEMIT AI가 당신의 소중한 기억을 도와드립니다.</p>
            </div>
        </header>
    );
}
