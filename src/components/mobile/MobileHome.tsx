'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Brain, ArrowRight, Zap, Play, Grid, ChevronRight, Quote, Heart, TrophyIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { convertNumberAction } from '@/app/actions';
import ResultCard from './ResultCard';

export default function MobileHome() {
    const router = useRouter();
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string[] | null>(null);

    const handleConvert = async () => {
        if (!input.trim() || loading) return;
        setLoading(true);
        const res = await convertNumberAction(input);
        if (res.success && res.data) {
            setResult(res.data);
        }
        setLoading(false);
    };

    return (
        <div className="pb-24 bg-background-light dark:bg-background-dark min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5">
                <div className="px-5 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                            <Brain className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">MEMIT</span>
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="px-5 pt-8 pb-4">
                    <h1 className="text-3xl font-bold leading-tight mb-2 text-slate-900 dark:text-white">
                        모든 순간을 기억하세요,<br />
                        <span className="text-primary">메밋</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm leading-relaxed">
                        무엇이든 3초 만에 메밋하세요.<br />복잡한 정보도 나만의 이야기로 영구 저장됩니다.
                    </p>

                    {/* Quick Action Card */}
                    <div className="bg-white dark:bg-[#1e1c30] rounded-2xl shadow-xl shadow-primary/5 border border-slate-100 dark:border-slate-800 overflow-hidden relative">
                        <div className="p-1.5 bg-slate-100/50 dark:bg-black/20 m-4 rounded-xl flex gap-1">
                            <button className="flex-1 py-2.5 px-4 rounded-lg bg-white dark:bg-white/10 shadow-sm text-primary dark:text-white font-semibold text-sm text-center transition-all">
                                숫자 암기
                            </button>
                            <button className="flex-1 py-2.5 px-4 rounded-lg text-slate-500 dark:text-slate-400 font-medium text-sm text-center hover:text-slate-700 dark:hover:text-slate-200 transition-all">
                                비밀번호 생성
                            </button>
                        </div>
                        <div className="px-4 pb-4">
                            <div className="relative">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="w-full h-32 bg-slate-50 dark:bg-black/20 border-none rounded-xl p-4 text-base resize-none focus:ring-2 focus:ring-primary/20 placeholder-slate-400 text-slate-900 dark:text-white"
                                    placeholder="암기하고 싶은 숫자나 단어를 입력하세요...&#13;&#10;(예: 3.141592, 은행 계좌번호 등)"
                                ></textarea>
                                <div className="absolute bottom-3 right-3 text-xs text-slate-400 font-medium">{input.length}/500</div>
                            </div>
                        </div>
                        <div className="px-4 pb-4">
                            <button
                                onClick={handleConvert}
                                disabled={loading}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-indigo-500 text-white font-bold text-lg shadow-lg shadow-primary/25 active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <Zap className="w-5 h-5 text-yellow-300" fill="currentColor" />
                                )}
                                {loading ? '생성 중...' : '메밋 생성하기'}
                            </button>
                        </div>
                    </div>

                    {result && (
                        <div className="mt-6 animate-in fade-in slide-in-from-top-4 duration-500">
                            <ResultCard
                                input={input}
                                keywords={result}
                                onSave={() => { }}
                                onReset={() => setResult(null)}
                            />
                        </div>
                    )}
                </section>

                {/* Service Link */}
                <section className="px-5 py-4">
                    <Link href="/dashboard/services" className="w-full group bg-white dark:bg-[#1e1c30] hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-primary dark:text-indigo-300">
                                <Grid className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg">다른 암기 서비스 보기</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">보안, 비즈니스, 학습 등 더 많은 카테고리</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </Link>
                </section>

                {/* Hall of Fame */}
                <section className="py-6">
                    <div className="px-5 mb-4">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <TrophyIcon className="w-5 h-5 text-yellow-500" />
                            명예의 전당
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">다른 사용자들이 생성한 놀라운 기억법을 확인하세요.</p>
                    </div>
                    <div className="flex overflow-x-auto gap-4 px-5 pb-4 no-scrollbar snap-x">
                        {/* Card 1 */}
                        <div className="min-w-[280px] snap-center bg-white dark:bg-[#1e1c30] rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Quote className="w-12 h-12 text-primary" />
                            </div>
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQp78p9_EmjD6tz8xlY-Ltf7WlxvNHUph5rcihBE6kJ237xfyvsc-pyyb1wysrWt5Q1YI22Duz-kY0AsA5pNnrvPm4qzpxUb-anyavJDjHYPp-nzf8XIP2bFf5soBv-e2veMVkl7plpi4xE9vDmadV0H2pXULaIcouBk3q45AdhdXm3UX8fo91TpWuGu-RNo9-KYWP_cPe_ZAQz-33P2bk7Qv52WkVj3QyyknwkFypiEC2-y3UndW1vlMoBZeWK9PAPqMFW9QNRIcR" alt="User" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">김지수</div>
                                        <div className="text-[10px] text-slate-400">2시간 전</div>
                                    </div>
                                </div>
                                <div className="flex items-center text-rose-500 text-xs font-bold bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-full">
                                    <Heart className="w-3 h-3 mr-1 fill-current" />
                                    1.2k
                                </div>
                            </div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">원주율 100자리 외우기</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                3.14159... 숫자를 거대한 우주 정거장의 방 번호로 바꿔서 기억했습니다. 첫 번째 방에는...
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="min-w-[280px] snap-center bg-white dark:bg-[#1e1c30] rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Quote className="w-12 h-12 text-primary" />
                            </div>
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-CBxnd15NTUZ8yBRN-cAQpts-Yt6p0VTIbPF-gjwhGO8-mrD8uDbct7OGY0LX1MdyVC-tcxXLSmTWFaRMT0sHylQYaox_aTBvKqenq4cdyd5RaYxgEuXGGmz33FMgIEUQayDVkFBwi2B-hDAiO_tRYQpS7dL4Gvbk_uTKuBXzzz83tjk6amhnK5GJ1XwdSBfzYFxASIhX0nOjERdyvnONl2lK3nNzcAwZeNFJuQ5cFZROHpCgxFFoakv3K1gBs54dMMfs3yjFvpll" alt="User" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">박민준</div>
                                        <div className="text-[10px] text-slate-400">5시간 전</div>
                                    </div>
                                </div>
                                <div className="flex items-center text-rose-500 text-xs font-bold bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-full">
                                    <Heart className="w-3 h-3 mr-1 fill-current" />
                                    850
                                </div>
                            </div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">한국사 연도표 암기</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                임진왜란 1592년을 "이리오 구이" 굽는 장면으로 연상해서 외우니까 절대 안 잊어버리네요!
                            </p>
                        </div>
                    </div>
                </section>

                {/* Banner */}
                <section className="px-5 mt-4">
                    <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-lg group">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10 flex flex-col justify-end p-5">
                            <p className="text-white font-bold text-lg mb-1">기억의 궁전 체험하기</p>
                            <p className="text-white/80 text-xs">지금 무료로 시작하고 뇌 잠재력을 깨우세요.</p>
                        </div>
                        <img className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrjkqA0PK5F73_khPA8VvmE506ni8v1sVeR1FxG5nVj29YRvSwweDOn8TPn2546dAoz8RV3yg9ZZfqQgapNoV31cu2VsB4oeWNgcOabtXViGqVBAsJ-3Rm-9cYPbSqfywvaZr1wdNXID5KZCUHzfJLW8URVRr6itnw5QgKmCkzXf6Ejv6nGXug6V-NNEUYH1PKb3qM18aMmfQHeD_qvdneOaNDvzsAks0nge3-_2CShI8BWHrt1mq-Wyt31opi9wfGYpQikFDgohEu" alt="Banner" />
                    </div>
                </section>
            </main>
        </div>
    );
}

