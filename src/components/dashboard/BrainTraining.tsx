'use client';

import React from 'react';
import { MoreHorizontal } from 'lucide-react';

export default function BrainTraining() {
    return (
        <div className="bg-surface-dark border border-slate-800 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
                <button className="text-slate-600 hover:text-white transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            <h3 className="text-lg font-bold text-white mb-1 font-display">두뇌 트레이닝</h3>
            <p className="text-xs text-slate-500 mb-6">매일 10분, 뇌의 근육을 키워보세요.</p>

            <div className="relative w-40 h-40 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    {/* Background Circle */}
                    <path
                        className="text-slate-800"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                    />
                    {/* Progress Circle (66%) */}
                    <path
                        className="text-primary drop-shadow-[0_0_10px_rgba(140,43,238,0.5)]"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeDasharray="66, 100"
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-white font-display">66%</span>
                    <span className="text-[10px] text-slate-500 uppercase font-medium tracking-wider">진척도</span>
                </div>
            </div>

            <button className="w-full py-3 bg-primary hover:bg-[#6b1cb0] text-white rounded-xl font-medium transition-all shadow-lg shadow-primary/25">
                훈련 이어하기
            </button>
        </div>
    );
}
