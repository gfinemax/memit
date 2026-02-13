'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MoreHorizontal, Sun, ShoppingCart, CheckCircle, MapPin, Book, Plus, Edit, CheckSquare } from 'lucide-react';

export default function DailyPage() {
    const router = useRouter();

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col relative overflow-hidden text-slate-900 dark:text-white">
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-4 sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold tracking-tight">일상 & 생활</h1>
                <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                    <MoreHorizontal className="w-6 h-6" />
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
                {/* Hero */}
                <div className="px-6 py-6 text-center">
                    <div className="mx-auto w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/10 blur-xl"></div>
                        <Sun className="w-10 h-10 text-primary relative z-10" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">오늘의 일상 기록</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                        사소한 일상을 잊지 않도록 도와줍니다.<br />
                        오늘 해야 할 일이나 기억할 내용을 적어보세요.
                    </p>
                </div>

                {/* Preset Chips */}
                <div className="px-0 py-4">
                    <div className="flex gap-3 overflow-x-auto px-6 pb-4 hide-scrollbar snap-x no-scrollbar">
                        <button className="snap-start shrink-0 px-5 py-2.5 bg-slate-100 dark:bg-[#1E1E24] hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary active:scale-95 transition-all rounded-full flex items-center gap-2 border border-transparent hover:border-primary/30">
                            <ShoppingCart className="w-4 h-4 opacity-70" />
                            <span className="text-sm font-medium">장보기 목록</span>
                        </button>
                        <button className="snap-start shrink-0 px-5 py-2.5 bg-slate-100 dark:bg-[#1E1E24] hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary active:scale-95 transition-all rounded-full flex items-center gap-2 border border-transparent hover:border-primary/30">
                            <CheckCircle className="w-4 h-4 opacity-70" />
                            <span className="text-sm font-medium">오늘의 할일</span>
                        </button>
                        <button className="snap-start shrink-0 px-5 py-2.5 bg-slate-100 dark:bg-[#1E1E24] hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary active:scale-95 transition-all rounded-full flex items-center gap-2 border border-transparent hover:border-primary/30">
                            <MapPin className="w-4 h-4 opacity-70" />
                            <span className="text-sm font-medium">주차 위치</span>
                        </button>
                    </div>
                </div>

                {/* Input Area */}
                <div className="px-6 mb-8">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Plus className="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            className="w-full bg-slate-100 dark:bg-[#1E1E24] text-slate-900 dark:text-white placeholder-slate-500 rounded-full py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-[#1E1E24] transition-all shadow-sm border-0"
                            placeholder="새로운 항목 입력"
                            type="text"
                        />
                    </div>
                </div>

                {/* Checklist View */}
                <div className="px-6 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">List</h3>
                        <span className="text-xs text-slate-500 bg-slate-100 dark:bg-[#1E1E24] px-2 py-1 rounded-lg">3 items</span>
                    </div>

                    {[
                        { text: '세탁소 맡기기', checked: false },
                        { text: '비타민 챙겨먹기', checked: true },
                        { text: '저녁 메뉴 고민하기', checked: false }
                    ].map((item, idx) => (
                        <div key={idx} className="group flex items-center p-4 bg-white dark:bg-[#1E1E24] rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-all cursor-pointer">
                            <div className="relative flex items-center justify-center w-6 h-6 mr-4">
                                <input
                                    type="checkbox"
                                    defaultChecked={item.checked}
                                    className="peer appearance-none w-6 h-6 border-2 border-slate-300 dark:border-slate-600 rounded-full checked:bg-primary checked:border-primary transition-all cursor-pointer"
                                />
                                <CheckSquare className="w-3 h-3 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                            </div>
                            <div className="flex-1">
                                <span className={`text-base font-medium transition-colors ${item.checked ? 'text-slate-400 line-through decoration-slate-400' : 'group-hover:text-primary'}`}>
                                    {item.text}
                                </span>
                            </div>
                        </div>
                    ))}

                    <div className="p-6 mt-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center">
                        <Plus className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
                        <p className="text-sm text-slate-400 dark:text-slate-600">더 추가할 내용이 있나요?</p>
                    </div>
                </div>
            </main>

            {/* Sticky Action Button */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light dark:via-background-dark to-transparent z-20">
                <button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-14 rounded-full shadow-lg shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
                    <Edit className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    일상 메밋하기
                </button>
                <div className="w-1/3 h-1 bg-slate-300 dark:bg-slate-700 mx-auto mt-4 rounded-full"></div>
            </div>
        </div>
    );
}
