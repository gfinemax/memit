'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, Search, MoreHorizontal, Heart, MessageCircle, Bookmark, PlayCircle, Plus, Trophy, Castle, User, Download, ExternalLink, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { eventBus, APP_EVENTS } from '@/lib/events';
import { supabaseMemoryService } from '@/lib/supabase-memory-service';
import { UserMemory } from '@/lib/memory-service';

const TAGS = ['#전체', '#숫자', '#암기꿀팁', '#역사', '#영어단어', '#지리', '#시험대비'];

export default function CommunityPage() {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(true);
    const [scenarios, setScenarios] = useState<UserMemory[]>([]);
    const [loading, setLoading] = useState(true);
    const [importingId, setImportingId] = useState<string | null>(null);

    useEffect(() => {
        const handleVisibility = (visible: boolean) => {
            setIsVisible(visible);
        };

        eventBus.on(APP_EVENTS.SET_NAV_VISIBILITY, handleVisibility);

        fetchScenarios();

        return () => eventBus.off(APP_EVENTS.SET_NAV_VISIBILITY, handleVisibility);
    }, []);

    const fetchScenarios = async () => {
        setLoading(true);
        try {
            const data = await supabaseMemoryService.getCommunityScenarios();
            setScenarios(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async (id: string) => {
        setImportingId(id);
        try {
            const res = await supabaseMemoryService.importMemory(id);
            if (res.success) {
                alert("내 저장소에 성공적으로 가져왔습니다! 📥");
            } else {
                alert("가져오기 실패: " + res.error);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setImportingId(null);
        }
    };

    return (
        <>
            {/* ─── Desktop View ─── */}
            <div className="hidden md:block p-6 lg:p-10">
                <div className="max-w-4xl mx-auto">
                    {/* Page Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white font-display">MEMIT 명예의 전당</h1>
                            <p className="text-primary text-sm font-medium mt-1">기억의 가치를 나누는 곳</p>
                        </div>
                        <button
                            onClick={() => router.push('/memit')}
                            className="bg-primary hover:bg-primary/90 text-white rounded-xl px-5 py-3 shadow-lg shadow-primary/25 flex items-center gap-2 font-bold text-sm transition-all hover:scale-105"
                        >
                            <Plus className="w-5 h-5" />
                            내 시나리오 자랑하기
                        </button>
                    </div>

                    {/* Search + Tags */}
                    <div className="space-y-4 mb-8">
                        <div className="relative max-w-xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#1e1c30] border border-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-white"
                                placeholder="어떤 기억법을 찾고 계신가요?"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {TAGS.map((tag, i) => (
                                <button
                                    key={tag}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${i === 0
                                        ? 'bg-primary text-white shadow-sm shadow-primary/30'
                                        : 'bg-[#1e1c30] border border-slate-700 text-slate-300 hover:border-primary hover:text-primary'
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Feed */}
                    <div className="space-y-6">
                        {loading ? (
                            <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-500">
                                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                                <p>멋진 기억들을 불러오고 있습니다...</p>
                            </div>
                        ) : scenarios.length === 0 ? (
                            <div className="py-20 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                                <p>아직 공유된 기억이 없습니다.</p>
                                <p className="text-sm mt-2">당신의 첫 번째 기억을 공유해보세요!</p>
                            </div>
                        ) : (
                            scenarios.map((post) => (
                                <article
                                    key={post.id}
                                    className="bg-[#1e1c30] rounded-2xl p-6 border border-slate-800 hover:border-primary/30 transition-all group"
                                >
                                    {/* Author header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            {post.authorAvatar ? (
                                                <img alt={post.authorName} className="w-11 h-11 rounded-full border border-slate-700 object-cover" src={post.authorAvatar} />
                                            ) : (
                                                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold uppercase">
                                                    {post.authorName?.substring(0, 2) || 'M'}
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="text-sm font-bold text-white">{post.authorName || '익명의 메밋'}</h3>
                                                <p className="text-xs text-slate-500">{new Date(post.created_at!).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <button className="text-slate-500 hover:text-slate-300 transition-colors">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="w-2 h-2 rounded-full bg-primary" />
                                            <h2 className="text-xl font-bold text-white truncate max-w-md">{post.input_number}</h2>
                                        </div>
                                        <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">{post.story}</p>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {post.keywords.map(kw => (
                                                <span key={kw} className="px-2.5 py-1 bg-slate-800 text-xs text-slate-400 rounded-md font-medium">{kw}</span>
                                            ))}
                                            {post.category && (
                                                <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-md font-bold uppercase">{post.category}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Media */}
                                    {post.image_url && (
                                        <div className="w-full h-48 rounded-xl bg-gradient-to-r from-indigo-900/30 to-purple-900/30 mb-4 overflow-hidden relative group/media cursor-pointer">
                                            <img alt="Content" className="w-full h-full object-cover opacity-60 group-hover/media:scale-105 transition-transform duration-500" src={post.image_url} />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-black/70 transition-colors">
                                                    <PlayCircle className="w-5 h-5 text-primary" />
                                                    <span className="text-sm font-semibold text-white">시나리오 보기</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                                        <div className="flex gap-6">
                                            <button className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 group/btn transition-colors">
                                                <Heart className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                                                <span className="text-xs font-medium">좋아요</span>
                                            </button>
                                            <button
                                                onClick={() => handleImport(post.id!)}
                                                disabled={importingId === post.id}
                                                className="flex items-center gap-1.5 text-slate-400 hover:text-primary group/btn transition-colors disabled:opacity-50"
                                            >
                                                {importingId === post.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />}
                                                <span className="text-xs font-medium">내 저장소로 가져오기</span>
                                            </button>
                                        </div>
                                        <button className="text-slate-500 hover:text-primary transition-colors">
                                            <Bookmark className="w-5 h-5" />
                                        </button>
                                    </div>
                                </article>
                            )
                            ))}
                    </div>
                </div>
            </div>

            {/* ─── Mobile View ─── */}
            <div className="block md:hidden bg-background-dark min-h-screen flex flex-col relative overflow-hidden text-white pb-24">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-sm border-b border-slate-800">
                    <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
                        <button
                            onClick={() => router.back()}
                            className="p-2 -ml-2 rounded-full hover:bg-slate-800 text-slate-300 transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div className="text-center">
                            <h1 className="text-lg font-bold">MEMIT 명예의 전당</h1>
                        </div>
                        <button className="p-2 -mr-2 rounded-full hover:bg-slate-800 text-slate-300 transition-colors">
                            <Bell className="w-6 h-6" />
                        </button>
                    </div>
                </header>

                <div className="max-w-md mx-auto px-4 py-4 space-y-4 w-full">
                    <div className="text-center pb-2">
                        <p className="text-sm text-primary font-medium">기억의 가치를 나누는 곳</p>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-3 rounded-xl border-none ring-1 ring-slate-700 bg-[#1e1c30] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-sm"
                            placeholder="어떤 기억법을 찾고 계신가요?"
                        />
                    </div>

                    {/* Tags */}
                    <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
                        <button className="flex-none px-4 py-2 rounded-full bg-primary text-white text-sm font-medium shadow-sm shadow-primary/30">
                            #전체
                        </button>
                        {['#숫자', '#암기꿀팁', '#역사', '#영어단어'].map((tag) => (
                            <button key={tag} className="flex-none px-4 py-2 rounded-full bg-[#1e1c30] border border-slate-700 text-slate-300 text-sm font-medium hover:border-primary hover:text-primary transition-colors">
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Feed */}
                <main className="max-w-md mx-auto px-4 space-y-4 w-full flex-1">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-500">
                            <Loader2 className="w-10 h-10 animate-spin text-primary" />
                            <p className="text-sm">기억들을 불러오는 중...</p>
                        </div>
                    ) : scenarios.length === 0 ? (
                        <div className="py-20 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                            <p>공유된 기억이 없습니다.</p>
                        </div>
                    ) : (
                        scenarios.map((post) => (
                            <article key={post.id} className="bg-[#1e1c30] rounded-2xl p-5 shadow-sm border border-slate-800 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        {post.authorAvatar ? (
                                            <img alt={post.authorName} className="w-10 h-10 rounded-full border border-slate-700 object-cover" src={post.authorAvatar} />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold uppercase">
                                                {post.authorName?.substring(0, 2) || 'M'}
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-sm font-bold">{post.authorName || '익명의 메밋'}</h3>
                                            <p className="text-[10px] text-slate-500">{new Date(post.created_at!).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <button className="text-slate-400 hover:text-slate-200">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="mb-4">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
                                        <h2 className="text-base font-bold truncate max-w-[200px]">{post.input_number}</h2>
                                    </div>
                                    <p className="text-slate-300 text-xs leading-relaxed line-clamp-2">
                                        {post.story}
                                    </p>
                                    <div className="flex gap-1.5 mt-3 overflow-hidden">
                                        {post.keywords.slice(0, 3).map(kw => (
                                            <span key={kw} className="px-2 py-0.5 bg-slate-800 text-[10px] text-slate-500 rounded-md truncate max-w-[60px]">{kw}</span>
                                        ))}
                                    </div>
                                </div>
                                {post.image_url && (
                                    <div className="w-full h-32 rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 mb-4 overflow-hidden relative group">
                                        <img alt="Content" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" src={post.image_url} />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer">
                                                <PlayCircle className="w-4 h-4 text-primary" />
                                                <span className="text-[10px] font-semibold text-white">시나리오 보기</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                                    <div className="flex space-x-6">
                                        <button className="flex items-center space-x-1 text-slate-500 hover:text-red-500 group transition-colors">
                                            <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            <span className="text-[10px] font-medium">좋아요</span>
                                        </button>
                                        <button
                                            onClick={() => handleImport(post.id!)}
                                            disabled={importingId === post.id}
                                            className="flex items-center space-x-1 text-slate-500 hover:text-primary group transition-colors disabled:opacity-50"
                                        >
                                            {importingId === post.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                                            <span className="text-[10px] font-medium">가져오기</span>
                                        </button>
                                    </div>
                                    <button className="text-slate-400 hover:text-primary transition-colors">
                                        <Bookmark className="w-5 h-5" />
                                    </button>
                                </div>
                            </article>
                        ))
                    )}
                </main>

                {/* Floating Action */}
                <div className="fixed bottom-24 right-4 z-40 px-4">
                    <motion.button
                        animate={{
                            y: isVisible ? 0 : 120,
                            opacity: isVisible ? 1 : 0
                        }}
                        transition={{
                            type: 'spring',
                            damping: 25,
                            stiffness: 200
                        }}
                        onClick={() => router.push('/memit')}
                        className="bg-primary hover:bg-indigo-600 text-white rounded-full px-5 py-4 shadow-lg shadow-primary/40 flex items-center space-x-2 transform hover:scale-105 transition-all duration-200"
                    >
                        <Plus className="w-6 h-6" />
                        <span className="font-bold text-sm tracking-wide">내 시나리오 자랑하기</span>
                    </motion.button>
                </div>
            </div>
        </>
    );
}
