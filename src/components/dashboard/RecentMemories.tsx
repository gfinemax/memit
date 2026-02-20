import React, { useState, useEffect } from 'react';
import { Play, FlaskConical, ShoppingCart, Brain, Calendar, Image as ImageIcon, Trash2, Pencil } from 'lucide-react';
import { deleteMemoryAction, getMemoriesAction, toggleFavoriteAction, updateMemoryLabelAction } from '@/app/actions_v2';
import { UserMemory } from '@/lib/memory-service';
import MemoryModal from './MemoryModal';
import Link from 'next/link';

export default function RecentMemories() {
    const [memories, setMemories] = useState<UserMemory[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMemory, setSelectedMemory] = useState<UserMemory | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editLabel, setEditLabel] = useState('');

    const fetchMemories = async () => {
        setLoading(true);
        const res = await getMemoriesAction();
        if (res.success && res.data) {
            setMemories(res.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMemories();
    }, []);

    const handleReview = (memory: UserMemory) => {
        setSelectedMemory(memory);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("이 기억을 보관함에서 삭제하시겠습니까?")) return;

        const res = await deleteMemoryAction(id);
        if (res.success) {
            setSelectedMemory(null);
            fetchMemories();
        } else {
            alert(res.error || "삭제에 실패했습니다.");
        }
    };

    const startEditLabel = (e: React.MouseEvent, memory: UserMemory) => {
        e.stopPropagation();
        setEditingId(memory.id!);
        setEditLabel(memory.label || '');
    };

    const handleLabelSave = async (id: string) => {
        setEditingId(null);
        await updateMemoryLabelAction(id, editLabel);
        setMemories(prev => prev.map(m => m.id === id ? { ...m, label: editLabel } : m));
    };

    if (loading && memories.length === 0) {
        return (
            <section className="animate-pulse">
                <h3 className="text-xl font-bold text-white mb-6 font-display">최근 기억</h3>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 bg-slate-800/50 rounded-2xl border border-slate-700/50"></div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white font-display">내 암기 보관함</h3>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">{memories.length}개의 기억</span>
                    {memories.length > 6 && (
                        <Link href="/memit/storage" className="text-xs text-primary font-semibold hover:underline">
                            전체보기 →
                        </Link>
                    )}
                </div>
            </div>

            {memories.length === 0 ? (
                <div className="bg-slate-900/40 border border-dashed border-slate-700 rounded-2xl p-8 text-center">
                    <Brain className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-sm text-slate-400">아직 저장된 기억이 없습니다.<br />숫자를 입력하고 컬렉션에 저장해 보세요!</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {memories.slice(0, 6).map((memory) => (
                        <div
                            key={memory.id}
                            onClick={() => handleReview(memory)}
                            className="bg-surface-dark border border-slate-800 rounded-2xl overflow-hidden hover:border-primary/50 transition-all group cursor-pointer relative"
                        >
                            {/* Image Thumbnail */}
                            {memory.image_url ? (
                                <>
                                    {/* Image Area */}
                                    <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                                        <img
                                            src={memory.image_url}
                                            alt={memory.keywords.join(', ')}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                        {/* Hover: Review Button */}
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleReview(memory); }}
                                                className="px-2 py-1 rounded-lg bg-primary/80 backdrop-blur-sm text-white text-[10px] font-bold flex items-center gap-1"
                                            >
                                                <Play className="w-2.5 h-2.5" /> 복습하기
                                            </button>
                                        </div>
                                    </div>
                                    {/* Text Area */}
                                    <div className="p-3 bg-slate-900/80 text-center">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <span className="text-[12px] font-bold text-white tracking-wider">
                                                {memory.input_number}
                                            </span>
                                            {editingId === memory.id ? (
                                                <input
                                                    type="text"
                                                    value={editLabel}
                                                    onChange={(e) => setEditLabel(e.target.value)}
                                                    onBlur={() => handleLabelSave(memory.id!)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') handleLabelSave(memory.id!); }}
                                                    onClick={(e) => e.stopPropagation()}
                                                    autoFocus
                                                    placeholder="예: 아버지"
                                                    className="text-[11px] text-slate-300 bg-slate-800 border border-slate-600 rounded px-1.5 py-0.5 w-16 outline-none focus:border-primary"
                                                />
                                            ) : (
                                                <button
                                                    onClick={(e) => startEditLabel(e, memory)}
                                                    className="flex items-center gap-0.5 text-[11px] text-slate-400 hover:text-primary transition-colors"
                                                    title="라벨 편집"
                                                >
                                                    {memory.label ? (
                                                        <span>({memory.label})</span>
                                                    ) : (
                                                        <Pencil className="w-2.5 h-2.5" />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-300 leading-snug">
                                            {memory.keywords.join(' · ')}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                /* Text Fallback (no image) */
                                <div className="p-4 flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="px-2 py-0.5 rounded bg-primary/20 text-white text-[12px] font-bold tracking-widest border border-primary/30">
                                                {memory.input_number}
                                            </div>
                                            <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {memory.created_at ? new Date(memory.created_at).toLocaleDateString() : ''}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h5 className="text-sm font-semibold text-slate-200 truncate">
                                            {memory.keywords.join(' · ')}
                                        </h5>
                                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                                            {memory.story}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/50">
                                        <span className="text-[9px] text-slate-500 uppercase tracking-tighter">{memory.strategy}</span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleReview(memory); }}
                                            className="text-[10px] text-primary font-bold flex items-center gap-1 hover:underline"
                                        >
                                            <Play className="w-2.5 h-2.5" /> 복습하기
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <MemoryModal
                memory={selectedMemory}
                isOpen={!!selectedMemory}
                onClose={() => setSelectedMemory(null)}
                onDelete={handleDelete}
            />
        </section>
    );
}
