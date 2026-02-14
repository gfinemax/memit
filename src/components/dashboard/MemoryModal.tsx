import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Trash2, Brain, Zap, Image as ImageIcon, Star } from 'lucide-react';
import { UserMemory } from '@/lib/memory-service';

interface MemoryModalProps {
    memory: UserMemory | null;
    isOpen: boolean;
    onClose: () => void;
    onDelete?: (id: string) => void;
    onToggleFavorite?: (id: string, current: boolean) => void;
}

export default function MemoryModal({ memory, isOpen, onClose, onDelete, onToggleFavorite }: MemoryModalProps) {
    const [imageError, setImageError] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            setImageError(false);
        }
    }, [isOpen, memory?.image_url]);

    if (!memory || !mounted) return null;

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 md:p-10">
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
                        className="relative w-full max-w-2xl bg-[#0f111a] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-all z-50 shadow-lg border border-white/10"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Favorite Button */}
                        <button
                            onClick={() => memory?.id && onToggleFavorite?.(memory.id, memory.isFavorite || false)}
                            className={`absolute top-4 right-16 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all z-50 shadow-lg border ${memory.isFavorite
                                ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400'
                                : 'bg-black/40 border-white/10 text-white/60 hover:text-white'
                                }`}
                        >
                            <Star className={`w-5 h-5 ${memory.isFavorite ? 'fill-current' : ''}`} />
                        </button>

                        <div className="overflow-y-auto custom-scrollbar flex-1">
                            {/* Header Image or Placeholder */}
                            <div className="relative w-full bg-[#161826] flex items-center justify-center overflow-hidden border-b border-slate-800/50 min-h-[300px]">
                                {memory.image_url && !imageError ? (
                                    <img
                                        src={memory.image_url}
                                        alt="Mnemonic Visual"
                                        onError={() => setImageError(true)}
                                        className="w-full h-auto max-h-[60vh] object-contain shadow-2xl"
                                    />
                                ) : (
                                    <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center text-slate-700 bg-gradient-to-b from-slate-900 to-slate-950 px-10 text-center">
                                        <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
                                        <p className="text-sm opacity-40">이미지를 불러올 수 없거나 생성되지 않았습니다</p>
                                    </div>
                                )}
                            </div>

                            {/* Content Body */}
                            <div className="p-6 md:p-10 flex flex-col items-center">
                                <div className="flex flex-col items-center gap-4 mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="px-5 py-2 rounded-2xl bg-primary/20 text-primary text-2xl font-bold tracking-[0.2em] shadow-lg shadow-primary/5">
                                            {memory.input_number}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold mb-1">기억 태그</span>
                                        <span className="text-xs text-slate-400 flex items-center gap-1.5 opacity-60">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {memory.created_at ? new Date(memory.created_at).toLocaleDateString() : 'N/A'}
                                            <span className="mx-2 text-slate-700">•</span>
                                            <span className="px-2 py-0.5 rounded bg-slate-800/50 text-[10px] uppercase font-bold text-slate-500">
                                                {memory.strategy}
                                            </span>
                                        </span>
                                    </div>
                                </div>

                                {/* Keywords */}
                                <div className="flex flex-wrap justify-center gap-2 mb-10 max-w-md">
                                    {memory.keywords.map((word, i) => (
                                        <div key={i} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800/40 border border-slate-700/30 text-slate-200 text-sm font-medium shadow-sm">
                                            <Zap className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                                            {word}
                                        </div>
                                    ))}
                                </div>

                                {/* Story Section */}
                                <div className="w-full space-y-3 bg-white/[0.03] border border-white/[0.05] rounded-3xl p-8 md:p-10 relative overflow-hidden group">
                                    <Brain className="absolute -top-6 -right-6 w-32 h-32 text-white/[0.02] group-hover:text-white/[0.04] transition-colors" />
                                    <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.4em] mb-4 text-center">MEMORY STORY</h4>
                                    <p className="text-xl md:text-2xl text-slate-200 leading-relaxed font-medium text-center balance-text">
                                        {memory.story.split(/(\*\*.*?\*\*)/).map((part, i) =>
                                            part.startsWith('**') ? (
                                                <span key={i} className="text-primary font-bold">{part.replace(/\*\*/g, '')}</span>
                                            ) : part
                                        )}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="w-full flex items-center justify-between mt-10 pt-8 border-t border-slate-800/50">
                                    <button
                                        onClick={() => memory?.id && onDelete?.(memory.id)}
                                        className="flex items-center gap-2 text-xs text-slate-500 hover:text-red-400 transition-colors group"
                                    >
                                        <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                        <span className="opacity-60 group-hover:opacity-100">저장함에서 삭제</span>
                                    </button>

                                    <button
                                        onClick={onClose}
                                        className="px-8 py-3 rounded-2xl bg-slate-100 text-slate-900 font-bold text-sm hover:bg-white active:scale-95 transition-all shadow-xl shadow-white/5"
                                    >
                                        확인
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
}
