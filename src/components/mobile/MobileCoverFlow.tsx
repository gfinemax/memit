'use client';

import React, { useEffect, useState } from 'react';
import { Quote, Heart, Loader2 } from 'lucide-react';
import { supabaseMemoryService } from '@/lib/supabase-memory-service';
import { UserMemory } from '@/lib/memory-service';

export default function MobileCoverFlow() {
    const [scenarios, setScenarios] = useState<UserMemory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScenarios = async () => {
            try {
                const data = await supabaseMemoryService.getCommunityScenarios();
                // Take top 3-5 for cover flow
                setScenarios(data.slice(0, 5));
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchScenarios();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-48 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary opacity-50" />
            </div>
        );
    }

    if (scenarios.length === 0) {
        return (
            <div className="mx-5 py-6 border border-dashed border-slate-700 rounded-2xl text-center text-xs text-slate-500">
                공유된 기억이 아직 없습니다. 첫 번째 주인공이 되어보세요!
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto no-scrollbar pb-6 pt-2 pl-5 snap-x snap-mandatory">
            <div className="flex gap-4 pr-5 min-w-max">
                {scenarios.map((item, idx) => {
                    const colors = ['bg-indigo-500', 'bg-rose-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500'];
                    const color = colors[idx % colors.length];

                    return (
                        <div
                            key={item.id}
                            className="
                                relative w-[85vw] max-w-[320px] h-48 rounded-2xl p-6 snap-center shrink-0
                                bg-white dark:bg-[#1e1c30] border border-slate-100 dark:border-white/10
                                shadow-lg shadow-slate-200/50 dark:shadow-black/50
                                flex flex-col justify-between overflow-hidden group
                                transform transition-transform active:scale-95
                            "
                        >
                            {/* Decorative Gradient Background */}
                            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[50px] opacity-10 ${color}`}></div>

                            {/* Quote Icon */}
                            <div className="absolute top-4 right-4 text-slate-200 dark:text-slate-700 opacity-50">
                                <Quote className="w-10 h-10 fill-current" />
                            </div>

                            {/* Top Content */}
                            <div className="relative z-10">
                                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold text-white mb-2 ${color} bg-opacity-80`}>
                                    {idx === 0 ? 'BEST MEMORY' : 'COMMUNITY'}
                                </span>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight mb-2 pr-8 truncate">
                                    {item.input_number}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                    {item.story}
                                </p>
                            </div>

                            {/* Bottom User Info */}
                            <div className="relative z-10 flex items-center justify-between mt-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden ring-2 ring-white dark:ring-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                        {item.authorAvatar ? (
                                            <img src={item.authorAvatar} alt={item.authorName} className="w-full h-full object-cover" />
                                        ) : (
                                            item.authorName?.substring(0, 1) || 'M'
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[100px]">{item.authorName || '익명의 메밋'}</div>
                                        <div className="text-[10px] text-slate-400">{new Date(item.created_at!).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-rose-500 font-bold text-xs bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-full">
                                    <Heart className="w-3 h-3 fill-current" />
                                    {Math.floor(Math.random() * 50) + 1}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
