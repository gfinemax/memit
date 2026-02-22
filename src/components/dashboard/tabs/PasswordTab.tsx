import React, { useState } from 'react';
import { Brain, Sparkles, AlertTriangle, ShieldCheck, Tag, Copy, Lock, Unlock, ArrowRight, Check } from 'lucide-react';
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
    passwordCopied: boolean;
    currentSceneIndex: number;
    passwordScenes: Record<string, PasswordSceneContent[]>;
    getLengthForLevel: (level: string) => number;
    handleThemeClick: (theme: string) => void;
    handleHintChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    generatePassword: () => void;
    copyPassword: () => void;
}

export function PasswordTab({ passwordProps }: { passwordProps: PasswordProps }) {
    const {
        passwordLevel, setPasswordLevel,
        serviceName, setServiceName,
        coreNumber, setCoreNumber,
        specialSymbol, setSpecialSymbol,
        hintKeyword, setHintKeyword,
        activeTheme, setActiveTheme,
        passwordResult,
        passwordCopied,
        currentSceneIndex,
        passwordScenes,
        getLengthForLevel,
        handleThemeClick,
        handleHintChange,
        generatePassword,
        copyPassword
    } = passwordProps;

    const [generatingStoryPassword, setGeneratingStoryPassword] = useState(false);
    const pinLength = getLengthForLevel(passwordLevel);

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

                {!hintKeyword && (
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
                )}

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
                            if (coreNumber) {
                                generatePassword();
                            }
                        }}
                        disabled={!coreNumber || coreNumber.length < (passwordLevel === 'L1_PIN' ? 4 : 2)}
                        className={`w-full md:w-auto px-10 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 active:scale-[0.98] overflow-hidden relative group/btn ${!coreNumber || coreNumber.length < (passwordLevel === 'L1_PIN' ? 4 : 2)
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                            : 'bg-gradient-to-r from-primary to-[#8B5CF6] text-white shadow-[0_10px_30px_rgba(139,92,246,0.3)] hover:shadow-[0_15px_40px_rgba(139,92,246,0.5)] border border-white/10'
                            }`}
                    >
                        {(!coreNumber || coreNumber.length < (passwordLevel === 'L1_PIN' ? 4 : 2)) ? null : (
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 pointer-events-none" />
                        )}
                        {coreNumber.length === pinLength ? <Sparkles className="w-5 h-5 relative z-10" /> : <Brain className="w-5 h-5 relative z-10" />}
                        <span className="relative z-10 text-lg">
                            {coreNumber.length === pinLength ? '완벽한 암호 만들기' : '비밀번호 생성'}
                        </span>
                    </button>
                </div>
            </div>

            {passwordResult && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500 mb-8 max-w-2xl mx-auto">
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
                                className={`shrink-0 flex items-center justify-center gap-2 px-6 py-4 md:py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 ${passwordCopied ? 'bg-green-500 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'}`}
                            >
                                {passwordCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                <span className={passwordCopied ? 'hidden md:inline' : 'hidden md:inline'}>{passwordCopied ? '복사 완료!' : '비밀번호 복사'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}