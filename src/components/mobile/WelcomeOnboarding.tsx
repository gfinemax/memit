'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X, Sparkles, Brain, Lightbulb, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { MNEMONIC_MAP } from '@/lib/mnemonic-map';

interface WelcomeOnboardingProps {
    onComplete: () => void;
}

const SLIDES = [
    {
        id: 'intro',
        title: '메밋 AI에 오신 것을 환영합니다!',
        subtitle: '당신의 기억력을 무한히 확장하는 두뇌 OS',
        description: '숫자는 금방 잊혀지지만, 강렬한 이미지는 평생 기억됩니다. 메밋과 함께 "기억의 언어"를 배워보세요.',
        icon: Brain,
        color: 'from-purple-500 to-indigo-600'
    },
    {
        id: 'the-key',
        title: '기억의 언어: 규칙 배우기',
        subtitle: '숫자를 자음으로 바꾸는 마법',
        description: '메밋의 핵심은 숫자를 자음으로 변환하는 것입니다. 1은 ㄱ, 2는 ㄴ... 이 규칙만 알면 모든 숫자를 스토리로 만들 수 있습니다.',
        icon: Lightbulb,
        color: 'from-blue-500 to-cyan-500',
        content: (
            <div className="grid grid-cols-5 gap-2 mt-4 scale-90 sm:scale-100">
                {MNEMONIC_MAP.map((item) => (
                    <div key={item.num} className="bg-white/5 border border-white/10 rounded-lg p-2 text-center">
                        <div className="text-secondary font-bold text-xs mb-0.5">{item.num}</div>
                        <div className="text-white font-bold text-lg leading-tight">{item.consonants}</div>
                    </div>
                ))}
            </div>
        )
    },
    {
        id: 'connection',
        title: '숫자가 단어가 되는 과정',
        subtitle: '12 -> ㄱㄴ -> 그네',
        description: '숫자 12는 자음 ㄱ과 ㄴ이 됩니다. 이 자음들로 "그네"라는 구체적인 이미지를 떠올려보세요. 이제 12는 더 이상 숫자가 아닌 "그네"입니다.',
        icon: Sparkles,
        color: 'from-indigo-500 to-purple-500',
        content: (
            <div className="flex flex-col items-center gap-4 mt-6">
                <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold text-white">12</div>
                    <ChevronRight className="w-6 h-6 text-white/30" />
                    <div className="text-4xl font-bold text-secondary">ㄱㄴ</div>
                    <ChevronRight className="w-6 h-6 text-white/30" />
                    <div className="text-4xl font-bold text-white">그네</div>
                </div>
                <div className="text-xs text-white/50 mt-2">자음 사이에 모음을 넣어 자유롭게 단어를 만들어보세요!</div>
            </div>
        )
    },
    {
        id: 'ai-magic',
        title: '이미지로 각인시키기',
        subtitle: 'AI가 그려주는 기억의 조각',
        description: '떠올린 단어를 메밋 AI가 압도적인 비주얼의 예술 작품으로 그려줍니다. 뇌는 이 환상적인 일러스트를 결코 잊지 못할 것입니다.',
        icon: ImageIcon,
        color: 'from-emerald-500 to-teal-500',
        content: (
            <div className="mt-4 relative w-full aspect-square max-w-[240px] rounded-2xl overflow-hidden border border-white/20 shadow-2xl mx-auto">
                <img
                    src="https://images.unsplash.com/photo-1616194464132-73a7d2f954ec?auto=format&fit=crop&q=80&w=400"
                    alt="Example Play"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                    <p className="text-white font-bold text-sm">"해질녘 숲속의 신비로운 그네"</p>
                </div>
            </div>
        )
    },
    {
        id: 'ready',
        title: '이제 시작할 준비가 되셨나요?',
        subtitle: '당신의 두뇌 OS를 깨우세요',
        description: '복잡한 암호, 긴 발표 원고, 시험 공부까지. 메밋 AI가 당신의 천재적인 기억 파트너가 되어드릴게요.',
        icon: CheckCircle2,
        color: 'from-orange-500 to-red-500'
    }
];

export default function WelcomeOnboarding({ onComplete }: WelcomeOnboardingProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(0);

    const handleNext = () => {
        if (currentSlide < SLIDES.length - 1) {
            setDirection(1);
            setCurrentSlide(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    const handlePrev = () => {
        if (currentSlide > 0) {
            setDirection(-1);
            setCurrentSlide(prev => prev - 1);
        }
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 300 : -300,
            opacity: 0
        })
    };

    const slide = SLIDES[currentSlide];
    const Icon = slide.icon;

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />

            {/* Close/Skip Button */}
            <button
                onClick={onComplete}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
            >
                <span className="text-xs mr-1">Skip</span>
                <X className="w-5 h-5 inline-block" />
            </button>

            <div className="w-full max-w-sm flex flex-col h-full items-center justify-between py-12">
                {/* Content Area */}
                <div className="relative w-full flex-grow flex items-center justify-center">
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={currentSlide}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            className="w-full flex flex-col items-center text-center px-4"
                        >
                            <div className={`p-4 rounded-3xl bg-gradient-to-br ${slide.color} shadow-2xl shadow-black/40 mb-8`}>
                                <Icon className="w-12 h-12 text-white" />
                            </div>

                            <h1 className="text-2xl font-bold text-white mb-2 leading-tight">
                                {slide.title}
                            </h1>
                            <h2 className="text-secondary font-semibold text-sm mb-4">
                                {slide.subtitle}
                            </h2>
                            <p className="text-slate-400 text-sm leading-relaxed break-keep">
                                {slide.description}
                            </p>

                            {slide.content && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="w-full"
                                >
                                    {slide.content}
                                </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer Controls */}
                <div className="w-full flex flex-col gap-6 items-center">
                    {/* Progress Dots */}
                    <div className="flex gap-2">
                        {SLIDES.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-6 bg-primary' : 'w-1.5 bg-white/20'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="w-full flex items-center gap-3">
                        {currentSlide > 0 && (
                            <button
                                onClick={handlePrev}
                                className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            className={`
                                flex-grow h-14 rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 
                                active:scale-[0.98] transition-all hover:brightness-110
                            `}
                        >
                            {currentSlide === SLIDES.length - 1 ? '시작하기' : '다음으로'}
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
