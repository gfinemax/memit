import { useRouter } from 'next/navigation';
import { ArrowLeft, MoreVertical, Signal, Wifi, BatteryCharging, Check, Play, Zap as ZapIcon, Book as BookIcon, LayoutGrid, CreditCard, Sparkles, ArrowRight } from 'lucide-react';

export default function TrainingPage() {
    const router = useRouter();

    return (
        <>
            {/* ─── Desktop View ─── */}
            <div className="hidden md:block p-6 lg:p-10">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-10">
                        <span className="text-primary font-semibold text-xs uppercase tracking-wider">MEMIT BRAIN TRAINING</span>
                        <h1 className="text-3xl font-bold text-white font-display mt-1">두뇌 트레이닝</h1>
                        <p className="text-slate-400 mt-1">기억의 근육을 단련하여 더 빠르고 정확하게 메밋하세요.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left: Progress Board */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-[#1e1c30] rounded-2x border border-slate-800 p-8 text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                                <div className="mx-auto w-32 h-32 mb-6 rounded-full border-4 border-slate-800 flex items-center justify-center relative">
                                    <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin-slow"></div>
                                    <div className="text-center">
                                        <span className="text-4xl font-bold text-white">72</span>
                                        <span className="text-sm text-slate-500 block">Score</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">상위 5%의 기억력</h3>
                                <p className="text-sm text-slate-400 mb-6">지난주 대비 12% 향상되었습니다.</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                                        <span className="text-xs text-slate-500 block mb-1">연속 출석</span>
                                        <span className="text-lg font-bold text-primary">12일</span>
                                    </div>
                                    <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                                        <span className="text-xs text-slate-500 block mb-1">완료 미션</span>
                                        <span className="text-lg font-bold text-primary">48개</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Missions & Action */}
                        <div className="lg:col-span-8 space-y-8">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-2">Available Missions</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { title: '순발력 퀴즈', desc: '10초 안에 이미지를 매칭하세요', icon: ZapIcon, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
                                    { title: '스토리 빌딩', desc: '5개의 키워드로 이야기를 만드세요', icon: BookIcon, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                                    { title: '카드 기억하기', desc: '뒤집힌 카드의 위치를 기억하세요', icon: LayoutGrid, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                                    { title: '숫자 시각화', desc: '랜덤 숫자를 이미지로 변환하세요', icon: CreditCard, color: 'text-green-400', bg: 'bg-green-400/10' },
                                ].map((mission, idx) => (
                                    <button key={idx} className="group flex items-start p-6 bg-[#1e1c30] rounded-2xl border border-slate-800 hover:border-primary/40 transition-all hover:shadow-2xl hover:shadow-primary/5 text-left">
                                        <div className={`w-12 h-12 rounded-xl ${mission.bg} ${mission.color} flex items-center justify-center shrink-0 mr-4 group-hover:scale-110 transition-transform`}>
                                            <mission.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white mb-1 group-hover:text-primary transition-colors">{mission.title}</h4>
                                            <p className="text-sm text-slate-500 group-hover:text-slate-400 transition-colors">{mission.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="p-8 rounded-2xl bg-gradient-to-r from-primary/20 to-purple-600/20 border border-primary/20 flex items-center justify-between relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                                    <Sparkles className="w-32 h-32" />
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold text-white mb-2 italic">Daily Challenge</h3>
                                    <p className="text-slate-300">오늘의 스페셜 미션을 완료하고 200포인트를 획득하세요!</p>
                                </div>
                                <button className="relative z-10 bg-primary hover:bg-primary/90 text-white font-bold py-4 px-10 rounded-xl shadow-xl shadow-primary/30 transition-all active:scale-95 flex items-center gap-3 group">
                                    <span>트레이닝 시작</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Mobile View ─── */}
            <div className="block md:hidden bg-background-dark min-h-screen flex flex-col items-center justify-center relative overflow-hidden text-white">
                <div className="w-full h-full max-w-md bg-background-dark relative flex flex-col overflow-hidden shadow-2xl">
                    {/* Header */}
                    <div className="px-4 py-3 flex items-center justify-between z-10">
                        <button
                            onClick={() => router.back()}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-lg font-semibold tracking-wide">두뇌 트레이닝</h1>
                        <button className="p-2 rounded-full hover:bg-white/10 transition-colors opacity-0">
                            <MoreVertical className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Main Content */}
                    <main className="flex-1 overflow-y-auto no-scrollbar px-6 pb-24">
                        {/* Hero / Progress */}
                        <div className="mt-4 mb-8 flex flex-col items-center justify-center text-center">
                            <div className="relative w-48 h-48 mb-6 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle className="text-[#1e1d2b]" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="12"></circle>
                                    <circle className="text-primary" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeDasharray="552" strokeDashoffset="187" strokeLinecap="round" strokeWidth="12"></circle>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-bold">66%</span>
                                    <span className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">진척도</span>
                                </div>
                            </div>
                            <h2 className="text-xl font-bold mb-2">오늘의 훈련 진척도</h2>
                            <p className="text-slate-400 text-sm max-w-[240px]">매일 10분, 뇌의 근육을 키워보세요.</p>
                        </div>

                        {/* Game Cards */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">오늘의 미션</h3>
                                <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary font-medium">2/3 완료</span>
                            </div>

                            {/* Card 1 */}
                            <div className="group relative overflow-hidden rounded-lg bg-[#1e1d2b] p-1 border border-white/5 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-center gap-4 p-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 font-bold text-xl">
                                        A
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-white">카드 순서 외우기</h4>
                                        <p className="text-xs text-slate-400 mt-0.5">기억력 향상</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                                        <Check className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/20">
                                    <div className="h-full bg-primary w-full"></div>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="group relative overflow-hidden rounded-lg bg-[#1e1d2b] p-1 border border-white/5 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-center gap-4 p-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                        {/* Mock Icon */}
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-white">N-Back 게임</h4>
                                        <p className="text-xs text-slate-400 mt-0.5">집중력 강화</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                                        <Check className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/20">
                                    <div className="h-full bg-primary w-full"></div>
                                </div>
                            </div>

                            {/* Card 3 (Active) */}
                            <div className="group relative overflow-hidden rounded-lg bg-[#1e1d2b] p-1 border-2 border-primary/50 shadow-lg shadow-primary/10 transition-all transform scale-[1.02]">
                                <div className="absolute top-2 right-2 flex">
                                    <span className="inline-flex items-center rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary ring-1 ring-inset ring-primary/30">NEXT</span>
                                </div>
                                <div className="flex items-center gap-4 p-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/30">
                                        <Mic className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-white">단어 연상 퀴즈</h4>
                                        <p className="text-xs text-slate-400 mt-0.5">언어 능력</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full border-2 border-slate-600 flex items-center justify-center shrink-0">
                                        <Check className="w-4 h-4 text-transparent" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/10">
                                    <div className="h-full bg-primary w-0"></div>
                                </div>
                            </div>
                        </div>
                    </main>

                    {/* Footer Action */}
                    <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background-dark via-background-dark to-transparent pointer-events-none">
                        <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-full shadow-lg shadow-primary/40 active:scale-95 transition-transform flex items-center justify-center gap-2 pointer-events-auto">
                            <Play className="w-5 h-5 fill-current" />
                            <span>훈련 시작</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

function Mic({ className }: { className?: string }) {
    return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>;
}
