'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, Map, Hash, GraduationCap, ChevronRight } from 'lucide-react';

interface Tip {
    id: number;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}

const tips: Tip[] = [
    {
        id: 1,
        title: "장소법 (Loci System)",
        description: "익숙한 장소(우리 집, 학교 등)를 상상하고, 기억할 물건들을 그 장소 곳곳에 배치해보세요. 나중에 그 장소를 걷는 상상을 하면 물건들이 떠오릅니다.",
        icon: <Map className="w-6 h-6" />,
        color: "bg-blue-500"
    },
    {
        id: 2,
        title: "이미지 결합법",
        description: "두 가지 이상의 정보를 아주 우스꽝스럽거나 비상식적인 이미지로 합쳐보세요. 뇌는 평범한 것보다 이상한 이미지(예: 피자를 입은 코끼리)를 훨씬 더 잘 기억합니다.",
        icon: <Lightbulb className="w-6 h-6" />,
        color: "bg-amber-500"
    },
    {
        id: 3,
        title: "숫자-문자 치환법",
        description: "숫자를 비슷한 모양이나 소리의 글자로 바꿔보세요. 예를 들어 숫자 '1'은 '기둥'으로, '8'은 '눈사람'으로 기억하면 숫자 나열이 하나의 이야기가 됩니다.",
        icon: <Hash className="w-6 h-6" />,
        color: "bg-emerald-500"
    },
    {
        id: 4,
        title: "청킹 (Chunking)",
        description: "긴 정보를 의미 있는 작은 덩어리로 나누세요. 01012345678보다는 010-1234-5678이 훨씬 외우기 쉬운 것과 같은 원리입니다.",
        icon: <GraduationCap className="w-6 h-6" />,
        color: "bg-purple-500"
    }
];

interface MnemonicTipsOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MnemonicTipsOverlay({ isOpen, onClose }: MnemonicTipsOverlayProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[110]"
                    />
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-slate-50 dark:bg-slate-900 rounded-t-[2.5rem] z-[120] overflow-hidden flex flex-col"
                    >
                        <div className="p-6 flex items-center justify-between border-b border-slate-200 dark:border-white/5">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-amber-500" />
                                기억의 궁전 비법 노트
                            </h2>
                            <button onClick={onClose} className="p-2 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-20">
                            {tips.map((tip) => (
                                <motion.div
                                    key={tip.id}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-3xl p-5 shadow-sm"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-2xl ${tip.color} flex items-center justify-center text-white shrink-0 shadow-lg`}>
                                            {tip.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">{tip.title}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">
                                                "{tip.description}"
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 text-center">
                                <p className="text-sm font-medium text-primary mb-2">더 많은 암기 기술이 준비 중입니다!</p>
                                <span className="text-xs text-slate-400">메밋과 함께 나만의 기억의 궁전을 지어보세요.</span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
