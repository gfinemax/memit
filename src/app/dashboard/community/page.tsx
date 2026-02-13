'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, Search, MoreHorizontal, Heart, MessageCircle, Bookmark, PlayCircle, Plus, Trophy, Castle, User } from 'lucide-react';

const MOCK_POSTS = [
    {
        id: 1,
        author: '암기왕 김철수',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMASOdi2S9TCx2WGIc7aBy09E9kuKH4oxX_-xoOJ26M_ofO5AbxDbCBDcXWrVe5GjoweAHDAzezHlmFCKKUlPMvF1HITyHse4T_tQxecGhU9mf_BD8KRx10P3SznxQ02-tNpUm5QF70gl9fJcjHnOGzoHh7zJhsZncwa5x2jRmcYUPpGFvhYUi2GLpCPtAhYxEoQHpwan255FIt-Fi2FDajKGZ_qF1GZvKPP_3av9jB6fT3lMdn4ksiFSSZueImAQyXAQUPfWS7P3O',
        time: '2시간 전',
        title: '원주율 100자리 3분컷 🚀',
        content: '기적의 장소법을 활용해서 원주율을 외워봤습니다. 제 기억의 궁전은 저희 집 거실부터 시작해서 부엌으로 이어지는...',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKFSEz853yhuIAgHJd-g5tpgRtFIFSptUmLZioKmwmAWzNm6wVln4Td5k3wIHiL77orR0X3Ibhc2wlYDI1BJVAXRSMqQ2IDqBruqQbGwvngmZJ8aaryFkEcYN2sCzqDtz0Ya_uPm4m6eOKi-LTaZTQT1wnanXtDv-hY3eoLyAo01WGWi3SzOVU-PhI3aoffOdQ5lAMV2DVFwMDvddbCu77NDCdWh9_SItLQNId41nZ-ST6BwkI1ATaZ3UbOJCA6a5gyd3MP_qksXxd',
        likes: 1240,
        comments: 58,
        hasMedia: true,
        badge: true,
    },
    {
        id: 2,
        author: 'MemoryKing',
        avatarInitials: 'MK',
        time: '1일 전',
        title: '필수 영단어 100개 (수능대비)',
        content: '수능에 자주 나오는 빈출 단어 100개를 스토리텔링 기법으로 엮어보았습니다.',
        tags: ['#영어단어', '#수능'],
        likes: 420,
        comments: 15,
    },
    {
        id: 3,
        author: '기억술사',
        avatarInitials: 'KS',
        time: '3일 전',
        title: '세계 수도 195개 완벽 암기법 🌍',
        content: '모든 나라의 수도를 이미지 연상법으로 정리했습니다. 아시아부터 시작해서 유럽, 아프리카까지 대륙별로 정리하면...',
        tags: ['#지리', '#세계수도'],
        likes: 890,
        comments: 42,
    },
];

const TAGS = ['#전체', '#숫자', '#암기꿀팁', '#역사', '#영어단어', '#지리', '#시험대비'];

