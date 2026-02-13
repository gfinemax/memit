'use client';

import React from 'react';
import MobileServiceCategories from '@/components/mobile/MobileServiceCategories';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function ServicesPage() {
    const router = useRouter();

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen pb-24">
            <header className="pt-8 pb-4 px-6 flex flex-col items-start justify-end bg-background-light dark:bg-background-dark sticky top-0 z-20 shadow-sm dark:shadow-none dark:border-b dark:border-white/5">
                <div className="flex w-full justify-between items-center mb-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                    </button>

                    <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/20 cursor-pointer">
                        {/* Placeholder Avatar - Replace with actual user image if available */}
                        <span className="text-primary font-bold">U</span>
                    </div>
                </div>

                <div className="space-y-1">
                    <span className="text-primary font-semibold text-xs uppercase tracking-wider">MEMIT SERVICE</span>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">메밋 상황별 기억 도우미</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">MEMIT AI가 당신의 소중한 기억을 도와드립니다.</p>
                </div>
            </header>
            <MobileServiceCategories />
        </div>
    );
}
