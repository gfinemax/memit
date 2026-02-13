'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MoreHorizontal, Mic, Wand2, Plus, ArrowRight } from 'lucide-react';

export default function SpeechPage() {
    const router = useRouter();

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col relative overflow-hidden text-slate-900 dark:text-white">
            {/* Header */}
            <header className="px-6 py-4 flex items-center justify-between shrink-0 z-10">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold tracking-wide">발표 & 스피치</h1>
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                    <MoreHorizontal className="w-6 h-6" />
                </button>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto no-scrollbar px-6 pb-32 z-10">
                {/* Service Intro Card */}
                <div className="mt-2 mb-8 p-6 rounded-lg bg-white dark:bg-[#1e1c36] shadow-sm border border-slate-100 dark:border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                    <div className="flex items-start justify-between relative z-10">
                        <div>
                            <div className="inline-flex items-center space-x-2 mb-2">
                                <Mic className="w-5 h-5 text-primary" />
                                <span className="text-primary font-semibold text-sm uppercase tracking-wider">스피치 모드</span>
                            </div>
                            <h2 className="text-2xl font-bold leading-snug mb-2">발표의 핵심 내용을<br />입력해주세요.</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">발표의 핵심 키워드를 흐름에 따라<br />자연스럽게 암기하세요.</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary">
                            <Mic className="w-6 h-6" />
                        </div>
                    </div>
                    {/* Keyword Extraction Button */}
                    <div className="mt-6 flex justify-end">
                        <button className="flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-[#2a283f] hover:bg-primary/20 border border-transparent dark:border-white/5 text-sm font-medium transition-all group-hover:border-primary/30">
                            <Wand2 className="w-4 h-4 text-primary" />
                            <span className="text-slate-600 dark:text-slate-300 group-hover:text-primary dark:group-hover:text-white">AI 키워드 추출</span>
                        </button>
                    </div>
                </div>

                {/* Speech Points List */}
                <div className="space-y-6">
                    {/* Point 1 */}
                    <div className="group">
                        <div className="flex items-center justify-between mb-2 pl-2">
                            <span className="text-primary font-bold text-sm tracking-widest">STEP 01</span>
                            <span className="text-xs text-slate-500 dark:text-slate-500">서론 / 도입</span>
                        </div>
                        <div className="relative">
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-l-lg"></div>
                            <textarea
                                className="w-full bg-white dark:bg-[#1e1c36] text-slate-900 dark:text-white p-5 pl-6 rounded-r-lg rounded-bl-lg border-0 ring-1 ring-slate-200 dark:ring-white/5 focus:ring-2 focus:ring-primary dark:focus:ring-primary placeholder-slate-400 dark:placeholder-slate-600 resize-none h-32 text-base leading-relaxed transition-all shadow-sm outline-none"
                                placeholder="첫 번째 핵심 내용을 입력하세요..."
                                defaultValue="안녕하세요, 오늘 발표를 맡게 된 김메밋입니다. 오늘 저는 효과적인 암기 방법에 대해 이야기하고자 합니다."
                            ></textarea>
                            <div className="absolute bottom-3 right-3 text-xs text-slate-400 font-medium bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-full">58자</div>
                        </div>
                    </div>

                    {/* Point 2 */}
                    <div className="group">
                        <div className="flex items-center justify-between mb-2 pl-2">
                            <span className="text-slate-400 dark:text-slate-500 font-bold text-sm tracking-widest group-hover:text-primary transition-colors">STEP 02</span>
                            <span className="text-xs text-slate-500 dark:text-slate-500">본론 1</span>
                        </div>
                        <div className="relative group">
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-200 dark:bg-[#2a283f] group-focus-within:bg-primary rounded-l-lg transition-colors duration-300"></div>
                            <textarea
                                className="w-full bg-white dark:bg-[#1e1c36] text-slate-900 dark:text-white p-5 pl-6 rounded-r-lg rounded-bl-lg border-0 ring-1 ring-slate-200 dark:ring-white/5 focus:ring-2 focus:ring-primary dark:focus:ring-primary placeholder-slate-400 dark:placeholder-slate-600 resize-none h-32 text-base leading-relaxed transition-all shadow-sm focus:bg-slate-50 dark:focus:bg-[#2a283f] outline-none"
                                placeholder="두 번째 핵심 내용을 입력하세요..."
                            ></textarea>
                        </div>
                    </div>

                    {/* Point 3 (Add) */}
                    <div className="opacity-70 hover:opacity-100 transition-opacity">
                        <div className="flex items-center justify-between mb-2 pl-2">
                            <span className="text-slate-400 dark:text-slate-600 font-bold text-sm tracking-widest">STEP 03</span>
                        </div>
                        <button className="w-full bg-transparent border-2 border-dashed border-slate-300 dark:border-white/10 p-4 rounded-lg flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:border-primary/50 hover:text-primary transition-all h-24 group">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-2 group-hover:bg-primary/10 transition-colors">
                                <Plus className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium">다음 내용 추가하기</span>
                        </button>
                    </div>
                </div>
            </main>

            {/* Bottom Action Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light dark:via-background-dark to-transparent z-20">
                <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-lg py-4 rounded-full shadow-lg shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 group relative overflow-hidden">
                    <span>스피치 흐름 메밋</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
