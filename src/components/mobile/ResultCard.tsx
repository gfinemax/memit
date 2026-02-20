'use client';

import { Share as CapShare } from '@capacitor/share';
import { Clipboard } from '@capacitor/clipboard';
import { Toast } from '@capacitor/toast';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { ChevronDown, ChevronUp, Check, Save, Share2, RefreshCw, KeyRound, Zap, Maximize2, X, Lock, Unlock, Brain, Loader2, Phone, Trophy, Copy, Eye, EyeOff, ShieldCheck, AlertCircle, Quote, Type, User, ArrowRight, Sliders } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { createPortal } from 'react-dom';
import { KeywordItem, PasswordResult } from './MobileHome';
import { generateVerificationHash } from '@/lib/password-generator';
import { generateShareCardCanvas } from '@/lib/share-card-utils';
import { getApiUrl } from '@/lib/api-utils';

interface ResultCardProps {
    input?: string;
    keywords?: KeywordItem[];
    passwordResult?: PasswordResult | null;
    story: {
        text: string;
        highlighted: string[];
    };
    imageUrl?: string;
    onSave?: () => void;
    onReset?: () => void;
    onKeywordChange?: (index: number, newWord: string) => void;
    onKeywordLockToggle?: (index: number) => void;
    onToggleAllLocks?: () => void;
    onRememit?: () => void;
    onShareCommunity?: () => void;
    useFourCut?: boolean;
    setUseFourCut?: (val: boolean) => void;
}

