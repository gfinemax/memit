'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit2, User, Smile, ArrowRight } from 'lucide-react';

export default function NetworkingPage() {
    const router = useRouter();

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col relative overflow-hidden text-slate-800 dark:text-white">
            {/* Background decorative elements */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
                <div className="absolute -top-[20%] -right-[20%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl"></div>
                <div className="absolute top-[40%] -left-[20%] w-[300px] h-[300px] rounded-full bg-purple-500/10 blur-3xl"></div>
            </div>

            {/* Header */}
            <header className="flex items-center justify-between px-6 pt-12 pb-4 z-20">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-slate-800 dark:text-white" />
                </button>
                <h1 className="text-lg font-semibold tracking-wide">인맥 & 비즈니스</h1>
                <div className="w-10 h-10"></div> {/* Spacer */}
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col items-center px-8 pt-4 pb-24 overflow-y-auto no-scrollbar z-10">
                {/* Photo Uploader Section */}
                <div className="w-full flex flex-col items-center mt-6 mb-10">
                    <div className="relative group cursor-pointer">
                        {/* Glow Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                        {/* Uploader Circle */}
                        <div className="relative w-40 h-40 rounded-full bg-surface-dark bg-white dark:bg-[#1e1c36] border-2 border-dashed border-primary/40 group-hover:border-primary flex items-center justify-center transition-all duration-300 overflow-hidden">
                            <div className="flex flex-col items-center justify-center text-primary">
                                <Plus className="w-10 h-10 mb-1" />
                                <span className="text-xs font-medium opacity-80">사진 추가</span>
                            </div>
                        </div>
                        {/* Floating Edit Button */}
                        <div className="absolute bottom-1 right-1 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                            <Edit2 className="w-4 h-4" />
                        </div>
                    </div>
                    {/* Helper Text */}
                    <div className="mt-6 text-center space-y-2">
                        <p className="text-slate-400 text-sm leading-relaxed px-4">
                            얼굴의 특징을 잡아<br />이름과 연결해드립니다.
                        </p>
                    </div>
                </div>

                {/* Form Inputs */}
                <div className="w-full space-y-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 pl-4" htmlFor="name">이름</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="w-5 h-5 text-slate-500 dark:text-slate-600 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                id="name"
                                type="text"
                                className="block w-full pl-12 pr-4 py-4 bg-white dark:bg-[#1e1c36] border border-slate-200 dark:border-white/5 rounded-full text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                                placeholder="이름을 입력하세요"
                            />
                        </div>
                    </div>
                    {/* Features Field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 pl-4" htmlFor="features">주요 특징</label>
                        <div className="relative group">
                            <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none">
                                <Smile className="w-5 h-5 text-slate-500 dark:text-slate-600 group-focus-within:text-primary transition-colors" />
                            </div>
                            <textarea
                                id="features"
                                rows={3}
                                className="block w-full pl-12 pr-4 py-4 bg-white dark:bg-[#1e1c36] border border-slate-200 dark:border-white/5 rounded-[2rem] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm resize-none"
                                placeholder="예: 안경 씀, 목소리가 낮음, 골프 취미 등"
                            ></textarea>
                        </div>
                    </div>
                </div>
            </main>

            {/* Sticky Bottom Action */}
            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark dark:to-transparent pt-12 z-20">
                <button className="w-full py-4 px-6 bg-primary hover:bg-primary/90 active:scale-[0.98] text-white font-semibold rounded-full shadow-lg shadow-primary/30 flex items-center justify-center transition-all duration-200 group">
                    <span className="mr-2">인물 메밋하기</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
