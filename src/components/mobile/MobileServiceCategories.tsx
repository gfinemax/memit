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
            {/* Search Bar */}
            <div className="px-6 py-4">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-3 border-none rounded-xl leading-5 bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm group-hover:shadow-md transition-all duration-200"
                        placeholder="무엇을 기억하고 싶으신가요?"
                    />
                </div>
            </div>

            {/* Service Grid */}
            <div className="px-5">
                <div className="grid grid-cols-2 gap-4">
                    {services.map((service) => (
                        <Link
                            key={service.id}
                            href={service.href}
                            className="group flex flex-col p-5 bg-white dark:bg-surface-dark rounded-2xl shadow-sm hover:shadow-lg hover:bg-primary hover:text-white transition-all duration-300 border border-slate-100 dark:border-white/5 text-left h-full"
                        >
                            <div className="h-12 w-12 rounded-xl bg-slate-50 dark:bg-white/5 group-hover:bg-white/20 flex items-center justify-center mb-4 transition-colors">
                                <service.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="font-bold text-lg mb-1 group-hover:text-white">{service.title}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-white/80 leading-relaxed word-keep-all">
                                {service.desc}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Promotion Banner */}
            <div className="px-5 mt-6">
                <div className="relative w-full h-32 rounded-2xl overflow-hidden shadow-md group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-purple-600/90 mix-blend-multiply z-10"></div>
                    {/* Using a gradient background instead of image for now to avoid broken link */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-700 z-0"></div>

                    <div className="absolute inset-0 z-20 flex flex-col justify-center px-6">
                        <span className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Zap className="w-3 h-3 text-yellow-300" fill="currentColor" />
                            Premium Feature
                        </span>
                        <h4 className="text-white font-bold text-lg">기억력 테스트 시작하기</h4>
                        <div className="flex items-center mt-2 text-white/90 text-sm font-medium">
                            <span>지금 도전해보세요</span>
                            <ArrowRight className="ml-1 w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
