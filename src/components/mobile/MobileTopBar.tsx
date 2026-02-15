'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Brain, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MobileProfileSheet from './MobileProfileSheet';

export default function MobileTopBar() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

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

        // 1. Initial check
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(session.user);
                fetchProfile(session.user.id);
            }
        });

        // 2. Listen for changes
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

    const displayName = profile?.username ||
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.email?.split('@')[0] ||
        'U';

    const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

    return (
        <header className="fixed top-0 left-0 right-0 h-12 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 z-50 flex items-center justify-between px-5 pt-[env(safe-area-inset-top)] box-content">
            {/* Left: Logo */}
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center text-white shadow-md shadow-primary/20">
                    <Brain className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">MEMIT AI</span>
            </div>

            {/* Right: User Profile */}
            <button
                onClick={() => setIsSheetOpen(true)}
                className="relative group transition-transform active:scale-95"
            >
                <div className="w-7 h-7 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-sm">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary font-bold text-xs">
                            {displayName.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border border-white dark:border-[#020617] rounded-full"></div>
            </button>

            <MobileProfileSheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
            />
        </header>
    );
}
