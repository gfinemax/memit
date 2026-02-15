'use client';

import { Share as CapShare } from '@capacitor/share';
import { Device } from '@capacitor/device'; // Check if already installed or used elsewhere. I'll stick to Share first.
import { ChevronDown, Check, Save, Share2, RefreshCw, KeyRound, Zap, Maximize2, X, Lock, Unlock, Brain } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { createPortal } from 'react-dom';
import Image from 'next/image';
import type { KeywordItem } from './MobileHome';
import { saveCustomKeywordAction } from '@/app/actions';

interface ResultCardProps {
    input?: string;
    keywords?: KeywordItem[];
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
}

export default function ResultCard({
    input,
    keywords,
    story,
    imageUrl,
    onSave,
    onReset,
    onKeywordChange,
    onKeywordLockToggle,
    onToggleAllLocks,
    onRememit
}: ResultCardProps) {
    const [isZoomed, setIsZoomed] = useState(false);

    // Keyword selection state
    const [activeKeywordIndex, setActiveKeywordIndex] = useState<number | null>(null);
    const keywordRefs = useRef<(HTMLButtonElement | null)[]>([]);

    // Close popover on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (activeKeywordIndex !== null) {
                const target = e.target as HTMLElement;
                if (!target.closest('.keyword-btn') && !target.closest('.absolute')) { // Simple check for now
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

    return (
        <div className="flex flex-col h-full overflow-y-auto no-scrollbar relative w-full max-w-md mx-auto">
            {/* Particles - Abstract representation for React */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className={`absolute rounded-full bg-primary/40 animate-pulse`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 10 + 5}px`,
                            height: `${Math.random() * 10 + 5}px`,
                            animationDuration: `${Math.random() * 3 + 2}s`
                        }}
                    ></div>
                ))}
            </div>

            {/* Header */}
            <header className="flex-none pt-8 pb-4 text-center z-10">
                <div className="inline-flex items-center justify-center bg-primary/20 text-primary px-4 py-1 rounded-full mb-4">
                    <Brain className="w-3 h-3 mr-1" />
                    <span className="text-xs font-bold uppercase tracking-wider">AI Generated</span>
                </div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">메밋 완료! 🎉</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">성공적으로 기억이 변환되었습니다.</p>
            </header>

            {/* Memory Card - increased z-index to prevent popover being covered by footer */}
            <div className="flex-grow flex flex-col justify-center py-4 z-20">
                <div className="relative bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-lg p-6 shadow-2xl transition-transform hover:scale-[1.02] duration-300">
                    {/* Card Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">입력한 내용</span>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-slate-900 dark:text-white">{input}</span>
                                <span className="bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded-md font-medium">숫자</span>
                            </div>
                        </div>
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <KeyRound className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Image Zoom Modal - Uses Portal to break out of parent stacking context */}
                    {isZoomed && typeof document !== 'undefined' && createPortal(
                        <div
                            className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center animate-in fade-in duration-200 touch-none"
                            onClick={() => setIsZoomed(false)}
                        >
                            <button
                                className="absolute top-6 right-6 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors z-50"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsZoomed(false);
                                }}
                            >
                                <X className="w-8 h-8" />
                            </button>

                            <div
                                className="w-full h-full flex items-center justify-center p-4"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <TransformWrapper
                                    initialScale={1}
                                    minScale={1}
                                    maxScale={5}
                                    centerOnInit={true}
                                    wheel={{ step: 0.2 }}
                                    pinch={{ step: 5 }}
                                    doubleClick={{ disabled: false, mode: 'reset' }}
                                >
                                    <TransformComponent
                                        wrapperStyle={{
                                            width: "100%",
                                            height: "100%",
                                            maxWidth: "100%",
                                            maxHeight: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                        contentStyle={{
                                            width: "100%",
                                            height: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <img
                                            src={imageUrl}
                                            alt="Full Size Memory"
                                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                                            style={{ touchAction: 'none' }}
                                        />
                                    </TransformComponent>
                                </TransformWrapper>
                            </div>
                        </div>,
                        document.body
                    )}
                </div>

                <div
                    className="aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800 rounded-xl mb-6 relative overflow-hidden group cursor-zoom-in"
                    onClick={() => setIsZoomed(true)}
                >
                    <img
                        src={imageUrl}
                        alt="Memory Visualization"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Maximize2 className="w-8 h-8 text-white/80 drop-shadow-md" />
                    </div>
                </div>

                {/* Story Text */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary uppercase tracking-wide">기억 스토리</span>
                        {keywords && keywords.length > 0 && (
                            <button
                                onClick={onToggleAllLocks}
                                className={`
                                    flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all duration-300
                                    ${keywords.every(k => k.isLocked)
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                                    }
                                `}
                            >
                                {keywords.every(k => k.isLocked) ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                                {keywords.every(k => k.isLocked) ? "전체 고정됨" : "전체 고정하기"}
                            </button>
                        )}
                    </div>
                    <div className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-relaxed break-keep">
                        {keywords ? (
                            <div className="grid grid-cols-4 gap-2">
                                {keywords.map((item, i) => (
                                    <div
                                        key={i}
                                        className={`relative group ${activeKeywordIndex === i ? 'z-50' : 'z-20'}`}
                                    >
                                        <div className="flex flex-col gap-1">
                                            <div className="relative">
                                                <button
                                                    ref={el => { keywordRefs.current[i] = el; }}
                                                    className={`
                                                    keyword-btn w-full flex items-center justify-between px-2 py-2.5 rounded-lg border transition-all duration-300
                                                    ${item.isLocked
                                                            ? 'bg-primary/10 border-primary shadow-[0_0_10px_rgba(79,70,229,0.2)]'
                                                            : 'bg-slate-50 dark:bg-[#1e1c30] border-slate-100 dark:border-slate-800 hover:border-primary/30'
                                                        }
                                                    ${activeKeywordIndex === i ? 'ring-2 ring-primary/50' : ''}
                                                `}
                                                    onClick={(e) => {
                                                        if (item.isLocked) return; // Prevent change if locked
                                                        setActiveKeywordIndex(activeKeywordIndex === i ? null : i);
                                                    }}
                                                >
                                                    <div className="flex flex-col items-start min-w-0">
                                                        <span className={`text-sm font-bold truncate ${item.isLocked ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                                                            {item.word}
                                                        </span>
                                                    </div>
                                                    {!item.isLocked && item.candidates && item.candidates.length > 1 && (
                                                        <ChevronDown className={`w-3.5 h-3.5 opacity-40 transition-transform duration-300 ${activeKeywordIndex === i ? 'rotate-180' : ''}`} />
                                                    )}
                                                </button>

                                                {/* Code Badge (Top-Right Overlay) */}
                                                <span className={`absolute -top-1.5 -right-1 z-30 text-[9px] font-mono px-1.5 py-0.5 rounded-md border border-white/10 shadow-sm ${item.isLocked ? 'bg-primary text-white font-bold border-primary-dark/20' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`}>
                                                    {item.code}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Dropdown Popover */}
                                        {!item.isLocked && activeKeywordIndex === i && (
                                            <div
                                                className={`absolute top-full mt-2 z-50 w-[200px] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-100 max-h-[280px] overflow-hidden flex flex-col
                                                    ${i % 4 === 0 ? 'left-0 origin-top-left' :
                                                        i % 4 === 3 ? 'right-0 origin-top-right' :
                                                            'left-1/2 -translate-x-1/2 origin-top'}
                                                `}
                                            >
                                                <div className="text-xs px-2 mb-2 text-slate-400 font-bold uppercase flex justify-between items-center flex-shrink-0">
                                                    <span>단어 교체</span>
                                                    <span className="bg-primary/20 text-primary px-1.5 rounded">{item.code}</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-1 overflow-y-auto custom-scrollbar flex-grow min-h-0">
                                                    {(item.candidates || []).map((candidate, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => {
                                                                if (onKeywordChange) onKeywordChange(i, candidate);
                                                                setActiveKeywordIndex(null);
                                                            }}
                                                            className={`text-center px-1 py-2 rounded-md text-xs font-medium transition-colors truncate
                                                                ${item.word === candidate
                                                                    ? 'bg-primary text-white'
                                                                    : 'text-slate-300 hover:bg-slate-800'
                                                                }
                                                            `}
                                                        >
                                                            {candidate}
                                                        </button>
                                                    ))}
                                                </div>

                                                {/* Custom Word Input */}
                                                <div className="mt-2 pt-2 border-t border-slate-700 flex items-center gap-1 flex-shrink-0">
                                                    <input
                                                        type="text"
                                                        placeholder="직접 입력..."
                                                        className="flex-1 bg-slate-800 text-slate-200 text-xs px-2 py-1.5 rounded-md border border-slate-700 focus:border-primary focus:outline-none transition-colors"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                const val = (e.target as HTMLInputElement).value.trim();
                                                                if (val && onKeywordChange) {
                                                                    onKeywordChange(i, val);
                                                                    saveCustomKeywordAction(item.code, val);
                                                                    setActiveKeywordIndex(null);
                                                                }
                                                            }
                                                        }}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                    <button
                                                        className="bg-slate-800 hover:bg-slate-700 text-primary p-1.5 rounded-md border border-slate-700 transition-colors"
                                                        onClick={(e) => {
                                                            const inputEl = e.currentTarget.previousElementSibling as HTMLInputElement;
                                                            const val = inputEl.value.trim();
                                                            if (val && onKeywordChange) {
                                                                onKeywordChange(i, val);
                                                                saveCustomKeywordAction(item.code, val);
                                                                setActiveKeywordIndex(null);
                                                            }
                                                        }}
                                                    >
                                                        <Check className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>
                                <span className="text-primary">총알(70)</span>이 날아가 <span className="text-primary">파리(82)</span>를 정확히 맞추는 장면을 상상해보세요!
                            </p>
                        )}
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 mt-2 border border-slate-100 dark:border-slate-700/50">
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                            💡 Tip: 단어를 눌러서 더 기억하기 쉬운 단어로 바꿔보세요.
                        </p>
                    </div>
                </div>

                {/* Badge */}
                <div className="absolute -top-3 -right-3">
                    <div className="bg-gradient-to-r from-primary to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <Zap className="w-3 h-3" fill="currentColor" />
                        SUPER MEMORY
                    </div>
                </div>
            </div>

            {/* Action Stack */}
            <div className="flex-none pt-4 pb-8 space-y-3 z-10 relative">
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={onRememit}
                        className="flex items-center justify-center gap-2 py-4 bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-white font-bold rounded-2xl active:scale-[0.98] transition-all border border-slate-200 dark:border-slate-700"
                    >
                        <RefreshCw className="w-5 h-5 text-primary" />
                        <span>다시 메밋</span>
                    </button>
                    <button
                        onClick={onSave}
                        className="flex items-center justify-center gap-2 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/25 active:scale-[0.98] transition-all"
                    >
                        <Save className="w-5 h-5" />
                        <span>기억 저장</span>
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-semibold rounded-xl hover:bg-slate-200 transition-all text-sm"
                        onClick={async () => {
                            const shareData = {
                                title: 'Memit - 나만의 기억법',
                                text: story.text,
                                url: window.location.href,
                                dialogTitle: '기억 스토리 공유하기',
                            };

                            try {
                                if (navigator.share) {
                                    await navigator.share(shareData);
                                } else {
                                    // Try Capacitor Share
                                    await CapShare.share(shareData);
                                }
                            } catch (error) {
                                console.error('Share failed:', error);
                                // Fallback: Copy to clipboard
                                try {
                                    await navigator.clipboard.writeText(`${shareData.text}\n\n${shareData.url}`);
                                    alert("스토리가 클립보드에 복사되었습니다.");
                                } catch (clipboardError) {
                                    alert("공유 기능을 지원하지 않는 환경입니다.");
                                }
                            }
                        }}
                    >
                        <Share2 className="w-4 h-4" />
                        <span>공유하기</span>
                    </button>
                    <button
                        onClick={onReset}
                        className="flex items-center justify-center gap-2 py-3.5 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-semibold rounded-xl hover:bg-slate-200 transition-all text-sm"
                    >
                        <X className="w-4 h-4" />
                        <span>처음으로</span>
                    </button>
                </div>
            </div>
        </div >
    );
}
