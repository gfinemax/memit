'use client';

import React, { useRef } from 'react';

export type FilterMode = 'number' | 'password' | 'pao' | 'story';

interface MobileFilterChipsProps {
    currentMode: FilterMode;
    onModeChange: (mode: FilterMode) => void;
}

const MODES: { id: FilterMode; label: string; icon?: string }[] = [
    { id: 'number', label: '숫자 암기', icon: '🔢' },
    { id: 'password', label: '비밀번호', icon: '🔐' },
    { id: 'pao', label: 'PAO 모드', icon: '🎭' },
    { id: 'story', label: '스토리', icon: '📖' },
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
        <div className="w-full overflow-x-auto no-scrollbar py-2 pl-4">
            <div className="flex gap-2 pr-4 min-w-max" ref={scrollRef}>
                {MODES.map((mode) => {
                    const isActive = currentMode === mode.id;
                    return (
                        <button
                            key={mode.id}
                            onClick={() => handleClick(mode.id)}
                            className={`
                                relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-out
                                flex items-center gap-2 border
                                ${isActive
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-lg scale-105'
                                    : 'bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10'
                                }
                            `}
                        >
                            <span className="text-base">{mode.icon}</span>
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