export default function CommunityPage() {
    const router = useRouter();

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
                        <button className="bg-primary hover:bg-primary/90 text-white rounded-xl px-5 py-3 shadow-lg shadow-primary/25 flex items-center gap-2 font-bold text-sm transition-all hover:scale-105">
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
                        {MOCK_POSTS.map((post) => (
                            <article
                                key={post.id}
                                className="bg-[#1e1c30] rounded-2xl p-6 border border-slate-800 hover:border-primary/30 transition-all group"
                            >
                                {/* Author header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        {post.avatar ? (
                                            <img alt={post.author} className="w-11 h-11 rounded-full border border-slate-700 object-cover" src={post.avatar} />
                                        ) : (
                                            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                                                {post.avatarInitials}
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-sm font-bold text-white">{post.author}</h3>
                                            <p className="text-xs text-slate-500">{post.time}</p>
                                        </div>
                                    </div>
                                    <button className="text-slate-500 hover:text-slate-300 transition-colors">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        {post.badge && <span className="w-2 h-2 rounded-full bg-primary" />}
                                        <h2 className="text-xl font-bold text-white">{post.title}</h2>
                                    </div>
                                    <p className="text-slate-300 text-sm leading-relaxed">{post.content}</p>
                                    {post.tags && (
                                        <div className="flex gap-2 mt-3">
                                            {post.tags.map(tag => (
                                                <span key={tag} className="px-2.5 py-1 bg-slate-800 text-xs text-slate-400 rounded-md">{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Media */}
                                {post.hasMedia && post.image && (
                                    <div className="w-full h-48 rounded-xl bg-gradient-to-r from-indigo-900/30 to-purple-900/30 mb-4 overflow-hidden relative group/media cursor-pointer">
                                        <img alt="Content" className="w-full h-full object-cover opacity-60 group-hover/media:scale-105 transition-transform duration-500" src={post.image} />
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
                                            <span className="text-xs font-medium">{post.likes.toLocaleString()}</span>
                                        </button>
                                        <button className="flex items-center gap-1.5 text-slate-400 hover:text-primary group/btn transition-colors">
                                            <MessageCircle className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                                            <span className="text-xs font-medium">{post.comments}</span>
                                        </button>
                                    </div>
                                    <button className="text-slate-500 hover:text-primary transition-colors">
                                        <Bookmark className="w-5 h-5" />
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── Mobile View (기존 코드 유지) ─── */}
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
                    {/* Article 1 */}
                    <article className="bg-[#1e1c30] rounded-2xl p-5 shadow-sm border border-slate-800 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <img alt="User Avatar" className="w-10 h-10 rounded-full border border-slate-700 object-cover" src={MOCK_POSTS[0].avatar} />
                                <div>
                                    <h3 className="text-sm font-bold">암기왕 김철수</h3>
                                    <p className="text-xs text-slate-500">2시간 전</p>
                                </div>
                            </div>
                            <button className="text-slate-400 hover:text-slate-200">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="mb-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
                                <h2 className="text-lg font-bold">원주율 100자리 3분컷 🚀</h2>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed line-clamp-2">
                                기적의 장소법을 활용해서 원주율을 외워봤습니다. 제 기억의 궁전은 저희 집 거실부터 시작해서 부엌으로 이어지는...
                            </p>
                        </div>
                        <div className="w-full h-32 rounded-xl bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-slate-800 dark:to-slate-700 mb-4 overflow-hidden relative group">
                            <img alt="Content" className="w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-105 transition-transform duration-500" src={MOCK_POSTS[0].image} />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer hover:bg-black/80 transition-colors">
                                    <PlayCircle className="w-4 h-4 text-primary" />
                                    <span className="text-xs font-semibold text-white">시나리오 보기</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                            <div className="flex space-x-6">
                                <button className="flex items-center space-x-1 text-slate-500 hover:text-red-500 group transition-colors">
                                    <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-medium">1,240</span>
                                </button>
                                <button className="flex items-center space-x-1 text-slate-500 hover:text-primary group transition-colors">
                                    <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-medium">58</span>
                                </button>
                            </div>
                            <button className="text-slate-400 hover:text-primary transition-colors">
                                <Bookmark className="w-5 h-5" />
                            </button>
                        </div>
                    </article>

                    {/* Article 2 */}
                    <article className="bg-[#1e1c30] rounded-2xl p-5 shadow-sm border border-slate-800 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">MK</div>
                                <div>
                                    <h3 className="text-sm font-bold">MemoryKing</h3>
                                    <p className="text-xs text-slate-500">1일 전</p>
                                </div>
                            </div>
                            <button className="text-slate-400 hover:text-slate-200">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="mb-4">
                            <h2 className="text-lg font-bold mb-1">필수 영단어 100개 (수능대비)</h2>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                수능에 자주 나오는 빈출 단어 100개를 스토리텔링 기법으로 엮어보았습니다.
                            </p>
                            <div className="flex gap-2 mt-3">
                                <span className="px-2 py-1 bg-slate-800 text-xs text-slate-500 rounded-md">#영어단어</span>
                                <span className="px-2 py-1 bg-slate-800 text-xs text-slate-500 rounded-md">#수능</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                            <div className="flex space-x-6">
                                <button className="flex items-center space-x-1 text-slate-500 hover:text-red-500 group transition-colors">
                                    <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-medium">420</span>
                                </button>
                                <button className="flex items-center space-x-1 text-slate-500 hover:text-primary group transition-colors">
                                    <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-medium">15</span>
                                </button>
                            </div>
                            <button className="text-slate-400 hover:text-primary transition-colors">
                                <Bookmark className="w-5 h-5" />
                            </button>
                        </div>
                    </article>
                </main>

                {/* Floating Action */}
                <div className="fixed bottom-24 right-4 z-40 px-4">
                    <button className="bg-primary hover:bg-indigo-600 text-white rounded-full px-5 py-4 shadow-lg shadow-primary/40 flex items-center space-x-2 transform hover:scale-105 transition-all duration-200">
                        <Plus className="w-6 h-6" />
                        <span className="font-bold text-sm tracking-wide">내 시나리오 자랑하기</span>
                    </button>
                </div>
            </div>
        </>
    );
}
