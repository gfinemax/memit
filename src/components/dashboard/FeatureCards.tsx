'use client';

import React from 'react';
import { Mic, GraduationCap, ShieldCheck, ArrowRight } from 'lucide-react';

export default function FeatureCards() {
    const features = [
        {
            icon: Mic,
            title: '발표 & 스피치',
            description: '발표의 핵심 내용을 흐름에 따라 자연스럽게 암기하세요.',
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            hoverBg: 'group-hover:bg-blue-500',
        },
        {
            icon: GraduationCap,
            title: '학습 & 지식',
            description: '복잡한 이론과 개념을 시각적 스토리로 재구성하세요.',
            color: 'text-[#8B5CF6]',
            bg: 'bg-[#8B5CF6]/10',
            hoverBg: 'group-hover:bg-[#8B5CF6]',
        },
        {
            icon: ShieldCheck,
            title: '보안 & 금융',
            description: '비밀번호와 핀 번호를 나만의 기억 지갑에 보관하세요.',
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            hoverBg: 'group-hover:bg-emerald-500',
        },
    ];

    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white font-display">주요 기능</h3>
                <a href="#" className="text-sm text-primary hover:text-[#8B5CF6] font-medium flex items-center gap-1 transition-colors">
                    전체보기 <ArrowRight className="w-4 h-4" />
                </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {features.map((feature, index) => (
                    <div key={index} className="bg-surface-dark border border-slate-800 p-6 rounded-2xl hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group cursor-pointer">
                        <div className={`w-12 h-12 rounded-xl ${feature.bg} ${feature.color} flex items-center justify-center mb-4 ${feature.hoverBg} group-hover:text-white transition-colors`}>
                            <feature.icon className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-bold mb-2 text-white font-display">{feature.title}</h4>
                        <p className="text-sm text-slate-400 leading-relaxed font-sans">{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
