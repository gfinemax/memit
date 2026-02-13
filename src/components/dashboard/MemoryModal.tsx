'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Trash2, Brain, Zap, Image as ImageIcon } from 'lucide-react';
import { UserMemory } from '@/lib/memory-service';

interface MemoryModalProps {
    memory: UserMemory | null;
    isOpen: boolean;
    onClose: () => void;
    onDelete?: (id: string) => void;
}

export default function MemoryModal({ memory, isOpen, onClose, onDelete }: MemoryModalProps) {
    if (!memory) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-[#0f111a] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
                    >
                        {/* Header Image or Placeholder */}
                        <div className="relative aspect-video bg-slate-900 overflow-hidden group">
                            {memory.image_url ? (
                                <img
                                    src={memory.image_url}
                                    alt="Mnemonic Visual"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 bg-gradient-to-b from-slate-900 to-slate-950">
                                    <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
                                    <p className="text-sm">생성된 이미지가 없습니다</p>
                                </div>
                            )}

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-all z-10"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content Body */}
                        <div className="p-6 md:p-8">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="px-4 py-1.5 rounded-full bg-primary/20 text-primary text-xl font-bold tracking-[0.2em]">
                                        {memory.input_number}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">기억 태그</span>
                                        <span className="text-xs text-slate-400 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {memory.created_at ? new Date(memory.created_at).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 rounded-md bg-slate-800 text-slate-400 text-[10px] uppercase font-bold tracking-tighter">
                                        {memory.strategy}
                                    </span>
                                </div>
                            </div>

                            {/* Keywords */}
                            <div className="flex flex-wrap gap-2 mb-8">
                                {memory.keywords.map((word, i) => (
                                    <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200 text-sm font-medium">
                                        <Zap className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                                        {word}
                                    </div>
                                ))}
                            </div>

                            {/* Story Section */}
                            <div className="space-y-3 bg-white/5 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                                <Brain className="absolute -top-4 -right-4 w-24 h-24 text-white/5" />
                                <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-2">기억 스토리</h4>
                                <p className="text-lg text-slate-200 leading-relaxed font-medium">
                                    {memory.story.split(/(\*\*.*?\*\*)/).map((part, i) =>
                                        part.startsWith('**') ? (
                                            <span key={i} className="text-primary font-bold">{part.replace(/\*\*/g, '')}</span>
                                        ) : part
                                    )}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
                                <button
                                    onClick={() => memory?.id && onDelete?.(memory.id)}
                                    className="flex items-center gap-2 text-xs text-slate-500 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    저장함에서 삭제
                                </button>

                                <button
                                    onClick={onClose}
                                    className="px-6 py-2.5 rounded-xl bg-slate-100 text-slate-900 font-bold text-sm hover:bg-white transition-all shadow-lg shadow-white/5"
                                >
                                    확인
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
