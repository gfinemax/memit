'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Brain } from 'lucide-react';
import MemoryGenerator from '@/components/dashboard/MemoryGenerator';

export default function TrainingPage() {
    const router = useRouter();

    const handleMemorySaved = () => {
        // Optional
    };

    return (
        <div className="min-h-screen bg-transparent">
            {/* Desktop View */}
            <div className="hidden md:block p-6 lg:p-10">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8 px-4 flex items-center justify-between">
                        <div>
                            <span className="text-primary font-semibold text-xs uppercase tracking-wider flex items-center gap-2">
                                <Brain className="w-3.5 h-3.5 text-yellow-400" /> MEMIT TRAINING
                            </span>
                            <h1 className="text-3xl font-bold text-white font-display mt-1">두뇌 트레이닝</h1>
                            <p className="text-slate-400 mt-1">기억의 메커니즘을 이해하고, 실전 훈련을 통해 당신의 잠재력을 깨우세요.</p>
                        </div>
                    </div>

                    <MemoryGenerator category="training" onMemorySaved={handleMemorySaved} />
                </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden flex flex-col min-h-screen bg-background-dark">
                <header className="flex items-center justify-between px-6 py-5 z-20">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-slate-300" />
                    </button>
                    <h1 className="text-lg font-bold tracking-tight text-center flex-1 text-white">두뇌 트레이닝</h1>
                    <div className="w-10"></div>
                </header>

                <main className="flex-1 px-4 pt-2 pb-24 overflow-y-auto no-scrollbar">
                    <MemoryGenerator category="training" onMemorySaved={handleMemorySaved} />
                </main>
            </div>
        </div>
    );
}
