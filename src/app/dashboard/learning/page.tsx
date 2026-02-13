'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit3, Plus, Image as ImageIcon, MapPin, Sparkles, ArrowRight } from 'lucide-react';

export default function LearningPage() {
    const router = useRouter();

    return (
        <>
            {/* ─── Desktop View ─── */}
            <div className="hidden md:block p-6 lg:p-10">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <span className="text-primary font-semibold text-xs uppercase tracking-wider">MEMIT LEARNING</span>
                        <h1 className="text-3xl font-bold text-white font-display mt-1">학습 & 지식</h1>
                        <p className="text-slate-400 mt-1">복잡한 이론과 개념을 시각적 스토리로 재구성하세요.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Left: Input Canvas */}
                        <div className="lg:col-span-7">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-br from-primary to-purple-600 rounded-2xl opacity-20 blur-lg group-hover:opacity-40 transition duration-500"></div>
                                <div className="relative bg-[#1e1c30] rounded-2xl p-8 min-h-[400px] flex flex-col border border-slate-800 shadow-2xl">
                                    <div className="flex items-center gap-2 mb-6 text-slate-400">
                                        <Edit3 className="w-5 h-5 text-primary" />
                                        <span className="text-xs font-bold uppercase tracking-widest">MEMIT Canvas</span>
                                    </div>
                                    <textarea
                                        className="w-full flex-1 bg-transparent border-none p-0 text-2xl lg:text-3xl font-medium placeholder:text-slate-700 focus:ring-0 leading-relaxed resize-none text-white outline-none"
                                        placeholder="학습할 키워드나 정의를 입력하세요..."
                                    ></textarea>
                                    <div className="mt-6 flex justify-between items-center border-t border-slate-800 pt-6">
                                        <div className="flex -space-x-2">
                                            {[1, 2].map(i => (
                                                <div key={i} className="h-9 w-9 rounded-full ring-4 ring-[#1e1c30] bg-slate-800 flex items-center justify-center text-xs text-slate-400 font-bold border border-slate-700">
                                                    {i === 1 ? 'JM' : 'K'}
                                                </div>
                                            ))}
                                            <div className="h-9 w-9 rounded-full ring-4 ring-[#1e1c30] bg-primary/20 flex items-center justify-center border border-primary/30">
                                                <Plus className="w-4 h-4 text-primary" />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs text-slate-500 font-medium tracking-wider uppercase">0 / 150</span>
                                            <button className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2 group">
                                                <span>학습 메밋하기</span>
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Controls & Info */}
                        <div className="lg:col-span-5 space-y-8">
                            <section>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-4">
                                    기억 모드 선택
                                </label>
                                <div className="flex flex-col gap-3">
                                    <button className="flex items-center gap-4 p-4 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 border border-primary/20 transition-all text-left">
                                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                                            <ImageIcon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <span className="font-bold block text-lg">이미지 연상법</span>
                                            <span className="text-xs text-white/70 block">시각적 스토리를 생성합니다</span>
                                        </div>
                                    </button>
                                    <button className="flex items-center gap-4 p-4 rounded-2xl bg-[#1e1c30] text-slate-400 border border-slate-800 hover:border-slate-700 transition-all text-left group">
                                        <div className="w-12 h-12 rounded-xl bg-slate-800 group-hover:bg-slate-700 flex items-center justify-center shrink-0 transition-colors">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <span className="font-bold block text-lg text-slate-200 group-hover:text-white transition-colors">장소법 (Loci)</span>
                                            <span className="text-xs block">익숙한 공간에 배치합니다</span>
                                        </div>
                                    </button>
                                </div>
                            </section>

                            <section className="p-6 rounded-2xl bg-[#1e1c30] border border-slate-800">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary border border-primary/20">
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-2">시각적 스토리텔링</h3>
                                        <p className="text-sm leading-relaxed text-slate-400">
                                            뇌는 텍스트보다 이미지를 훨씬 더 입체적으로 기억합니다. 복잡한 정의를 캐릭터와 상황이 있는 드라마로 바꿔보세요.
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Mobile View ─── */}
            <div className="block md:hidden bg-background-dark text-white h-screen overflow-hidden flex flex-col items-center justify-center relative">
                <div className="w-full max-w-md h-full flex flex-col relative bg-background-dark shadow-2xl overflow-hidden">
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
                    <main className="flex-1 px-6 pt-2 pb-24 overflow-y-auto no-scrollbar flex flex-col justify-start z-0">
                        {/* Hero Card / Input Area */}
                        <div className="w-full relative group mt-4 mb-8">
                            {/* Glowing effect */}
                            <div className="absolute -inset-0.5 bg-gradient-to-br from-primary to-purple-600 rounded-lg opacity-30 blur-lg group-hover:opacity-50 transition duration-500"></div>
                            <div className="relative bg-[#1c1b2e] rounded-lg p-6 min-h-[280px] flex flex-col shadow-xl border border-white/5">
                                <div className="flex items-center gap-2 mb-4">
                                    <Edit3 className="w-5 h-5 text-primary" />
                                    <label htmlFor="learning-input-mobile" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        MEMIT Canvas
                                    </label>
                                </div>
                                <textarea
                                    id="learning-input-mobile"
                                    className="w-full flex-1 bg-transparent border-none p-0 text-2xl font-medium placeholder:text-slate-600 focus:ring-0 leading-normal resize-none text-white outline-none"
                                    placeholder="학습할 키워드나 정의를 입력하세요..."
                                ></textarea>
                                {/* Bottom Helper */}
                                <div className="mt-4 flex justify-between items-end border-t border-white/5 pt-4">
                                    <div className="flex -space-x-2 overflow-hidden">
                                        <div className="h-8 w-8 rounded-full ring-2 ring-[#1c1b2e] bg-slate-700 flex items-center justify-center text-[10px] text-slate-300 font-bold">JM</div>
                                        <div className="h-8 w-8 rounded-full ring-2 ring-[#1c1b2e] bg-slate-600 flex items-center justify-center text-[10px] text-slate-300 font-bold">K</div>
                                        <div className="h-8 w-8 rounded-full ring-2 ring-[#1c1b2e] bg-primary/20 flex items-center justify-center">
                                            <Plus className="w-4 h-4 text-primary" />
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-500 font-medium">0/150</span>
                                </div>
                            </div>
                        </div>

                        {/* Mode Selector */}
                        <div className="mb-8">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 block pl-1">
                                기억 모드 선택
                            </label>
                            <div className="bg-[#1c1b2e] p-1.5 rounded-full flex relative">
                                <div className="w-1/2 h-full absolute left-1.5 top-1.5 bottom-1.5 bg-primary rounded-full shadow-sm transition-all duration-300"></div>
                                <button className="relative w-1/2 py-3 rounded-full text-sm font-semibold z-10 transition-colors duration-300 text-white shadow-sm flex items-center justify-center gap-2">
                                    <ImageIcon className="w-5 h-5" />
                                    이미지 연상법
                                </button>
                                <button className="relative w-1/2 py-3 rounded-full text-sm font-medium z-10 transition-colors duration-300 text-slate-400 hover:text-slate-200 flex items-center justify-center gap-2">
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
                                    <h3 className="text-base font-semibold text-white mb-1">
                                        시각적 스토리텔링
                                    </h3>
                                    <p className="text-sm leading-relaxed text-slate-400 word-keep-all">
                                        복잡한 이론과 개념을 시각적 스토리로 재구성하세요. 뇌가 더 오래 기억할 수 있도록 돕습니다.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </main>

                    {/* Floating Action Button Area */}
                    <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background-dark via-background-dark to-transparent pt-12 z-20">
                        <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-full shadow-lg shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
                            <span>학습 메밋하기</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
