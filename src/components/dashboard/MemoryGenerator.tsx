'use client';

import React, { useState } from 'react';
import { Sparkles, Brain, X, Share2, Sliders, ArrowRight, ShieldCheck, Tag, Copy, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemoryGenerator } from '@/hooks/useMemoryGenerator';
import { usePasswordGenerator } from '@/hooks/usePasswordGenerator';
import { MemoryTab } from './tabs/MemoryTab';
import { PasswordTab } from './tabs/PasswordTab';
import { generateShareCardCanvas, ShareKeywordItem } from '@/lib/share-card-utils';
import { createPortal } from 'react-dom';

export default function MemoryGenerator({ onMemorySaved, category = 'general' }: { onMemorySaved?: () => void, category?: string }) {
    const [activeTab, setActiveTab] = useState<'memory' | 'password'>('memory');

    // Memory Hook Initialization
    const memoryProps = useMemoryGenerator({ onMemorySaved, category, activeTab });

    // Password Hook Initialization (Needs Memory's handleConvert callback)
    const passwordProps = usePasswordGenerator(memoryProps.pinLength, memoryProps.handleConvert);

    return (
        <section className="relative bg-white/5 dark:bg-slate-900/40 backdrop-blur-[30px] p-8 rounded-[2.5rem] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.2)] group h-full flex flex-col justify-center transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-[#8B5CF6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* Glowing orb effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#8B5CF6]/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

            <div className="flex-1 flex flex-col justify-center">
                <div className="bg-slate-800/50 p-1 rounded-xl flex self-start backdrop-blur-md border border-slate-700/50 mb-6 relative z-20 shadow-lg">
                    <button
                        onClick={() => setActiveTab('memory')}
                        className={`px-4 xl:px-8 py-2.5 rounded-lg text-sm font-black transition-all flex items-center gap-2 ${activeTab === 'memory' ? 'bg-white text-slate-900 shadow-md scale-100' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Brain className="w-4 h-4" /> <span>숫자 암기</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('password')}
                        className={`px-4 xl:px-8 py-2.5 rounded-lg text-sm font-black transition-all flex items-center gap-2 ${activeTab === 'password' ? 'bg-gradient-to-r from-primary to-[#8B5CF6] text-white shadow-md scale-100' : 'text-slate-400 hover:text-white'}`}
                    >
                        <ShieldCheck className="w-4 h-4" /> <span>비밀번호 생성</span>
                    </button>
                </div>

                <div className="relative z-10 flex-1">
                    <AnimatePresence mode="wait">
                        {activeTab === 'memory' ? (
                            <motion.div key="memory" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                <MemoryTab memoryProps={memoryProps} />
                            </motion.div>
                        ) : (
                            <motion.div key="password" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <PasswordTab passwordProps={passwordProps} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Share Context Menu / Portal Renderings code from previous MemoryGenerator can go here or in a separate ShareModal component. For now, incorporating directly: */}
            {memoryProps.isOptionsOpen && (
                <div
                    className="absolute top-12 right-2 bg-slate-900 border border-slate-700 rounded-lg p-2 shadow-xl z-50 flex flex-col gap-2 min-w-[250px]"
                >
                    <div className="text-xs font-bold text-slate-400 mb-1 px-2">이미지 저장 옵션 (공유카드)</div>

                    <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-800 rounded cursor-pointer transition-colors">
                        <input
                            type="checkbox"
                            checked={memoryProps.sharePrefix010}
                            onChange={(e) => memoryProps.setSharePrefix010(e.target.checked)}
                            className="accent-primary"
                        />
                        <span className="text-sm text-slate-300">010 접두사 포함</span>
                    </label>

                    <div className="px-2 py-1">
                        <span className="text-xs text-slate-500 mb-1 block">강조 라벨 (예: 현관 비밀번호)</span>
                        <input
                            type="text"
                            value={memoryProps.shareLabel}
                            onChange={(e) => memoryProps.setShareLabel(e.target.value)}
                            placeholder="없음"
                            className="w-full bg-slate-800 border-slate-700 text-sm py-1 px-2 rounded focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>
            )}

            {memoryProps.previewUrl && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl max-w-lg w-full relative"
                    >
                        <button
                            onClick={() => memoryProps.setPreviewUrl(null)}
                            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>

                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Share2 className="w-5 h-5 text-primary" /> 공유용 카드
                        </h3>

                        <div className="rounded-xl overflow-hidden border border-white/10 relative">
                            <img src={memoryProps.previewUrl} alt="Share Card Preview" className="w-full h-auto" />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-4 opacity-0 hover:opacity-100 transition-opacity">
                                <span className="text-white text-sm font-medium">우클릭하여 이미지 저장 가능</span>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => memoryProps.setPreviewUrl(null)}
                                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors border border-slate-700"
                            >
                                닫기
                            </button>
                            <button
                                onClick={() => {
                                    const a = document.createElement('a');
                                    a.href = memoryProps.previewUrl!;
                                    a.download = `memit-card-${Date.now()}.png`;
                                    a.click();
                                    memoryProps.setPreviewUrl(null);
                                }}
                                className="flex-1 py-3 bg-primary hover:bg-primary-light text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/30"
                            >
                                저장하기
                            </button>
                        </div>
                    </motion.div>
                </div>,
                document.body
            )}
        </section>
    );
}
