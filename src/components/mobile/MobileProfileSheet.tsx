'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Settings, LogOut, User, X, ChevronRight, Moon, Sun, Clock } from 'lucide-react';
import { createPortal } from 'react-dom';

interface MobileProfileSheetProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileProfileSheet({ isOpen, onClose }: MobileProfileSheetProps) {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [greeting, setGreeting] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [animateOpen, setAnimateOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Sync visibility for animation with a small delay to allow render
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            // Slight delay to allow DOM to render before animating in
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setAnimateOpen(true);
                });
            });
            updateGreeting();
        } else {
            setAnimateOpen(false);
            const timer = setTimeout(() => setIsVisible(false), 300); // Wait for slide down transition
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const updateGreeting = () => {
        const hour = new Date().getHours();
        const messages = [
            "오늘도 기억할 준비 되셨나요?",
            "당신의 뇌는 무한한 가능성을 가졌어요.",
            "작은 기억들이 모여 인생이 됩니다.",
            "메밋과 함께 스마트하게 기억하세요."
        ];
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];

        if (hour < 6) setGreeting(`새벽 감성 충만한 시간이네요. ${randomMsg}`);
        else if (hour < 12) setGreeting(`상쾌한 오전입니다! ${randomMsg}`);
        else if (hour < 18) setGreeting(`나른한 오후, ${randomMsg}`);
        else setGreeting(`하루를 마무리하는 밤이군요. ${randomMsg}`);
    };

    useEffect(() => {
        const supabase = createClient();
        if (supabase) {
            supabase.auth.getSession().then(({ data: { session } }) => {

                if (session?.user) {
                    setUser(session.user);
                    fetchProfile(session.user.id);
                }
            });
        }
    }, []);

    const fetchProfile = async (userId: string) => {
        const supabase = createClient();
        if (!supabase) return;
        const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
        if (data) setProfile(data);
    };

    const handleSignOut = async () => {
        const supabase = createClient();
        if (!supabase) return;
        await supabase.auth.signOut();
        window.location.href = '/login';
    };

    if (!mounted || !isVisible) return null;

    const displayName = profile?.username || user?.user_metadata?.full_name || 'User';
    const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

    const content = (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end pointer-events-none">
            {/* Backdrop - pointer-events-auto only when visible to block clicks */}
            <div
                onClick={onClose}
                className={`
                    absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-out pointer-events-auto
                    ${animateOpen ? 'opacity-100' : 'opacity-0'}
                `}
            ></div>

            {/* Bottom Sheet */}
            <div
                className={`
                    relative w-full bg-white dark:bg-[#1a1c2e] rounded-t-3xl shadow-2xl 
                    transform transition-transform duration-300 ease-out pointer-events-auto
                    ${animateOpen ? 'translate-y-0' : 'translate-y-full'}
                    border-t border-white/10 overflow-hidden pb-safe
                `}
            >
                {/* Drag Handle */}
                <div className="w-full flex justify-center pt-3 pb-1" onClick={onClose}>
                    <div className="w-12 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full"></div>
                </div>

                {/* Content */}
                <div className="p-6 pb-12 space-y-8">
                    {/* Header: User Info & Greeting */}
                    <div className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                        <div className="w-16 h-16 rounded-2xl border-2 border-primary/20 p-1 flex-shrink-0 relative">
                            <div className="w-full h-full rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative group">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="User" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-primary text-xl font-bold">
                                        {displayName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-[#1a1c2e]">
                                ON
                            </div>
                        </div>
                        <div className="flex-1 space-y-1">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                                {displayName}님,
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                {greeting}
                            </p>
                        </div>
                    </div>

                    {/* Stats / Quick Info (Optional) */}
                    <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                        <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 flex flex-col gap-1 items-center justify-center border border-slate-100 dark:border-white/5">
                            <span className="text-2xl font-bold text-primary">12</span>
                            <span className="text-xs text-slate-500">기억 저장소</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 flex flex-col gap-1 items-center justify-center border border-slate-100 dark:border-white/5">
                            <span className="text-2xl font-bold text-indigo-500">Lv.3</span>
                            <span className="text-xs text-slate-500">기억 마스터</span>
                        </div>
                    </div>

                    {/* Action Menu */}
                    <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                        <button
                            onClick={() => { onClose(); router.push('/memit/settings'); }}
                            className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-white dark:bg-white/10 text-slate-600 dark:text-indigo-300 shadow-sm">
                                    <Settings className="w-5 h-5" />
                                </div>
                                <span className="font-medium text-slate-700 dark:text-slate-200">설정 및 계정 관리</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center justify-between p-4 rounded-xl bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-white dark:bg-red-500/20 text-red-500 shadow-sm">
                                    <LogOut className="w-5 h-5" />
                                </div>
                                <span className="font-medium text-red-600 dark:text-red-400">로그아웃</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(content, document.body);
}
