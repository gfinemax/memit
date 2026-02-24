import React, { useState } from 'react';
import { Brain, Sparkles, AlertTriangle, ShieldCheck, Tag, Copy, Lock, Unlock, ArrowRight, Check, Bookmark, Share2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Define the type for passwordScenes content
interface PasswordSceneContent {
    type: string;
    content?: string;
    complexData?: any; // Adjust this type if complexData structure is known
}

// Define the interface for passwordProps
interface PasswordProps {
    passwordLevel: 'L1_PIN' | 'L2_WEB' | 'L3_MASTER';
    setPasswordLevel: (level: 'L1_PIN' | 'L2_WEB' | 'L3_MASTER') => void;
    serviceName: string;
    setServiceName: (name: string) => void;
    coreNumber: string;
    setCoreNumber: (num: string) => void;
    specialSymbol: string;
    setSpecialSymbol: (symbol: string) => void;
    hintKeyword: string;
    setHintKeyword: (keyword: string) => void;
    activeTheme: string | null;
    setActiveTheme: (theme: string | null) => void;
    passwordResult: string;
    setPasswordResult: (res: string) => void;
    passwordCopied: boolean;
    currentSceneIndex: number;
    passwordScenes: Record<string, PasswordSceneContent[]>;
    pinLength: 4 | 6 | 8;
    setPinLength: (len: 4 | 6 | 8) => void;
    pin8SplitMode: '4+4' | '6+2' | '4+2+2' | '자유';
    setPin8SplitMode: (mode: '4+4' | '6+2' | '4+2+2' | '자유') => void;
    isCustomLength: boolean;
    setIsCustomLength: (custom: boolean) => void;
    getLengthForLevel: (level: string) => number;
    handleThemeClick: (theme: string) => void;
    handleHintChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    generatePassword: () => void;
    copyPassword: () => void;
    handleConvert: (
        customWords?: string[] | null,
        forcedInput?: string,
        theme?: string,
        onInputUpdate?: (val: string) => void,
        onResultUpdate?: (res: string) => void
    ) => void;
    themeDatasets: Record<string, string[]>;
    handleSuggestionClick: (word: string) => void;
}

export function PasswordTab({ passwordProps, memoryProps }: { passwordProps: PasswordProps, memoryProps: any }) {
    const {
        passwordLevel, setPasswordLevel,
        serviceName, setServiceName,
        coreNumber, setCoreNumber,
        specialSymbol, setSpecialSymbol,
        hintKeyword, setHintKeyword,
        activeTheme, setActiveTheme,
        passwordResult, setPasswordResult,
        passwordCopied,
        currentSceneIndex,
        passwordScenes,
        pinLength, setPinLength,
        isCustomLength, setIsCustomLength,
        getLengthForLevel,
        handleThemeClick,
        handleHintChange,
        generatePassword,
        copyPassword,
        handleConvert,
        themeDatasets,
        handleSuggestionClick,
    } = passwordProps;

    const {
        loading,
        result: memoryResult,
        story: memoryStory,
        imageUrl: memoryImageUrl,
        isSelecting,
        revealedCount,
        candidates,
        activePopoverIndex,
        setActivePopoverIndex,
        lockedIndices,
        toggleLock,
        handleSingleWordChange,
        handleSaveMemory,
        saving,
        isSaved,
        handleOpenShareModal,
        isCapturing,
        toggleAllLocks,
        imageType,
        setImageType,
        handleGenerateImage,
        generatingImage,
        generatingMessageIndex,
        generationProgress,
        generationMessages
    } = memoryProps;

    const [generatingStoryPassword, setGeneratingStoryPassword] = useState(false);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <div className="bg-slate-900/40 p-1.5 rounded-2xl flex border border-white/5 shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 opacity-50 pointer-events-none" />
                    <button
                        onClick={() => setPasswordLevel('L1_PIN')}
                        className={`flex-1 py-3 px-2 rounded-xl text-sm font-black transition-all flex flex-col items-center gap-1 ${passwordLevel === 'L1_PIN' ? 'bg-white/10 text-white shadow-lg border border-white/10 z-10' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <span>L1. 핀번호</span>
                        <span className="text-[10px] font-medium opacity-70 hidden md:block">숫자만 (기본 4자리)</span>
                    </button>
                    <button
                        onClick={() => setPasswordLevel('L2_WEB')}
                        className={`flex-1 py-3 px-2 rounded-xl text-sm font-black transition-all flex flex-col items-center gap-1 ${passwordLevel === 'L2_WEB' ? 'bg-primary/20 text-white shadow-lg border border-primary/30 z-10' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <span className="flex items-center gap-1.5 hover:text-primary-light transition-colors"><Sparkles className="w-3.5 h-3.5" /> L2. 웹사이트</span>
                        <span className="text-[10px] font-medium opacity-70 hidden md:block">영문+숫자+특문 조합</span>
                    </button>
                    <button
                        onClick={() => setPasswordLevel('L3_MASTER')}
                        className={`flex-1 py-3 px-2 rounded-xl text-sm font-black transition-all flex flex-col items-center gap-1 ${passwordLevel === 'L3_MASTER' ? 'bg-[#8B5CF6]/20 text-white shadow-lg border border-[#8B5CF6]/30 z-10' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <span>L3. 마스터 키</span>
                        <span className="text-[10px] font-medium opacity-70 hidden md:block">가장 강력한 보안</span>
                    </button>
                </div>
            </div>

            {/* Length Selection UI - Only for L1_PIN */}
            <AnimatePresence>
                {passwordLevel === 'L1_PIN' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-8 overflow-hidden"
                    >
                        <label className="block text-xs font-bold text-slate-400 mb-3 ml-1">
                            생성 번호 갯수 선택
                        </label>
                        <div className="flex flex-wrap gap-2 p-1 bg-slate-900/40 rounded-2xl border border-white/5 shadow-inner">
                            {[4, 6, 8, 10].map((len) => (
                                <button
                                    key={len}
                                    onClick={() => {
                                        setPinLength(len as any);
                                        setIsCustomLength(false);
                                        setCoreNumber(''); // Reset when length changes
                                    }}
                                    className={`flex-1 min-w-[60px] py-2.5 rounded-xl text-sm font-black transition-all border ${!isCustomLength && pinLength === len
                                        ? 'bg-white/10 text-white border-white/20 shadow-lg'
                                        : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/5'}`}
                                >
                                    {len}자리
                                </button>
                            ))}
                            <div className="flex-1 min-w-[100px] relative">
                                <button
                                    onClick={() => setIsCustomLength(true)}
                                    className={`w-full py-2.5 rounded-xl text-sm font-black transition-all border ${isCustomLength
                                        ? 'bg-primary/20 text-white border-primary/30 shadow-lg'
                                        : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/5'}`}
                                >
                                    {isCustomLength ? '커스텀' : '직접 입력'}
                                </button>

                                {isCustomLength && (
                                    <div className="mt-2 animate-in zoom-in-95 duration-200">
                                        <input
                                            type="number"
                                            value={pinLength}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                if (!isNaN(val)) {
                                                    setPinLength(Math.min(Math.max(val, 1), 20) as any);
                                                    setCoreNumber(''); // Reset when length changes
                                                }
                                            }}
                                            onBlur={(e) => {
                                                if (!e.target.value) setPinLength(4);
                                            }}
                                            placeholder="숫자 입력"
                                            className="w-full bg-slate-900/60 border border-primary/30 rounded-xl px-4 py-2 text-sm text-center font-bold text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                                            autoFocus
                                        />
                                        <p className="text-[10px] text-slate-500 mt-1 ml-1">최대 20자리</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col gap-5 mb-8">
                <div className="w-full">
                    <label className="block text-xs font-bold text-slate-400 mb-2 ml-1 flex justify-between items-end">
                        <span>{passwordLevel === 'L1_PIN' ? '보안 핀번호 단어 입력' : '나만의 기억 코어 (단어)'}</span>
                    </label>
                    <input
                        type="text"
                        value={hintKeyword}
                        onChange={handleHintChange}
                        placeholder={passwordLevel === 'L1_PIN' ? "예: 우리집 강아지 생일, 좋아하는 영화 제목" : "절대 잊지 않을 나만의 단어나 짧은 문장"}
                        className="w-full bg-slate-900/40 border border-slate-700/50 rounded-xl px-4 py-3.5 text-sm md:text-base text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap gap-2 justify-center mt-1">
                        {['🎬 영화', '🐶 동물', '🍕 음식', '✈️ 여행', '🎲 랜덤'].map(theme => (
                            <button
                                key={theme}
                                onClick={() => handleThemeClick(theme)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${activeTheme === theme ? 'bg-primary/20 border-primary text-white scale-105' : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-800 hover:text-slate-300'}`}
                            >
                                {theme} 추천
                            </button>
                        ))}
                    </div>

                    <AnimatePresence>
                        {activeTheme && themeDatasets[activeTheme] && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex flex-wrap gap-2 justify-center p-2 bg-slate-900/30 rounded-xl border border-white/5"
                            >
                                {themeDatasets[activeTheme].map((word) => (
                                    <button
                                        key={word}
                                        onClick={() => handleSuggestionClick(word)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${hintKeyword === word ? 'bg-primary text-white scale-105' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                                    >
                                        {word}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="lighting-border group p-[3px] rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.1)] mt-2">
                    <div className="relative z-10 bg-slate-900/80 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-6 shadow-inner border border-white/5 focus-within:border-primary/30 transition-all">
                        <div className="flex-1 w-full relative min-h-[100px] flex items-center justify-center">
                            <textarea
                                className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-text focus:outline-none resize-none"
                                rows={1}
                                value={coreNumber}
                                onChange={(e) => setCoreNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, pinLength))}
                            ></textarea>

                            <div className="flex items-center justify-center w-full relative py-2">
                                <AnimatePresence mode="wait">
                                    {coreNumber.length === 0 ? (
                                        <motion.div
                                            key="empty-state"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="w-full flex justify-center items-center pointer-events-none"
                                        >
                                            {passwordScenes[passwordLevel]?.[currentSceneIndex] && (
                                                <div className="text-center transition-all duration-500 flex flex-col items-center gap-2">
                                                    {(passwordScenes[passwordLevel][currentSceneIndex].type === 'text' || passwordScenes[passwordLevel][currentSceneIndex].type === 'text-highlight') && (
                                                        <motion.h3
                                                            key={`h3 - ${currentSceneIndex} `}
                                                            initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                                                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                                            className={`text-lg md:text-2xl font-black ${passwordScenes[passwordLevel][currentSceneIndex].type === 'text-highlight' ? 'text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#8B5CF6] to-pink-500' : 'text-slate-400'}`}
                                                        >
                                                            {passwordScenes[passwordLevel][currentSceneIndex].content}
                                                        </motion.h3>
                                                    )}

                                                    {passwordScenes[passwordLevel][currentSceneIndex].type === 'example-simple' && (
                                                        <motion.div
                                                            key={`ex - ${currentSceneIndex} `}
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            className="flex gap-1.5 md:gap-2 justify-center items-center"
                                                        >
                                                            {passwordScenes[passwordLevel][currentSceneIndex].content!.split('').map((char, i) => (
                                                                <div key={i} className="w-8 h-12 md:w-12 md:h-16 rounded-xl border border-white/10 bg-slate-800/50 flex items-center justify-center text-xl md:text-3xl font-black text-slate-300 font-mono shadow-[0_5px_15px_rgba(0,0,0,0.2)]">
                                                                    {char}
                                                                </div>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </div>
                                            )}
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="real-input"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2"
                                        >
                                            {Array.from({ length: pinLength }).map((_, i) => {
                                                const char = coreNumber[i];
                                                const isFilled = char !== undefined;
                                                return (
                                                    <div
                                                        key={i}
                                                        className={`w-9 h-14 md:w-14 md:h-20 rounded-xl flex items-center justify-center text-2xl md:text-4xl font-black shadow-xl border transition-all font-mono
                                                            ${isFilled
                                                                ? 'bg-white/95 dark:bg-slate-800/80 text-slate-900 dark:text-white border-white/10'
                                                                : 'bg-white/5 dark:bg-slate-800/30 text-slate-500/50 dark:text-slate-500/50 border-white/5'
                                                            }`}
                                                        style={isFilled ? { boxShadow: '0 10px 20px rgba(0,0,0,0.1), inset 0 2px 5px rgba(255,255,255,0.5)' } : {}}
                                                    >
                                                        {isFilled ? char : '*'}
                                                    </div>
                                                );
                                            })}
                                            {coreNumber.length < pinLength && (
                                                <div className="w-1 h-8 md:h-12 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(79,70,229,0.8)] ml-1" />
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-2 flex justify-center">
                    <button
                        onClick={() => {
                            // Import wordToNumbers for local conversion
                            const { wordToNumbers } = require('@/lib/mnemonic-password');

                            if (hintKeyword.trim()) {
                                const baseKeywords = hintKeyword.split(/[, ]+/).filter((w: string) => w.trim());
                                let allKeywords = [...baseKeywords];

                                // Calculate current digits from all keywords
                                let allDigits = '';
                                for (const kw of baseKeywords) {
                                    allDigits += wordToNumbers(kw).slice(0, 2);
                                }

                                // If we need more digits, pick additional words from the matching theme
                                const targetLength = pinLength;
                                if (allDigits.length < targetLength) {
                                    // Find the theme that contains the base keyword
                                    let themeWords: string[] = [];

                                    // First try activeTheme
                                    if (activeTheme && themeDatasets[activeTheme]) {
                                        themeWords = themeDatasets[activeTheme];
                                    } else {
                                        // Search all themes for a matching keyword
                                        for (const [, words] of Object.entries(themeDatasets)) {
                                            if (words.some((w: string) => baseKeywords.includes(w))) {
                                                themeWords = words;
                                                break;
                                            }
                                        }
                                    }

                                    // Fallback to random theme if no match found
                                    if (themeWords.length === 0) {
                                        const allKeys = Object.keys(themeDatasets);
                                        themeWords = themeDatasets[allKeys[Math.floor(Math.random() * allKeys.length)]];
                                    }

                                    const availableWords = themeWords.filter(
                                        (w: string) => !baseKeywords.includes(w)
                                    );

                                    // Shuffle and pick as many words as needed
                                    const shuffled = [...availableWords].sort(() => Math.random() - 0.5);
                                    const neededWords = Math.ceil((targetLength - allDigits.length) / 2);

                                    for (let i = 0; i < Math.min(neededWords, shuffled.length); i++) {
                                        const extraWord = shuffled[i];
                                        allKeywords.push(extraWord);
                                        allDigits += wordToNumbers(extraWord).slice(0, 2);
                                    }
                                }

                                // Slice to exact target length
                                const fullCoreNumber = allDigits.slice(0, targetLength);
                                setCoreNumber(fullCoreNumber);
                                setPasswordResult(fullCoreNumber);

                                handleConvert(
                                    allKeywords,
                                    fullCoreNumber,
                                    activeTheme || undefined,
                                    (val: string) => setCoreNumber(val),
                                    (res: string) => setPasswordResult(res)
                                );
                            }
                            // Priority 2: If we only have numbers, go to standard conversion
                            else if (coreNumber.length > 0) {
                                handleConvert(
                                    null,
                                    coreNumber,
                                    undefined,
                                    (val: string) => setCoreNumber(val),
                                    (res: string) => setPasswordResult(res)
                                );
                            }
                        }}
                        disabled={!hintKeyword.trim() && coreNumber.length === 0}
                        className={`w-full md:w-auto px-10 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 active:scale-[0.98] overflow-hidden relative group/btn ${!hintKeyword.trim() && coreNumber.length === 0
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                            : 'bg-gradient-to-r from-primary to-[#8B5CF6] text-white shadow-[0_10px_30px_rgba(139,92,246,0.3)] hover:shadow-[0_15px_40px_rgba(139,92,246,0.5)] border border-white/10'
                            }`}
                    >
                        {(!hintKeyword.trim() && coreNumber.length === 0) ? null : (
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 pointer-events-none" />
                        )}
                        {hintKeyword.trim() ? <Sparkles className="w-5 h-5 relative z-10" /> : <Brain className="w-5 h-5 relative z-10" />}
                        <span className="relative z-10 text-lg">
                            {hintKeyword.trim() ? '기억 카드 만들기' : '비밀번호 생성'}
                        </span>
                    </button>
                </div>
            </div>

            {passwordResult && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500 mb-8 max-w-2xl mx-auto">
                    {/* PIN Display Card */}
                    <div className="p-6 rounded-2xl bg-white shadow-xl border border-primary/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none" />
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2 flex items-center gap-1.5"><Lock className="w-3 h-3" /> 최종 생성된 비밀번호</span>
                                <div className="font-mono text-3xl md:text-5xl text-slate-900 font-black tracking-tight" style={{ wordBreak: 'break-all' }}>
                                    {passwordResult}
                                </div>
                            </div>
                            <button
                                onClick={copyPassword}
                                className={`shrink-0 flex items-center justify-center gap-2 px-6 py-4 md:py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 ${passwordCopied ? 'bg-green-500 text-white shadow-[0_5px_15px_rgba(34,197,94,0.3)]' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                            >
                                {passwordCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                <span>{passwordCopied ? '복사 완료!' : '비밀번호 복사'}</span>
                            </button>
                        </div>
                    </div>

                    {/* AI Story & Mnemonic Card Display (Shared from MemoryTab logic) */}
                    {(memoryStory || memoryImageUrl) && (
                        <div className="mt-6 p-5 rounded-2xl bg-primary/10 border border-primary/20 relative animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Memory Card Result</span>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handleSaveMemory}
                                        disabled={saving || isSaved}
                                        className={`p-1.5 rounded-md transition-all flex items-center justify-center ${isSaved ? 'text-green-400' : 'text-slate-500 hover:text-white hover:bg-white/10'}`}
                                        title="내 컬렉션에 저장"
                                    >
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (isSaved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />)}
                                    </button>
                                    <button
                                        onClick={handleOpenShareModal}
                                        disabled={isCapturing}
                                        className="p-1.5 rounded-md text-slate-500 hover:text-primary hover:bg-primary/10 transition-all flex items-center justify-center"
                                        title="이미지 카드 공유"
                                    >
                                        {isCapturing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Selected Keywords Display */}
                            {memoryResult && Array.isArray(memoryResult) && memoryResult.length > 0 && (
                                <div className="mb-4 pb-4 border-b border-primary/20">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Tag className="w-3 h-3 text-cyan-400" />
                                        <span className="text-xs font-bold text-cyan-400">선택된 키워드</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {memoryResult.map((word: string, i: number) => {
                                            const chunk = passwordResult.replace(/[^0-9]/g, '').slice(i * 2, (i * 2) + 2);
                                            return (
                                                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-sm font-bold">
                                                    <span>{word}</span>
                                                    <span className="text-cyan-500/60 text-xs font-mono">({chunk})</span>
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {memoryStory && (
                                <div className="pt-4 border-t border-primary/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="w-3 h-3 text-yellow-300" />
                                        <span className="text-xs font-bold text-yellow-300">AI Story</span>
                                    </div>
                                    <div className="text-slate-100 text-lg leading-relaxed font-medium">
                                        {/* Parse **keyword** and render in blue */}
                                        {memoryStory.split(/(\*\*[^*]+\*\*)/).map((part: string, i: number) => {
                                            if (part.startsWith('**') && part.endsWith('**')) {
                                                const keyword = part.slice(2, -2);
                                                return (
                                                    <span key={i} className="text-cyan-400 font-black">
                                                        {keyword}
                                                    </span>
                                                );
                                            }
                                            return <span key={i}>{part}</span>;
                                        })}
                                    </div>
                                </div>
                            )}

                            {memoryImageUrl && (
                                <div className="mt-4 pt-4 border-t border-primary/20">
                                    <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10 group">
                                        <img src={memoryImageUrl} alt="AI Generated Card" className="w-full h-auto" />
                                    </div>
                                </div>
                            )}

                            {!memoryImageUrl && !generatingImage && memoryStory && (
                                <div className="mt-4 pt-4 border-t border-primary/20">
                                    <button
                                        onClick={handleGenerateImage}
                                        className="w-full py-3 bg-gradient-to-r from-purple-600/50 to-pink-600/50 hover:from-purple-600 hover:to-pink-600 border border-white/10 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
                                    >
                                        <span className="text-lg group-hover:scale-110 transition-transform">🎨</span>
                                        <span>이 장면을 그림으로 그리기</span>
                                    </button>
                                </div>
                            )}

                            {generatingImage && (
                                <div className="mt-4 pt-4 border-t border-primary/20">
                                    <div className="relative h-48 w-full bg-slate-900/60 rounded-2xl border border-primary/20 flex flex-col items-center justify-center p-6 text-center">
                                        <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                                        <p className="text-sm font-bold text-white/90">그림을 생성하는 중...</p>
                                        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
                                            <motion.div
                                                className="h-full bg-primary"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${generationProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}