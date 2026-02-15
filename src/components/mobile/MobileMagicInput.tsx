'use client';

import React, { useState } from 'react';
import { FilterMode } from './MobileFilterChips';

interface MobileMagicInputProps {
    value: string;
    onChange: (value: string) => void;
    mode: FilterMode;
    placeholder?: string;
    maxLength?: number;
}

export default function MobileMagicInput({
    value,
    onChange,
    mode,
    placeholder = "기억하고 싶은 내용을 입력하세요...",
    maxLength = 500
}: MobileMagicInputProps) {
    const [isFocused, setIsFocused] = useState(false);

    // Dynamic styles based on mode
    const getModeStyles = () => {
        switch (mode) {
            case 'password':
                return 'from-emerald-500/10 via-teal-500/5 to-transparent border-emerald-500/30 focus-within:ring-emerald-500/50';
            case 'number':
                return 'from-blue-500/10 via-indigo-500/5 to-transparent border-blue-500/30 focus-within:ring-blue-500/50';
            case 'pao':
                return 'from-purple-500/10 via-pink-500/5 to-transparent border-purple-500/30 focus-within:ring-purple-500/50';
            case 'story':
            default:
                return 'from-amber-500/10 via-orange-500/5 to-transparent border-amber-500/30 focus-within:ring-amber-500/50';
        }
    };

    return (
        <div className={`
            relative rounded-2xl overflow-hidden transition-all duration-500
            bg-white/50 dark:bg-[#1e1c30]/50 backdrop-blur-xl border
            ${isFocused ? 'shadow-xl scale-[1.01] border-primary/50' : 'shadow-md border-slate-200 dark:border-white/5'}
            group
        `}>
            {/* Animated Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getModeStyles()} opacity-50 transition-colors duration-700`}></div>

            {/* Aurora Effect (Pseudo) */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[40px] opacity-20 transition-colors duration-700
                ${mode === 'number' ? 'bg-blue-500' : mode === 'password' ? 'bg-emerald-500' : 'bg-purple-500'}
            `}></div>

            <div className="relative p-1">
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`
                        w-full h-40 bg-transparent border-none p-5 text-lg leading-relaxed resize-none
                        focus:ring-0 placeholder-slate-400/70 text-slate-800 dark:text-slate-100
                        transition-all duration-300
                        ${mode === 'number' ? 'font-mono tracking-widest text-2xl' : 'font-sans'}
                    `}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    inputMode={mode === 'number' ? 'decimal' : 'text'}
                />
            </div>

            {/* Bottom Info Bar */}
            <div className="absolute bottom-3 right-4 flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 text-slate-500 transition-colors
                    ${value.length > 0 ? 'opacity-100' : 'opacity-50'}
                `}>
                    {mode.toUpperCase()}
                </span>
                <span className={`text-xs font-medium transition-colors ${value.length > maxLength * 0.9 ? 'text-rose-500' : 'text-slate-400'}`}>
                    {value.length}/{maxLength}
                </span>
            </div>
        </div>
    );
}
