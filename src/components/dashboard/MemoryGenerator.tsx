'use client';

import React from 'react';
import { Sparkles, Brain, Info } from 'lucide-react';

export default function MemoryGenerator() {
    return (
        <section className="glass-panel p-8 rounded-3xl relative overflow-hidden group h-full flex flex-col justify-center">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-700 pointer-events-none"></div>
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-[#8B5CF6]/20 rounded-full blur-3xl group-hover:bg-[#8B5CF6]/30 transition-all duration-700 pointer-events-none"></div>

            <div className="relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-[#8B5CF6] text-[11px] font-bold text-white mb-4 shadow-lg shadow-primary/25">
                    <Sparkles className="w-3 h-3" />
                    AI MEMORY GEN
                </span>

                <h2 className="text-3xl lg:text-4xl font-bold mb-3 leading-tight text-white font-display">
                    무엇을 기억하고 싶으신가요?<br />
                    <span className="text-slate-400 text-lg font-normal mt-2 block font-sans">
                        숫자를 입력하면 한글 자음과 매칭하여 기억법을 생성합니다.
                    </span>
                </h2>

                <div className="mt-8 relative">
                    <div className="glass-panel border-slate-700/50 rounded-2xl p-2 flex flex-col md:flex-row items-center gap-2 shadow-2xl shadow-black/20 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                        <div className="flex-1 w-full relative">
                            <textarea
                                className="w-full bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 resize-none py-3 px-4 focus:outline-none"
                                placeholder="기억할 숫자나 문장을 입력하세요 (예: 010-1234-5678)"
                                rows={1}
                            ></textarea>
                        </div>
                        <button className="w-full md:w-auto px-6 py-3 bg-primary hover:bg-[#6b1cb0] text-white rounded-xl font-medium transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2 whitespace-nowrap">
                            <Brain className="w-5 h-5" />
                            <span>변환하기</span>
                        </button>
                    </div>

                    <div className="mt-3 flex items-center gap-4 text-xs text-slate-400 px-2">
                        <span className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
                            <Info className="w-3 h-3" /> 기본 원칙 적용 중
                        </span>
                        <span className="ml-auto">Ctrl + Enter로 전송</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
