'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Layers, Plus, Archive, History, Camera, Type, ShieldCheck, X, Menu, Search, Mic, Sparkles, Brain, BarChart3, Sun, Moon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { eventBus, APP_EVENTS } from '@/lib/events';
import MnemonicTipsOverlay from './MnemonicTipsOverlay';
import MemoryUtilitiesOverlay from './MemoryUtilitiesOverlay';
import { memoryUtilitiesService } from '@/lib/memory-utilities-service';

// Add type for Web Speech API
declare global {
    interface Window {
        webkitSpeechRecognition: any;
    }
}

export default function MobileBottomNav() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isTipsOpen, setIsTipsOpen] = useState(false);
    const [isUtilOpen, setIsUtilOpen] = useState(false);
    const [utilType, setUtilType] = useState<'quiz' | 'report'>('quiz');
    const [utilLoading, setUtilLoading] = useState(false);
    const [utilContent, setUtilContent] = useState<string | null>(null);
    const [utilError, setUtilError] = useState<string | null>(null);
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [isVisible, setIsVisible] = useState(true);
    // Visibility sync via eventBus
    useEffect(() => {
        const handleVisibility = (visible: boolean) => {
            // Keep visible if menu is open
            if (isMenuOpen) {
                setIsVisible(true);
            } else {
                setIsVisible(visible);
            }
        };

        eventBus.on(APP_EVENTS.SET_NAV_VISIBILITY, handleVisibility);
        return () => eventBus.off(APP_EVENTS.SET_NAV_VISIBILITY, handleVisibility);
    }, [isMenuOpen]);

    // Initialize theme
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (savedTheme) {
            setTheme(savedTheme);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }, []);

    const toggleTheme = (newTheme?: 'light' | 'dark') => {
        const target = newTheme || (theme === 'light' ? 'dark' : 'light');
        setTheme(target);
        localStorage.setItem('theme', target);
        document.documentElement.classList.toggle('dark', target === 'dark');
    };
    const isActive = (path: string) => pathname === path;

    // Show on main dashboard, community, and settings pages
    const showNav = ['/memit', '/memit/services', '/memit/community', '/memit/settings', '/memit/storage'].includes(pathname);

    if (!showNav) {
        return null;
    }

    const handleQuickAction = (mode: string) => {
        setIsMenuOpen(false);
        if (pathname !== '/memit') {
            router.push('/memit');
        }
        setTimeout(() => {
            eventBus.emit(APP_EVENTS.FOCUS_INPUT, { mode });
        }, 150);
    };

    const startVoiceCommand = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("이 브라우저는 음성 인식을 지원하지 않습니다.");
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'ko-KR';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
            setIsMenuOpen(false);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            console.log("Voice Transcript:", transcript);

            if (transcript.includes("다크 모드") || transcript.includes("어둡게")) {
                toggleTheme('dark');
                alert("다크 모드로 전환합니다.");
            } else if (transcript.includes("라이트 모드") || transcript.includes("밝게")) {
                toggleTheme('light');
                alert("라이트 모드로 전환합니다.");
            } else {
                // Default: Treat as memory input
                if (pathname !== '/memit') {
                    router.push('/memit');
                }
                setTimeout(() => {
                    eventBus.emit(APP_EVENTS.FOCUS_INPUT, { mode: 'study', text: transcript });
                }, 150);
            }
        };

        recognition.onerror = (event: any) => {
            console.error("Speech Recognition Error:", event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const handleQuizRequest = async () => {
        setIsMenuOpen(false);
        setUtilType('quiz');
        setIsUtilOpen(true);
        setUtilLoading(true);
        setUtilError(null);
        setUtilContent(null);
        try {
            const content = await memoryUtilitiesService.generateQuiz();
            setUtilContent(content);
        } catch (err: any) {
            setUtilError(err.message || "퀴즈를 가져오지 못했습니다.");
        } finally {
            setUtilLoading(false);
        }
    };

    const handleReportRequest = async () => {
        setIsMenuOpen(false);
        setUtilType('report');
        setIsUtilOpen(true);
        setUtilLoading(true);
        setUtilError(null);
        setUtilContent(null);
        try {
            const content = await memoryUtilitiesService.generateReport();
            setUtilContent(content);
        } catch (err: any) {
            setUtilError(err.message || "리포트를 생성하지 못했습니다.");
        } finally {
            setUtilLoading(false);
        }
    };

    const handleCenterClick = () => {
        if (pathname !== '/memit') {
            router.push('/memit');
        }
        setTimeout(() => {
            eventBus.emit(APP_EVENTS.FOCUS_INPUT, { mode: 'study' });
        }, 150);
    };

    return (
        <>
            {/* Quick Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[60]"
                        />
                        <div className="fixed bottom-32 left-0 right-0 z-[70] px-6">
                            <div className="flex flex-col gap-4 items-center">
                                {/* 1. 음성으로 메밋 */}
                                <motion.button
                                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                                    transition={{ type: "spring", damping: 20 }}
                                    onClick={startVoiceCommand}
                                    className="w-full max-w-[260px] bg-white dark:bg-slate-800 p-4 rounded-2xl flex items-center gap-4 shadow-2xl border border-slate-100 dark:border-white/10 active:scale-95 transition-transform"
                                >
                                    <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center text-rose-500">
                                        <Mic className={`w-6 h-6 ${isListening ? 'animate-pulse' : ''}`} />
                                    </div>
                                    <div className="flex flex-col items-start translate-y-[-1px]">
                                        <span className="font-bold text-slate-800 dark:text-white leading-tight">음성으로 메밋/명령</span>
                                        <span className="text-[11px] text-slate-400 dark:text-slate-500">"다크 모드" 또는 음성 입력</span>
                                    </div>
                                </motion.button>

                                {/* 2. 기억의 궁전 팁 */}
                                <motion.button
                                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                                    transition={{ type: "spring", damping: 20, delay: 0.05 }}
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        setIsTipsOpen(true);
                                    }}
                                    className="w-full max-w-[260px] bg-white dark:bg-slate-800 p-4 rounded-2xl flex items-center gap-4 shadow-2xl border border-slate-100 dark:border-white/10 active:scale-95 transition-transform"
                                >
                                    <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-500">
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col items-start translate-y-[-1px]">
                                        <span className="font-bold text-slate-800 dark:text-white leading-tight">기억의 궁전 팁</span>
                                        <span className="text-[11px] text-slate-400 dark:text-slate-500">암기 고수들의 비법 배우기</span>
                                    </div>
                                </motion.button>

                                {/* 3. 기억력 퀴즈 */}
                                <motion.button
                                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                                    transition={{ type: "spring", damping: 20, delay: 0.1 }}
                                    onClick={handleQuizRequest}
                                    className="w-full max-w-[260px] bg-white dark:bg-slate-800 p-4 rounded-2xl flex items-center gap-4 shadow-2xl border border-slate-100 dark:border-white/10 active:scale-95 transition-transform"
                                >
                                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500">
                                        <Brain className="w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col items-start translate-y-[-1px]">
                                        <span className="font-bold text-slate-800 dark:text-white leading-tight">기억력 퀴즈</span>
                                        <span className="text-[11px] text-slate-400 dark:text-slate-500">잊기 전에 한 번 더 확인</span>
                                    </div>
                                </motion.button>

                                {/* 4. AI 요약 리포트 */}
                                <motion.button
                                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                                    transition={{ type: "spring", damping: 20, delay: 0.15 }}
                                    onClick={handleReportRequest}
                                    className="w-full max-w-[260px] bg-white dark:bg-slate-800 p-4 rounded-2xl flex items-center gap-4 shadow-2xl border border-slate-100 dark:border-white/10 active:scale-95 transition-transform"
                                >
                                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500">
                                        <BarChart3 className="w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col items-start translate-y-[-1px]">
                                        <span className="font-bold text-slate-800 dark:text-white leading-tight">AI 요약 리포트</span>
                                        <span className="text-[11px] text-slate-400 dark:text-slate-500">내 기억 데이터 한 눈에 보기</span>
                                    </div>
                                </motion.button>
                            </div>
                        </div>
                    </>
                )}
            </AnimatePresence>

            {/* Dynamic Center Pill */}
            <div className="fixed bottom-0 left-0 right-0 z-[100] px-6 mb-safe pointer-events-none">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{
                        y: isVisible ? 0 : 100,
                        opacity: isVisible ? 1 : 0
                    }}
                    transition={{
                        type: 'spring',
                        damping: 25,
                        stiffness: 200,
                        opacity: { duration: 0.2 }
                    }}
                    className="w-full max-w-sm mx-auto h-14 bg-background-light/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/50 dark:border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex items-center p-1.5 pointer-events-auto overflow-hidden"
                >
                    {/* Left: Menu Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`group w-11 h-11 rounded-full flex items-center justify-center transition-all ${isMenuOpen ? 'bg-primary text-white rotate-90' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200'}`}
                    >
                        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    {/* Center: Interactive Input Area */}
                    <button
                        onClick={handleCenterClick}
                        className="flex-1 h-full px-4 flex items-center gap-3 text-left overflow-hidden min-w-0"
                    >
                        <Search className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="text-sm font-medium text-slate-400 dark:text-slate-500 truncate whitespace-nowrap">
                            어떤 기억을 만드실 건가요?
                        </span>
                    </button>

                    {/* Right: Archive/History Shortcut */}
                    <div className="flex items-center gap-0.5 pr-0.5">
                        <Link
                            href="/memit/storage"
                            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${isActive('/memit/storage') ? 'bg-primary/10 text-primary' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}`}
                        >
                            <Archive className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/memit/community"
                            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${isActive('/memit/community') ? 'bg-primary/10 text-primary' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}`}
                        >
                            <History className="w-5 h-5" />
                        </Link>
                    </div>
                </motion.div>
            </div>

            <MnemonicTipsOverlay
                isOpen={isTipsOpen}
                onClose={() => setIsTipsOpen(false)}
            />

            <MemoryUtilitiesOverlay
                isOpen={isUtilOpen}
                onClose={() => setIsUtilOpen(false)}
                type={utilType}
                title={utilType === 'quiz' ? '기억력 퀴즈' : 'AI 요약 리포트'}
                loading={utilLoading}
                content={utilContent}
                error={utilError}
            />
        </>
    );
}
