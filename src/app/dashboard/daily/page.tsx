'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MoreHorizontal, Sun, ShoppingCart, CheckCircle, MapPin, Book, Plus, Edit, CheckSquare } from 'lucide-react';

export default function DailyPage() {
    const router = useRouter();

    return (
        <>
            {/* ─── Desktop View ─── */}
            <div className="hidden md:block p-6 lg:p-10">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <span className="text-primary font-semibold text-xs uppercase tracking-wider">MEMIT DAILY</span>
                            <h1 className="text-3xl font-bold text-white font-display mt-1">일상 & 생활</h1>
                            <p className="text-slate-400 mt-1">오늘의 사소한 기억들이 모여 당신의 하루가 됩니다.</p>
                        </div>
                        <button className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2 group">
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                            <span>새 항목 추가</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left: Input & Categories */}
                        <div className="lg:col-span-8 space-y-8">
                            {/* Fast Add Section */}
                            <div className="bg-[#1e1c30] rounded-2xl p-6 border border-slate-800 shadow-xl">
                                <div className="relative group">
                                    <Plus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                                    <input
                                        className="w-full bg-slate-800/50 text-white placeholder-slate-500 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-[#1e1c30] transition-all border border-slate-700 focus:border-transparent"
                                        placeholder="무엇을 기억해야 하나요?"
                                        type="text"
                                    />
                                </div>

                                <div className="mt-6 flex flex-wrap gap-3">
                                    {[
                                        { icon: ShoppingCart, label: '장보기 목록' },
                                        { icon: CheckCircle, label: '오늘의 할일' },
                                        { icon: MapPin, label: '주차 위치' },
                                        { icon: Book, label: '독서 기록' },
                                    ].map((item, idx) => (
                                        <button key={idx} className="px-4 py-2 bg-slate-800/50 hover:bg-primary/10 border border-slate-700 hover:border-primary/30 rounded-lg text-sm text-slate-300 hover:text-primary transition-all flex items-center gap-2">
                                            <item.icon className="w-4 h-4 opacity-70" />
                                            <span>{item.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Checklist */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Active List</h3>
                                    <span className="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700">3 Items Remaining</span>
                                </div>

                                <div className="grid gap-3">
                                    {[
                                        { text: '세탁소 맡기기', checked: false, time: '오전 10:00' },
                                        { text: '비타민 챙겨먹기', checked: true, time: '오전 08:30' },
                                        { text: '저녁 메뉴 고민하기', checked: false, time: '오후 05:00' }
                                    ].map((item, idx) => (
                                        <div key={idx} className={`group flex items-center p-5 bg-[#1e1c30] rounded-xl border transition-all h-20 ${item.checked ? 'border-slate-800 opacity-60' : 'border-slate-800 hover:border-primary/40 shadow-sm'}`}>
                                            <div className="relative flex items-center justify-center w-6 h-6 mr-5">
                                                <input
                                                    type="checkbox"
                                                    defaultChecked={item.checked}
                                                    className="peer appearance-none w-6 h-6 border-2 border-slate-700 rounded-lg checked:bg-primary checked:border-primary transition-all cursor-pointer"
                                                />
                                                <CheckSquare className="w-4 h-4 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                                            </div>
                                            <div className="flex-1">
                                                <p className={`text-lg font-medium transition-colors ${item.checked ? 'text-slate-500 line-through decoration-slate-500' : 'text-white group-hover:text-primary'}`}>
                                                    {item.text}
                                                </p>
                                                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{item.time}</span>
                                            </div>
                                            <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-600 hover:text-slate-300 transition-all">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: Summary & AI */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-gradient-to-br from-[#1e1c30] to-[#25233d] rounded-2xl p-8 border border-slate-800 text-center relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                                <div className="mx-auto w-20 h-20 mb-6 rounded-2xl bg-primary/10 flex items-center justify-center relative group-hover:scale-110 transition-transform duration-500">
                                    <Sun className="w-10 h-10 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">오늘의 일상 기록</h2>
                                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                                    메밋 AI가 당신의 일상 조각들을<br />기억의 성에 차곡차곡 쌓고 있습니다.
                                </p>
                                <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group/btn">
                                    <Edit className="w-5 h-5 text-primary group-hover/btn:rotate-12 transition-transform" />
                                    <span>일상 메밋 리포트</span>
                                </button>
                            </div>

                            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                                <h3 className="text-sm font-bold text-primary mb-3 uppercase tracking-widest">Memory Tip</h3>
                                <p className="text-xs text-slate-400 leading-relaxed italic">
                                    "할 일을 기한과 함께 이미지로 상상해보세요. 세탁소 봉투가 문앞에 걸려있는 이미지를 떠올리면 뇌가 훨씬 더 잘 반응합니다."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Mobile View ─── */}
            <div className="block md:hidden bg-background-dark min-h-screen flex flex-col relative overflow-hidden text-white">
                {/* Header */}
                <header className="flex items-center justify-between px-4 py-4 sticky top-0 z-10 bg-background-dark/80 backdrop-blur-md">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-full hover:bg-slate-800 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg font-bold tracking-tight">일상 & 생활</h1>
                    <button className="p-2 rounded-full hover:bg-slate-800 transition-colors">
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
                        <p className="text-slate-400 text-sm font-medium leading-relaxed">
                            사소한 일상을 잊지 않도록 도와줍니다.<br />
                            오늘 해야 할 일이나 기억할 내용을 적어보세요.
                        </p>
                    </div>

                    {/* Preset Chips */}
                    <div className="px-0 py-4">
                        <div className="flex gap-3 overflow-x-auto px-6 pb-4 no-scrollbar">
                            <button className="shrink-0 px-5 py-2.5 bg-[#1E1E24] hover:bg-primary/20 hover:text-primary active:scale-95 transition-all rounded-full flex items-center gap-2 border border-transparent hover:border-primary/30">
                                <ShoppingCart className="w-4 h-4 opacity-70" />
                                <span className="text-sm font-medium">장보기 목록</span>
                            </button>
                            <button className="shrink-0 px-5 py-2.5 bg-[#1E1E24] hover:bg-primary/20 hover:text-primary active:scale-95 transition-all rounded-full flex items-center gap-2 border border-transparent hover:border-primary/30">
                                <CheckCircle className="w-4 h-4 opacity-70" />
                                <span className="text-sm font-medium">오늘의 할일</span>
                            </button>
                            <button className="shrink-0 px-5 py-2.5 bg-[#1E1E24] hover:bg-primary/20 hover:text-primary active:scale-95 transition-all rounded-full flex items-center gap-2 border border-transparent hover:border-primary/30">
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
                                className="w-full bg-[#1E1E24] text-white placeholder-slate-500 rounded-full py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm border-0"
                                placeholder="새로운 항목 입력"
                                type="text"
                            />
                        </div>
                    </div>

                    {/* Checklist View */}
                    <div className="px-6 space-y-3">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider pl-1">List</h3>
                            <span className="text-xs text-slate-500 bg-[#1E1E24] px-2 py-1 rounded-lg">3 items</span>
                        </div>

                        {[
                            { text: '세탁소 맡기기', checked: false },
                            { text: '비타민 챙겨먹기', checked: true },
                            { text: '저녁 메뉴 고민하기', checked: false }
                        ].map((item, idx) => (
                            <div key={idx} className="group flex items-center p-4 bg-[#1E1E24] rounded-2xl shadow-sm border border-slate-800 hover:border-primary/30 transition-all cursor-pointer">
                                <div className="relative flex items-center justify-center w-6 h-6 mr-4">
                                    <input
                                        type="checkbox"
                                        defaultChecked={item.checked}
                                        className="peer appearance-none w-6 h-6 border-2 border-slate-600 rounded-full checked:bg-primary checked:border-primary transition-all cursor-pointer"
                                    />
                                    <CheckSquare className="w-3 h-3 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                                </div>
                                <div className="flex-1">
                                    <span className={`text-base font-medium transition-colors ${item.checked ? 'text-slate-500 line-through decoration-slate-500' : 'group-hover:text-primary'}`}>
                                        {item.text}
                                    </span>
                                </div>
                            </div>
                        ))}

                        <div className="p-6 mt-4 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center">
                            <Plus className="w-8 h-8 text-slate-700 mb-2" />
                            <p className="text-sm text-slate-600">더 추가할 내용이 있나요?</p>
                        </div>
                    </div>
                </main>

                {/* Sticky Action Button */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-dark via-background-dark to-transparent z-20">
                    <button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-14 rounded-full shadow-lg shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
                        <Edit className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        일상 메밋하기
                    </button>
                </div>
            </div>
        </>
    );
}
