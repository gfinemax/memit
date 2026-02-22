import React, { useState, useEffect } from 'react';
import MnemonicKey from '../MnemonicKey';
import { Brain, Check, Info, Lock, Unlock, Sparkles, ChevronDown, ChevronUp, Bookmark, Share2, Loader2 } from 'lucide-react';
import StoryText from '@/components/ui/StoryText';
import { motion, AnimatePresence } from 'framer-motion';
import { ShuffleSlot } from '../ShuffleSlot';

export function MemoryTab({ memoryProps }: { memoryProps: any }) {
    const {
        input, setInput,
        context, setContext,
        result,
        story, setStory,
        imageUrl, setImageUrl,
        generatingImage,
        loading,
        strategy, setStrategy,
        isSelecting, setIsSelecting,
        revealedCount,
        candidates,
        imageType, setImageType,
        activePopoverIndex, setActivePopoverIndex,
        lockedIndices,
        saving,
        isSaved,
        isEditingStory, setIsEditingStory,
        ghostInput,
        isGhostTyping,
        showPlaceholder,
        isCapturing,
        previewUrl,
        generatingMessageIndex, generationProgress, generationMessages,
        handleConvert, handleSaveMemory, toggleAllLocks, toggleLock, handleSingleWordChange,
        handleGenerateImage, handleOpenShareModal
    } = memoryProps;

    const [isKeyExpanded, setIsKeyExpanded] = useState(false);

    return (
        <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-500 z-10">

            <div className="flex flex-col gap-3 mb-8">
                <div className="lighting-border group p-[4px] rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                    <div className="relative z-10 bg-white/10 dark:bg-slate-950/40 rounded-[2rem] p-4 flex flex-col md:flex-row items-center gap-3 backdrop-blur-2xl border border-white/10 shadow-2xl transition-all focus-within:border-primary/40">
                        <div className="flex-1 w-full relative min-h-[120px] md:min-h-[160px] flex items-center justify-center py-4">
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
                            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 z-10 pointer-events-none w-full py-2">
                                <AnimatePresence mode="wait">
                                    {input.length === 0 && showPlaceholder ? (
                                        <motion.div
                                            key="placeholder"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
                                            transition={{ duration: 1 }}
                                            className="flex flex-col items-center"
                                        >
                                            <span className="text-slate-400 text-xl md:text-3xl font-black tracking-tight opacity-50">
                                                숫자를 입력해주세요
                                            </span>
                                        </motion.div>
                                    ) : input.length === 0 ? (
                                        // Ghost Prompt Mode
                                        <motion.div
                                            key="ghost-typing"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex flex-wrap items-center justify-center gap-2 md:gap-4"
                                        >
                                            {ghostInput.split('').map((char: string, i: number) => (
                                                <div
                                                    key={`ghost-${i}`}
                                                    className="w-10 h-14 md:w-16 md:h-24 bg-slate-900/20 border border-white/5 rounded-[1.2rem] flex items-center justify-center text-2xl md:text-5xl font-black text-slate-500 opacity-20"
                                                >
                                                    {char}
                                                </div>
                                            ))}
                                            {/* Pulsing Ghost Cursor */}
                                            <div className="w-1 h-8 md:h-12 bg-primary/20 rounded-full animate-pulse ml-1 self-center" />
                                        </motion.div>
                                    ) : (
                                        // Real Input Mode
                                        <motion.div
                                            key="real-input"
                                            className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3 md:gap-x-2.5 md:gap-y-6"
                                        >
                                            {input.split('').map((char: string, i: number) => (
                                                <div
                                                    key={i}
                                                    className="w-11 h-16 md:w-16 md:h-24 bg-white/95 dark:bg-slate-800/80 rounded-[1.2rem] flex items-center justify-center text-3xl md:text-5xl font-black text-slate-900 dark:text-white shadow-2xl border border-white/10 transition-all"
                                                    style={{
                                                        boxShadow: '0 20px 40px rgba(0,0,0,0.1), inset 0 2px 5px rgba(255,255,255,0.5)',
                                                    }}
                                                >
                                                    {char}
                                                </div>
                                            ))}
                                            {/* Neon Pulsing Cursor */}
                                            <div className="w-1.5 h-10 md:h-16 bg-primary rounded-full animate-pulse shadow-[0_0_15px_rgba(79,70,229,0.8)] ml-1 self-center" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                        <button
                            disabled={loading}
                            onClick={() => handleConvert()}
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
                    <div className="bg-slate-900/60 p-1.5 rounded-2xl flex gap-1 border border-white/5 backdrop-blur-xl shadow-lg">
                        <button onClick={() => setStrategy('SCENE')} className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${strategy === 'SCENE' ? 'bg-primary text-white shadow-lg scale-100 z-10' : 'text-slate-500 hover:text-slate-300'}`}>장면 카드</button>
                        <button onClick={() => setStrategy('PAO')} className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${strategy === 'PAO' ? 'bg-primary text-white shadow-lg scale-100 z-10' : 'text-slate-500 hover:text-slate-300'}`}>PAO 모드</button>
                        <button onClick={() => setStrategy('STORY_BEAT')} className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${strategy === 'STORY_BEAT' ? 'bg-primary text-white shadow-lg scale-100 z-10' : 'text-slate-500 hover:text-slate-300'}`}>스토리 비트</button>
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

                            <button
                                onClick={handleOpenShareModal}
                                disabled={isCapturing}
                                className="p-1.5 rounded-md text-slate-500 hover:text-primary hover:bg-primary/10 transition-all flex items-center justify-center"
                                title="이미지 카드 공유"
                            >
                                {isCapturing ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Share2 className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-6 min-h-[60px] justify-center items-center">
                        <AnimatePresence mode="popLayout" initial={false}>
                            {result.slice(0, Math.max(revealedCount, isSelecting ? result.length : 0)).map((word: string, i: number) => {
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
                                                            {candidates[i]?.words.map((candidate: string) => (
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

    return (
        <div className="relative">
            <StoryText text={displayedText} className="text-xl md:text-2xl text-slate-200 leading-relaxed font-medium" />
            {index < text.length && (
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                    className="inline-block w-1.5 h-4 bg-primary align-middle ml-1"
                />
            )}
        </div>
    );
}