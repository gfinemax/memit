'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getConsonants } from '@/lib/mnemonic-map';
import { Camera, Zap, Scan } from 'lucide-react';
import { ocrService } from '@/lib/ocr-service';

export type FilterMode = 'password' | 'number' | 'speech' | 'study';

interface MobileMagicInputProps {
    value: string;
    onChange: (value: string) => void;
    mode: FilterMode;
    placeholder?: string;
    maxLength?: number;
    onOcrScan?: (text: string, keywords?: string[]) => void;
}

export default function MobileMagicInput({
    value,
    onChange,
    mode,
    placeholder = "기억하고 싶은 내용을 입력하세요...",
    maxLength = 500,
    onOcrScan
}: MobileMagicInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [isScanning, setIsScanning] = useState(false);

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
    }, [value, ghostInput, isGhostTyping, ghostIndex, mode]);


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

    // External Focus Trigger
    useEffect(() => {
        const handleMagicFocus = (e: CustomEvent) => {
            const detail = e.detail;
            if (detail?.text) {
                onChange(detail.text);
            }

            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                    setIsFocused(true);
                    inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 150);
        };

        window.addEventListener('trigger-magic-focus', handleMagicFocus as any);
        return () => window.removeEventListener('trigger-magic-focus', handleMagicFocus as any);
    }, [onChange]);

    return (
        <div
            className={`
                relative rounded-[2.5rem] overflow-hidden transition-all duration-500
                bg-white/40 dark:bg-slate-900/40 backdrop-blur-[20px] border
                ${isFocused ? 'shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] scale-[1.01] border-primary/40' : 'shadow-lg border-slate-200/50 dark:border-white/5'}
                group min-h-[200px] flex flex-col relative mx-1
            `}
            onClick={(mode as string) === 'number' ? handleContainerClick : undefined}
        >
            {isScanning && (
                <div className="absolute inset-0 z-[40] bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center space-y-3">
                    <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <p className="text-white text-xs font-bold animate-pulse">이미지 분석 중...</p>
                </div>
            )}

            {/* Animated Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getModeStyles()} opacity-50 transition-colors duration-700 pointer-events-none`}></div>

            {/* Aurora Effect (Pseudo) */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[40px] opacity-20 transition-colors duration-700 pointer-events-none
                ${(mode as string) === 'number' ? 'bg-blue-500' : (mode as string) === 'password' ? 'bg-emerald-500' : 'bg-purple-500'}
            `}></div>

            {/* Scanning Light Effect (Concept 3 Style) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
                <motion.div
                    animate={{ top: ['-20%', '120%'] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="absolute left-0 right-0 h-[100px] bg-gradient-to-b from-transparent via-primary/20 to-transparent blur-[20px]"
                />
            </div>

            <div className="relative p-1 h-full flex-1 flex flex-col">
                {(mode as string) === 'number' ? (
                    // --- Number Mode: Segmented Grid Layout ---
                    <div className="relative flex-1 flex flex-col items-center justify-center p-4">
                        {/* Hidden Input for Native Behavior */}
                        <textarea
                            ref={inputRef}
                            value={value}
                            onChange={(e) => {
                                const val = e.target.value;
                                onChange(val);
                            }}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-text caret-transparent resize-none"
                            placeholder={placeholder}
                            maxLength={maxLength}
                            inputMode="decimal"
                        />

                        {/* Visual Segmented Grid */}
                        <div className="flex flex-wrap gap-2 justify-center items-center z-10 pointer-events-none w-full">
                            {/* Render Value Characters */}
                            {value.split('').map((char, index) => {
                                const consonant = getConsonants(char);
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ type: "spring", damping: 15, stiffness: 300 }}
                                        className={`
                                        w-12 ${consonant ? 'h-[74px]' : 'h-16'} rounded-2xl border flex flex-col items-center justify-center shadow-sm
                                        bg-white dark:bg-slate-800 text-slate-800 dark:text-white
                                        ${index === value.length - 1 && isFocused ? 'border-primary shadow-[0_0_15px_rgba(79,70,229,0.3)] ring-2 ring-primary/20 scale-105' : 'border-slate-100 dark:border-slate-700'}
                                    `}
                                    >
                                        <span className="text-3xl font-mono font-bold leading-none">{char}</span>
                                        {consonant && (
                                            <span className="text-[10px] font-bold text-primary/70 mt-1 leading-none">{consonant}</span>
                                        )}
                                    </motion.div>
                                );
                            })}

                            {/* Cursor / Placeholder Box (Only if length < maxLength) */}
                            <motion.div
                                animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.05, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                className={`
                                        w-12 h-16 rounded-2xl border-2 border-dashed flex items-center justify-center
                                        border-primary/30 bg-primary/5
                                    `}
                            >
                                <div className="w-1 h-8 bg-primary rounded-full shadow-[0_0_10px_rgba(79,70,229,0.8)]"></div>
                            </motion.div>
                        </div>

                        {/* Ghost Prompt for Number Mode */}
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
                                        ${(mode as string) === 'number' ? 'tracking-widest text-2xl' : 'font-sans'}
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
                                ${(mode as string) === 'number' ? 'font-mono tracking-widest text-2xl' : 'font-sans'}
                            `}
                            placeholder={placeholder}
                            maxLength={maxLength}
                            inputMode={(mode as string) === 'number' ? 'decimal' : 'text'}
                        />
                    </>
                )}
            </div>

            {/* Bottom Info Bar */}
            <div className={`absolute bottom-4 right-5 flex items-center gap-3 z-30`}>
                <button
                    onClick={async (e) => {
                        e.stopPropagation();
                        setIsScanning(true);
                        try {
                            const result = await ocrService.scanImage();
                            if (result) {
                                if (onOcrScan) {
                                    onOcrScan(result.text, result.keywords);
                                } else {
                                    onChange(result.text);
                                }
                            }
                        } finally {
                            setIsScanning(false);
                        }
                    }}
                    disabled={isScanning}
                    className="p-2.5 bg-slate-900/80 dark:bg-white/10 text-white dark:text-slate-200 rounded-full backdrop-blur-md shadow-lg active:scale-90 transition-all"
                >
                    <Scan className="w-4 h-4" />
                </button>
                <div className="flex flex-col items-end gap-1">
                    <span className={`text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-slate-900/80 dark:bg-white/10 text-white/90 backdrop-blur-md shadow-sm transition-all
                        ${value.length > 0 ? 'opacity-100' : 'opacity-40'}
                    `}>
                        {mode.toUpperCase()}
                    </span>
                    <span className={`text-[9px] font-bold px-1 transition-colors ${value.length > maxLength * 0.9 ? 'text-rose-500' : 'text-slate-400 opacity-60'}`}>
                        {value.length} / {maxLength}
                    </span>
                </div>
            </div>
        </div>
    );
}
