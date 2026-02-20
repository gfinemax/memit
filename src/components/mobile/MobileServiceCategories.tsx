'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, Handshake, GraduationCap, Mic, ShoppingCart, Brain, Search, ArrowRight, Zap } from 'lucide-react';

export default function MobileServiceCategories() {
    const services = [
        {
            id: 'security',
            title: '보안 & 금융',
            desc: '비밀번호, 계좌번호 등 민감한 정보 안전 보관',
            icon: Lock,
            href: '/memit/security'
        },
        {
            id: 'networking',
            name: '인맥 & 비즈니스',
            desc: '명함 정보, 미팅 핵심 요약 및 인물 기억',
            icon: Handshake,
            color: 'bg-emerald-500',
            href: '/memit/networking'
        },
        {
            id: 'learning',
            name: '학습 & 지식',
            desc: '전공 서적, 시험 요점 효율적인 암기 지원',
            icon: GraduationCap,
            color: 'bg-amber-500',
            href: '/memit/learning'
        },
        {
            id: 'speech',
            name: '발표 & 스피치',
            desc: '연설문 스크립트, 프레젠테이션 흐름',
            icon: Mic,
            color: 'bg-rose-500',
            href: '/memit/speech'
        },
        {
            id: 'daily',
            name: '일상 & 생활',
            desc: '장보기 목록, 할 일, 사소하지만 중요한 것',
            icon: ShoppingCart,
            color: 'bg-cyan-500',
            href: '/memit/daily'
        },
        {
            id: 'training',
            name: '두뇌 트레이닝',
            desc: '기억력 향상 퀴즈, 두뇌 회전 연습',
            icon: Brain,
            color: 'bg-indigo-500',
            href: '/memit/training'
        }
    ];

    return (
        <div className="pb-24">
            {/* Service Grid - Concept 3 Style */}
            <div className="px-4">
                <div className="grid grid-cols-2 gap-3.5">
                    {services.map((service) => (
                        <Link
                            key={service.id}
                            href={service.href}
                            className="group relative flex flex-col p-5 bg-white/5 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2rem] border border-white/10 hover:border-primary/40 transition-all duration-500 overflow-hidden shadow-xl"
                        >
                            {/* Inner Glow */}
                            <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            <div className="h-12 w-12 rounded-2xl bg-white/5 dark:bg-white/5 group-hover:bg-primary/20 flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-inner">
                                <service.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                            </div>

                            <h3 className="font-black text-base text-white mb-1 group-hover:text-primary transition-colors tracking-tight">
                                {service.title || service.name}
                            </h3>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 group-hover:text-slate-300 leading-relaxed line-clamp-2 opacity-80">
                                {service.desc}
                            </p>

                            {/* Corner Accent */}
                            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
                                <ArrowRight className="w-3 h-3 text-primary" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Promotion Banner - Enhanced Glassmorphism */}
            <div className="px-4 mt-6">
                <div className="relative w-full h-32 rounded-[2rem] overflow-hidden shadow-2xl group cursor-pointer border border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/40 to-purple-600/40 backdrop-blur-md z-10" />
                    <div className="absolute inset-0 bg-slate-950 z-0" />

                    {/* Animated Light Streaks */}
                    <div className="absolute inset-0 z-5 bg-[radial-gradient(circle_at_50%_120%,rgba(79,70,229,0.3),transparent)]" />

                    <div className="absolute inset-0 z-20 flex flex-col justify-center px-8">
                        <span className="text-white/60 text-[9px] font-black uppercase tracking-widest mb-1 flex items-center gap-1.5">
                            <Zap className="w-3 h-3 text-yellow-300 fill-current" />
                            Premium Training
                        </span>
                        <h4 className="text-white font-black text-xl tracking-tight">기억력 테스트</h4>
                        <div className="flex items-center mt-2">
                            <div className="text-white/90 text-xs font-bold bg-white/10 px-3 py-1 rounded-full flex items-center gap-2 group-hover:bg-primary transition-colors">
                                <span>지금 도전해보세요</span>
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
