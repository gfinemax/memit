'use client';

import React, { useState, useEffect } from 'react';
import MnemonicKey from './MnemonicKey';
import { Sparkles, Brain, Info, Copy, Check, ChevronDown, ChevronUp, Pin, Lock, Unlock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { convertNumberAction } from '@/app/actions';
import { openAIStoryService } from '@/lib/openai-story-service';

export default function MemoryGenerator() {
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
    const [copied, setCopied] = useState(false);
    const [strategy, setStrategy] = useState<'SCENE' | 'PAO' | 'STORY_BEAT'>('SCENE');
    const [isSelecting, setIsSelecting] = useState(false);
    const [revealedCount, setRevealedCount] = useState(0);
    const [candidates, setCandidates] = useState<{ chunk: string, words: string[] }[]>([]);
    const [imageType, setImageType] = useState<'single' | 'quad'>('single');
    const [activePopoverIndex, setActivePopoverIndex] = useState<number | null>(null);
    const [isModified, setIsModified] = useState(false);
    const [lastConvertedInput, setLastConvertedInput] = useState('');
    const [lockedIndices, setLockedIndices] = useState<number[]>([]);

    // Password State
    const [passwordLength, setPasswordLength] = useState(12);
    const [includeSpecial, setIncludeSpecial] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [passwordResult, setPasswordResult] = useState('');
    const [passwordCopied, setPasswordCopied] = useState(false);


    const handleConvert = async () => {
        if (!input.trim() || loading) return;
        const isSameInput = input.trim() === lastConvertedInput;

        // Reset and start animation
        setLoading(true);
        setIsSelecting(true);
        setRevealedCount(0);

        // Reset everything if input is different, EXCEPT locked indices
        if (!isSameInput) {
            setResult(null);
            setCandidates([]);
            setIsModified(false);
            setLockedIndices([]); // Decide: clear locks on fresh input? User might want to keep the "positions" locked.
            // Better to clear ALL locks if input length changes radically,
            // but for now let's clear them on input change to avoid confusion.
        }

        setStory(null);
        setImageUrl(null);
        setActivePopoverIndex(null);

        // 1. Basic Conversion
        const res = await convertNumberAction(input);
        if (res.success && res.data) {
            const currentCandidates = res.candidates || [];
            setCandidates(currentCandidates as { chunk: string, words: string[] }[]);

            // 2. AI Story Generation
            if (process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
                try {
                    // Use currently selected words if same input OR if specifically locked
                    const manualKeywords = result ? result.map((word, idx) => {
                        if (isSameInput || lockedIndices.includes(idx)) return word;
                        return undefined;
                    }).filter((w): w is string => w !== undefined) : undefined;

                    // Actually, if we want to preserve ONLY specific indices, we need to handle that in the prompt.
                    // Let's refine manualKeywords to be the full array but with nulls for AI to fill.
                    // But generateStory takes string[]. Let's pass the full 'result' if we want to fix it.

                    const data = await openAIStoryService.generateStory(input, {
                        candidates: currentCandidates,
                        context,
                        strategy,
                        manualKeywords: (isSameInput || lockedIndices.length > 0) ? result || undefined : undefined
                    });

                    // Start Reveal Animation
                    // CRITICAL: result must have the same length as candidates (chunks)
                    // If AI returned fewer keywords, pad with candidates' first words
                    const finalKeywords = Array(currentCandidates.length).fill('').map((_, idx) => {
                        // Priority 1: Locked keyword
                        if (lockedIndices.includes(idx) && result && result[idx]) return result[idx];
                        // Priority 2: AI returned keyword
                        if (data.keywords && data.keywords[idx]) return data.keywords[idx];
                        // Priority 3: Candidate fallback
                        return currentCandidates[idx].words[0] || '???';
                    });

                    setResult(finalKeywords);

                    // Sequentially reveal words
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
                    setStory("스토리 생성 중 오류가 발생했습니다.");
                    setIsSelecting(false);
                    setLoading(false);
                }
            } else {
                setResult(res.data);
                setStory("⚠️ OpenAI API Key가 설정되지 않았습니다.");
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
        // Automatically lock if user manually picked?
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

    const handleRefreshStory = async () => {
        if (!input.trim() || loading || !isModified || !result) return;
        setLoading(true);
        try {
            const data = await openAIStoryService.generateStory(input, {
                candidates,
                context,
                strategy,
                manualKeywords: result
            });
            setStory(data.story);
            setIsModified(false);
            setImageUrl(null); // Story changed, old image might be invalid
        } catch (error) {
            console.error("Story refresh failed:", error);
            setStory("스토리 재생성 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateImage = async () => {
        if (!story || generatingImage) return;
        setGeneratingImage(true);
        try {
            const url = await openAIStoryService.generateImage(story, context, imageType === 'quad');
            setImageUrl(url);
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

    const copyToClipboard = () => {
        if (!result) return;
        navigator.clipboard.writeText(result.join(' '));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const copyPassword = () => {
        if (!passwordResult) return;
        navigator.clipboard.writeText(passwordResult);
        setPasswordCopied(true);
        setTimeout(() => setPasswordCopied(false), 2000);
    };

    return (
        <section className="glass-panel p-8 rounded-3xl relative overflow-hidden group h-full flex flex-col justify-center transition-all duration-500">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-700 pointer-events-none"></div>
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-[#8B5CF6]/20 rounded-full blur-3xl group-hover:bg-[#8B5CF6]/30 transition-all duration-700 pointer-events-none"></div>

            <div className="relative z-10 w-full flex flex-col h-full">
                {/* Header & Tabs */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-[#8B5CF6] text-[11px] font-bold text-white mb-2 shadow-lg shadow-primary/25">
                            <Sparkles className="w-3 h-3" />
                            AI MEMORY GEN
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-bold leading-tight text-white font-display">
                            {activeTab === 'memory' ? '무엇을 기억하고 싶으신가요?' : '강력한 암호를 생성하세요'}
                        </h2>
                    </div>

                    <div className="bg-slate-800/50 p-1 rounded-xl flex self-start md:self-center backdrop-blur-md border border-slate-700/50">
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
                </div>

                <div className="flex-1 flex flex-col justify-center">
                    {activeTab === 'memory' ? (
                        /* Memory Generator UI */
                        <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-500 z-10">
                            <p className="text-slate-400 text-lg font-normal mb-8 leading-relaxed">
                                숫자를 입력하면 한글 자음과 매칭하여<br className="hidden md:block" /> 기억법을 생성합니다.
                            </p>

                            <div className="flex flex-col gap-3 mb-8">
                                <div className="glass-panel border-slate-700/50 rounded-2xl p-2 flex flex-col md:flex-row items-center gap-2 shadow-2xl shadow-black/20 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                                    <div className="flex-1 w-full relative">
                                        <textarea
                                            className="w-full bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 resize-none py-6 px-4 focus:outline-none min-h-[100px] text-center text-4xl font-bold tracking-widest placeholder:text-lg placeholder:font-normal placeholder:tracking-normal"
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
                                        ></textarea>
                                    </div>
                                    <button
                                        disabled={loading}
                                        onClick={handleConvert}
                                        className="w-full md:w-auto px-6 py-4 bg-primary hover:bg-[#6b1cb0] text-white rounded-xl font-medium transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <Brain className="w-5 h-5" />
                                        )}
                                        <span>{loading ? '변환 중...' : '변환하기'}</span>
                                    </button>
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
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Generated Result</span>
                                        <button onClick={copyToClipboard} className="text-slate-400 hover:text-white transition-colors">
                                            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                        </button>
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
                                                                        className={`p-1 rounded-md transition-all hover:bg-white/10 ${isLocked ? 'text-primary opacity-100' : 'text-slate-500 opacity-0 group-hover/card:opacity-100'}`}
                                                                    >
                                                                        {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                                                                    </div>
                                                                </>
                                                            )}
                                                        </motion.div>

                                                        {/* Selection Popover */}
                                                        <AnimatePresence>
                                                            {isMenuOpen && (
                                                                <>
                                                                    <div className="fixed inset-0 z-40" onClick={() => setActivePopoverIndex(null)} />
                                                                    <motion.div
                                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                                                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 bg-slate-900/95 backdrop-blur-xl border border-primary/30 rounded-xl shadow-2xl overflow-hidden min-w-[120px]"
                                                                    >
                                                                        <div className="p-1 px-2 border-b border-primary/10 bg-primary/5">
                                                                            <span className="text-[10px] text-primary/60 font-bold uppercase tracking-wider">단어 교체</span>
                                                                        </div>
                                                                        <div className="p-1">
                                                                            {candidates[i]?.words.map((candidate) => (
                                                                                <button
                                                                                    key={candidate}
                                                                                    onClick={() => handleSingleWordChange(i, candidate)}
                                                                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between group ${candidate === word ? 'bg-primary/20 text-primary-light' : 'text-slate-300 hover:bg-white/5'}`}
                                                                                >
                                                                                    <span>{candidate}</span>
                                                                                    {candidate === word && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
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

                                    {story && (
                                        <div className="pt-4 border-t border-primary/20">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Sparkles className={`w-3 h-3 ${story.includes('⚠️') ? 'text-red-400' : 'text-yellow-300'}`} />
                                                <span className={`text-xs font-bold ${story.includes('⚠️') ? 'text-red-400' : 'text-yellow-300'}`}>
                                                    {story.includes('⚠️') ? 'SYSTEM NOTICE' : 'AI Story'}
                                                </span>
                                            </div>
                                            <div className={`text-sm leading-relaxed font-medium ${story.includes('⚠️') ? 'text-red-300' : 'text-white/90'}`}>
                                                {isSelecting ? (
                                                    <div className="flex gap-1">
                                                        <motion.div initial={{ opacity: 0.3 }} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2 h-4 bg-primary/40 rounded-sm" />
                                                        <motion.div initial={{ opacity: 0.3 }} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-2 h-4 bg-primary/40 rounded-sm" />
                                                        <motion.div initial={{ opacity: 0.3 }} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-2 h-4 bg-primary/40 rounded-sm" />
                                                    </div>
                                                ) : (
                                                    <TypewriterText text={story} />
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-4 pt-4 border-t border-primary/20">
                                        {!imageUrl ? (
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
                                                    disabled={generatingImage}
                                                    className="w-full py-3 bg-gradient-to-r from-purple-600/50 to-pink-600/50 hover:from-purple-600 hover:to-pink-600 border border-white/10 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2 group"
                                                >
                                                    {generatingImage ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                            <span>AI가 {imageType === 'quad' ? '4컷 ' : ''}그림을 그리는 중... (약 10초)</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="text-lg group-hover:scale-110 transition-transform">🎨</span>
                                                            <span>이 장면을 {imageType === 'quad' ? '4컷 ' : ''}그림으로 보기 (DALL-E 3)</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10 group">
                                                <img src={imageUrl} alt="AI Generated Mnemonic" className="w-full h-auto animate-in fade-in duration-700" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded-md text-[10px] text-white/80 font-medium">Generated by DALL-E 3</div>
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
                        /* Password Generator UI */
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <p className="text-slate-400 text-lg font-normal mb-8 leading-relaxed">안전한 비밀번호를 생성하고<br className="hidden md:block" /> 메밋으로 쉽게 기억하세요.</p>
                            <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 mb-6">
                                <div className="flex flex-col gap-6">
                                    <div>
                                        <div className="flex justify-between mb-2"><label className="text-sm font-medium text-slate-300">비밀번호 길이</label><span className="text-sm font-bold text-[#8B5CF6]">{passwordLength}자</span></div>
                                        <input type="range" min="8" max="32" value={passwordLength} onChange={(e) => setPasswordLength(parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#8B5CF6]" />
                                    </div>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer group"><div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${includeNumbers ? 'bg-[#8B5CF6] border-[#8B5CF6]' : 'border-slate-500 group-hover:border-slate-400'}`}>{includeNumbers && <Check className="w-3.5 h-3.5 text-white" />}</div><input type="checkbox" checked={includeNumbers} onChange={() => setIncludeNumbers(!includeNumbers)} className="hidden" /><span className="text-sm text-slate-300 group-hover:text-white transition-colors">숫자 포함</span></label>
                                        <label className="flex items-center gap-2 cursor-pointer group"><div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${includeSpecial ? 'bg-[#8B5CF6] border-[#8B5CF6]' : 'border-slate-500 group-hover:border-slate-400'}`}>{includeSpecial && <Check className="w-3.5 h-3.5 text-white" />}</div><input type="checkbox" checked={includeSpecial} onChange={() => setIncludeSpecial(!includeSpecial)} className="hidden" /><span className="text-sm text-slate-300 group-hover:text-white transition-colors">특수문자 포함</span></label>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2"><button onClick={generatePassword} className="flex-1 py-4 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-xl font-bold transition-all shadow-lg shadow-[#8B5CF6]/30 flex items-center justify-center gap-2 active:scale-[0.98]"><Sparkles className="w-5 h-5 text-yellow-300" /><span>비밀번호 생성하기</span></button></div>
                            {passwordResult && (
                                <div className="mt-6 p-5 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 relative animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="flex items-center justify-between gap-4"><div className="font-mono text-xl sm:text-2xl text-white font-bold tracking-wider break-all">{passwordResult}</div><button onClick={copyPassword} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">{passwordCopied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}</button></div>
                                    <div className="mt-2 text-xs text-[#8B5CF6] font-medium">✨ 안전한 비밀번호가 생성되었습니다.</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
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
