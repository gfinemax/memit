'use client';

import React from 'react';
import Link from 'next/link';
import MobileServiceCategories from '@/components/mobile/MobileServiceCategories';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock, Handshake, GraduationCap, Mic, ShoppingCart, Brain, Search, ArrowRight, Zap } from 'lucide-react';

const services = [
    {
        id: 'security',
        title: '보안 & 금융',
        desc: '비밀번호, 계좌번호 등 민감한 정보 안전 보관',
        icon: Lock,
        href: '/dashboard/security',
        gradient: 'from-blue-500 to-cyan-400',
    },
    {
        id: 'networking',
        title: '인맥 & 비즈니스',
        desc: '명함 정보, 미팅 핵심 요약 및 인물 기억',
        icon: Handshake,
        href: '/dashboard/networking',
        gradient: 'from-orange-500 to-amber-400',
    },
    {
        id: 'learning',
        title: '학습 & 지식',
        desc: '전공 서적, 시험 요점 효율적인 암기 지원',
        icon: GraduationCap,
        href: '/dashboard/learning',
        gradient: 'from-green-500 to-emerald-400',
    },
    {
        id: 'speech',
        title: '발표 & 스피치',
        desc: '연설문 스크립트, 프레젠테이션 흐름',
        icon: Mic,
        href: '/dashboard/speech',
        gradient: 'from-pink-500 to-rose-400',
    },
    {
        id: 'daily',
        title: '일상 & 생활',
        desc: '장보기 목록, 할 일, 사소하지만 중요한 것',
        icon: ShoppingCart,
        href: '/dashboard/daily',
        gradient: 'from-violet-500 to-purple-400',
    },
    {
        id: 'training',
        title: '두뇌 트레이닝',
        desc: '기억력 향상 퀴즈, 두뇌 회전 연습',
        icon: Brain,
        href: '/dashboard/training',
        gradient: 'from-indigo-500 to-blue-400',
    },
];

export default function ServicesPage() {
    const router = useRouter();

    return (
        <>
            {/* ─── Desktop View ─── */}
            <div className="hidden md:block p-6 lg:p-10">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-10">
                        <span className="text-primary font-semibold text-xs uppercase tracking-wider">MEMIT SERVICE</span>
                        <h1 className="text-3xl font-bold text-white font-display mt-1">메밋 상황별 기억 도우미</h1>
                        <p className="text-slate-400 mt-1">MEMIT AI가 당신의 소중한 기억을 도와드립니다.</p>
                    </div>

                    {/* Search */}
                    <div className="relative max-w-xl mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#1e1c30] border border-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-white"
                            placeholder="무엇을 기억하고 싶으신가요?"
                        />
                    </div>

                    {/* Service Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                        {services.map((service) => (
                            <Link
                                key={service.id}
                                href={service.href}
                                className="group relative bg-[#1e1c30] rounded-2xl p-6 border border-slate-800 hover:border-primary/40 transition-all duration-300 overflow-hidden"
                            >
                                {/* Hover glow */}
                                <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500`} />

                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.gradient} bg-opacity-10 flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <service.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="font-bold text-lg text-white mb-1.5 group-hover:text-primary transition-colors">{service.title}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">{service.desc}</p>
                                <div className="flex items-center mt-4 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span>시작하기</span>
                                    <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Promotion Banner */}
                    <div className="mt-8 relative w-full h-36 rounded-2xl overflow-hidden cursor-pointer group">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-purple-600/90 z-10" />
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-700 z-0" />
                        <div className="absolute inset-0 z-20 flex items-center px-8">
                            <div className="flex-1">
                                <span className="text-white/80 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                                    <Zap className="w-3 h-3 text-yellow-300" fill="currentColor" />
                                    Premium Feature
                                </span>
                                <h4 className="text-white font-bold text-xl mt-1">기억력 테스트 시작하기</h4>
                                <div className="flex items-center mt-2 text-white/90 text-sm font-medium">
                                    <span>나의 기억력 등급을 확인해보세요</span>
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Mobile View (기존 코드 유지) ─── */}
            <div className="block md:hidden bg-background-dark min-h-screen pb-24">
                <header className="pt-8 pb-4 px-6 flex flex-col items-start justify-end bg-background-dark sticky top-0 z-20 border-b border-white/5">
                    <div className="flex w-full justify-between items-center mb-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6 text-slate-300" />
                        </button>
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/20 cursor-pointer">
                            <span className="text-primary font-bold">U</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-primary font-semibold text-xs uppercase tracking-wider">MEMIT SERVICE</span>
                        <h1 className="text-2xl font-bold text-white leading-tight">메밋 상황별 기억 도우미</h1>
                        <p className="text-sm text-slate-400">MEMIT AI가 당신의 소중한 기억을 도와드립니다.</p>
                    </div>
                </header>
                <MobileServiceCategories />
            </div>
        </>
    );
}
