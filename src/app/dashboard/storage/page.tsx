'use client';

import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    LayoutGrid,
    List,
    Search as SearchIcon,
    Lock,
    Handshake,
    GraduationCap,
    Mic,
    ShoppingCart,
    Brain,
    Grid3X3,
    Calendar,
    Image as ImageIcon,
    Play,
    Trash2,
    Clock,
    Tag,
    Star,
    Download,
    LucideIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMemoriesAction, deleteMemoryAction, toggleFavoriteAction } from '@/app/actions';
import { UserMemory } from '@/lib/memory-service';
import MemoryModal from '@/components/dashboard/MemoryModal';

const CATEGORIES: { id: string; label: string; icon: LucideIcon; color: string }[] = [
    { id: 'all', label: '전체', icon: LayoutGrid, color: 'text-white' },
    { id: 'favorite', label: '즐겨찾기', icon: Star, color: 'text-yellow-400' },
    { id: 'security', label: '보안 & 금융', icon: Lock, color: 'text-blue-400' },
    { id: 'networking', label: '인맥 & 비즈니스', icon: Handshake, color: 'text-emerald-400' },
    { id: 'learning', label: '학습 & 지식', icon: GraduationCap, color: 'text-purple-400' },
    { id: 'speech', label: '발표 & 스피치', icon: Mic, color: 'text-orange-400' },
    { id: 'daily', label: '일상 & 생활', icon: ShoppingCart, color: 'text-pink-400' },
    { id: 'training', label: '두뇌 트레이닝', icon: Brain, color: 'text-yellow-400' },
    { id: 'general', label: '기타', icon: Tag, color: 'text-slate-400' },
];

