'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'security' | 'brain' | 'speech' | 'study'>('security');

    const tabs = [
        { id: 'security', label: '🔐 암호 생성', icon: '🛡️' },
        { id: 'brain', label: '🧠 숫자 암기', icon: '⚡' },
        { id: 'speech', label: '🎤 스피치', icon: '🗣️' },
        { id: 'study', label: '📚 학습', icon: '📖' },
    ];

    const content = {
        security: {
            badge: '✨ 보안 전문가 (Security Officer)',
            title: <>비밀번호, <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300">외우지 말고 만드세요.</span></>,
            desc: <>3초 만에 생성하고 평생 잊지 않는<br className="hidden md:block" />나만의 마스터키 공식을 설계해 드립니다.</>,
            cta: '마스터키 만들기 (무료)',
            color: 'from-blue-500/20 to-indigo-500/20'
        },
        brain: {
            badge: '⚡ 두뇌 트레이너 (Brain Coach)',
            title: <>죽어있는 숫자를 <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300">살아있는 이미지로.</span></>,
            desc: <>잠든 좌뇌와 우뇌를 동시에 깨우는<br className="hidden md:block" />고강도 두뇌 트레이닝.</>,
            cta: '두뇌 훈련 시작하기',
            color: 'from-emerald-500/20 to-teal-500/20'
        },
        speech: {
            badge: '🎤 카리스마 코치 (Stage Director)',
            title: <>원고 없이 <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-rose-300">무대에 서는 자유.</span></>,
            desc: <>당신의 이야기가 청중의 기억 속에<br className="hidden md:block" />영원히 남도록 '기억의 궁전'을 짓습니다.</>,
            cta: '기억의 궁전 짓기',
            color: 'from-purple-500/20 to-pink-500/20'
        },
        study: {
            badge: '📚 지식 건축가 (Knowledge Architect)',
            title: <>복잡한 지식을 <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-red-300">한 장의 그림으로.</span></>,
            desc: <>어려운 전공 서적도, 방대한 시험 범위도<br className="hidden md:block" />체계적인 구조로 머릿속에 건축해 드립니다.</>,
            cta: '지식 구조화 시작하기',
            color: 'from-orange-500/20 to-red-500/20'
        }
    };

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0f172a] pt-20">
            {/* Dynamic Background */}
            <div className={`absolute inset-0 bg-gradient-to-b ${content[activeTab].color} transition-colors duration-1000 opacity-20`}></div>
            <div className="absolute inset-0 starry-bg opacity-30 animate-pulse-slow pointer-events-none"></div>

            {/* Tabs */}
            <div className="relative z-20 mb-12 flex flex-wrap justify-center gap-4 px-4">
                {tabs.map((tab: any) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`
                            px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2
                            ${activeTab === tab.id
                                ? 'bg-white text-slate-900 shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105'
                                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'}
                        `}
                    >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-8 min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center"
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-sm font-medium text-slate-300 mb-8 tracking-wider uppercase">
                            {content[activeTab].badge}
                        </span>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-display text-white mb-8 leading-tight drop-shadow-2xl">
                            {content[activeTab].title}
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-md mb-10">
                            {content[activeTab].desc}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                            <button
                                onClick={() => router.push('/login')}
                                className="px-8 py-4 rounded-full bg-white text-indigo-900 text-lg font-bold hover:bg-blue-50 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:-translate-y-1 transform active:scale-95 w-full sm:w-auto min-w-[200px]"
                            >
                                {content[activeTab].cta}
                            </button>
                            <button
                                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                                className="px-8 py-4 rounded-full bg-white/5 backdrop-blur-md text-white text-lg font-medium border border-white/10 hover:bg-white/10 transition-all w-full sm:w-auto min-w-[160px]"
                            >
                                더 알아보기
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-0 right-0"
            >
                <div className="flex flex-col items-center animate-bounce text-slate-500 text-xs font-display tracking-[0.2em] uppercase">
                    <span>Explore the tools</span>
                    <ChevronDown className="mt-2 w-5 h-5" />
                </div>
            </motion.div>
        </section>
    );
}
