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
        <div className="w-full grid grid-cols-4 gap-2 mb-4">
            {MODES.map((mode) => {
                const isActive = currentMode === mode.id;
                return (
                    <button
                        key={mode.id}
                        onClick={() => handleModeChange(mode.id)}
                        className={`
                            relative h-20 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all duration-300 overflow-hidden
                            ${isActive
                                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-lg scale-[1.02] ring-1 ring-black/5 dark:ring-white/10 z-10'
                                : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-white/10 shadow-sm'
                            }
                        `}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 opacity-100 z-0"
                                initial={false}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}

                        <span className={`relative z-10 text-2xl mb-0.5 filter drop-shadow-sm transition-transform duration-300 ${isActive ? 'scale-110' : 'grayscale opacity-70'}`}>
                            {mode.icon}
                        </span>
                        <span className={`relative z-10 text-[10px] font-bold tracking-tight whitespace-nowrap ${isActive ? 'text-slate-900 dark:text-white opacity-100' : 'opacity-70'}`}>
                            {mode.label}
                        </span>

                        {isActive && (
                            <span className={`absolute top-1.5 right-1.5 w-1 h-1 rounded-full ${mode.color.replace('bg-', 'bg-')} ring-1 ring-white dark:ring-slate-800`}></span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
