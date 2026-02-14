'use client';

import React, { useEffect, useState } from 'react';
import { Home, Search, Bell, Settings, ChevronDown } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function Header() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient();
            if (!supabase) return;

            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                // Try to fetch profile if exists (optional)
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                setProfile(data);
            }
        };

        fetchUser();
    }, []);

    // Display Name Logic: Profile Name -> User Meta Name -> Email -> 'Guest'
    const displayName = profile?.username ||
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.email?.split('@')[0] ||
        'User Name';

    const displayEmail = user?.email || 'Free Plan';
    const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

    return (
        <header className="h-16 flex items-center justify-between px-6 lg:px-10 border-b border-slate-800/50 backdrop-blur-sm z-10 transition-colors">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Home className="w-5 h-5 text-slate-400" />
                <span className="text-slate-400">/</span>
                <span>대시보드</span>
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


                <button className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-800 transition-colors text-left group border border-transparent hover:border-slate-700">
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
                    <ChevronDown className="w-4 h-4 text-slate-400 ml-1 hidden lg:block" />
                </button>
            </div>
        </header>
    );
}
