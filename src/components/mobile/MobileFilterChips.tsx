'use client';

import React, { useRef } from 'react';

export type FilterMode = 'password' | 'number' | 'speech' | 'study';

interface MobileFilterChipsProps {
    currentMode: FilterMode;
    onModeChange: (mode: FilterMode) => void;
}

const MODES: { id: FilterMode; label: string; icon?: string }[] = [
    { id: 'password', label: '암호생성', icon: '🔐' },
    { id: 'number', label: '숫자 암기', icon: '🔢' },
    { id: 'speech', label: '스피치', icon: '🎤' },
    { id: 'study', label: '학습', icon: '📚' },
];

export default function MobileFilterChips({ currentMode, onModeChange }: MobileFilterChipsProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleClick = (mode: FilterMode) => {
        onModeChange(mode);
        // Haptic feedback pattern (navigator.vibrate is often blocked, but visual feedback handles it)
        if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(10);
        }
    };

    return (
        <div className="w-full overflow-x-auto no-scrollbar py-1 pl-5">
            <div className="flex gap-2 pr-5 min-w-max" ref={scrollRef}>
                {MODES.map((mode) => {
                    const isActive = currentMode === mode.id;
                    return (
                        <button
                            key={mode.id}
                            onClick={() => handleClick(mode.id)}
                            className={`
                                relative px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ease-out
                                flex items-center gap-1.5 border
                                ${isActive
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-lg scale-105'
                                    : 'bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10'
                                }
                            `}
                        >
                            <span className="text-sm">{mode.icon}</span>
                            <span>{mode.label}</span>
                            {isActive && (
                                <span className="absolute inset-0 rounded-full ring-2 ring-primary/20 animate-pulse"></span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
