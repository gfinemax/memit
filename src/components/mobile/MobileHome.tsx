'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, Quote, Heart, TrophyIcon, Brain, Zap, Key, Grid } from 'lucide-react';

import { convertNumberAction } from '@/app/actions';
import { openAIStoryService } from '@/lib/openai-story-service';
import { supabaseMemoryService } from '@/lib/supabase-memory-service';
import { createClient } from '@/utils/supabase/client';
import { MNEMONIC_MAP } from '@/lib/mnemonic-map';

import ResultCard from './ResultCard';
import MobileModeTabs, { FilterMode } from './MobileModeTabs';
import MobileMagicInput from './MobileMagicInput';
import MobileCoverFlow from './MobileCoverFlow';
import WelcomeOnboarding from './WelcomeOnboarding';

export interface KeywordItem {
    word: string;
    code: string;
    candidates: string[];
    isLocked?: boolean;
}

export default function MobileHome() {
    const router = useRouter();
    const [currentMode, setCurrentMode] = useState<FilterMode>('password');
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<KeywordItem[] | null>(null);
    const [story, setStory] = useState<string>('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [mnemonicKeyOpen, setMnemonicKeyOpen] = useState(false);
    const [useFourCut, setUseFourCut] = useState(false); // Style Selector State
    const [showOnboarding, setShowOnboarding] = useState(false);

    // Advanced Generation States
    const [generatingImage, setGeneratingImage] = useState(false);
    const [generatingMessageIndex, setGeneratingMessageIndex] = useState(0);
    const [generationProgress, setGenerationProgress] = useState(0);

    const generationMessages = [
        "스토리에서 핵심 이미지를 추출하는 중...",
        "캔버스에 기억의 조각들을 배치 중...",
        "AI가 초안 스케치를 진행하고 있습니다...",
        "DALL-E가 정교한 붓 터치를 시작합니다...",
        "공간의 깊이와 조명 효과를 불어넣는 중...",
        "마지막 디테일과 질감을 다듬고 있습니다...",
        "거의 다 되었습니다! 이미지를 현상 중..."
    ];

    useEffect(() => {
        const init = async () => {
            // Check auth
            const supabase = createClient();
            if (supabase) {
                try {
                    const { data: { user }, error } = await supabase.auth.getUser();
                    if (error) {
                        if (error.message.includes("Refresh Token Not Found") || error.status === 401) {
                            await supabase.auth.signOut();
                            setUser(null);
                        }
                    } else {
                        setUser(user);
                    }
                } catch (err) {
                    console.error("Auth check error:", err);
                }
            }

            // Check onboarding
            const hasSeen = localStorage.getItem('hasSeenOnboarding_v2');
            if (!hasSeen) {
                setShowOnboarding(true);
            }
        };

        init();
    }, []);

    const handleOnboardingComplete = () => {
        localStorage.setItem('hasSeenOnboarding_v2', 'true');
        setShowOnboarding(false);
    };

    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        let msgInterval: NodeJS.Timeout;

        if (generatingImage) {
            setGenerationProgress(0);
            setGeneratingMessageIndex(0);

            // Progress bar logic (roughly 30 seconds)
            interval = setInterval(() => {
                setGenerationProgress(prev => {
                    if (prev >= 95) return prev;
                    return prev + (100 / (30 * 10));
                });
            }, 100);

            // Message rotation logic
            msgInterval = setInterval(() => {
                setGeneratingMessageIndex(prev => (prev + 1) % generationMessages.length);
            }, 4000);
        }

        return () => {
            clearInterval(interval);
            clearInterval(msgInterval);
        };
    }, [generatingImage]);

    const handleConvert = async () => {
        if (!input.trim() || loading || generatingImage) return;
        setLoading(true);
        setResult(null);
        setStory('');
        setImageUrl(null);

        try {
            // Step 1: Keywords
            const res = await convertNumberAction(input);
            if (res.success && res.data && res.candidates) {
                // Map to structured KeywordItem
                const structuredResult: KeywordItem[] = res.candidates.map(candidate => ({
                    word: candidate.words[0], // Default to first word
                    code: candidate.chunk,
                    candidates: candidate.words
                }));
                setResult(structuredResult);

                // Step 2: Story (Auto-generate for mobile simple flow)
                const storyRes = await openAIStoryService.generateStory(input, {
                    manualKeywords: res.data
                });
                setStory(storyRes.story);

                // Step 3: Image (Advanced UX starts here)
                setGeneratingImage(true);
                const url = await openAIStoryService.generateImage(storyRes.story, "Mobile App Memory", useFourCut, res.data);
                setImageUrl(url);
                setGenerationProgress(100);
            }
        } catch (error) {
            console.error("Mobile conversion failed:", error);
            alert("처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
        } finally {
            setLoading(false);
            setGeneratingImage(false);
        }
    };

    const handleKeywordChange = (index: number, newWord: string) => {
        if (!result) return;
        const newResult = [...result];
        newResult[index] = { ...newResult[index], word: newWord };
        setResult(newResult);
    };

    const handleKeywordLockToggle = (index: number) => {
        if (!result) return;
        const newResult = [...result];
        newResult[index] = { ...newResult[index], isLocked: !newResult[index].isLocked };
        setResult(newResult);
    };

    const handleToggleAllLocks = () => {
        if (!result) return;
        // If all are currently locked, unlock all. Otherwise, lock all.
        const allLocked = result.every(item => item.isLocked);
        const newResult = result.map(item => ({ ...item, isLocked: !allLocked }));
        setResult(newResult);
    };

    const handleRememit = async () => {
        if (!result || !input.trim() || loading || generatingImage) return;

        setLoading(true);
        setGeneratingImage(true);

        try {
            // Step 1: Smart Randomization
            const newResult = result.map(item => {
                if (item.isLocked) return item; // Keep locked word

                // For unlocked words, pick a random one from candidates (preferably different)
                const otherCandidates = item.candidates.filter(c => c !== item.word);
                const randomWord = otherCandidates.length > 0
                    ? otherCandidates[Math.floor(Math.random() * otherCandidates.length)]
                    : item.word;

                return { ...item, word: randomWord };
            });

            setResult(newResult);

            // Step 2: Regenerate Story
            const currentWords = newResult.map(r => r.word);
            const storyRes = await openAIStoryService.generateStory(input, {
                manualKeywords: currentWords
            });
            setStory(storyRes.story);

            // Step 3: Regenerate Image
            const url = await openAIStoryService.generateImage(storyRes.story, "Mobile App Memory Refined", useFourCut, currentWords);
            setImageUrl(url);
            setGenerationProgress(100);

        } catch (error) {
            console.error("Rememit failed:", error);
            alert("다시 메밋하기 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
            setGeneratingImage(false);
        }
    };

    const getStrategyFromMode = (mode: FilterMode): string => {
        switch (mode) {
            case 'number': return '3D';
            case 'password': return 'ETYMOLOGY';
            case 'speech': return 'LOCI';
            case 'study': return 'STORY';
            default: return 'ASSOCIATION';
        }
    };

    const handleSave = async () => {
        if (!user) {
            if (confirm("기억을 저장하려면 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")) {
                router.push('/login');
            }
            return;
        }

        if (!result) return;

        try {
            const memoryData = {
                input_number: input,
                keywords: result.map(item => item.word), // Extract just the words for saving
                story: story,
                image_url: imageUrl || undefined,
                strategy: getStrategyFromMode(currentMode),
                category: currentMode,
                context: "Mobile App Generated"
            };

            const saved = await supabaseMemoryService.saveMemory(memoryData);

            if (saved) {
                alert("기억이 성공적으로 저장되었습니다! PC에서도 확인하실 수 있습니다.");
            } else {
                alert("저장에 실패했습니다.");
            }
        } catch (e) {
            console.error(e);
            alert("저장 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="pb-24 bg-background-light dark:bg-background-dark min-h-screen">
            {/* Header removed: Now using Global MobileTopBar */}
            {showOnboarding && <WelcomeOnboarding onComplete={handleOnboardingComplete} />}
            <main>
                {/* Hero Section */}
                <section className="px-5 pt-1 pb-1">
                    <div className="mb-4">
                        {/* Line 1: Main Benefit (Staggered Up) */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-2xl min-[390px]:text-3xl font-bold italic text-slate-900 dark:text-white tracking-tight break-keep flex flex-wrap items-center gap-x-2"
                            style={{ fontFamily: 'Pretendard Variable, Pretendard, sans-serif' }}
                        >
                            <span>있는 그대로 기억하세요.</span>
                            <div className="flex items-center gap-1.5">
                                <motion.span
                                    animate={{
                                        textShadow: [
                                            "0 0 0px rgba(99,102,241,0)",
                                            "0 0 15px rgba(99,102,241,0.3)",
                                            "0 0 0px rgba(99,102,241,0)"
                                        ]
                                    }}
                                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                    className="text-primary whitespace-nowrap"
                                >
                                    두뇌 OS
                                </motion.span>
                                <motion.span
                                    initial={{ opacity: 1 }}
                                    animate={{ opacity: [1, 0, 1] }}
                                    transition={{ repeat: Infinity, duration: 0.8, times: [0, 0.5, 1] }}
                                    className="text-primary font-bold mr-1"
                                >
                                    _
                                </motion.span>
                                <span className="text-primary font-bold tracking-widest opacity-90">메밋</span>
                            </div>
                        </motion.div>
                    </div>


                    {/* 2. Main Input Section */}
                    <section className="flex flex-col gap-4">
                        {/* 1. Filter Chips */}
                        <MobileModeTabs currentMode={currentMode} onModeChange={setCurrentMode} />

                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed transition-all duration-300 break-keep px-1 -mt-2">
                            {
                                currentMode === 'password' ? "강력하고 기억하기 쉬운 나만의 암호를 생성하세요." :
                                    currentMode === 'number' ? "숫자를 자음으로 치환하여 이미지로 기억하세요." :
                                        currentMode === 'speech' ? "기억의 궁전을 지어 원고 없이 발표하세요." :
                                            "모든 기억법을 응용해 지식을 구조화하세요."
                            }
                        </p>

                        {/* Collapsible Mnemonic Key (Number mode only) */}
                        {currentMode === 'number' && (
                            <div className="-mt-1">
                                <button
                                    onClick={() => setMnemonicKeyOpen(!mnemonicKeyOpen)}
                                    className="flex items-center gap-1.5 text-sm font-semibold text-primary/80 hover:text-primary active:scale-[0.98] transition-all px-1"
                                >
                                    <Key className="w-3.5 h-3.5" />
                                    <span>기억의 열쇠</span>
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${mnemonicKeyOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {mnemonicKeyOpen && (
                                    <div className="mt-2 p-3 rounded-xl bg-slate-900/60 border border-primary/20 backdrop-blur-sm animate-in slide-in-from-top-2 duration-200">
                                        <div className="grid grid-cols-5 gap-1.5">
                                            {MNEMONIC_MAP.map((item) => {
                                                const isActive = input.includes(item.num);
                                                return (
                                                    <div
                                                        key={item.num}
                                                        className={`
                                                            flex flex-col items-center py-1.5 rounded-lg transition-all duration-200
                                                            ${isActive
                                                                ? 'bg-primary/20 ring-1 ring-primary/50 scale-105'
                                                                : 'bg-white/5 hover:bg-white/10'
                                                            }
                                                        `}
                                                    >
                                                        <span className={`text-[10px] font-bold ${isActive ? 'text-white' : 'text-slate-500'}`}>
                                                            {item.num}
                                                        </span>
                                                        <span className={`text-sm font-bold leading-tight ${isActive ? 'text-primary' : 'text-slate-300'}`}>
                                                            {item.consonants}
                                                        </span>
                                                        <span className={`text-[9px] ${isActive ? 'text-slate-300' : 'text-slate-600'}`}>
                                                            {item.label.split(',')[0]}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div>
                            {/* 2. Magic Input Card */}
                            <MobileMagicInput
                                value={input}
                                onChange={setInput}
                                mode={currentMode}
                                placeholder={
                                    currentMode === 'password' ? "생성할 키워드를 입력하세요 (예: 네이버, 인스타그램)" :
                                        currentMode === 'number' ? "암기할 숫자를 입력하세요 (예: 3.141592)" :
                                            currentMode === 'speech' ? "발표 주제나 핵심 키워드를 입력하세요..." :
                                                "학습할 내용을 입력하거나 이미지를 업로드하세요..."
                                }
                            />
                        </div>

                        {/* Style Selector Toggle */}
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                            <button
                                onClick={() => setUseFourCut(false)}
                                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${!useFourCut
                                    ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                                    }`}
                            >
                                🎨 단일 컷 (웹툰)
                            </button>
                            <button
                                onClick={() => setUseFourCut(true)}
                                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${useFourCut
                                    ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                                    }`}
                            >
                                🧩 4컷 만화
                            </button>
                        </div>

                        <div>
                            <button
                                onClick={handleConvert}
                                disabled={loading || !input.trim()}
                                className={`
                                    w-full py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none
                                    ${input.trim()
                                        ? 'bg-gradient-to-r from-primary to-indigo-600 text-white shadow-primary/30 translate-y-0'
                                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                    }
                                `}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <Zap className="w-5 h-5 text-yellow-300" fill="currentColor" />
                                )}
                                {loading ? '생성 중...' : '메밋 생성하기'}
                            </button>
                        </div>
                    </section>

                    {
                        result && (
                            <div className="mt-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                <ResultCard
                                    input={input}
                                    keywords={result}
                                    story={{ text: story, highlighted: [] }}
                                    imageUrl={imageUrl || undefined}
                                    onSave={handleSave}
                                    onKeywordChange={handleKeywordChange}
                                    onKeywordLockToggle={handleKeywordLockToggle}
                                    onToggleAllLocks={handleToggleAllLocks}
                                    onRememit={handleRememit}
                                    useFourCut={useFourCut}
                                    setUseFourCut={setUseFourCut}
                                    onReset={() => {
                                        setResult(null);
                                        setStory('');
                                        setImageUrl(null);
                                        setInput('');
                                    }}
                                />
                            </div>
                        )
                    }

                    {/* Advanced Generation UI Overlay */}
                    {
                        generatingImage && (
                            <div className="fixed inset-0 z-[100] bg-black/9Center overflow-hidden flex flex-col items-center justify-center p-6 backdrop-blur-xl">
                                <div className="w-full max-w-sm space-y-8 text-center">
                                    {/* Cinema-style Loading Animation */}
                                    <div className="relative aspect-square w-full max-w-[280px] mx-auto overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 animate-pulse"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="relative">
                                                <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                                <Brain className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                                            </div>
                                        </div>
                                        {/* Scanning Light Effect */}
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_rgba(79,70,229,0.8)] animate-scan-y opacity-50"></div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-white tracking-tight animate-pulse">
                                            {generationMessages[generatingMessageIndex]}
                                        </h3>
                                        <p className="text-slate-400 text-sm">기억의 퍼즐을 맞추는 중입니다...</p>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full space-y-2">
                                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary transition-all duration-300 ease-out shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                                                style={{ width: `${generationProgress}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                                            <span>Initialising AI</span>
                                            <span>{Math.round(generationProgress)}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </section >

                {/* Service Link */}
                < section className="px-5 py-4" >
                    <Link href="/memit/services" className="w-full group bg-white dark:bg-[#1e1c30] hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-primary dark:text-indigo-300">
                                <Grid className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg">다른 암기 서비스 보기</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">보안, 비즈니스, 학습 등 더 많은 카테고리</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </Link>
                </section >

                {/* Hall of Fame (Converted to MobileCoverFlow) */}
                < section className="py-8" >
                    <div className="px-5 mb-4">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <TrophyIcon className="w-5 h-5 text-yellow-500" />
                            명예의 전당
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">다른 사용자들이 생성한 놀라운 기억법을 확인하세요.</p>
                    </div>

                    <MobileCoverFlow />
                </section >

                {/* Banner */}
                < section className="px-5 mt-4" >
                    <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-lg group">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10 flex flex-col justify-end p-5">
                            <p className="text-white font-bold text-lg mb-1">기억의 궁전 체험하기</p>
                            <p className="text-white/80 text-xs">지금 무료로 시작하고 뇌 잠재력을 깨우세요.</p>
                        </div>
                        <img className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrjkqA0PK5F73_khPA8VvmE506ni8v1sVeR1FxG5nVj29YRvSwweDOn8TPn2546dAoz8RV3yg9ZZfqQgapNoV31cu2VsB4oeWNgcOabtXViGqVBAsJ-3Rm-9cYPbSqfywvaZr1wdNXID5KZCUHzfJLW8URVRr6itnw5QgKmCkzXf6Ejv6nGXug6V-NNEUYH1PKb3qM18aMmfQHeD_qvdneOaNDvzsAks0nge3-_2CShI8BWHrt1mq-Wyt31opi9wfGYpQikFDgohEu" alt="Banner" />
                    </div>
                </section >
            </main >
        </div >
    );
}

