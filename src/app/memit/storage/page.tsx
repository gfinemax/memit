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
    LucideIcon,
    ShieldAlert,
    ChevronRight,
    ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMemoriesAction, deleteMemoryAction, toggleFavoriteAction, updateMemoryLabelAction } from '@/app/actions_v2';
import { UserMemory } from '@/lib/memory-service';
// import { NativeBiometric } from '@capgo/capacitor-native-biometric';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MemoryModal from '@/components/dashboard/MemoryModal';
import StoryText from '@/components/ui/StoryText';

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
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedMemory, setSelectedMemory] = useState<UserMemory | null>(null);
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

    const { data: memories = [], isLoading: loading } = useQuery({
        queryKey: ['memories'],
        queryFn: async () => {
            const res = await getMemoriesAction();
            if (res.success && res.data) return res.data;
            return [] as UserMemory[];
        },
    });

    const [filteredMemories, setFilteredMemories] = useState<UserMemory[]>([]);

    useEffect(() => {
        let result = memories;

        // Apply Category Filter
        if (activeCategory === 'favorite') {
            result = result.filter((m: UserMemory) => m.isFavorite);
        } else if (activeCategory !== 'all') {
            result = result.filter((m: UserMemory) => m.category === activeCategory);
        }

        // Apply Search Filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter((m: UserMemory) =>
                m.input_number.includes(query) ||
                m.keywords.some((k: string) => k.toLowerCase().includes(query)) ||
                m.story.toLowerCase().includes(query) ||
                (m.context && m.context.toLowerCase().includes(query))
            );
        }

        setFilteredMemories(result);
    }, [activeCategory, searchQuery, memories]);

    const deleteMutation = useMutation({
        mutationFn: deleteMemoryAction,
        onSuccess: (res: any) => {
            if (res.success) {
                queryClient.invalidateQueries({ queryKey: ['memories'] });
                setSelectedMemory(null);
            } else {
                alert(res.error || "삭제에 실패했습니다.");
            }
        }
    });

    const handleDelete = async (id: string) => {
        if (!confirm("이 기억을 보관함에서 영구히 삭제하시겠습니까?")) return;
        deleteMutation.mutate(id);
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

    const favoriteMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: boolean }) => toggleFavoriteAction(id, status),
        onMutate: async ({ id, status }: { id: string; status: boolean }) => {
            await queryClient.cancelQueries({ queryKey: ['memories'] });
            const previousMemories = queryClient.getQueryData(['memories']);
            queryClient.setQueryData(['memories'], (old: UserMemory[] | undefined) =>
                old?.map(m => m.id === id ? { ...m, isFavorite: status } : m)
            );
            return { previousMemories };
        },
        onError: (err, variables, context) => {
            if (context?.previousMemories) {
                queryClient.setQueryData(['memories'], context.previousMemories);
            }
            alert("실패했습니다.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['memories'] });
        },
    });

    const handleToggleFavorite = async (id: string, currentStatus: boolean) => {
        favoriteMutation.mutate({ id, status: !currentStatus });
    };

    const handleCategoryClick = async (categoryId: string) => {
        const isBiometricEnabled = localStorage.getItem('biometric_enabled') === 'true';

        if (categoryId === 'security' && isBiometricEnabled) {
            try {
                const { NativeBiometric } = await import('@capgo/capacitor-native-biometric');
                const check = await NativeBiometric.isAvailable();
                if (check.isAvailable) {
                    await NativeBiometric.verifyIdentity({
                        reason: "보안 항목에 접근하기 위해 인증이 필요합니다.",
                        title: "보안 인증",
                        subtitle: "생체 인식을 사용하여 잠금을 해제합니다.",
                        description: "보관된 민감한 정보를 확인합니다.",
                        negativeButtonText: "취소",
                    });
                }
                setActiveCategory(categoryId);
            } catch (e) {
                console.error('Biometric verification failed', e);
            }
        } else {
            setActiveCategory(categoryId);
        }
    };

    return (
        <div className="px-5 pt-0 pb-6 lg:p-10 max-w-[1600px] mx-auto min-h-screen">
            {/* Combined Floating Filter Capsule (Concept 3 Style) */}
            <div className="sticky top-0 z-30 -mx-5 px-5 py-3 mb-6 bg-gradient-to-b from-slate-950 via-slate-950/80 to-transparent pointer-events-none">
                <div className="pointer-events-auto space-y-3">
                    {/* Header: Title & Search */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <motion.h1
                                initial={{ opacity: 0, x: -15 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-2xl font-bold italic tracking-tight flex items-center gap-2"
                                style={{ fontFamily: 'Pretendard Variable, Pretendard, sans-serif' }}
                            >
                                <span className="text-white">내 기억</span>
                                <span className="text-primary">저장소<span className="animate-pulse">_</span></span>
                            </motion.h1>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleExportData}
                                    className="p-2.5 rounded-full bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white transition-all backdrop-blur-md"
                                    title="데이터 내보내기"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                                <div className="flex bg-slate-900/60 border border-slate-800 rounded-full p-1 backdrop-blur-md">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-1.5 rounded-full transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-lg' : 'text-slate-500'}`}
                                    >
                                        <Grid3X3 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-1.5 rounded-full transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-lg' : 'text-slate-500'}`}
                                    >
                                        <List className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Search Bar (Floating Style) */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Search className="w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="숫자나 키워드로 찾기..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 focus:border-primary/40 focus:bg-white/10 text-white rounded-2xl py-3 pl-11 pr-5 backdrop-blur-xl transition-all outline-none text-sm placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    {/* Category Filter Pills (Floating Scrollable) */}
                    <div className="overflow-x-auto no-scrollbar -mx-5 px-5">
                        <div className="flex items-center gap-2 py-1 min-w-max">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryClick(cat.id)}
                                    className={`
                                        flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 whitespace-nowrap text-xs font-bold
                                        ${activeCategory === cat.id
                                            ? 'bg-primary border-primary text-white shadow-[0_5px_15px_rgba(79,70,229,0.3)] scale-105 z-10'
                                            : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                                        }
                                    `}
                                >
                                    <cat.icon className={`w-3.5 h-3.5 ${activeCategory === cat.id ? 'text-white' : cat.color}`} />
                                    <span>{cat.label}</span>
                                    {activeCategory === cat.id && (
                                        <span className="ml-1 bg-white/20 py-0.5 px-1.5 rounded-full text-[9px]">
                                            {filteredMemories.length}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Security Notice Banner - Appears when security category is active */}
            <AnimatePresence>
                {activeCategory === 'security' && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -20, height: 0 }}
                        className="mb-10 overflow-hidden"
                    >
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-[2.5rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-3xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                    <ShieldAlert className="w-7 h-7 text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white mb-1">개인 보안 및 금융 정보 관리 안내</h4>
                                    <p className="text-sm text-blue-200/70 leading-relaxed">
                                        보안이 중요한 암호나 금융 관련 기억은 서비스 내 보관보다,<br className="hidden sm:block" />
                                        **개별적으로 안전하게 다운로드**하여 오프라인으로 관리하시는 것을 강력히 권장합니다.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleExportData}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95"
                            >
                                <Download className="w-4 h-4" />
                                지금 백업 파일 다운로드
                                <ArrowRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                                        {/* Input Number - The Protagonist (Premium Pill Style) */}
                                        <div className="absolute top-3 left-3 z-20">
                                            <div className="px-3 py-1 bg-black/50 backdrop-blur-xl rounded-full border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.15)] group/num transition-all group-hover:scale-105 group-hover:border-primary/50 group-hover:shadow-primary/20">
                                                <span className="text-xl font-black text-white tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
                                                    {memory.input_number}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Favorite Toggle (Concept 3 Floating) */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleFavorite(memory.id!, memory.isFavorite || false);
                                            }}
                                            className={`
                                                absolute top-3 left-3 z-30 w-9 h-9 rounded-full backdrop-blur-xl border flex items-center justify-center transition-all active:scale-90
                                                ${memory.isFavorite
                                                    ? 'bg-yellow-500/30 border-yellow-400/50 text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                                                    : 'bg-black/40 border-white/10 text-white/40 hover:text-white'
                                                }
                                            `}
                                        >
                                            <Star className={`w-4 h-4 ${memory.isFavorite ? 'fill-current' : ''}`} />
                                        </button>

                                        {/* Category Pin (Small Capsule) */}
                                        <div className="absolute top-3 right-3 z-30">
                                            <div className="px-2 py-1 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 flex items-center gap-1.5 shadow-xl">
                                                {(() => {
                                                    const cat = CATEGORIES.find(c => c.id === memory.category);
                                                    const Icon = cat?.icon || Tag;
                                                    return (
                                                        <>
                                                            <Icon className={`w-3 h-3 ${cat?.color || 'text-slate-400'}`} />
                                                            <span className="text-[9px] font-black text-white/70 uppercase tracking-tighter">
                                                                {cat?.label || 'ETC'}
                                                            </span>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </div>

                                        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1b2e] via-transparent to-transparent opacity-60"></div>
                                    </div>
                                )}

                                {/* Card Body (Updated Spacing & Protagonist Keywords) */}
                                <div className={`p-5 ${viewMode === 'list' ? 'flex-1 ml-4 p-0' : ''}`}>
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
                                            <h3 className="text-xl font-black text-white mb-2 group-hover:text-primary transition-colors line-clamp-1 tracking-tight">
                                                {memory.keywords.join(' · ')}
                                            </h3>
                                            <StoryText
                                                text={memory.story}
                                                className="text-slate-400 text-sm leading-snug line-clamp-2 mb-5 h-10 opacity-80 block"
                                            />

                                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold bg-white/5 px-2 py-1 rounded-lg">
                                                        <Clock className="w-3 h-3 text-primary opacity-70" />
                                                        {memory.created_at ? new Date(memory.created_at).toLocaleDateString() : 'N/A'}
                                                    </div>
                                                    <span className="px-2 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-tighter">
                                                        {memory.strategy}
                                                    </span>
                                                </div>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(memory.id!);
                                                    }}
                                                    className="p-2 rounded-xl bg-red-500/10 text-red-500/40 hover:text-white hover:bg-red-500 transition-all active:scale-95"
                                                    title="삭제"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                                                {memory.keywords.join(' · ')}
                                            </h3>
                                            <StoryText
                                                text={memory.story}
                                                className="text-sm text-slate-400 line-clamp-2 leading-relaxed mb-4 block"
                                            />

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
