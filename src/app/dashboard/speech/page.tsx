'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, MoreHorizontal, Mic, Wand2, Plus, ArrowRight, Sparkles, Edit3, Zap } from 'lucide-react';

export default function SpeechPage() {
    const router = useRouter();

    return (
        <>
            {/* ─── Desktop View ─── */}
            <div className="hidden md:block p-6 lg:p-10">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-10">
                        <span className="text-primary font-semibold text-xs uppercase tracking-wider">MEMIT SPEECH</span>
                        <h1 className="text-3xl font-bold text-white font-display mt-1">발표 & 스피치</h1>
                        <p className="text-slate-400 mt-1">완벽한 발표를 위한 당신의 개인 기억 코치입니다.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Left: Intro & Tips */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="bg-[#1e1c30] rounded-2xl p-8 border border-slate-800 shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                                    <Mic className="w-24 h-24" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">발표의 공포를<br /><span className="text-primary">자신감으로</span> 바꾸세요.</h3>
                                <p className="text-slate-400 leading-relaxed mb-6">
                                    긴 문장을 통째로 외우는 무모한 방식은 이제 그만하세요. 메밋은 당신의 발표 키워드를 강력한 이미지로 연결하여, 어떤 상황에서도 막힘없는 스피치를 보장합니다.
                                </p>
                                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-200">AI 키워드 추출 시스템 지원</span>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                                <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Speech Formula</h4>
                                <ul className="space-y-3">
                                    {[
                                        '핵심 키워드 3가지 선정',
                                        '각 키워드를 강렬한 장소와 결합',
                                        '감정을 담아 이야기로 연결',
                                    ].map((step, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-sm text-slate-400">
                                            <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-700">
                                                {idx + 1}
                                            </div>
                                            {step}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Right: Input & Action */}
                        <div className="lg:col-span-7 space-y-8">
                            <div className="bg-[#1e1c30] rounded-2xl p-8 border border-slate-800 shadow-xl">
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Topic or Title</label>
                                        <input
                                            className="w-full bg-slate-800/50 text-white placeholder-slate-600 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-primary transition-all border border-slate-700 focus:border-transparent text-lg font-bold"
                                            placeholder="발표 주제를 입력하세요 (예: 2024 마케팅 전략)"
                                            type="text"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Main Keypoints</label>
                                        <div className="space-y-3">
                                            {[1, 2, 3].map((num) => (
                                                <div key={num} className="relative group">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold group-focus-within:text-primary transition-colors">{num}</span>
                                                    <input
                                                        className="w-full bg-slate-800/30 text-white placeholder-slate-700 rounded-xl py-4 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all border border-slate-800/50 focus:border-transparent"
                                                        placeholder={`키워드 ${num}`}
                                                        type="text"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full mt-10 bg-primary hover:bg-primary/90 text-white font-bold py-5 rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 group">
                                    <Edit3 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                    <span className="text-lg">발표 메모 메밋하기</span>
                                </button>
                            </div>

                            <div className="flex items-center gap-4 text-slate-500 text-sm italic pl-2">
                                <Zap className="w-4 h-4 text-yellow-400" />
                                <span>"스티브 잡스의 발표 비결도 바로 시각화였습니다."</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Mobile View ─── */}
            <div className="block md:hidden bg-background-dark min-h-screen flex flex-col relative overflow-hidden text-white">
                {/* Background Decor */}
                <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none opacity-50"></div>

                {/* Header */}
                <header className="px-6 py-4 flex items-center justify-between shrink-0 z-10">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg font-bold tracking-wide">발표 & 스피치</h1>
                    <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 hover:bg-white/10 transition-colors">
                        <MoreHorizontal className="w-6 h-6" />
                    </button>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto no-scrollbar px-6 pb-32 z-10">
                    {/* Service Intro Card */}
                    <div className="mt-2 mb-8 p-6 rounded-lg bg-[#1e1c36] shadow-sm border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                        <div className="flex items-start justify-between relative z-10">
                            <div>
                                <div className="inline-flex items-center space-x-2 mb-2">
                                    <Mic className="w-5 h-5 text-primary" />
                                    <span className="text-primary font-semibold text-sm uppercase tracking-wider">스피치 모드</span>
                                </div>
                                <h2 className="text-2xl font-bold leading-snug mb-2 text-white">발표의 핵심 내용을<br />입력해주세요.</h2>
                                <p className="text-slate-400 text-sm leading-relaxed">발표의 핵심 키워드를 흐름에 따라<br />자연스럽게 암기하세요.</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary">
                                <Mic className="w-6 h-6" />
                            </div>
                        </div>
                        {/* Keyword Extraction Button */}
                        <div className="mt-6 flex justify-end">
                            <button className="flex items-center space-x-2 px-4 py-2 rounded-full bg-[#2a283f] hover:bg-primary/20 border border-white/5 text-sm font-medium transition-all group-hover:border-primary/30 text-slate-300 group-hover:text-white">
                                <Wand2 className="w-4 h-4 text-primary" />
                                <span>AI 키워드 추출</span>
                            </button>
                        </div>
                    </div>

                    {/* Speech Points List */}
                    <div className="space-y-6">
                        {/* Point 1 */}
                        <div className="group text-left">
                            <div className="flex items-center justify-between mb-2 pl-2">
                                <span className="text-primary font-bold text-sm tracking-widest">STEP 01</span>
                                <span className="text-xs text-slate-500">서론 / 도입</span>
                            </div>
                            <div className="relative">
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-l-lg"></div>
                                <textarea
                                    className="w-full bg-[#1e1c36] text-white p-5 pl-6 rounded-r-lg rounded-bl-lg border-0 ring-1 ring-white/5 focus:ring-2 focus:ring-primary placeholder-slate-600 resize-none h-32 text-base leading-relaxed transition-all shadow-sm outline-none"
                                    placeholder="첫 번째 핵심 내용을 입력하세요..."
                                    defaultValue="안녕하세요, 오늘 발표를 맡게 된 김메밋입니다. 오늘 저는 효과적인 암기 방법에 대해 이야기하고자 합니다."
                                ></textarea>
                                <div className="absolute bottom-3 right-3 text-xs text-slate-400 font-medium bg-black/20 px-2 py-0.5 rounded-full">58자</div>
                            </div>
                        </div>

                        {/* Point 2 */}
                        <div className="group text-left">
                            <div className="flex items-center justify-between mb-2 pl-2">
                                <span className="text-slate-500 font-bold text-sm tracking-widest group-hover:text-primary transition-colors">STEP 02</span>
                                <span className="text-xs text-slate-500">본론 1</span>
                            </div>
                            <div className="relative group">
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#2a283f] group-focus-within:bg-primary rounded-l-lg transition-colors duration-300"></div>
                                <textarea
                                    className="w-full bg-[#1e1c36] text-white p-5 pl-6 rounded-r-lg rounded-bl-lg border-0 ring-1 ring-white/5 focus:ring-2 focus:ring-primary placeholder-slate-600 resize-none h-32 text-base leading-relaxed transition-all shadow-sm focus:bg-[#2a283f] outline-none"
                                    placeholder="두 번째 핵심 내용을 입력하세요..."
                                ></textarea>
                            </div>
                        </div>

                        {/* Point 3 (Add) */}
                        <div className="opacity-70 hover:opacity-100 transition-opacity">
                            <div className="flex items-center justify-between mb-2 pl-2">
                                <span className="text-slate-600 font-bold text-sm tracking-widest">STEP 03</span>
                            </div>
                            <button className="w-full bg-transparent border-2 border-dashed border-white/10 p-4 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:border-primary/50 hover:text-primary transition-all h-24 group">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:bg-primary/10 transition-colors">
                                    <Plus className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-medium">다음 내용 추가하기</span>
                            </button>
                        </div>
                    </div>
                </main>

                {/* Bottom Action Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-dark via-background-dark to-transparent z-20">
                    <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-lg py-4 rounded-full shadow-lg shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 group relative overflow-hidden">
                        <span>스피치 흐름 메밋</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </>
    );
}
