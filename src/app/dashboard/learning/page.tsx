'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit3, Plus, Image as ImageIcon, MapPin, Sparkles, ArrowRight } from 'lucide-react';

export default function LearningPage() {
    const router = useRouter();

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-white h-screen overflow-hidden flex flex-col items-center justify-center relative">
            <div className="w-full max-w-md h-full flex flex-col relative bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden">
                {/* Header */}
                <header className="flex items-center justify-between px-6 py-4 z-10 shrink-0">
                    <button
                        onClick={() => router.back()}
                        className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-slate-300"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg font-semibold tracking-wide text-slate-900 dark:text-white">학습 & 지식</h1>
                    <div className="w-10"></div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 px-6 pt-2 pb-24 overflow-y-auto no-scrollbar flex flex-col justify-start z-0">
                    {/* Hero Card / Input Area */}
                    <div className="w-full relative group mt-4 mb-8">
                        {/* Glowing effect */}
                        <div className="absolute -inset-0.5 bg-gradient-to-br from-primary to-purple-600 rounded-lg opacity-30 blur-lg group-hover:opacity-50 transition duration-500"></div>
                        <div className="relative bg-white dark:bg-[#1c1b2e] rounded-lg p-6 min-h-[280px] flex flex-col shadow-xl border border-slate-100 dark:border-white/5">
                            <div className="flex items-center gap-2 mb-4">
                                <Edit3 className="w-5 h-5 text-primary" />
                                <label htmlFor="learning-input" className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                                    MEMIT Canvas
                                </label>
                            </div>
                            <textarea
                                id="learning-input"
                                className="w-full flex-1 bg-transparent border-none p-0 text-2xl md:text-3xl font-medium placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:ring-0 leading-normal resize-none text-slate-900 dark:text-white outline-none"
                                placeholder="학습할 키워드나 정의를 입력하세요..."
                            ></textarea>
                            {/* Bottom Helper */}
                            <div className="mt-4 flex justify-between items-end border-t border-slate-100 dark:border-white/5 pt-4">
                                <div className="flex -space-x-2 overflow-hidden">
                                    <div className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#1c1b2e] bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] text-slate-600 dark:text-slate-300 font-bold">JM</div>
                                    <div className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#1c1b2e] bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-[10px] text-slate-600 dark:text-slate-300 font-bold">K</div>
                                    <div className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#1c1b2e] bg-primary/20 flex items-center justify-center">
                                        <Plus className="w-4 h-4 text-primary" />
                                    </div>
                                </div>
                                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">0/150</span>
                            </div>
                        </div>
                    </div>

                    {/* Mode Selector */}
                    <div className="mb-8">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 block pl-1">
                            기억 모드 선택
                        </label>
                        <div className="bg-slate-200 dark:bg-[#1c1b2e] p-1.5 rounded-full flex relative">
                            {/* Visual Toggle (Simplified for static) */}
                            <div className="w-1/2 h-full absolute left-1.5 top-1.5 bottom-1.5 bg-white dark:bg-primary rounded-full shadow-sm transition-all duration-300"></div>
                            <button className="relative w-1/2 py-3 rounded-full text-sm font-semibold z-10 transition-colors duration-300 text-slate-900 dark:text-white shadow-sm flex items-center justify-center gap-2">
                                <ImageIcon className="w-5 h-5" />
                                이미지 연상법
                            </button>
                            <button className="relative w-1/2 py-3 rounded-full text-sm font-medium z-10 transition-colors duration-300 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center gap-2">
                                <MapPin className="w-5 h-5" />
                                장소법 (Loci)
                            </button>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                                    시각적 스토리텔링
                                </h3>
                                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 word-keep-all">
                                    복잡한 이론과 개념을 시각적 스토리로 재구성하세요. 뇌가 더 오래 기억할 수 있도록 돕습니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Floating Action Button Area */}
                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark dark:to-transparent pt-12 z-20">
                    <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-full shadow-lg shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
                        <span>학습 메밋하기</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
