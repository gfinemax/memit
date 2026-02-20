'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Define available modes
export type FilterMode = 'password' | 'number' | 'speech' | 'study';

interface MobileModeTabsProps {
    currentMode: FilterMode;
    onModeChange: (mode: FilterMode) => void;
}

const MODES: { id: FilterMode; label: string; icon: string; color: string }[] = [
    { id: 'number', label: '숫자 암기', icon: '🔢', color: 'bg-blue-500' },
    { id: 'password', label: '암호생성', icon: '🔐', color: 'bg-emerald-500' },
    { id: 'speech', label: '스피치', icon: '🎤', color: 'bg-purple-500' },
    { id: 'study', label: '학습', icon: '📚', color: 'bg-amber-500' },
];

export default function MobileModeTabs({ currentMode, onModeChange }: MobileModeTabsProps) {

    const handleModeChange = (mode: FilterMode) => {
        onModeChange(mode);
        if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(10);
        }
    };

    return (
        <div className="w-full flex justify-center mb-4">
            <div className="inline-flex bg-slate-100/50 dark:bg-white/5 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-700/30 backdrop-blur-xl shadow-lg relative z-20">
                {MODES.map((mode) => {
                    const isActive = currentMode === mode.id;
                    return (
                        <button
                            key={mode.id}
                            onClick={() => handleModeChange(mode.id)}
                            className={`
                                relative min-w-[76px] h-16 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-300
                                ${isActive
                                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md scale-100 z-10'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                }
                            `}
                        >
                            <span className={`relative z-10 text-xl mb-0.5 transition-all duration-300 ${isActive ? 'scale-110' : 'grayscale opacity-60'}`}>
                                {mode.icon}
                            </span>
                            <span className={`relative z-10 text-[9px] font-bold tracking-tight whitespace-nowrap transition-all ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                                {mode.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