export default function StoragePage() {
    const [memories, setMemories] = useState<UserMemory[]>([]);
    const [filteredMemories, setFilteredMemories] = useState<UserMemory[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedMemory, setSelectedMemory] = useState<UserMemory | null>(null);
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

    const fetchMemories = async () => {
        setLoading(true);
        const res = await getMemoriesAction();
        if (res.success && res.data) {
            setMemories(res.data);
            setFilteredMemories(res.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMemories();
    }, []);

    useEffect(() => {
        let result = memories;

        // Apply Category Filter
        if (activeCategory === 'favorite') {
            result = result.filter(m => m.isFavorite);
        } else if (activeCategory !== 'all') {
            result = result.filter(m => m.category === activeCategory);
        }

        // Apply Search Filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(m =>
                m.input_number.includes(query) ||
                m.keywords.some(k => k.toLowerCase().includes(query)) ||
                m.story.toLowerCase().includes(query) ||
                (m.context && m.context.toLowerCase().includes(query))
            );
        }

        setFilteredMemories(result);
    }, [activeCategory, searchQuery, memories]);

    const handleDelete = async (id: string) => {
        if (!confirm("이 기억을 보관함에서 영구히 삭제하시겠습니까?")) return;

        const res = await deleteMemoryAction(id);
        if (res.success) {
            setSelectedMemory(null);
            fetchMemories();
        } else {
            alert(res.error || "삭제에 실패했습니다.");
        }
    };

    const handleExportData = () => {
        try {
            const exportData = JSON.stringify(memories, null, 2);
            const blob = new Blob([exportData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `memit_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Export failed:", error);
            alert("데이터 내보내기에 실패했습니다.");
        }
    };

    const handleToggleFavorite = async (id: string, currentStatus: boolean) => {
        const nextStatus = !currentStatus;

        // Optimistic Update
        setMemories(prev => prev.map(m => m.id === id ? { ...m, isFavorite: nextStatus } : m));

        const res = await toggleFavoriteAction(id, nextStatus);
        if (!res.success) {
            alert(res.error || "실패했습니다.");
            // Rollback
            setMemories(prev => prev.map(m => m.id === id ? { ...m, isFavorite: currentStatus } : m));
        }
    };

    return (
        <div className="p-6 lg:p-10 max-w-[1600px] mx-auto min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-white font-display mb-2">내 기억 저장소</h1>
                    <p className="text-slate-400">당신이 수집한 소중한 기억들의 컬렉션입니다.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-slate-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="숫자나 키워드로 찾기..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-slate-900/50 border border-slate-800 focus:border-primary/50 text-white rounded-2xl py-3 pl-12 pr-6 w-full md:w-72 lg:w-96 transition-all outline-none focus:ring-4 focus:ring-primary/10"
                        />
                    </div>

                    <div className="hidden sm:flex bg-slate-900/50 border border-slate-800 rounded-2xl p-1">
                        <button
                            onClick={handleExportData}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-700 transition-all text-sm font-medium"
                            title="데이터 내보내기 (JSON)"
                        >
                            <Download className="w-4 h-4" />
                            <span>내보내기</span>
                        </button>
                        <div className="w-px h-6 bg-slate-800 mx-2"></div>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <Grid3X3 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Category Bar */}
            <div className="mb-10">
                <div className="flex flex-wrap items-center gap-3">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl border transition-all duration-300 whitespace-nowrap ${activeCategory === cat.id
                                ? 'bg-primary/20 border-primary/40 text-white shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                                : 'bg-slate-900/20 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                                }`}
                        >
                            <cat.icon className={`w-4 h-4 ${activeCategory === cat.id ? cat.color : 'text-slate-600'}`} />
                            <span className="font-semibold text-sm">{cat.label}</span>
                            {activeCategory === cat.id && (
                                <span className="ml-1 bg-primary/30 py-0.5 px-2 rounded-full text-[10px] font-bold">
                                    {filteredMemories.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="aspect-[4/3] bg-slate-900/40 animate-pulse rounded-3xl border border-slate-800"></div>
                    ))}
                </div>
            ) : filteredMemories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-40 bg-slate-900/20 rounded-[40px] border border-dashed border-slate-800">
                    <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                        <SearchIcon className="w-10 h-10 text-slate-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">저장된 기억이 없습니다</h3>
                    <p className="text-slate-500">검색어를 변경하거나 다른 카테고리를 선택해 보세요.</p>
                </div>
            ) : (
                <motion.div
                    layout
                    className={viewMode === 'grid'
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        : "space-y-4 max-w-5xl mx-auto"
                    }
                >
                    <AnimatePresence mode="popLayout">
                        {filteredMemories.map((memory) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={memory.id}
                                onClick={() => setSelectedMemory(memory)}
                                className={`group relative bg-[#1c1b2e] border border-slate-800 rounded-[30px] overflow-hidden hover:border-primary/50 transition-all duration-500 cursor-pointer ${viewMode === 'list' ? 'flex items-center p-4' : ''
                                    }`}
                            >
                                {/* Image Overlay/Preview */}
                                {viewMode === 'grid' && (
                                    <div className="aspect-[16/10] relative overflow-hidden bg-slate-950">
                                        {memory.image_url && !imageErrors[memory.id!] ? (
                                            <img
                                                src={memory.image_url}
                                                alt={memory.input_number}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                onError={() => {
                                                    setImageErrors(prev => ({ ...prev, [memory.id!]: true }));
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-900/50">
                                                <ImageIcon className="w-10 h-10 text-slate-800" />
                                            </div>
                                        )}
                                        {/* Input Number - The Protagonist */}
                                        <div className="absolute top-4 left-4 z-20">
                                            <div className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-lg border border-white/20 shadow-xl group/num">
                                                <span className="text-2xl font-black text-white tracking-wider drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                                                    {memory.input_number}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Favorite Toggle */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleFavorite(memory.id!, memory.isFavorite || false);
                                            }}
                                            className={`absolute top-4 right-14 z-20 w-8 h-8 rounded-full backdrop-blur-md border flex items-center justify-center transition-all ${memory.isFavorite
                                                ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400'
                                                : 'bg-black/60 border-white/10 text-slate-500 hover:text-white'
                                                }`}
                                        >
                                            <Star className={`w-4 h-4 ${memory.isFavorite ? 'fill-current' : ''}`} />
                                        </button>

                                        {/* Category Pin */}
                                        <div
                                            className="absolute top-4 right-4 z-10"
                                            title={(() => {
                                                const cat = CATEGORIES.find(c => c.id === memory.category);
                                                return cat?.label || '기타';
                                            })()}
                                        >
                                            <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center">
                                                {(() => {
                                                    const cat = CATEGORIES.find(c => c.id === memory.category);
                                                    const Icon = cat?.icon || Tag;
                                                    return <Icon className={`w-4 h-4 ${cat?.color || 'text-slate-400'}`} />;
                                                })()}
                                            </div>
                                        </div>

                                        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1b2e] via-transparent to-transparent opacity-60"></div>
                                    </div>
                                )}

                                {/* Card Body */}
                                <div className={`p-6 ${viewMode === 'list' ? 'flex-1 ml-4 p-0' : ''}`}>
                                    {viewMode === 'list' && (
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-bold tracking-widest">
                                                {memory.input_number}
                                            </div>
                                            {(() => {
                                                const cat = CATEGORIES.find(c => c.id === memory.category);
                                                return <span className={`text-[10px] font-bold uppercase tracking-wider ${cat?.color || 'text-slate-500'}`}>{cat?.label || '기타'}</span>;
                                            })()}
                                        </div>
                                    )}

                                    {viewMode === 'grid' ? (
                                        <>
                                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-1">
                                                {memory.keywords.join(' · ')}
                                            </h3>
                                            <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-6 h-10">
                                                {memory.story}
                                            </p>

                                            <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                                                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium whitespace-nowrap overflow-hidden">
                                                    <span className="flex items-center gap-1 shrink-0">
                                                        <Clock className="w-3 h-3" />
                                                        {memory.created_at ? new Date(memory.created_at).toLocaleDateString() : 'N/A'}
                                                    </span>
                                                    <span className="px-1.5 py-0.5 rounded-md bg-slate-900 border border-slate-800/80 text-[8px] uppercase tracking-tighter shrink-0">
                                                        {memory.strategy}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 shrink-0">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(memory.id!);
                                                        }}
                                                        className="p-2 rounded-xl bg-red-500/10 text-red-500/0 group-hover:text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                                        title="삭제"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                                                {memory.keywords.join(' · ')}
                                            </h3>
                                            <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed mb-4">
                                                {memory.story}
                                            </p>

                                            <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                                                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium whitespace-nowrap overflow-hidden">
                                                    <span className="flex items-center gap-1 shrink-0">
                                                        <Clock className="w-3 h-3" />
                                                        {memory.created_at ? new Date(memory.created_at).toLocaleDateString() : 'N/A'}
                                                    </span>
                                                    <span className="px-1.5 py-0.5 rounded-md bg-slate-900 border border-slate-800/80 text-[8px] uppercase tracking-tighter shrink-0">
                                                        {memory.strategy}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 shrink-0">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(memory.id!);
                                                        }}
                                                        className="p-2 rounded-xl bg-red-500/10 text-red-500/0 group-hover:text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                                        title="삭제"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Memory Detail Modal */}
            <MemoryModal
                memory={selectedMemory}
                isOpen={!!selectedMemory}
                onClose={() => setSelectedMemory(null)}
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
            />
        </div>
    );
}
