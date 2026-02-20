'use client';

import { motion } from 'framer-motion';
import { Lock, Briefcase, Cake, GraduationCap, Car, GripVertical, ArrowRight, Brain } from 'lucide-react';

export function ServiceSection() {
    const categories = [
        { icon: Lock, title: '보안 정보', desc: '복잡한 비밀번호, 현관 도어락, 계좌 비밀번호 등을 이미지로 안전하게 암기하세요.' },
        { icon: Briefcase, title: '비즈니스', desc: '거래처 전화번호, 사업자 등록번호, 중요한 미팅 날짜를 놓치지 마세요.' },
        { icon: Cake, title: '일상 생활', desc: '가족 생일, 기념일, 주민등록번호 등 잊기 쉬운 생활 속 숫자들을 기억하세요.' },
        { icon: GraduationCap, title: '시험 공부', desc: '역사적 연도, 주기율표 숫자 등 단순 암기가 필요한 학습 내용을 스토리로 변환합니다.' },
        { icon: Car, title: '차량/위치', desc: '차량 번호판, 넓은 주차장에서의 주차 구역 번호를 사진처럼 기억하세요.' },
        { icon: GripVertical, title: '기타', desc: '그 외 기억하고 싶은 모든 숫자들을 당신만의 방식으로 저장할 수 있습니다.' },
    ];

    return (
        <section className="py-24 bg-[#130c1a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold font-display text-white mb-4">활용 분야</h2>
                    <p className="text-gray-400">일상의 사소한 기억부터 중요한 비즈니스 정보까지.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative bg-background-dark p-8 rounded-2xl border border-white/5 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <cat.icon className="w-6 h-6 text-primary group-hover:text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 font-display">{cat.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{cat.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function CallToAction() {
    return (
        <section className="relative py-32 flex flex-col items-center justify-center bg-background-dark overflow-hidden text-center px-4">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="relative z-10 max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-8">
                    이제, 기억의 주인이 되세요.
                </h2>
                <p className="text-gray-400 text-lg mb-10">
                    Memit과 함께라면 더 이상 중요한 순간을 잊지 않습니다.<br />
                    지금 무료로 시작하고 첫 번째 기억을 만들어보세요.
                </p>
                <button
                    className="relative group overflow-hidden rounded-full p-[1px] shadow-[0_0_30px_rgba(140,43,238,0.4)] hover:shadow-[0_0_50px_rgba(140,43,238,0.6)] transition-shadow duration-300"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-indigo-600 rounded-full"></div>
                    <div className="relative px-10 py-5 bg-background-dark rounded-full group-hover:bg-opacity-0 transition-all duration-300 ease-out">
                        <span className="relative flex items-center justify-center gap-2 text-white text-lg font-bold tracking-wide group-hover:scale-105 transition-transform font-display">
                            기억의 궁전 입장하기
                            <ArrowRight className="w-6 h-6" />
                        </span>
                    </div>
                </button>
                <p className="mt-6 text-sm text-gray-500">
                    Google 계정으로 3초 만에 시작 가능합니다.
                </p>
            </div>
        </section>
    );
}

export function Footer() {
    return (
        <footer className="bg-[#0f0a14] border-t border-white/5 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <Brain className="text-primary w-6 h-6" />
                    <span className="font-display font-bold text-white text-lg tracking-tight">Memit AI</span>
                </div>
                <div className="flex gap-6 text-sm text-gray-400">
                    <a className="hover:text-white transition-colors" href="#">이용약관</a>
                    <a className="hover:text-white transition-colors" href="#">개인정보처리방침</a>
                    <a className="hover:text-white transition-colors" href="#">문의하기</a>
                </div>
                <div className="text-sm text-gray-600">
                    © 2026 Memit AI. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
