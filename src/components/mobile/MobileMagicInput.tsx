'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterMode } from './MobileModeTabs';

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

    // --- Ghost Prompt Logic ---
    const [ghostInput, setGhostInput] = useState('');
    const [isGhostTyping, setIsGhostTyping] = useState(true);
    const [ghostIndex, setGhostIndex] = useState(0);

    // Define specific examples for each mode
    const getExamples = () => {
        switch (mode) {
            case 'number': return ['3.141592', '010-1234-5678', '940505-1234567'];
            case 'password': return ['naver_pw', 'google_login', 'my_wifi_password'];
            case 'speech': return ['발표 핵심 키워드', '결혼식 축사', '중요한 프레젠테이션 오프닝'];
            case 'study': return ['English Vocabulary', '한국사 연표', '주기율표 암기'];
            default: return ['기억하고 싶은 것', '무엇이든 입력하세요'];
        }
    };

    const ghostExamples = getExamples();

    useEffect(() => {
        // Reset ghost if user types
        if (value.length > 0) {
            setGhostInput('');
            return;
        }

        let timeout: NodeJS.Timeout;
        const currentExample = ghostExamples[ghostIndex % ghostExamples.length];

        if (isGhostTyping) {
            if (ghostInput.length < currentExample.length) {
                // Typing forward
                const delay = ghostInput.length === 0 ? 1000 : 150; // Initial delay then type speed
                timeout = setTimeout(() => {
                    setGhostInput(currentExample.slice(0, ghostInput.length + 1));
                }, delay);
            } else {
                // Finished typing, wait before deleting
                timeout = setTimeout(() => setIsGhostTyping(false), 2000);
            }
        } else {
            // Deleting backward
            if (ghostInput.length > 0) {
                timeout = setTimeout(() => {
                    setGhostInput(ghostInput.slice(0, -1));
                }, 50);
            } else {
                // Done deleting, move to next example
                setGhostIndex(prev => prev + 1);
                setIsGhostTyping(true);
            }
        }

        return () => clearTimeout(timeout);
    }, [value, ghostInput, isGhostTyping, ghostIndex, mode]); // Added mode dependency to reset/change examples


    // Dynamic styles based on mode
    const getModeStyles = () => {
        switch (mode) {
            case 'password':
                return 'from-emerald-500/10 via-teal-500/5 to-transparent border-emerald-500/30 focus-within:ring-emerald-500/50';
            case 'number':
                return 'from-blue-500/10 via-indigo-500/5 to-transparent border-blue-500/30 focus-within:ring-blue-500/50';
            case 'speech':
                return 'from-purple-500/10 via-pink-500/5 to-transparent border-purple-500/30 focus-within:ring-purple-500/50';
            case 'study':
            default:
                return 'from-amber-500/10 via-orange-500/5 to-transparent border-amber-500/30 focus-within:ring-amber-500/50';
        }
    };

    // Focus handler for number mode
    const inputRef = React.useRef<HTMLTextAreaElement>(null);

    const handleContainerClick = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
        setIsFocused(true);
    };

    return (
        <div
            className={`
                relative rounded-2xl overflow-hidden transition-all duration-500
                bg-white/50 dark:bg-[#1e1c30]/50 backdrop-blur-xl border
                ${isFocused ? 'shadow-xl scale-[1.005] border-primary/50' : 'shadow-md border-slate-200 dark:border-white/5'}
                group min-h-[180px] flex flex-col
            `}
            onClick={mode === 'number' ? handleContainerClick : undefined}
        >
            {/* Animated Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getModeStyles()} opacity-50 transition-colors duration-700 pointer-events-none`}></div>

            {/* Aurora Effect (Pseudo) */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[40px] opacity-20 transition-colors duration-700 pointer-events-none
                ${mode === 'number' ? 'bg-blue-500' : mode === 'password' ? 'bg-emerald-500' : 'bg-purple-500'}
            `}></div>

            {/* Quantum Scanner Effect (Only when not focused or empty) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
                <motion.div
                    animate={{ top: ['-10%', '110%'] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear", repeatDelay: 1 }}
                    className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent blur-[1px]"
                />
            </div>

            <div className="relative p-1 h-full flex-1 flex flex-col">
                {mode === 'number' ? (
                    // --- Number Mode: Segmented Grid Layout ---
                    <div className="relative flex-1 flex flex-col items-center justify-center p-4">
                        {/* Hidden Input for Native Behavior */}
                        <textarea
                            ref={inputRef}
                            value={value}
                            onChange={(e) => {
                                const val = e.target.value;
                                // Allow only numbers and typical dividers if needed (or just raw input as requested, but user said 'Number')
                                // For now allow all, but keyboard is decimal.
                                onChange(val);
                            }}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-text caret-transparent resize-none"
                            placeholder={placeholder}
                            maxLength={maxLength}
                            inputMode="decimal" // Numeric keyboard
                        />

                        {/* Visual Segmented Grid */}
                        <div className="flex flex-wrap gap-2 justify-center items-center z-10 pointer-events-none w-full">
                            {/* Render Value Characters */}
                            {value.split('').map((char, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className={`
                                        w-12 h-16 rounded-lg border-2 flex items-center justify-center text-3xl font-mono font-bold shadow-sm
                                        bg-white dark:bg-slate-800 text-slate-800 dark:text-white
                                        border-primary/30
                                    `}
                                >
                                    {char}
                                </motion.div>
                            ))}

                            {/* Cursor / Placeholder Box (Only if length < maxLength) */}
                            {value.length < maxLength && (
                                <motion.div
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                    className={`
                                        w-12 h-16 rounded-lg border-2 border-dashed flex items-center justify-center
                                        border-slate-300 dark:border-slate-600 bg-white/10
                                    `}
                                >
                                    <div className="w-1 h-8 bg-primary/50"></div>
                                </motion.div>
                            )}
                        </div>

                        {/* Ghost Prompt for Number Mode (Optional: Show below/above if empty?) */}
                        {value.length === 0 && (
                            <div className="mt-4 text-slate-400 text-sm animate-pulse font-mono">
                                예: {ghostInput || "3.14"}
                            </div>
                        )}
                    </div>
                ) : (
                    // --- Other Modes: Standard Textarea ---
                    <>
                        {/* Ghost Input Overlay (Standard) */}
                        <AnimatePresence>
                            {value.length === 0 && (
                                <div className="absolute inset-0 p-5 pointer-events-none z-0">
                                    <div className={`
                                        text-lg leading-relaxed font-mono whitespace-pre-wrap break-all
                                        ${mode === 'number' ? 'tracking-widest text-2xl' : 'font-sans'}
                                        text-slate-400/40 blur-[0.5px]
                                    `}>
                                        {ghostInput}
                                        <span className="inline-block w-0.5 h-5 ml-0.5 align-middle bg-primary/40 animate-pulse"></span>
                                    </div>
                                </div>
                            )}
                        </AnimatePresence>

                        <textarea
                            ref={inputRef}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            className={`
                                w-full h-40 bg-transparent border-none p-5 text-lg leading-relaxed resize-none
                                focus:ring-0 placeholder-transparent text-slate-800 dark:text-slate-100
                                transition-all duration-300 relative z-10
                                ${mode === 'number' ? 'font-mono tracking-widest text-2xl' : 'font-sans'}
                            `}
                            placeholder={placeholder} // Visual placeholder is handled by Ghost Prompt
                            maxLength={maxLength}
                            inputMode={mode === 'number' ? 'decimal' : 'text'}
                        />
                    </>
                )}
            </div>

            {/* Bottom Info Bar */}
            <div className={`absolute bottom-3 right-4 flex items-center gap-2 z-20 ${mode === 'number' ? 'opacity-50' : ''}`}>
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
