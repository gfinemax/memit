'use client';

import React from 'react';
import { Check } from 'lucide-react';

export default function DailyMission() {
    const missions = [
        { title: '카드 순서 외우기', completed: true },
        { title: 'N-Back 게임', completed: true },
        { title: '단어 연상 퀴즈', completed: false, isNext: true },
    ];

    const completedCount = missions.filter(m => m.completed).length;
    const totalCount = missions.length;

    return (
        <div className="bg-surface-dark border border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white font-display">오늘의 미션</h3>
                <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded">
                    {completedCount}/{totalCount} 완료
                </span>
            </div>

            <div className="space-y-3">
                {missions.map((mission, index) => (
                    <div
                        key={index}
                        className={`flex items-center p-3 rounded-xl border transition-colors ${mission.isNext
                                ? 'bg-surface-dark border-primary/30 shadow-sm relative overflow-hidden group cursor-pointer hover:border-primary'
                                : 'bg-slate-800/50 border-slate-700/50'
                            }`}
                    >
                        {mission.isNext ? (
                            <>
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                                <div className="w-8 h-8 rounded-full border-2 border-slate-500 mr-3 flex items-center justify-center group-hover:border-primary transition-colors"></div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                                        {mission.title}
                                    </h4>
                                </div>
                                <span className="text-xs font-bold text-primary">NEXT</span>
                            </>
                        ) : (
                            <>
                                <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center mr-3">
                                    <Check className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-slate-500 line-through">
                                        {mission.title}
                                    </h4>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
