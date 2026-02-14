'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import MemoryGenerator from '@/components/dashboard/MemoryGenerator';

export default function LearningPage() {
    const router = useRouter();

    const handleMemorySaved = () => {
        // Optional: transition or show local success
    };

    return (
        <>
            {/* ─── Desktop View ─── */}
            <div className="hidden md:block p-6 lg:p-10">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 px-4">
                        <span className="text-primary font-semibold text-xs uppercase tracking-wider">MEMIT LEARNING</span>
                        <h1 className="text-3xl font-bold text-white font-display mt-1">학습 & 지식</h1>
                        <p className="text-slate-400 mt-1">복잡한 이론과 개념을 시각적 스토리로 재구성하세요.</p>
                    </div>

                    <div className="w-full">
                        <MemoryGenerator category="learning" onMemorySaved={handleMemorySaved} />
                    </div>
                </div>
            </div>

            {/* ─── Mobile View ─── */}
            <div className="block md:hidden bg-background-dark text-white min-h-screen flex flex-col relative">
                {/* Header */}
                <header className="flex items-center justify-between px-6 py-4 z-10 shrink-0">
                    <button
                        onClick={() => router.back()}
                        className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors text-slate-300"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg font-semibold tracking-wide text-white">학습 & 지식</h1>
                    <div className="w-10"></div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 px-4 pt-2 pb-24 overflow-y-auto no-scrollbar z-0">
                    <MemoryGenerator category="learning" onMemorySaved={handleMemorySaved} />

                    <div className="mt-8 px-4 py-6 rounded-2xl bg-white/5 border border-white/5">
                        <h3 className="text-sm font-bold text-primary mb-2">학습 팁</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            뇌는 추상적인 개념보다 구체적인 이미지를 훨씬 더 잘 기억합니다. 복잡한 이론을 캐릭터와 상황이 있는 드라마로 바꿔보세요.
                        </p>
                    </div>
                </main>
            </div>
        </>
    );
}
