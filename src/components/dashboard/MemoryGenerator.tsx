'use client';

import React, { useState, useEffect } from 'react';
import MnemonicKey from './MnemonicKey';
import { Sparkles, Brain, Info, Copy, Check, ChevronDown, ChevronUp, Lock, Unlock, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { convertNumberAction, saveMemoryAction, generatePasswordFromStoryAction } from '@/app/actions';
import { openAIStoryService } from '@/lib/openai-story-service';

export default function MemoryGenerator({ onMemorySaved, category = 'general' }: { onMemorySaved?: () => void, category?: string }) {
    const [activeTab, setActiveTab] = useState<'memory' | 'password'>('memory');
    const [isKeyExpanded, setIsKeyExpanded] = useState(false);

    // Memory State
    const [input, setInput] = useState('');
    const [context, setContext] = useState('');
    const [result, setResult] = useState<string[] | null>(null);
    const [story, setStory] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [generatingImage, setGeneratingImage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [strategy, setStrategy] = useState<'SCENE' | 'PAO' | 'STORY_BEAT'>('SCENE');
    const [isSelecting, setIsSelecting] = useState(false);
    const [revealedCount, setRevealedCount] = useState(0);
    const [candidates, setCandidates] = useState<{ chunk: string, words: string[] }[]>([]);
    const [imageType, setImageType] = useState<'single' | 'quad'>('single');
    const [activePopoverIndex, setActivePopoverIndex] = useState<number | null>(null);
    const [isModified, setIsModified] = useState(false);
    const [lastConvertedInput, setLastConvertedInput] = useState('');
    const [lockedIndices, setLockedIndices] = useState<number[]>([]);
    const [saving, setSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isEditingStory, setIsEditingStory] = useState(false);

    // Password State
    const [passwordLength, setPasswordLength] = useState(12);
    const [includeSpecial, setIncludeSpecial] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [passwordResult, setPasswordResult] = useState('');
    const [passwordCopied, setPasswordCopied] = useState(false);
    const [passwordStory, setPasswordStory] = useState('');
    const [passwordMapping, setPasswordMapping] = useState<{ word: string, code: string }[]>([]);
    const [generatingStoryPassword, setGeneratingStoryPassword] = useState(false);

    // Ghost Prompt State
    const [ghostInput, setGhostInput] = useState('');
    const [isGhostTyping, setIsGhostTyping] = useState(true);
    const ghostExamples = ['3755', '100482', '24681357']; // 4, 6, 8 digits
    const [ghostIndex, setGhostIndex] = useState(0);
    const [showPlaceholder, setShowPlaceholder] = useState(true);


    const handleConvert = async () => {
        if (!input.trim() || loading) return;
        const isSameInput = input.trim() === lastConvertedInput;

        setLoading(true);
        setIsSelecting(true);
        setRevealedCount(0);

        if (!isSameInput) {
            setResult(null);
            setCandidates([]);
            setIsModified(false);
            setLockedIndices([]);
        }

        setStory(null);
        setImageUrl(null);
        setActivePopoverIndex(null);
        setIsEditingStory(false);

        const res = await convertNumberAction(input);
        if (res.success && res.data) {
            const currentCandidates = res.candidates || [];
            setCandidates(currentCandidates as { chunk: string, words: string[] }[]);

            try {
                const data = await openAIStoryService.generateStory(input, {
                    candidates: currentCandidates,
                    context,
                    strategy,
                    manualKeywords: (isSameInput || lockedIndices.length > 0) ? result || undefined : undefined
                });

                const finalKeywords = Array(currentCandidates.length).fill('').map((_, idx) => {
                    if (lockedIndices.includes(idx) && result && result[idx]) return result[idx];
                    if (data.keywords && data.keywords[idx]) return data.keywords[idx];
                    return currentCandidates[idx].words[0] || '???';
                });

                setResult(finalKeywords);

                for (let i = 1; i <= finalKeywords.length; i++) {
                    await new Promise(r => setTimeout(r, 400));
                    setRevealedCount(i);
                }

                setStory(data.story);
                setIsSelecting(false);
                setLoading(false);
                setLastConvertedInput(input.trim());
            } catch (error) {
                console.error("AI Story generation failed:", error);
                setResult(res.data);
                setStory("스토리 생성 중 오류가 발생했습니다.");
                setRevealedCount(res.data.length);
                setIsSelecting(false);
                setLoading(false);
                setLastConvertedInput(input.trim());
            }
        } else {
            setLoading(false);
            setIsSelecting(false);
            setImageUrl(null);
        }
    };

    const handleSingleWordChange = (index: number, newWord: string) => {
        if (!result) return;
        const newResult = [...result];
        newResult[index] = newWord;
        setResult(newResult);
        setIsModified(true);
        setActivePopoverIndex(null);
        if (!lockedIndices.includes(index)) {
            setLockedIndices([...lockedIndices, index]);
        }
    };

    const toggleLock = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        if (lockedIndices.includes(index)) {
            setLockedIndices(lockedIndices.filter(i => i !== index));
        } else {
            setLockedIndices([...lockedIndices, index]);
        }
    };

    const toggleAllLocks = () => {
        if (!result) return;
        if (lockedIndices.length === result.length) {
            setLockedIndices([]);
        } else {
            setLockedIndices(result.map((_, i) => i));
        }
    };

    const [generatingMessageIndex, setGeneratingMessageIndex] = useState(0);
    const [generationProgress, setGenerationProgress] = useState(0);

    // Ghost Typing Effect
    useEffect(() => {
        if (input.length > 0) {
            setGhostInput('');
            setShowPlaceholder(false);
            return;
        }

        // Initial delay for placeholder visibility (3 seconds)
        if (showPlaceholder) {
            const initialTimeout = setTimeout(() => {
                setShowPlaceholder(false);
            }, 3000);
            return () => clearTimeout(initialTimeout);
        }

        let timeout: NodeJS.Timeout;
        const currentExample = ghostExamples[ghostIndex];

        if (isGhostTyping) {
            if (ghostInput.length < currentExample.length) {
                // First character waits for dissolve animation (1200ms)
                const delay = ghostInput.length === 0 ? 1200 : 250;
                timeout = setTimeout(() => {
                    setGhostInput(currentExample.slice(0, ghostInput.length + 1));
                }, delay);
            } else {
                // Wait after typing full example
                timeout = setTimeout(() => {
                    setIsGhostTyping(false);
                }, 2000);
            }
        } else {
            // Backspacing/Deleting
            if (ghostInput.length > 0) {
                timeout = setTimeout(() => {
                    setGhostInput(ghostInput.slice(0, -1));
                }, 100);
            } else {
                // Move to next stage
                const nextIndex = (ghostIndex + 1) % ghostExamples.length;
                setGhostIndex(nextIndex);
                setIsGhostTyping(true);

                // After finishing 4, 6, 8 digit loop, go back to placeholder
                if (nextIndex === 0) {
                    setShowPlaceholder(true);
                }
            }
        }

        return () => clearTimeout(timeout);
    }, [input, ghostInput, isGhostTyping, ghostIndex, showPlaceholder]);

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
        let interval: NodeJS.Timeout;
        let msgInterval: NodeJS.Timeout;

        if (generatingImage) {
            setGenerationProgress(0);
            setGeneratingMessageIndex(0);

            // Progress bar logic (roughly 30 seconds)
            interval = setInterval(() => {
                setGenerationProgress(prev => {
                    if (prev >= 95) return prev; // Hold at 95% until done
                    return prev + (100 / (30 * 10)); // ~30 seconds for 100%
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

    const handleGenerateImage = async () => {
        if (!story || generatingImage) return;
        setGeneratingImage(true);
        try {
            const url = await openAIStoryService.generateImage(story, context, imageType === 'quad');
            setImageUrl(url);
            setGenerationProgress(100);
        } catch (error: any) {
            console.error("Image generation failed:", error);
            if (error.message === "SAFETY_FILTER_TRIGGERED") {
                alert("스토리가 너무 자극적이거나 위험 요소가 포함되어 이미지 생성이 차단되었습니다. 조금 더 부드러운 맥락(Context)을 입력해 보시겠어요? 🎨");
            } else {
                alert("이미지 생성 중 오류가 발생했습니다. 다시 시도해 주세요.");
            }
        }
        setGeneratingImage(false);
    };

    const handleSaveMemory = async () => {
        if (!result || !story || saving || isSaved) return;
        setSaving(true);
        try {
            const res = await saveMemoryAction({
                input_number: lastConvertedInput || input,
                keywords: result,
                story: story,
                image_url: imageUrl || undefined,
                context: context || undefined,
                strategy: strategy,
                category: category
            });
            if (res.success) {
                setIsSaved(true);
                if (onMemorySaved) onMemorySaved();
                setTimeout(() => setIsSaved(false), 3000);
            } else {
                alert(res.error || "저장에 실패했습니다.");
            }
        } catch (error) {
            console.error("Save error:", error);
            alert("저장 중 오류가 발생했습니다.");
        } finally {
            setSaving(false);
        }
    };

    const generatePassword = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const nums = "0123456789";
        const special = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

        let allowed = chars;
        if (includeNumbers) allowed += nums;
        if (includeSpecial) allowed += special;

        let password = "";
        for (let i = 0; i < passwordLength; i++) {
            const randomIndex = Math.floor(Math.random() * allowed.length);
            password += allowed[randomIndex];
        }
        setPasswordResult(password);
    };

    const copyPassword = () => {
        if (!passwordResult) return;
        navigator.clipboard.writeText(passwordResult);
        setPasswordCopied(true);
        setTimeout(() => setPasswordCopied(false), 2000);
    };

    return (
        <section className="glass-panel p-8 rounded-3xl relative group h-full flex flex-col justify-center transition-all duration-500">
            {/* Background Decorations Container - to prevent blobs from overflowing but allow popovers to show */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-700"></div>
                <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-[#8B5CF6]/20 rounded-full blur-3xl group-hover:bg-[#8B5CF6]/30 transition-all duration-700"></div>
            </div>

            <div className="relative z-10 w-full flex flex-col h-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-[#8B5CF6] text-[11px] font-bold text-white mb-2 shadow-lg shadow-primary/25">
                            <Sparkles className="w-3 h-3" />
                            AI MEMORY GEN
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-bold leading-tight text-white font-display">
                            {activeTab === 'memory' ? '오늘의 기억을 메밋할 시간입니다' : '강력한 암호를 생성하세요'}
                        </h2>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                    <p className="text-slate-400 text-lg font-normal mb-4 leading-relaxed">
                        {activeTab === 'memory'
                            ? '숫자를 입력하면 한글 자음과 매칭하여 기억법을 생성합니다.'
                            : '기억하고 싶은 스토리나 맥락을 입력하세요. AI가 기억법과 매칭되는 보안 숫자를 생성합니다.'}
                    </p>

                    <div className="bg-slate-800/50 p-1 rounded-xl flex self-start backdrop-blur-md border border-slate-700/50 mb-6">
                        <button
                            onClick={() => setActiveTab('memory')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'memory' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            숫자 암기
                        </button>
                        <button
                            onClick={() => setActiveTab('password')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'password' ? 'bg-[#8B5CF6] text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            비밀번호 생성
                        </button>
                    </div>

                    {activeTab === 'memory' ? (
                        <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-500 z-10">

                            <div className="flex flex-col gap-3 mb-8">
                                <div className="lighting-border group p-[4px] rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                                    <div className="relative z-10 bg-white rounded-2xl p-2 flex flex-col md:flex-row items-center gap-2 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] transition-all overflow-hidden focus-within:shadow-[inset_0_2px_15px_rgba(168,85,247,0.15)]">
                                        <div className="flex-1 w-full relative min-h-[140px] flex items-center justify-center">
                                            {/* Hidden but functional textarea */}
                                            <textarea
                                                className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-text focus:outline-none"
                                                placeholder="기억할 숫자를 입력하세요"
                                                rows={1}
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleConvert();
                                                    }
                                                }}
                                                autoFocus
                                            ></textarea>

                                            {/* Visual Segmented Slots */}
                                            <div className="flex flex-nowrap items-center justify-center gap-2 md:gap-4 z-10 pointer-events-none w-full overflow-hidden">
                                                <AnimatePresence mode="wait">
                                                    {input.length === 0 && showPlaceholder ? (
                                                        <motion.div
                                                            key="placeholder"
                                                            initial={{ opacity: 0, y: 0 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, filter: 'blur(8px)', scale: 1.05 }}
                                                            transition={{ duration: 1.2, ease: "easeInOut" }}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <span className="text-slate-400 text-2xl md:text-4xl font-medium tracking-tight">
                                                                기억할 숫자를 입력해주세요
                                                            </span>
                                                        </motion.div>
                                                    ) : input.length === 0 ? (
                                                        // Ghost Prompt Mode (Typing)
                                                        <motion.div
                                                            key="ghost-typing"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            className="flex flex-nowrap gap-2 md:gap-4"
                                                        >
                                                            {ghostInput.split('').map((char, i) => (
                                                                <div
                                                                    key={`ghost-${i}`}
                                                                    className="w-10 h-14 md:w-16 md:h-24 bg-white/50 border-2 border-primary/10 rounded-2xl flex items-center justify-center text-2xl md:text-5xl font-black text-slate-300 transition-all duration-300 animate-pulse shrink-0"
                                                                    style={{
                                                                        filter: 'blur(0.8px)',
                                                                        opacity: 0.3 + (i * 0.05), // Increased base opacity
                                                                        boxShadow: '0 0 10px rgba(168, 85, 247, 0.05)',
                                                                    }}
                                                                >
                                                                    {char}
                                                                </div>
                                                            ))}
                                                            {/* Animated Cursor (Ghost) */}
                                                            <div className="w-1 h-6 md:h-10 bg-primary/30 rounded-full animate-bounce shadow-[0_0_10px_rgba(168,85,247,0.2)] ml-1 self-center translate-y-[8px]" />
                                                        </motion.div>
                                                    ) : (
                                                        // Real Input Mode
                                                        <motion.div
                                                            key="real-input"
                                                            className="flex flex-nowrap gap-2 md:gap-4"
                                                        >
                                                            {input.split('').map((char, i) => (
                                                                <div
                                                                    key={i}
                                                                    className="w-10 h-14 md:w-16 md:h-24 bg-white border-2 border-primary/20 rounded-2xl flex items-center justify-center text-2xl md:text-5xl font-black text-slate-900 shadow-[0_8px_20px_rgba(168,85,247,0.06)] animate-in zoom-in-95 slide-in-from-bottom-2 duration-200 shrink-0"
                                                                    style={{
                                                                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02), 0 10px 15px -3px rgba(168, 85, 247, 0.1)',
                                                                        borderColor: 'rgba(168, 85, 247, 0.25)'
                                                                    }}
                                                                >
                                                                    {char}
                                                                </div>
                                                            ))}
                                                            {/* Animated Cursor (Real) */}
                                                            <div className="w-1.5 h-8 md:h-12 bg-primary/60 rounded-full animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.4)] ml-1 self-center translate-y-[8px]" />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                        <button
                                            disabled={loading}
                                            onClick={handleConvert}
                                            className="w-full md:w-auto px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 active:scale-95"
                                        >
                                            {loading ? (
                                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <Brain className="w-5 h-5" />
                                            )}
                                            <span>{loading ? '메밋 중...' : '메밋하기'}</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Brain className="w-3 h-3 text-primary" />
                                        <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Mnemonic Strategy</span>
                                    </div>
                                    <div className="bg-slate-900/40 p-1 rounded-xl flex gap-1 border border-slate-700/50 backdrop-blur-sm">
                                        <button onClick={() => setStrategy('SCENE')} className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${strategy === 'SCENE' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>장면 카드</button>
                                        <button onClick={() => setStrategy('PAO')} className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${strategy === 'PAO' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>PAO 모드</button>
                                        <button onClick={() => setStrategy('STORY_BEAT')} className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${strategy === 'STORY_BEAT' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>스토리 비트</button>
                                    </div>
                                </div>

                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                        <span className="text-slate-500">🏷️</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={context}
                                        onChange={(e) => setContext(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') handleConvert(); }}
                                        placeholder="어떤 숫자인가요? (예: 현관 비밀번호, 어머니 생신) - 스토리에 반영됩니다."
                                        className="w-full bg-slate-900/40 border border-slate-700/50 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all hover:bg-slate-900/60"
                                    />
                                </div>
                            </div>

                            {result && (
                                <div className="mt-6 p-5 rounded-2xl bg-primary/10 border border-primary/20 relative animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Generated Result</span>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={toggleAllLocks}
                                                className="p-1.5 rounded-md hover:bg-white/10 transition-colors group/masterlock flex items-center justify-center"
                                                title={lockedIndices.length === result.length ? "전체 고정 해제" : "전체 단어 고정"}
                                            >
                                                {lockedIndices.length === result.length ? (
                                                    <Lock className="w-4 h-4 text-primary" />
                                                ) : (
                                                    <Unlock className="w-4 h-4 text-slate-500 hover:text-slate-300 transform -scale-x-100 -rotate-[20deg]" />
                                                )}
                                            </button>

                                            <button
                                                onClick={handleSaveMemory}
                                                disabled={saving || isSaved}
                                                className={`p-1.5 rounded-md transition-all flex items-center justify-center ${isSaved ? 'text-green-400' : 'text-slate-500 hover:text-white hover:bg-white/10'}`}
                                                title="내 컬렉션에 저장"
                                            >
                                                {saving ? (
                                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                                ) : isSaved ? (
                                                    <Check className="w-4 h-4" />
                                                ) : (
                                                    <Bookmark className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3 mb-6 min-h-[60px] justify-center items-center">
                                        <AnimatePresence mode="popLayout" initial={false}>
                                            {result.slice(0, Math.max(revealedCount, isSelecting ? result.length : 0)).map((word, i) => {
                                                const isRevealed = i < revealedCount;
                                                const isMenuOpen = activePopoverIndex === i;
                                                const isLocked = lockedIndices.includes(i);

                                                if (!isSelecting && !isRevealed) return null;

                                                return (
                                                    <div key={`key-container-${i}`} className="relative group/card">
                                                        <motion.div
                                                            layout
                                                            initial={{ opacity: 0, scale: 0.5 }}
                                                            animate={{
                                                                opacity: 1,
                                                                scale: isRevealed ? [1.1, 1] : 1,
                                                                borderColor: isMenuOpen ? 'rgb(168, 85, 247)' : (isLocked ? 'rgb(168, 85, 247)' : (isRevealed ? 'rgba(168, 85, 247, 0.4)' : 'rgba(30, 41, 59, 0.5)'))
                                                            }}
                                                            exit={{ opacity: 0, scale: 0.5 }}
                                                            onClick={() => isRevealed && !loading && setActivePopoverIndex(isMenuOpen ? null : i)}
                                                            className={`px-4 py-2 bg-slate-900/80 rounded-lg text-white font-bold text-lg shadow-sm border transition-all cursor-pointer select-none active:scale-95 flex items-center gap-2 ${isRevealed ? 'border-primary shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:border-primary-light hover:bg-slate-800' : 'border-slate-800'}`}
                                                        >
                                                            {!isRevealed ? (
                                                                <ShuffleSlot words={candidates[i]?.words || ['···', '???', 'AI']} isSelecting={isSelecting} />
                                                            ) : (
                                                                <>
                                                                    <motion.span
                                                                        key={word}
                                                                        initial={{ y: 5, opacity: 0 }}
                                                                        animate={{ y: 0, opacity: 1 }}
                                                                        className="inline-block"
                                                                    >
                                                                        {word}
                                                                    </motion.span>
                                                                    <div
                                                                        onClick={(e) => toggleLock(e, i)}
                                                                        className={`p-1 rounded-md transition-all hover:bg-white/10 flex items-center justify-center ${isLocked ? 'text-primary' : 'text-slate-500/60 hover:text-slate-400'}`}
                                                                    >
                                                                        {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                                                                    </div>
                                                                </>
                                                            )}
                                                        </motion.div>

                                                        <AnimatePresence>
                                                            {isMenuOpen && (
                                                                <>
                                                                    <div className="fixed inset-0 z-40" onClick={() => setActivePopoverIndex(null)} />
                                                                    <motion.div
                                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                                                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 bg-slate-900/95 backdrop-blur-xl border border-primary/30 rounded-xl shadow-2xl overflow-hidden min-w-[180px]"
                                                                    >
                                                                        <div className="p-1 px-2 border-b border-primary/10 bg-primary/5">
                                                                            <span className="text-[10px] text-primary/60 font-bold uppercase tracking-wider">단어 교체</span>
                                                                        </div>
                                                                        <div className="p-1 grid grid-cols-2 gap-1">
                                                                            {candidates[i]?.words.map((candidate) => (
                                                                                <button
                                                                                    key={candidate}
                                                                                    onClick={() => handleSingleWordChange(i, candidate)}
                                                                                    className={`w-full text-left px-2 py-2 rounded-lg text-sm transition-colors flex items-center justify-between group ${candidate === word ? 'bg-primary/20 text-primary-light' : 'text-slate-300 hover:bg-white/5'}`}
                                                                                >
                                                                                    <span className="truncate">{candidate}</span>
                                                                                    {candidate === word && <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 ml-1 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />}
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    </motion.div>
                                                                </>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                );
                                            })}
                                        </AnimatePresence>
                                    </div>

                                    {story !== null && (
                                        <div className="pt-4 border-t border-primary/20">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Sparkles className={`w-3 h-3 ${story.includes('⚠️') ? 'text-red-400' : 'text-yellow-300'}`} />
                                                    <span className={`text-xs font-bold ${story.includes('⚠️') ? 'text-red-400' : 'text-yellow-300'}`}>
                                                        {story.includes('⚠️') ? 'SYSTEM NOTICE' : 'AI Story'}
                                                    </span>
                                                </div>

                                                {!isSelecting && !story.includes('⚠️') && (
                                                    <button
                                                        onClick={() => setIsEditingStory(!isEditingStory)}
                                                        className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all flex items-center gap-1 ${isEditingStory ? 'bg-primary text-white' : 'text-slate-500 hover:text-primary hover:bg-primary/10'}`}
                                                    >
                                                        {isEditingStory ? '수정 완료' : '스토리 수정'}
                                                    </button>
                                                )}
                                            </div>

                                            <div className={`text-sm leading-relaxed font-medium ${story.includes('⚠️') ? 'text-red-300' : 'text-white/90'}`}>
                                                {isSelecting ? (
                                                    <div className="flex gap-1">
                                                        <motion.div initial={{ opacity: 0.3 }} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2 h-4 bg-primary/40 rounded-sm" />
                                                        <motion.div initial={{ opacity: 0.3 }} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-2 h-4 bg-primary/40 rounded-sm" />
                                                        <motion.div initial={{ opacity: 0.3 }} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-2 h-4 bg-primary/40 rounded-sm" />
                                                    </div>
                                                ) : isEditingStory ? (
                                                    <textarea
                                                        value={story}
                                                        onChange={(e) => setStory(e.target.value)}
                                                        className="w-full bg-slate-900/60 border border-primary/30 rounded-xl p-4 text-sm text-white/90 focus:outline-none focus:ring-1 focus:ring-primary/50 min-h-[100px] resize-none leading-relaxed transition-all"
                                                        placeholder="나만의 스토리로 수정해 보세요..."
                                                    />
                                                ) : (
                                                    <TypewriterText text={story} />
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-4 pt-4 border-t border-primary/20">
                                        {!imageUrl && !generatingImage ? (
                                            <div className="space-y-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setImageType('single')}
                                                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${imageType === 'single' ? 'bg-primary/20 border-primary text-white' : 'bg-slate-900/40 border-slate-700/50 text-slate-500'}`}
                                                    >
                                                        1컷 요약
                                                    </button>
                                                    <button
                                                        onClick={() => setImageType('quad')}
                                                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${imageType === 'quad' ? 'bg-primary/20 border-primary text-white' : 'bg-slate-900/40 border-slate-700/50 text-slate-500'}`}
                                                    >
                                                        4컷 스토리
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={handleGenerateImage}
                                                    className="w-full py-3 bg-gradient-to-r from-purple-600/50 to-pink-600/50 hover:from-purple-600 hover:to-pink-600 border border-white/10 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
                                                >
                                                    <span className="text-lg group-hover:scale-110 transition-transform">🎨</span>
                                                    <span>이 장면을 {imageType === 'quad' ? '4컷 ' : ''}그림으로 보기 (DALL-E 3)</span>
                                                </button>
                                            </div>
                                        ) : generatingImage ? (
                                            <div className="space-y-4 animate-in fade-in duration-500">
                                                <div className="relative h-64 w-full bg-slate-900/60 rounded-2xl border border-primary/20 overflow-hidden flex flex-col items-center justify-center p-6 text-center">
                                                    {/* Scanning Effect */}
                                                    <motion.div
                                                        animate={{ top: ['0%', '100%', '0%'] }}
                                                        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                                        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent z-10"
                                                        style={{ top: '0%' }}
                                                    />

                                                    <div className="relative z-20 space-y-4">
                                                        <div className="flex justify-center flex-wrap gap-2">
                                                            <motion.div
                                                                animate={{ rotate: 360 }}
                                                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                                                className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full mb-2"
                                                            />
                                                        </div>

                                                        <AnimatePresence mode="wait">
                                                            <motion.div
                                                                key={generatingMessageIndex}
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -10 }}
                                                                className="h-12 flex flex-col items-center justify-center"
                                                            >
                                                                <p className="text-sm font-bold text-white/90 drop-shadow-sm">
                                                                    {generationMessages[generatingMessageIndex]}
                                                                </p>
                                                                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest animate-pulse">
                                                                    Processing Memory Frame...
                                                                </p>
                                                            </motion.div>
                                                        </AnimatePresence>
                                                    </div>

                                                    <div className="absolute bottom-6 left-6 right-6 space-y-2">
                                                        <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                                                            <span>Developing Image</span>
                                                            <span>{Math.round(generationProgress)}%</span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
                                                            <motion.div
                                                                className="h-full bg-gradient-to-r from-primary via-[#8B5CF6] to-pink-500"
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${generationProgress}%` }}
                                                                transition={{ duration: 0.3 }}
                                                            />
                                                        </div>
                                                        <p className="text-[10px] text-primary/60 font-medium">최신 DALL-E 3 모델을 사용하여 약 30초가 소요됩니다.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10 group animate-in zoom-in-95 duration-700">
                                                <img src={imageUrl!} alt="AI Generated Mnemonic" className="w-full h-auto" />
                                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-end">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-white/60 font-bold tracking-widest uppercase">Generated Artwork</span>
                                                        <span className="text-xs text-white font-medium">By DALL-E 3 (High Quality)</span>
                                                    </div>
                                                    <button
                                                        onClick={() => setImageUrl(null)}
                                                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 transition-colors text-xs"
                                                    >
                                                        다시 그리기
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="mt-3 flex items-center gap-4 text-xs text-slate-400 px-2">
                                <span className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors"><Info className="w-3 h-3" /> 기본 원칙 적용 중</span>
                                <span className="ml-auto">Ctrl + Enter로 전송</span>
                            </div>

                            <div className="mt-4">
                                <button onClick={() => setIsKeyExpanded(!isKeyExpanded)} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-primary transition-colors mx-auto px-4 py-2 rounded-full hover:bg-white/5">
                                    {isKeyExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}기억의 열쇠 {isKeyExpanded ? '접기' : '펼치기'}
                                </button>
                                <div className={`transition-all duration-300 ease-in-out ${isKeyExpanded ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                    <MnemonicKey activeNumber={input.replace(/[^0-9]/g, '')} isExpanded={isKeyExpanded} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

                            <div className="flex flex-col gap-3 mb-8">
                                <div className="lighting-border group p-[3px] rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                                    <div className="relative z-10 bg-white rounded-2xl p-2 flex flex-col items-center gap-2 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] transition-all overflow-hidden focus-within:shadow-[inset_0_2px_15px_rgba(168,85,247,0.15)]">
                                        <div className="flex-1 w-full relative flex items-center justify-center min-h-[120px]">
                                            <textarea
                                                className="w-full bg-transparent border-none text-slate-900 placeholder-slate-400 focus:ring-0 resize-none py-4 px-6 focus:outline-none text-center text-xl font-medium leading-relaxed placeholder:text-lg placeholder:font-normal"
                                                placeholder="예: 우리 집 강아지 해피의 생일과 좋아하는 간식"
                                                rows={2}
                                                value={passwordStory}
                                                onChange={(e) => setPasswordStory(e.target.value)}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={async () => {
                                        if (!passwordStory.trim() || generatingStoryPassword) return;
                                        setGeneratingStoryPassword(true);
                                        const res = await generatePasswordFromStoryAction(passwordStory);
                                        if (res.success && res.data) {
                                            setPasswordResult(res.data.password);
                                            setPasswordMapping(res.data.mapping);
                                        } else {
                                            alert(res.error || '실패했습니다.');
                                        }
                                        setGeneratingStoryPassword(false);
                                    }}
                                    disabled={generatingStoryPassword}
                                    className="w-full py-4 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-xl font-bold transition-all shadow-lg shadow-[#8B5CF6]/30 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                                >
                                    {generatingStoryPassword ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Sparkles className="w-5 h-5 text-yellow-300" />
                                    )}
                                    <span>{generatingStoryPassword ? '분석 중...' : '스토리로 비밀번호 만들기'}</span>
                                </button>
                            </div>

                            {passwordResult && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="p-6 rounded-2xl bg-white shadow-xl border border-primary/10 relative">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Generated Password</span>
                                                <div className="font-mono text-4xl text-slate-900 font-black tracking-[0.2em]">
                                                    {passwordResult}
                                                </div>
                                            </div>
                                            <button onClick={copyPassword} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-primary transition-all active:scale-90 border border-slate-100">
                                                {passwordCopied ? <Check className="w-6 h-6 text-green-500" /> : <Copy className="w-6 h-6" />}
                                            </button>
                                        </div>
                                    </div>

                                    {passwordMapping.length > 0 && (
                                        <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl p-5 border border-primary/20">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Brain className="w-4 h-4 text-primary" />
                                                <span className="text-xs font-bold text-primary-light uppercase tracking-wider">기억 가이드 (Recall Helper)</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {passwordMapping.map((item, idx) => (
                                                    <div key={idx} className="flex items-center bg-slate-800 rounded-lg px-3 py-2 border border-white/5">
                                                        <span className="text-slate-300 text-sm mr-2">{item.word}</span>
                                                        <span className="text-primary font-mono font-bold text-lg leading-none">{item.code}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="mt-4 text-[11px] text-slate-500 italic">
                                                * 스토리 속 단어들을 순서대로 기억하면 번호가 자동으로 떠오릅니다.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="mt-8 pt-8 border-t border-slate-800/50">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Info className="w-3 h-3" /> 기존 방식 (보안 전문가 추천)
                                </h4>
                                <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
                                    <div className="flex flex-col gap-6">
                                        <div>
                                            <div className="flex justify-between mb-2"><label className="text-sm font-medium text-slate-300">비밀번호 길이</label><span className="text-sm font-bold text-[#8B5CF6]">{passwordLength}자</span></div>
                                            <input type="range" min="8" max="32" value={passwordLength} onChange={(e) => setPasswordLength(parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#8B5CF6]" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer group bg-slate-900/50 p-3 rounded-xl border border-white/5 hover:border-primary/30 transition-all">
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${includeNumbers ? 'bg-[#8B5CF6] border-[#8B5CF6]' : 'border-slate-500 group-hover:border-slate-400'}`}>
                                                    {includeNumbers && <Check className="w-3.5 h-3.5 text-white" />}
                                                </div>
                                                <input type="checkbox" checked={includeNumbers} onChange={() => setIncludeNumbers(!includeNumbers)} className="hidden" />
                                                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">숫자 포함</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer group bg-slate-900/50 p-3 rounded-xl border border-white/5 hover:border-primary/30 transition-all">
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${includeSpecial ? 'bg-[#8B5CF6] border-[#8B5CF6]' : 'border-slate-500 group-hover:border-slate-400'}`}>
                                                    {includeSpecial && <Check className="w-3.5 h-3.5 text-white" />}
                                                </div>
                                                <input type="checkbox" checked={includeSpecial} onChange={() => setIncludeSpecial(!includeSpecial)} className="hidden" />
                                                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">특수문자 포함</span>
                                            </label>
                                        </div>
                                        <button onClick={generatePassword} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-sm font-bold transition-all border border-white/5">랜덤 생성하기</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section >
    );
}

function ShuffleSlot({ words, isSelecting = true }: { words: string[], isSelecting?: boolean }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (!isSelecting) return;
        const interval = setInterval(() => {
            setIndex(prev => (prev + 1) % words.length);
        }, 100);
        return () => clearInterval(interval);
    }, [words, isSelecting]);

    return (
        <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            className="inline-block min-w-[3ch] text-center"
        >
            {words[index]}
        </motion.span>
    );
}

function TypewriterText({ text }: { text: string }) {
    const [displayedText, setDisplayedText] = useState('');
    const [index, setIndex] = useState(0);

    useEffect(() => {
        setDisplayedText('');
        setIndex(0);
    }, [text]);

    useEffect(() => {
        if (index < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + text[index]);
                setIndex(prev => prev + 1);
            }, 30);
            return () => clearTimeout(timeout);
        }
    }, [index, text]);

    const renderStory = (content: string) => {
        if (!content) return null;
        const parts = content.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return (
                    <span key={i} className="text-primary-light font-bold drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">
                        {part.slice(2, -2)}
                    </span>
                );
            }
            return part;
        });
    };

    return (
        <p className="relative">
            {renderStory(displayedText)}
            {index < text.length && (
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                    className="inline-block w-1.5 h-4 bg-primary align-middle ml-1"
                />
            )}
        </p>
    );
}
