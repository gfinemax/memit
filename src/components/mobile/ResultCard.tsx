'use client';

import React from 'react';
import { Sparkles, Save, Share2, RefreshCw, KeyRound, Brain, Zap } from 'lucide-react';
import Image from 'next/image';

interface ResultCardProps {
    input?: string;
    inputType?: string;
    keywords?: string[];
    story?: {
        text: string;
        highlighted: { text: string; number: number }[];
    };
    imageUrl?: string;
    onSave?: () => void;
    onShare?: () => void;
    onReset?: () => void;
}

export default function ResultCard({
    input = "7082",
    inputType = "숫자",
    keywords,
    story,
    imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuAsr9Q27yn85vl4Qx2BsqSIi_p5ml8-QW_YJ8sL1L17a5exurxtUObKUPJnWvhbF5YoFK1MlF4pKansKSkiYY-kWSYODuBhRhAS3aJBIdaPEOrSt7X-PFG09_3AmxbWHWY1K6nYxi8_mdADlNCI9WZxovFcGqGg6YJqnyUvFoXP2I8Bi0MrBEdOvRZ_gGJifLVOUkxbx1-AivGCrptma7GSH7Dov67O5BsF1l5QTLoSjsFb4pY7iTjOlmxd1mZbh8rCHGNiUwKgODb_",
    onSave,
    onShare,
    onReset
}: Partial<ResultCardProps>) {
    const displayStory = story || (keywords ? {
        text: keywords.join(' '),
        highlighted: keywords.map(w => ({ text: w, number: 0 }))
    } : {
        text: "총알(70)이 날아가 파리(82)를 정확히 맞추는 장면을 상상해보세요!",
        highlighted: [{ text: "총알", number: 70 }, { text: "파리", number: 82 }]
    });

    return (
        <div className="flex flex-col h-full overflow-y-auto no-scrollbar relative w-full max-w-md mx-auto p-6">
            {/* Particles - Abstract representation for React */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className={`absolute rounded-full bg-primary/40 animate-pulse`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 10 + 5}px`,
                            height: `${Math.random() * 10 + 5}px`,
                            animationDuration: `${Math.random() * 3 + 2}s`
                        }}
                    ></div>
                ))}
            </div>

            {/* Header */}
            <header className="flex-none pt-8 pb-4 text-center z-10">
                <div className="inline-flex items-center justify-center bg-primary/20 text-primary px-4 py-1 rounded-full mb-4">
                    <Brain className="w-3 h-3 mr-1" />
                    <span className="text-xs font-bold uppercase tracking-wider">AI Generated</span>
                </div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">메밋 완료! 🎉</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">성공적으로 기억이 변환되었습니다.</p>
            </header>

            {/* Memory Card */}
            <div className="flex-grow flex flex-col justify-center py-4 z-10">
                <div className="relative bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-lg p-6 shadow-2xl transition-transform hover:scale-[1.02] duration-300">
                    {/* Card Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">입력한 내용</span>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-slate-900 dark:text-white">{input}</span>
                                <span className="bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded-md font-medium">{inputType}</span>
                            </div>
                        </div>
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <KeyRound className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Illustration */}
                    <div className="aspect-[4/3] w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl mb-6 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                        <img
                            src={imageUrl}
                            alt="Memory Visualization"
                            className="w-full h-full object-cover mix-blend-overlay opacity-80"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-full shadow-lg">
                                <Brain className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Story Text */}
                    <div className="space-y-3">
                        <span className="text-xs font-bold text-primary uppercase tracking-wide">기억 스토리</span>
                        <div className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-relaxed break-keep">
                            {keywords ? (
                                <div className="flex flex-wrap gap-2">
                                    {keywords.map((kw, i) => (
                                        <span key={i} className="text-primary">{kw}</span>
                                    ))}
                                </div>
                            ) : (
                                <p>
                                    <span className="text-primary">총알(70)</span>이 날아가 <span className="text-primary">파리(82)</span>를 정확히 맞추는 장면을 상상해보세요!
                                </p>
                            )}
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 mt-2 border border-slate-100 dark:border-slate-700/50">
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                                💡 Tip: 이미지를 머릿속으로 생생하게 그려보며 소리나 감각을 더해보세요.
                            </p>
                        </div>
                    </div>

                    {/* Badge */}
                    <div className="absolute -top-3 -right-3">
                        <div className="bg-gradient-to-r from-primary to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                            <Zap className="w-3 h-3" fill="currentColor" />
                            SUPER MEMORY
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Stack */}
            <div className="flex-none pt-4 pb-8 space-y-3 z-10">
                <button onClick={onSave} className="w-full bg-primary hover:bg-primary/90 active:scale-95 transition-all text-white font-bold text-lg py-4 rounded-full shadow-lg shadow-primary/30 flex items-center justify-center gap-2 group">
                    <Save className="w-5 h-5 group-hover:animate-bounce" />
                    기억 저장하기
                </button>
                <button onClick={onShare} className="w-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 active:scale-95 transition-all text-slate-800 dark:text-white font-semibold text-lg py-4 rounded-full flex items-center justify-center gap-2">
                    <Share2 className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    커뮤니티에 공유하기
                </button>
                <button onClick={onReset} className="w-full text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary active:scale-95 transition-colors font-medium text-sm py-2 flex items-center justify-center gap-1">
                    <RefreshCw className="w-4 h-4" />
                    다시 메밋하기
                </button>
            </div>
        </div>
    );
}
