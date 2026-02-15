'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Search, Bell, Settings, ChevronDown, LogOut } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function Header() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        const supabase = createClient();
        if (!supabase) return;

        const fetchProfile = async (userId: string) => {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            if (data) setProfile(data);
        };

        // 1. Initial check (getSession is faster/better for implicit flow than getUser often)
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(session.user);
                fetchProfile(session.user.id);
            }
        });

        // 2. Listen for changes (Login, Logout, Token Refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setProfile(null);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Display Name Logic: Profile Name -> User Meta Name -> Email -> 'Guest'
    const displayName = profile?.username ||
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.email?.split('@')[0] ||
        'User Name';

    const displayEmail = user?.email || 'Free Plan';
    const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleSignOut = async () => {
        const supabase = createClient();
        if (supabase) {
            await supabase.auth.signOut();
            window.location.href = '/login';
        }
    };

    return (
        <header className="h-16 flex items-center justify-between px-6 lg:px-10 border-b border-slate-800/50 backdrop-blur-sm z-50 transition-colors relative">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Home className="w-5 h-5 text-slate-400" />
                <span className="text-slate-400">/</span>
                <span>메밋하기</span>
            </h1>

            <div className="flex items-center gap-4">
                <div className="relative group hidden sm:block">
                    <input
                        type="text"
                        placeholder="기억 검색 (Ctrl+K)..."
                        className="w-64 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all pl-10 text-slate-200 placeholder-slate-500"
                    />
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                </div>

                <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-800 transition-colors text-left group border border-transparent hover:border-slate-700 relative z-50"
                    >
                        <div className="relative">
                            <div className="w-8 h-8 rounded-full border border-slate-700 bg-slate-800 overflow-hidden">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-xs">
                                        {displayName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#020617] rounded-full"></div>
                        </div>
                        <div className="hidden lg:block overflow-hidden">
                            <p className="text-sm font-semibold truncate text-white group-hover:text-primary transition-colors leading-tight">
                                {displayName}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate leading-tight">
                                {displayEmail}
                            </p>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 ml-1 hidden lg:block transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {dropdownOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)}></div>
                            <div className="absolute top-full right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-xl py-1 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-4 py-3 border-b border-slate-700/50 bg-slate-800/30">
                                    <p className="text-sm text-white font-medium truncate">{displayName}</p>
                                    <p className="text-xs text-slate-400 truncate mt-0.5">{displayEmail}</p>
                                </div>
                                <div className="p-1">
                                    <button
                                        onClick={() => { setDropdownOpen(false); router.push('/memit/settings'); }}
                                        className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/50 hover:text-white rounded-lg transition-colors flex items-center gap-2.5"
                                    >
                                        <Settings className="w-4 h-4 text-slate-400" /> <span>내 프로필 설정</span>
                                    </button>
                                    <button
                                        onClick={() => { setDropdownOpen(false); router.push('/memit/settings'); }}
                                        className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/50 hover:text-white rounded-lg transition-colors flex items-center gap-2.5"
                                    >
                                        <Bell className="w-4 h-4 text-slate-400" /> <span>알림 설정</span>
                                    </button>
                                    <div className="h-px bg-slate-700/50 my-1 mx-2"></div>
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors flex items-center gap-2.5"
                                    >
                                        <LogOut className="w-4 h-4" /> <span>로그아웃</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
