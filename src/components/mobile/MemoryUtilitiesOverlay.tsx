'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, BarChart3, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface MemoryUtilitiesOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'quiz' | 'report';
    title: string;
    loading: boolean;
    content: string | null;
    error: string | null;
}

export default function MemoryUtilitiesOverlay({
    isOpen,
    onClose,
    type,
    title,
    loading,
    content,
    error
}: MemoryUtilitiesOverlayProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[130]"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="fixed inset-x-6 top-[15%] bottom-[15%] bg-white dark:bg-slate-900 rounded-[2rem] z-[140] overflow-hidden flex flex-col shadow-2xl border border-slate-100 dark:border-white/10"
                    >
                        <div className="p-6 flex items-center justify-between border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                {type === 'quiz' ? <Brain className="w-5 h-5 text-emerald-500" /> : <BarChart3 className="w-5 h-5 text-blue-500" />}
                                {title}
                            </h2>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center min-h-0">
                            {loading ? (
                                <div className="text-center space-y-4">
                                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
                                    <p className="text-slate-500 dark:text-slate-400 font-medium whitespace-pre-wrap">
                                        {type === 'quiz' ? "AI가 나의 기억들을 복습하며\n적절한 퀴즈를 생성하고 있습니다..." : "최근 저장된 데이터들을 분석하여\n요약 리포트를 작성 중입니다..."}
                                    </p>
                                </div>
                            ) : error ? (
                                <div className="text-center space-y-4 bg-rose-50 dark:bg-rose-900/20 p-6 rounded-3xl border border-rose-100 dark:border-rose-900/30">
                                    <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
                                    <p className="text-rose-600 dark:text-rose-400 font-medium">오류가 발생했습니다.</p>
                                    <p className="text-sm text-rose-500/80">{error}</p>
                                </div>
                            ) : content ? (
                                <div className="w-full h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="prose prose-slate dark:prose-invert max-w-none">
                                        <div className="bg-slate-50 dark:bg-white/5 rounded-3xl p-6 border border-slate-100 dark:border-white/5">
                                            {content.split('\n').map((line, i) => (
                                                <p key={i} className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed last:mb-0">
                                                    {line}
                                                </p>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-8 flex justify-center">
                                        <button
                                            onClick={onClose}
                                            className="bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary/30 active:scale-95 transition-all"
                                        >
                                            확인 완료
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center space-y-4">
                                    <CheckCircle2 className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
                                    <p className="text-slate-500 dark:text-slate-500">데이터가 부족하거나 분석할 내용이 없습니다.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
