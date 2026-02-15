'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, PlayCircle } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 text-white">
            {/* Cinematic Background Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background-dark z-10" />
                {/* Fallback color if image fails */}
                <div className="absolute inset-0 bg-[#0f172a]" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
            </div>

            <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-sm">
                        <Sparkles className="w-3.5 h-3.5" />
                        Next-Gen AI Memory Tool
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] mb-8 font-display tracking-tight">
                        당신의 기억이 <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light via-cyan-300 to-emerald-300">
                            예술이 되는 곳
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
                        MEMIT AI는 단순한 기록을 넘어 당신의 소중한 순간을 지브리 감성의 화방으로 바꿉니다. <br className="hidden md:block" />
                        이제 복잡한 정보도 하나의 이야기로 영원히 기억하세요.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                        <Link
                            href="/login"
                            className="group relative px-8 py-4 rounded-2xl bg-primary text-white font-black text-lg shadow-[0_0_40px_rgba(139,92,246,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center gap-3 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            무료로 메밋하기
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <button className="flex items-center gap-2.5 text-white font-bold text-lg px-8 py-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-all">
                            <PlayCircle className="w-6 h-6 text-primary-light" />
                            쇼케이스 보기
                        </button>
                    </div>
                </motion.div>

                {/* Micro-interaction preview area */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="mt-20 relative"
                >
                    <div className="absolute -inset-10 bg-primary/20 blur-[100px] rounded-full opacity-30" />
                    <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-4 shadow-2xl overflow-hidden max-w-3xl mx-auto">
                        <div className="flex items-center gap-2 mb-4 px-2">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                            </div>
                            <div className="flex-1 text-center">
                                <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Memit Studio Active</span>
                            </div>
                        </div>
                        <div className="h-48 rounded-xl bg-slate-900 flex items-center justify-center border border-white/5 relative group cursor-pointer">
                            <div className="text-slate-500 font-display text-2xl group-hover:text-primary-light transition-colors animate-pulse px-6 text-center">
                                숫자를 입력하고 기억을 작품으로 바꿔보세요
                            </div>
                            <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-[10px] font-black uppercase text-white shadow-lg shadow-primary/20">
                                <Sparkles className="w-3 h-3" />
                                AI Magic Mode
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Floating visual elements */}
            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background-dark to-transparent z-10 pointer-events-none" />
        </section>
    );
}
