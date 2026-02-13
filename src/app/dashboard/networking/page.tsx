'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit2, User, Smile, ArrowRight, Camera, Sparkles, UserPlus } from 'lucide-react';

export default function NetworkingPage() {
    const router = useRouter();

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col relative overflow-hidden text-slate-800 dark:text-white">
            {/* ─── Desktop View ─── */}
            <div className="hidden md:block p-6 lg:p-10 z-10">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-10 text-left">
                        <span className="text-primary font-semibold text-xs uppercase tracking-wider">MEMIT NETWORKING</span>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display mt-1">인맥 & 비즈니스</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">이름과 얼굴, 그리고 특별한 인연을 기억하는 가장 완벽한 방법.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Left: Profile Photo Upload */}
                        <div className="lg:col-span-5">
                            <div className="bg-white dark:bg-[#1e1c30] rounded-3xl p-10 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center text-center">
                                <div className="relative group cursor-pointer mb-8">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                                    <div className="relative w-48 h-48 rounded-full bg-slate-50 dark:bg-[#2a283f] border-2 border-dashed border-primary/30 group-hover:border-primary flex items-center justify-center transition-all duration-300">
                                        <div className="flex flex-col items-center text-primary/60 group-hover:text-primary">
                                            <Camera className="w-12 h-12 mb-2" />
                                            <span className="text-sm font-bold">사진 업로드</span>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-2 right-2 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-[#1e1c30]">
                                        <Plus className="w-6 h-6" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">프로필 이미지</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                    상대방의 얼굴 특징이 잘 드러나는 사진을 선택해주세요. 메밋 AI가 기억을 돕는 메타데이터를 추출합니다.
                                </p>
                            </div>
                        </div>

                        {/* Right: Info Form */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="bg-white dark:bg-[#1e1c30] rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                <input
                                                    className="w-full bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white py-4 pl-12 pr-4 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary transition-all font-bold"
                                                    placeholder="이름"
                                                    type="text"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Job Title</label>
                                            <input
                                                className="w-full bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white py-4 px-5 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary transition-all font-bold"
                                                placeholder="직함/소속"
                                                type="text"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Special Features</label>
                                        <div className="relative group">
                                            <Smile className="absolute left-4 top-5 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                            <textarea
                                                className="w-full bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white py-4 pl-12 pr-4 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary transition-all h-32 resize-none"
                                                placeholder="인상적인 특징을 메모하세요 (예: 푸른 넥타이, 호탕한 웃음소리)"
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-center gap-4">
                                        <Sparkles className="w-6 h-6 text-primary shrink-0" />
                                        <p className="text-xs text-primary font-medium tracking-tight">
                                            메밋의 시각화 메모리는 텍스트 정보보다 7배 더 오래 기억됩니다.
                                        </p>
                                    </div>

                                    <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-5 rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 group">
                                        <UserPlus className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                        <span className="text-lg">인물 메밋 저장하기</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Mobile View ─── */}
            <div className="block md:hidden">
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
                            <div className="relative w-40 h-40 rounded-full bg-white dark:bg-[#1e1c36] border-2 border-dashed border-primary/40 group-hover:border-primary flex items-center justify-center transition-all duration-300 overflow-hidden">
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
                    <div className="w-full space-y-6 text-left">
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
        </div>
    );
}
