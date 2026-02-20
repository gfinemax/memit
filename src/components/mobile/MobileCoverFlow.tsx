'use client';

import React, { useEffect, useState } from 'react';
import { Quote, Heart, Loader2, ArrowUpRight, Image } from 'lucide-react';
import { supabaseMemoryService } from '@/lib/supabase-memory-service';
import { UserMemory } from '@/lib/memory-service';
import StoryText from '@/components/ui/StoryText';

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
            <div className="flex gap-4 min-[390px]:gap-5 pb-6 px-1">
                {scenarios.map((item, idx) => (
                    <div
                        key={item.id}
                        className="flex-shrink-0 w-[280px] min-[390px]:w-[320px] group transition-all duration-500"
                    >
                        <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-slate-900 border border-white/10 shadow-2xl transition-all duration-500 group-hover:scale-[1.02] group-hover:border-primary/40">
                            {/* Image with Overlay */}
                            {item.image_url ? (
                                <img
                                    src={item.image_url}
                                    alt={item.input_number}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-800">
                                    <Image className="w-12 h-12 text-slate-700" />
                                </div>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

                            {/* Floating Badge: Protagonist Number */}
                            <div className="absolute top-4 left-4 z-20">
                                <div className="px-3 py-1 bg-black/50 backdrop-blur-xl rounded-full border border-white/20 shadow-xl">
                                    <span className="text-xl font-black text-white tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
                                        {item.input_number}
                                    </span>
                                </div>
                            </div>

                            {/* Like Badge */}
                            <div className="absolute top-4 right-4 z-20">
                                <div className="px-3 py-1.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/10 flex items-center gap-1.5">
                                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                                    <span className="text-[10px] font-black text-white">{item.likes || (idx * 7) % 50 + 5}</span>
                                </div>
                            </div>

                            {/* Content Overlay */}
                            <div className="absolute bottom-0 inset-x-0 p-6 z-20">
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {item.keywords?.slice(0, 3).map((kw, i) => (
                                        <span key={i} className="px-2 py-0.5 rounded-lg bg-primary/20 border border-primary/30 text-[10px] font-black text-primary tracking-tight">
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                                <StoryText
                                    text={item.story}
                                    className="text-white text-base font-bold leading-tight line-clamp-2 h-10 mb-4 tracking-tight drop-shadow-md block"
                                />

                                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white border border-white/10">
                                            {item.authorAvatar ? (
                                                <img src={item.authorAvatar} alt={item.authorName} className="w-full h-full object-cover" />
                                            ) : (
                                                item.authorName?.slice(0, 1).toUpperCase() || 'A'
                                            )}
                                        </div>
                                        <span className="text-xs text-white/60 font-medium">@{item.authorName || '익명'}</span>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-primary transition-colors" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
