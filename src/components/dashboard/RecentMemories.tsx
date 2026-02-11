'use client';

import React from 'react';
import { Play, FlaskConical, ShoppingCart } from 'lucide-react';

export default function RecentMemories() {
    return (
        <section>
            <h3 className="text-xl font-bold text-white mb-6 font-display">최근 기억</h3>
            <div className="bg-surface-dark border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-4 flex items-center gap-4 hover:bg-slate-800/50 transition-colors border-b border-slate-800 group cursor-pointer">
                    <div className="w-12 h-12 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                        <FlaskConical className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h5 className="text-base font-semibold text-slate-200 truncate">양자 역학의 기본 원리</h5>
                        <p className="text-xs text-slate-500 truncate">슈뢰딩거의 고양이 비유를 사용하여...</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-2 py-1 rounded-md bg-green-500/10 text-green-500 text-xs font-medium">85% 기억 유지율</span>
                        <span className="text-xs text-slate-400 hidden sm:block">2분 전</span>
                        <button className="w-8 h-8 rounded-full hover:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                            <Play className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="p-4 flex items-center gap-4 hover:bg-slate-800/50 transition-colors group cursor-pointer">
                    <div className="w-12 h-12 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                        <ShoppingCart className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h5 className="text-base font-semibold text-slate-200 truncate">오늘의 장보기 목록</h5>
                        <p className="text-xs text-slate-500 truncate">사과, 우유, 계란, 파스타면...</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-2 py-1 rounded-md bg-orange-500/10 text-orange-500 text-xs font-medium">학습 필요</span>
                        <span className="text-xs text-slate-400 hidden sm:block">3시간 전</span>
                        <button className="w-8 h-8 rounded-full hover:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                            <Play className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