export default function ResultCard({
    input,
    keywords,
    passwordResult,
    story,
    imageUrl,
    onSave,
    onReset,
    onKeywordChange,
    onKeywordLockToggle,
    onToggleAllLocks,
    onRememit,
    onShareCommunity,
    useFourCut = false,
    setUseFourCut
}: ResultCardProps) {
    const [isZoomed, setIsZoomed] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [sharePrefix010, setSharePrefix010] = useState(false);
    const [shareLabel, setShareLabel] = useState('');
    const [shareTitle, setShareTitle] = useState('');
    const labelInputRef = useRef<HTMLInputElement>(null);
    const titleInputRef = useRef<HTMLTextAreaElement>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const isComposingRef = useRef(false);
    const is8Digits = /^\d{8}$/.test(input || '');

    const [showPassword, setShowPassword] = useState(false);
    const [isVerificationOpen, setIsVerificationOpen] = useState(false);
    const [verificationInput, setVerificationInput] = useState('');
    const [verificationError, setVerificationError] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const handleCopyPassword = async () => {
        if (!passwordResult) return;
        if (!isVerified) {
            setIsVerificationOpen(true);
            setVerificationInput('');
            setVerificationError(false);
            return;
        }
        await Clipboard.write({ string: passwordResult.password });
        await Toast.show({ text: '암호가 복사되었습니다!', duration: 'short' });
    };

    const verifyAndCopy = async () => {
        if (!passwordResult) return;
        const inputHash = generateVerificationHash(verificationInput);
        if (inputHash === passwordResult.verificationHash) {
            setIsVerified(true);
            setIsVerificationOpen(false);
            await Clipboard.write({ string: passwordResult.password });
            await Toast.show({ text: '인증 성공! 암호가 복사되었습니다.', duration: 'short' });
        } else {
            setVerificationError(true);
            await Toast.show({ text: '기억이 일치하지 않습니다.', duration: 'short' });
        }
    };

    useEffect(() => {
        if (keywords && keywords.length > 0) {
            const words = keywords.map(k => k.word).join(', ');
            const lastWord = keywords[keywords.length - 1].word;
            const lastChar = lastWord.charAt(lastWord.length - 1);
            const hasBatchim = (lastChar.charCodeAt(0) - 0xAC00) % 28 > 0;
            const particle = hasBatchim ? '을' : '를';
            setShareTitle(`✨ 핸드폰 번호를 쉽게 기억하세요.\n아래 그림에서 [${words}] ${particle} 찾아보세요.\n기억의 열쇠가 됩니다.`);
        }
    }, [keywords]);

    const handleDebouncedInput = () => {
        if (isComposingRef.current) return;
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = setTimeout(async () => {
            const currentTitle = titleInputRef.current?.value || shareTitle;
            const currentLabel = labelInputRef.current?.value || shareLabel;
            const dataUrl = await generateShareCardCanvas(
                input || '', keywords || [], displayStory.text || '', imageUrl,
                { prefix010: sharePrefix010, customLabel: currentLabel, customTitle: currentTitle }
            );
            setPreviewUrl(dataUrl);
        }, 500);
    };

    const [activeKeywordIndex, setActiveKeywordIndex] = useState<number | null>(null);
    const keywordRefs = useRef<(HTMLButtonElement | null)[]>([]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (activeKeywordIndex !== null) {
                const target = e.target as HTMLElement;
                if (!target.closest('.keyword-btn') && !target.closest('.absolute')) {
                    setActiveKeywordIndex(null);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeKeywordIndex]);

    const displayStory = story || (keywords ? {
        text: keywords.map(k => k.word).join(' '),
        highlighted: keywords.map(k => ({ text: k.word, number: parseInt(k.code) || 0 }))
    } : {
        text: "총알(70)이 날아가 파리(82)를 정확히 맞추는 장면을 상상해보세요!",
        highlighted: [{ text: "총알", number: 70 }, { text: "파리", number: 82 }]
    });

    const handleShare = async () => {
        if (!previewUrl) return;
        const isNative = Capacitor.isNativePlatform();
        const shareTitleStr = 'Memit - 나만의 기억법';
        setIsSharing(true);
        try {
            if (isNative) {
                const filename = `memit_card_${Date.now()}.png`;
                const base64Data = previewUrl.split(',')[1];
                await Filesystem.writeFile({ path: filename, data: base64Data, directory: Directory.Cache });
                const uriResult = await Filesystem.getUri({ path: filename, directory: Directory.Cache });
                await CapShare.share({ title: shareTitleStr, files: [uriResult.uri], dialogTitle: '기억 카드 공유하기' });
            } else if (navigator.share) {
                const blob = await (await fetch(previewUrl)).blob();
                const file = new File([blob], 'memit_card.png', { type: 'image/png' });
                await navigator.share({ title: shareTitleStr, files: [file] });
            } else {
                const link = document.createElement('a');
                link.download = 'memit_card.png';
                link.href = previewUrl;
                link.click();
                alert("카드가 다운로드되었습니다.");
            }
            setPreviewUrl(null);
        } catch (error) {
            console.error('Share failed:', error);
            if (isNative) await Toast.show({ text: '공유에 실패했습니다.', duration: 'short' });
            else alert("공유 기능을 사용할 수 없습니다.");
        } finally { setIsSharing(false); }
    };

    const saveCustomKeyword = async (code: string, word: string) => {
        try {
            const targetUrl = getApiUrl('/api/ai/save-custom-keyword');
            await fetch(targetUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, word })
            });
        } catch (e) {
            console.error("Failed to save custom keyword:", e);
        }
    };

    const handleOpenShareModal = async () => {
        setIsCapturing(true);
        try {
            const dataUrl = await generateShareCardCanvas(
                input || '',
                keywords || [],
                displayStory.text || '',
                imageUrl,
                { prefix010: sharePrefix010, customLabel: shareLabel, customTitle: shareTitle }
            );
            setPreviewUrl(dataUrl);
        } catch (error) {
            console.error('Failed to generate share card:', error);
            await Toast.show({ text: '카드 생성에 실패했습니다.', duration: 'short' });
        } finally {
            setIsCapturing(false);
        }
    };

    return (
        <div className="flex flex-col h-full overflow-y-auto no-scrollbar relative w-full max-w-md mx-auto">
            {/* ... existing background particles ... */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="absolute rounded-full bg-primary/40 animate-pulse"
                        style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, width: `${Math.random() * 10 + 5}px`, height: `${Math.random() * 10 + 5}px`, animationDuration: `${Math.random() * 3 + 2}s` }}
                    />
                ))}
            </div>

            <header className="flex-none pt-8 pb-4 text-center z-10">
                <div className="inline-flex items-center justify-center bg-primary/20 text-primary px-4 py-1 rounded-full mb-4">
                    <Brain className="w-3 h-3 mr-1" />
                    <span className="text-xs font-bold uppercase tracking-wider">AI Generated</span>
                </div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                    {passwordResult ? '암호 생성 완료! 🔒' : '메밋 완료! 🎉'}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    {passwordResult ? '안전하고 기억하기 쉬운 암호가 준비되었습니다.' : '성공적으로 기억이 변환되었습니다.'}
                </p>
            </header>

            {isVerificationOpen && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative">
                        <button onClick={() => setIsVerificationOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X className="w-6 h-6" /></button>
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-2"><Brain className="w-6 h-6" /></div>
                            <h3 className="text-xl font-bold text-white">즉시 회상 테스트</h3>
                            <p className="text-sm text-slate-400 break-keep">방금 기억한 문장을 다시 입력해보세요.<br /><span className="text-primary">일치해야만</span> 암호를 복사할 수 있습니다.</p>
                            <div className="w-full relative">
                                <input type="text" value={verificationInput} onChange={(e) => { setVerificationInput(e.target.value); setVerificationError(false); }} placeholder="방금 기억한 문장 입력..." className={`w-full bg-slate-800 border ${verificationError ? 'border-red-500' : 'border-slate-600'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors`} />
                                {verificationError && <div className="absolute -bottom-6 left-0 right-0 text-red-400 text-xs flex items-center justify-center gap-1"><AlertCircle className="w-3 h-3" /><span>기억이 일치하지 않습니다.</span></div>}
                            </div>
                            <button onClick={verifyAndCopy} className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] mt-2">확인 및 복사하기</button>
                        </div>
                    </div>
                </div>
            )}

            {passwordResult ? (
                <div className="flex-grow flex flex-col justify-center py-4 z-20">
                    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-2xl">
                        <div className="text-center mb-6">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">GENERATED PASSWORD</span>
                            <div className="mt-2 relative">
                                <div className="bg-slate-100 dark:bg-black/40 rounded-xl p-4 flex items-center justify-between border border-slate-200 dark:border-slate-700/50 group">
                                    <span className={`text-xl md:text-2xl font-mono font-bold tracking-wider ${showPassword ? 'text-slate-900 dark:text-white' : 'text-slate-400 blur-sm select-none'}`}>{showPassword ? passwordResult.password : '•'.repeat(passwordResult.password.length)}</span>
                                    <button onClick={() => setShowPassword(!showPassword)} className="p-2 text-slate-400 hover:text-primary transition-colors">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4 mb-6">
                            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 rounded-xl p-4">
                                <h4 className="text-xs font-bold text-indigo-500 mb-2 uppercase flex items-center gap-1"><KeyRound className="w-3 h-3" /> 기억 힌트/문장</h4>
                                <p className="text-slate-700 dark:text-slate-200 font-medium text-lg leading-snug break-keep">"{passwordResult.hints.sentence}"</p>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                <div className="text-xs text-slate-500 dark:text-slate-400"><span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">안전한 저장 방식</span>암호는 저장되지 않습니다. 오직 이 문장(힌트)만 저장되며, 필요할 때 문장을 입력해 암호를 다시 생성할 수 있습니다.</div>
                            </div>
                        </div>
                        <button onClick={handleCopyPassword} className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.95] ${isVerified ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20'}`}>{isVerified ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}{isVerified ? '복사 완료!' : '복사하기 (회상 테스트)'}</button>
                    </div>
                    <div className="mt-6 flex gap-3"><button onClick={onReset} className="flex-1 py-3.5 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-200 transition-all text-sm">다시 만들기</button></div>
                </div>
            ) : (
                <div className="flex-grow flex flex-col justify-center py-4 z-20">
                    <div className="relative bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-lg p-6 shadow-2xl transition-transform duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex flex-col"><span className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">입력한 내용</span><div className="flex items-center gap-2"><span className="text-2xl font-bold text-slate-900 dark:text-white">{input}</span><span className="bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded-md font-medium">숫자</span></div></div>
                            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary"><KeyRound className="w-5 h-5" /></div>
                        </div>
                        <div className="aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800 rounded-xl mb-6 relative overflow-hidden group cursor-zoom-in" onClick={() => setIsZoomed(true)}>
                            <img src={imageUrl} alt="Memory" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"><Maximize2 className="w-8 h-8 text-white/80 drop-shadow-md" /></div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-primary uppercase tracking-wide">기억 스토리</span>
                                {keywords && keywords.length > 0 && (
                                    <button onClick={onToggleAllLocks} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all duration-300 ${keywords.every(k => k.isLocked) ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800'}`}>
                                        {keywords.every(k => k.isLocked) ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                                        {keywords.every(k => k.isLocked) ? "전체 고정됨" : "전체 고정하기"}
                                    </button>
                                )}
                            </div>
                            <div className="space-y-4">
                                {displayStory.text && (
                                    <div className="bg-indigo-50/50 dark:bg-indigo-950/10 p-4 rounded-xl border border-indigo-100/50 dark:border-indigo-900/20 relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-primary/40" />
                                        <Quote className="absolute -top-1 -right-1 w-8 h-8 text-primary/5 opacity-20 rotate-12" />
                                        <p className="text-[15px] text-slate-700 dark:text-slate-200 leading-relaxed break-keep font-medium relative z-10">
                                            {displayStory.text}
                                        </p>
                                    </div>
                                )}

                                <div className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-relaxed break-keep">
                                    {keywords ? (
                                        <div className="grid grid-cols-4 gap-2">
                                            {keywords.map((item, i) => (
                                                <div key={i} className={`relative group ${activeKeywordIndex === i ? 'z-50' : 'z-20'}`}>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="relative">
                                                            <button ref={el => { keywordRefs.current[i] = el; }} className={`keyword-btn w-full flex items-center justify-between px-2 py-2.5 rounded-lg border transition-all duration-300 ${item.isLocked ? 'bg-primary/10 border-primary shadow-[0_0_10px_rgba(79,70,229,0.2)]' : 'bg-slate-50 dark:bg-[#1e1c30] border-slate-100 dark:border-slate-800 hover:border-primary/30'} ${activeKeywordIndex === i ? 'ring-2 ring-primary/50' : ''}`} onClick={() => { if (!item.isLocked) setActiveKeywordIndex(activeKeywordIndex === i ? null : i); }}>
                                                                <div className="flex flex-col items-start min-w-0"><span className={`text-sm font-bold truncate ${item.isLocked ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{item.word}</span></div>
                                                                {!item.isLocked && item.candidates && item.candidates.length > 1 && <ChevronDown className={`w-3.5 h-3.5 opacity-40 transition-transform duration-300 ${activeKeywordIndex === i ? 'rotate-180' : ''}`} />}
                                                            </button>
                                                            <span className={`absolute -top-1.5 -right-1 z-30 text-[9px] font-mono px-1.5 py-0.5 rounded-md border border-white/10 shadow-sm ${item.isLocked ? 'bg-primary text-white font-bold border-primary-dark/20' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`}>{item.code}</span>
                                                        </div>
                                                    </div>
                                                    {!item.isLocked && activeKeywordIndex === i && (
                                                        <div className={`absolute top-full mt-2 z-50 w-[200px] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-100 max-h-[280px] overflow-hidden flex flex-col ${i % 4 === 0 ? 'left-0 origin-top-left' : i % 4 === 3 ? 'right-0 origin-top-right' : 'left-1/2 -translate-x-1/2 origin-top'}`}>
                                                            <div className="text-xs px-2 mb-2 text-slate-400 font-bold uppercase flex justify-between items-center flex-shrink-0"><span>단어 교체</span><span className="bg-primary/20 text-primary px-1.5 rounded">{item.code}</span></div>
                                                            <div className="grid grid-cols-2 gap-1 overflow-y-auto custom-scrollbar flex-grow min-h-0">
                                                                {(item.candidates || []).map((candidate, idx) => (
                                                                    <button key={idx} onClick={() => { if (onKeywordChange) onKeywordChange(i, candidate); setActiveKeywordIndex(null); }} className={`text-center px-1 py-2 rounded-md text-xs font-medium transition-colors truncate ${item.word === candidate ? 'bg-primary text-white' : 'text-slate-300 hover:bg-slate-800'}`}>{candidate}</button>
                                                                ))}
                                                            </div>
                                                            <div className="mt-2 pt-2 border-t border-slate-700 flex items-center gap-1 flex-shrink-0">
                                                                <input type="text" placeholder="직접 입력..." className="flex-1 bg-slate-800 text-slate-200 text-xs px-2 py-1.5 rounded-md border border-slate-700 focus:border-primary focus:outline-none transition-colors" onKeyDown={async (e) => { if (e.key === 'Enter') { const val = (e.target as HTMLInputElement).value.trim(); if (val && onKeywordChange) { onKeywordChange(i, val); await saveCustomKeyword(item.code, val); setActiveKeywordIndex(null); } } }} onClick={(e) => e.stopPropagation()} />
                                                                <button className="bg-slate-800 hover:bg-slate-700 text-primary p-1.5 rounded-md border border-slate-700 transition-colors" onClick={async (e) => { const inputEl = e.currentTarget.previousElementSibling as HTMLInputElement; const val = inputEl.value.trim(); if (val && onKeywordChange) { onKeywordChange(i, val); await saveCustomKeyword(item.code, val); setActiveKeywordIndex(null); } }}><Check className="w-3.5 h-3.5" /></button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm italic text-slate-500 text-center py-8">키워드가 생성되지 않았습니다.</p>
                                    )}
                                </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 mt-2 border border-slate-100 dark:border-slate-700/50"><p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">💡 Tip: 단어를 눌러서 더 기억하기 쉬운 단어로 바꿔보세요.</p></div>
                        </div>
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2"><div className="bg-gradient-to-r from-primary to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1"><Zap className="w-3 h-3" fill="currentColor" />SUPER MEMORY</div></div>
                    </div>

                    {isZoomed && typeof document !== 'undefined' && createPortal(
                        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center animate-in fade-in duration-200 touch-none" onClick={() => setIsZoomed(false)}>
                            <button className="absolute top-6 right-6 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors z-50"><X className="w-8 h-8" /></button>
                            <div className="w-full h-full flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
                                <TransformWrapper initialScale={1} minScale={1} maxScale={5} centerOnInit={true} wheel={{ step: 0.2 }} pinch={{ step: 5 }}>
                                    <TransformComponent wrapperStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }} contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <img src={imageUrl} alt="Memory" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" style={{ touchAction: 'none' }} />
                                    </TransformComponent>
                                </TransformWrapper>
                            </div>
                        </div>, document.body
                    )}

                    {previewUrl && typeof document !== 'undefined' && createPortal(
                        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between"><h3 className="font-bold text-slate-900 dark:text-white">공유 카드 미리보기</h3><button onClick={() => { setPreviewUrl(null); setSharePrefix010(false); setShareLabel(''); }} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><X className="w-5 h-5 text-slate-500" /></button></div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar">
                                    <div className="border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300">
                                        <button onClick={() => setIsOptionsOpen(!isOptionsOpen)} className="w-full flex items-center justify-between px-4 py-4 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <div className="flex items-center gap-2"><span className="bg-primary/10 text-primary p-1.5 rounded-lg"><Sliders className="w-4 h-4" /></span><span>카드 세부 설정</span></div>
                                            {isOptionsOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                        </button>
                                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOptionsOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                            <div className="px-4 pb-6 space-y-4">
                                                {/* 상단 문구 그룹 */}
                                                <div className="p-3 bg-slate-50/50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                                    <div className="flex items-center gap-2 mb-2 px-1">
                                                        <Type className="w-3.5 h-3.5 text-primary opacity-80" />
                                                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">상단 문구</span>
                                                    </div>
                                                    <textarea
                                                        ref={titleInputRef}
                                                        defaultValue={shareTitle}
                                                        className="w-full text-sm px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all shadow-sm resize-none h-24"
                                                        onCompositionEnd={() => { isComposingRef.current = false; handleDebouncedInput(); }}
                                                        onChange={handleDebouncedInput}
                                                    />
                                                </div>

                                                {/* 기타 설정 그룹 */}
                                                <div className="p-3 bg-slate-50/50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-slate-800/50 space-y-4">
                                                    {is8Digits && (
                                                        <div className="flex items-center justify-between px-1">
                                                            <div className="flex items-center gap-2">
                                                                <Phone className="w-3.5 h-3.5 text-primary opacity-80" />
                                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">010 번호 자동 접두어</span>
                                                            </div>
                                                            <button
                                                                onClick={async () => {
                                                                    const next = !sharePrefix010;
                                                                    setSharePrefix010(next);
                                                                    const dataUrl = await generateShareCardCanvas(input || '', keywords || [], displayStory.text || '', imageUrl, { prefix010: next, customLabel: labelInputRef.current?.value || shareLabel, customTitle: titleInputRef.current?.value || shareTitle });
                                                                    setPreviewUrl(dataUrl);
                                                                }}
                                                                className={`relative w-10 h-6 rounded-full transition-colors flex items-center px-1 ${sharePrefix010 ? 'bg-primary' : 'bg-slate-300'}`}
                                                            >
                                                                <span className={`w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${sharePrefix010 ? 'translate-x-4' : 'translate-x-0'}`} />
                                                            </button>
                                                        </div>
                                                    )}

                                                    <div className="pt-3 border-t border-slate-200/50 dark:border-slate-800/50">
                                                        <div className="flex items-center gap-2 mb-2 px-1">
                                                            <User className="w-3.5 h-3.5 text-primary opacity-80" />
                                                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">이름 또는 추가 레이블</span>
                                                        </div>
                                                        <div className="relative">
                                                            <input
                                                                ref={labelInputRef}
                                                                type="text"
                                                                defaultValue={shareLabel}
                                                                placeholder="예: 홍길동"
                                                                className="w-full text-sm pl-4 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all shadow-sm"
                                                                onChange={handleDebouncedInput}
                                                            />
                                                            <button
                                                                onClick={async () => {
                                                                    setPreviewUrl(await generateShareCardCanvas(input || '', keywords || [], displayStory.text || '', imageUrl, { prefix010: sharePrefix010, customLabel: labelInputRef.current?.value || shareLabel, customTitle: titleInputRef.current?.value || shareTitle }));
                                                                }}
                                                                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg shadow-md active:scale-90 transition-all hover:bg-primary-dark"
                                                            >
                                                                <ArrowRight className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-slate-100 dark:bg-black/20 flex items-center justify-center min-h-[300px]"><img src={previewUrl} alt="Preview" className="w-full h-auto object-contain shadow-lg rounded-lg" /></div>
                                </div>
                                <div className="p-4 border-t border-slate-100 bg-white dark:bg-slate-900"><button onClick={handleShare} disabled={isSharing} className="w-full py-3.5 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 active:scale-[0.98]">{isSharing ? <><Loader2 className="w-5 h-5 animate-spin" />공유 준비 중...</> : <><Share2 className="w-5 h-5" />이대로 공유하기</>}</button></div>
                            </div>
                        </div>, document.body
                    )}
                </div>
            )}

            {!passwordResult && (
                <div className="flex-none pt-4 pb-10 z-10 relative">
                    {/* Style Selector Chips */}
                    <div className="flex justify-center mb-6">
                        <div className="inline-flex bg-slate-100/50 dark:bg-white/5 p-1 rounded-full border border-slate-200/50 dark:border-slate-700/30 backdrop-blur-md">
                            <button
                                onClick={() => setUseFourCut?.(false)}
                                className={`px-5 py-1.5 text-[11px] font-bold rounded-full transition-all duration-300 ${!useFourCut ? 'bg-white dark:bg-slate-700 text-primary shadow-sm scale-105' : 'text-slate-400'}`}
                            >
                                🎨 단일 컷
                            </button>
                            <button
                                onClick={() => setUseFourCut?.(true)}
                                className={`px-5 py-1.5 text-[11px] font-bold rounded-full transition-all duration-300 ${useFourCut ? 'bg-white dark:bg-slate-700 text-primary shadow-sm scale-105' : 'text-slate-400'}`}
                            >
                                🧩 4컷 만화
                            </button>
                        </div>
                    </div>

                    {/* Floating Action Card */}
                    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] mx-1">
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            {/* Ghost Button: Rememit */}
                            <button
                                onClick={onRememit}
                                className="py-3.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-slate-50 dark:hover:bg-white/5"
                            >
                                <RefreshCw className="w-4 h-4 opacity-70" />
                                <span className="text-sm">다시 메밋</span>
                            </button>

                            {/* Solid Button: Save */}
                            <button
                                onClick={onSave}
                                className="py-3.5 bg-emerald-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all hover:bg-emerald-600"
                            >
                                <Save className="w-4 h-4" />
                                <span className="text-sm">내 기억 저장</span>
                            </button>
                        </div>

                        {/* Primary Gradient Action: Share Card */}
                        <button
                            onClick={handleOpenShareModal}
                            disabled={isCapturing}
                            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-primary text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all mb-3 hover:opacity-90"
                        >
                            {isCapturing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Share2 className="w-5 h-5" />}
                            <span className="text-sm">이미지 카드 공유하기</span>
                        </button>

                        {/* Prestige Action: Hall of Fame */}
                        <button
                            onClick={onShareCommunity}
                            className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 border border-slate-800 dark:border-slate-200 font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-slate-800 dark:hover:bg-slate-50"
                        >
                            <Trophy className="w-4 h-4" />
                            <span className="text-sm">명예의 전당 등록</span>
                        </button>
                    </div>

                    {/* Minimal Reset Link */}
                    <button
                        onClick={onReset}
                        className="w-full py-4 text-slate-400 dark:text-slate-500 text-xs font-medium hover:text-slate-600 dark:hover:text-slate-300 transition-colors mt-2"
                    >
                        처음으로 돌아가기
                    </button>
                </div>
            )}
        </div>
    );
}
