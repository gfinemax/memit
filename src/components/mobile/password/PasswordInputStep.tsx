'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Sparkles, Key, Globe, Shield, Hash, Type, Palette, ArrowLeft, ChevronRight, Wand2 } from 'lucide-react';
import { PasswordLevel } from './PasswordLevelSelector';
import { wordToNumbers } from '@/lib/mnemonic-password';
import { MNEMONIC_MAP } from '@/lib/mnemonic-map';
import { getApiUrl } from '@/lib/api-utils';

// ─── Types ───────────────────────────────────────────
type L1SubStep = 'LENGTH' | 'METHOD' | 'INPUT';
type L1Method = 'THEME' | 'WORD';

interface PasswordInputStepProps {
    level: PasswordLevel;
    onGenerate: (serviceName: string, userSalt: string, manualNumber?: string) => void;
    onBack: () => void;
}

// ─── Theme Presets ───────────────────────────────────
const THEME_PRESETS = [
    { id: 'animation', label: '🎬 애니메이션', keywords: ['토토로', '나루토', '원피스', '포켓몬', '드래곤볼', '슬램덩크'], hints: ['좋아하는 캐릭터 이름', '기억에 남는 장면의 단어'] },
    { id: 'movie', label: '🎥 영화', keywords: ['매트릭스', '아바타', '타이타닉', '인셉션', '기생충', '올드보이'], hints: ['인상 깊었던 영화 제목', '배우 이름이나 명대사 속 단어'] },
    { id: 'sports', label: '⚽ 스포츠', keywords: ['축구', '야구', '농구', '테니스', '배구', '수영'], hints: ['좋아하는 선수 이름', '응원하는 팀 이름'] },
    { id: 'it', label: '💻 IT', keywords: ['리눅스', '파이썬', '리액트', '자바', '노드', '도커'], hints: ['자주 쓰는 프로그래밍 언어', '좋아하는 기술 이름'] },
    { id: 'food', label: '🍔 음식', keywords: ['김치', '불고기', '떡볶이', '피자', '햄버거', '초밥'], hints: ['가장 좋아하는 음식', '자주 먹는 메뉴 이름'] },
    { id: 'animal', label: '🐱 동물', keywords: ['고양이', '강아지', '토끼', '사자', '호랑이', '판다'], hints: ['좋아하는 동물 이름', '키우는 반려동물 이름'] },
    { id: 'music', label: '🎵 음악', keywords: ['피아노', '기타', '드럼', '바이올린', '첼로', '플룻'], hints: ['좋아하는 악기 이름', '즐겨 듣는 가수 이름'] },
    { id: 'travel', label: '✈️ 여행', keywords: ['파리', '도쿄', '뉴욕', '런던', '바르셀로나', '방콕'], hints: ['가보고 싶은 도시', '여행했던 장소 이름'] },
];


export default function PasswordInputStep({ level, onGenerate, onBack }: PasswordInputStepProps) {
    // ─── Common State ─────────────────────────────────
    const [serviceName, setServiceName] = useState('');
    const [userSalt, setUserSalt] = useState('');
    const [manualNumber, setManualNumber] = useState('');
    const [isSuggesting, setIsSuggesting] = useState(false);

    // ─── L1 Specific State ────────────────────────────
    const [l1SubStep, setL1SubStep] = useState<L1SubStep>('LENGTH');
    const [pinLength, setPinLength] = useState(4);
    const [l1Method, setL1Method] = useState<L1Method | null>(null);
    const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
    const [wordInput, setWordInput] = useState('');

    const isPinMode = level === 'L1_PIN';

    // ─── Auto-scroll Refs ─────────────────────────────
    const themeGridRef = useRef<HTMLDivElement>(null);
    const keywordGridRef = useRef<HTMLDivElement>(null);
    const inputStepRef = useRef<HTMLDivElement>(null);

    // ─── Auto-scroll Effects ──────────────────────────
    useEffect(() => {
        if (l1Method === 'THEME') {
            setTimeout(() => themeGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
        }
    }, [l1Method]);

    useEffect(() => {
        if (selectedTheme) {
            setTimeout(() => keywordGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
        }
    }, [selectedTheme]);

    useEffect(() => {
        if (l1SubStep === 'INPUT') {
            setTimeout(() => inputStepRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
        }
    }, [l1SubStep]);

    // ─── Live Preview: word -> numbers ────────────────
    const livePreview = useMemo(() => {
        if (!wordInput.trim()) return '';
        return wordToNumbers(wordInput);
    }, [wordInput]);

    // ─── Mnemonic breakdown for display ───────────────
    const mnemonicBreakdown = useMemo(() => {
        if (!wordInput.trim()) return [];
        const result: { char: string; digit: string; consonant: string }[] = [];
        for (const char of wordInput) {
            const digits = wordToNumbers(char);
            if (digits) {
                // Find which consonant maps
                const entry = MNEMONIC_MAP.find(e => e.num === digits);
                result.push({
                    char,
                    digit: digits,
                    consonant: entry?.consonants || char,
                });
            }
        }
        return result;
    }, [wordInput]);


    // ─── Helpers ───────────────────────────────────────
    const currentThemeData = selectedTheme ? THEME_PRESETS.find(t => t.id === selectedTheme) : null;

    // ─── Handlers ─────────────────────────────────────

    const handleL1Generate = async () => {
        if (!wordInput.trim()) {
            // Empty input → AI recommendation
            handleAiGenerate();
            return;
        }

        // If provided word doesn't have enough digits, ask AI to complete it
        if (livePreview.length < pinLength) {
            setIsSuggesting(true);
            try {
                const themeName = currentThemeData?.label?.replace(/^[^\s]+\s/, '') || selectedTheme || '일반';
                const res = await fetch(getApiUrl('/api/ai/generate-pin'), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        theme: themeName,
                        pinLength,
                        existingDigits: livePreview,
                        existingWords: wordInput
                    }),
                });
                const data = await res.json();
                if (data.error) {
                    console.warn('AI error:', data.error);
                    // Fallback: pad with varied digits instead of '0'
                    const padStr = '1234567890'.repeat(3);
                    const padded = (livePreview + padStr).slice(0, pinLength);
                    onGenerate(
                        wordInput,
                        userSalt,
                        padded
                    );
                    return;
                }

                // Combine user word + AI suggestions
                const allWords = [wordInput, ...(data.words || [])].join(' ');

                // If AI returns full digits instead of just remaining, handle gracefully
                let additionalDigits = data.digits || '';
                // If AI returned full length, strip the existing prefix if it matches
                if (additionalDigits.startsWith(livePreview) && additionalDigits.length >= pinLength) {
                    additionalDigits = additionalDigits.slice(livePreview.length);
                }

                // Ensure exactly pinLength
                let fullDigits = (livePreview + additionalDigits);
                if (fullDigits.length < pinLength) {
                    // Constant padding to avoid '00' (Ice) repetition
                    const salt = (allWords + userSalt).length.toString();
                    const extra = '12345678901234567890'.slice(0, pinLength - fullDigits.length);
                    fullDigits += extra;
                }
                fullDigits = fullDigits.slice(0, pinLength);

                onGenerate(
                    allWords,
                    userSalt,
                    fullDigits
                );
            } catch (err) {
                console.error('AI completion failed:', err);
                // Fallback: use repeating padding to always fill the requested length
                const fallbacks: Record<string, string> = {
                    'animation': '1256', 'movie': '3045', 'sports': '1122', 'it': '4089',
                    'food': '1567', 'animal': '2233', 'music': '4455', 'travel': '7788'
                };
                const basePadding = fallbacks[selectedTheme || ''] || '1234';
                // Repeat the padding pattern enough to fill any PIN length
                const repeatedPadding = basePadding.repeat(Math.ceil(pinLength / basePadding.length));
                const fullFallback = (livePreview + repeatedPadding).slice(0, pinLength);

                onGenerate(
                    wordInput,
                    userSalt,
                    fullFallback
                );
            } finally {
                setIsSuggesting(false);
            }
            return;
        }

        // Enough digits provided by user input
        setIsSuggesting(true);
        setTimeout(() => {
            onGenerate(
                wordInput,
                userSalt,
                livePreview.slice(0, pinLength)
            );
            setIsSuggesting(false);
        }, 600);
    };

    const handleAiGenerate = async () => {
        setIsSuggesting(true);
        try {
            const themeName = currentThemeData?.label?.replace(/^[^\s]+\s/, '') || selectedTheme || '일반';
            const res = await fetch(getApiUrl('/api/ai/generate-pin'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: themeName, pinLength }),
            });
            const data = await res.json();
            if (data.error) {
                console.warn('AI error:', data.error);
                const digits = '12345678901234567890'.slice(0, pinLength);
                onGenerate(
                    currentThemeData?.label?.split(' ')[1] || '기본',
                    userSalt,
                    digits
                );
                setIsSuggesting(false);
                return;
            }
            // Use AI result if available, otherwise fallback
            let finalDigits = data.digits || '';
            if (finalDigits.length < pinLength) {
                const extra = '1234567890'.repeat(3).slice(0, pinLength - finalDigits.length);
                finalDigits += extra;
            }
            finalDigits = finalDigits.slice(0, pinLength);

            onGenerate(
                data.words?.join(' ') || (currentThemeData?.label?.split(' ')[1] || '기본'),
                userSalt,
                finalDigits
            );
        } catch (err) {
            console.error('AI PIN generation failed:', err);
            // Fallback for complete failure (Network error, etc)
            const digits = '12345678901234567890'.slice(0, pinLength);
            onGenerate(
                currentThemeData?.label?.split(' ')[1] || '기본',
                userSalt,
                digits
            );
        } finally {
            setIsSuggesting(false);
        }
    };

    const handleSuggest = () => {
        if (!serviceName.trim() && !isPinMode) return;
        setIsSuggesting(true);
        setTimeout(() => {
            onGenerate(serviceName, userSalt, manualNumber || undefined);
            setIsSuggesting(false);
        }, 800);
    };

    const handleSelectThemeKeyword = (keyword: string) => {
        setWordInput(keyword);
        setL1SubStep('INPUT');
    };

    const handleBackInL1 = () => {
        if (l1SubStep === 'INPUT') {
            if (l1Method === 'THEME' && selectedTheme) {
                setSelectedTheme(null);
                // Go back to theme list view within METHOD
            }
            setL1SubStep('METHOD');
        } else if (l1SubStep === 'METHOD') {
            setL1Method(null);
            setL1SubStep('LENGTH');
        } else {
            onBack();
        }
    };

    // ─── Render: Level 1 PIN Mode ─────────────────────
    if (isPinMode) {
        return (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-8 duration-500">
                {/* Header */}
                <div className="flex items-center gap-2 mb-1">
                    <button
                        onClick={handleBackInL1}
                        className="text-xs text-slate-500 hover:text-white transition-colors flex items-center gap-1"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        {l1SubStep === 'LENGTH' ? '등급 변경' : '이전 단계'}
                    </button>
                    <h3 className="text-lg font-bold text-white ml-auto">
                        핀번호 생성
                    </h3>
                </div>

                {/* ── Sub-step 1: Length Selection ── */}
                {l1SubStep === 'LENGTH' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-400">
                        <div className="text-center mb-2">
                            <p className="text-sm text-slate-400">원하는 자릿수를 선택하세요</p>
                        </div>

                        {/* Quick Select: 4, 6, 8 */}
                        <div className="grid grid-cols-3 gap-2">
                            {[4, 6, 8].map(len => (
                                <button
                                    key={len}
                                    onClick={() => {
                                        setPinLength(len);
                                        setL1SubStep('METHOD');
                                    }}
                                    className={`
                                        py-4 rounded-xl font-bold text-xl transition-all border
                                        ${pinLength === len
                                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-lg shadow-emerald-500/10'
                                            : 'bg-slate-900/50 border-white/10 text-slate-300 hover:border-white/30 hover:bg-white/5'
                                        }
                                    `}
                                >
                                    {len}자리
                                </button>
                            ))}
                        </div>

                        {/* Custom Length Input */}
                        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                            <span className="text-xs text-slate-400 whitespace-nowrap">직접 입력:</span>
                            <input
                                type="number"
                                min={1}
                                max={20}
                                value={pinLength || ''}
                                onChange={(e) => {
                                    const valStr = e.target.value;
                                    if (valStr === '') {
                                        setPinLength(0);
                                        return;
                                    }
                                    const val = parseInt(valStr, 10);
                                    if (!isNaN(val)) {
                                        setPinLength(Math.min(val, 20));
                                    }
                                }}
                                onBlur={() => {
                                    if (pinLength < 1) setPinLength(1);
                                    if (pinLength > 20) setPinLength(20);
                                }}
                                className="flex-1 bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-white text-center font-mono text-lg focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button
                                onClick={() => {
                                    if (pinLength >= 1 && pinLength <= 20) {
                                        setL1SubStep('METHOD');
                                    }
                                }}
                                className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-sm px-4 py-2 rounded-lg hover:bg-emerald-500/30 transition-all"
                            >
                                확인
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-500 text-center">
                            1~20자리, 홀수/짝수 모두 가능
                        </p>
                    </div>
                )}

                {/* ── Sub-step 2: Method Selection ── */}
                {l1SubStep === 'METHOD' && !selectedTheme && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-400">
                        <div className="text-center mb-2">
                            <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full mb-2">
                                <Hash className="w-3 h-3" /> {pinLength}자리 선택됨
                            </div>
                            <p className="text-sm text-slate-400">변환 방식을 선택하세요</p>
                        </div>

                        {/* Method A: Theme */}
                        <button
                            onClick={() => setL1Method('THEME')}
                            className={`
                                w-full p-4 rounded-2xl border transition-all text-left group
                                ${l1Method === 'THEME'
                                    ? 'border-purple-500/50 bg-purple-500/10'
                                    : 'border-white/10 bg-slate-900/50 hover:border-purple-500/30 hover:bg-purple-500/5'
                                }
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                    <Palette className="w-5 h-5 text-purple-400" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-white mb-0.5">테마로 단어 추천받기</h4>
                                    <p className="text-[11px] text-slate-400">
                                        좋아하는 분야를 선택하면 관련 단어를 추천해드려요
                                    </p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                            </div>
                        </button>

                        {/* Method B: Direct Word */}
                        <button
                            onClick={() => {
                                setL1Method('WORD');
                                setL1SubStep('INPUT');
                            }}
                            className={`
                                w-full p-4 rounded-2xl border transition-all text-left group
                                ${l1Method === 'WORD'
                                    ? 'border-blue-500/50 bg-blue-500/10'
                                    : 'border-white/10 bg-slate-900/50 hover:border-blue-500/30 hover:bg-blue-500/5'
                                }
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                    <Type className="w-5 h-5 text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-white mb-0.5">단어 직접 입력</h4>
                                    <p className="text-[11px] text-slate-400">
                                        원하는 단어를 메밋 연상법으로 숫자로 변환해요
                                    </p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                            </div>
                        </button>

                        {/* Show theme grid when THEME method is selected */}
                        {l1Method === 'THEME' && (
                            <div ref={themeGridRef} className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-300 pt-2">
                                <p className="text-xs text-slate-400 font-medium">테마를 선택하세요:</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {THEME_PRESETS.map(theme => (
                                        <button
                                            key={theme.id}
                                            onClick={() => setSelectedTheme(theme.id)}
                                            className="p-3 rounded-xl bg-slate-800/50 border border-white/10 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all text-left"
                                        >
                                            <span className="text-sm font-medium text-white">{theme.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ── Theme -> Keyword Selection ── */}
                {l1SubStep === 'METHOD' && selectedTheme && (
                    <div ref={keywordGridRef} className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-2 mb-1">
                            <button
                                onClick={() => setSelectedTheme(null)}
                                className="text-xs text-slate-500 hover:text-white transition-colors"
                            >
                                ← 테마 다시 선택
                            </button>
                        </div>
                        <p className="text-sm text-slate-400 font-medium">추천 단어를 선택하세요:</p>
                        <div className="grid grid-cols-2 gap-2">
                            {THEME_PRESETS.find(t => t.id === selectedTheme)?.keywords.map(keyword => {
                                const preview = wordToNumbers(keyword);
                                return (
                                    <button
                                        key={keyword}
                                        onClick={() => handleSelectThemeKeyword(keyword)}
                                        className="p-3 rounded-xl bg-slate-800/50 border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all text-left group"
                                    >
                                        <span className="text-sm font-bold text-white block">{keyword}</span>
                                        <span className="text-[10px] text-slate-500 font-mono group-hover:text-emerald-400 transition-colors">
                                            → {preview.slice(0, pinLength)}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ── Sub-step 3: Input & Generate ── */}
                {l1SubStep === 'INPUT' && (
                    <div ref={inputStepRef} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-400">
                        {/* Status badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                <Hash className="w-2.5 h-2.5" /> {pinLength}자리
                            </span>
                            <span className="inline-flex items-center gap-1 bg-purple-500/10 text-purple-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {l1Method === 'THEME' ? <Palette className="w-2.5 h-2.5" /> : <Type className="w-2.5 h-2.5" />}
                                {l1Method === 'THEME' ? '테마' : '직접 입력'}
                            </span>
                        </div>

                        {/* Word Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Type className="w-3.5 h-3.5" /> 변환할 단어
                            </label>
                            <input
                                type="text"
                                value={wordInput}
                                onChange={(e) => setWordInput(e.target.value)}
                                placeholder={currentThemeData ? `예: ${currentThemeData.keywords.slice(0, 3).join(', ')}` : '예: 사랑, Love, 토토로'}
                                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all text-lg"
                                autoFocus
                            />
                            {/* Contextual Hint */}
                            {l1Method === 'THEME' && currentThemeData && !wordInput.trim() && (
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2 animate-in fade-in duration-300">
                                    <p className="text-xs text-blue-300">
                                        💡 <strong>{currentThemeData.label.replace(/^[^\s]+\s/, '')}</strong> 테마에서 떠오르는 단어를 입력하세요!
                                    </p>
                                    <p className="text-[10px] text-blue-400/70 mt-0.5">
                                        {currentThemeData.hints.join(', ')} 등
                                    </p>
                                    <p className="text-[10px] text-slate-500 mt-1">
                                        비워두면 AI가 재미있는 단어를 추천해드려요 ✨
                                    </p>
                                </div>
                            )}
                            {l1Method === 'WORD' && !wordInput.trim() && (
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2 animate-in fade-in duration-300">
                                    <p className="text-xs text-blue-300">
                                        💡 기억하기 쉬운 단어를 자유롭게 입력하세요!
                                    </p>
                                    <p className="text-[10px] text-slate-500 mt-0.5">
                                        한글, 영어, 숫자 모두 가능 · 비워두면 AI 추천
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Live Conversion Preview */}
                        {wordInput.trim() && (
                            <div className="bg-slate-900/80 rounded-xl p-4 border border-emerald-500/20 animate-in fade-in duration-300">
                                <div className="flex items-center gap-2 mb-3">
                                    <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-xs font-bold text-emerald-400">메밋 연상법 변환</span>
                                </div>

                                {/* Breakdown */}
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {mnemonicBreakdown.map((item, i) => (
                                        <div key={i} className="flex flex-col items-center bg-slate-800/80 rounded-lg px-2.5 py-1.5 border border-white/5">
                                            <span className="text-sm font-bold text-white">{item.char}</span>
                                            <span className="text-[9px] text-slate-500">{item.consonant}</span>
                                            <span className="text-xs font-mono font-bold text-emerald-400">↓ {item.digit}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Result Preview */}
                                <div className="bg-black/30 rounded-lg px-4 py-3 text-center">
                                    <span className="text-[10px] text-slate-500 block mb-1">생성될 {pinLength}자리 핀번호</span>
                                    <span className="text-2xl font-mono font-bold text-white tracking-[0.2em]">
                                        {livePreview.slice(0, pinLength).padEnd(pinLength, '·')}
                                    </span>
                                    {livePreview.length < pinLength && (
                                        <p className="text-[9px] text-yellow-500 mt-1">
                                            ※ 부족한 자릿수는 AI가 테마에 맞춰 채워줍니다 ✨
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Master Key (Optional) */}
                        <div className="space-y-2 pt-2 border-t border-white/5">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Key className="w-3.5 h-3.5 text-yellow-500" /> 나만의 소금
                                </label>
                                <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">선택사항</span>
                            </div>
                            <input
                                type="text"
                                value={userSalt}
                                onChange={(e) => setUserSalt(e.target.value)}
                                placeholder="비밀 키워드 (예: apple, 0000)"
                                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-yellow-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-yellow-500/50 transition-all font-mono text-sm"
                            />
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={handleL1Generate}
                            disabled={isSuggesting}
                            className={`
                                w-full py-4 rounded-xl font-bold text-lg shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2
                                ${wordInput.trim()
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/30'
                                    : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-purple-500/30'
                                }
                            `}
                        >
                            {isSuggesting ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <Sparkles className="w-5 h-5 text-yellow-300 fill-current" />
                            )}
                            <span>
                                {wordInput.trim()
                                    ? `${pinLength}자리 핀번호 생성하기`
                                    : `AI가 추천해줄게요 ✨`
                                }
                            </span>
                        </button>
                    </div>
                )}
            </div>
        );
    }

    // ─── Render: Level 2 & 3 (Existing Logic) ─────────
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex items-center gap-2 mb-2">
                <button onClick={onBack} className="text-xs text-slate-500 hover:text-white transition-colors flex items-center gap-1">
                    <ArrowLeft className="w-3.5 h-3.5" /> 단계 변경
                </button>
                <h3 className="text-lg font-bold text-white ml-auto">
                    암호 생성 정보
                </h3>
            </div>

            {/* Service Name */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" /> 서비스 이름
                </label>
                <input
                    type="text"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    placeholder="예: Naver, Google, Instagram"
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                    autoFocus
                />
            </div>

            {/* User Salt */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-yellow-500" /> 나만의 소금 (Master Key)
                    </label>
                    <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">선택사항 (권장)</span>
                </div>
                <input
                    type="text"
                    value={userSalt}
                    onChange={(e) => setUserSalt(e.target.value)}
                    placeholder="나만 아는 비밀단어 (예: apple, 0000)"
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-yellow-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-yellow-500/50 transition-all font-mono"
                />
                <p className="text-[10px] text-slate-500 leading-tight">
                    * 이 키워드는 저장되지 않습니다. 이 키워드를 기억해야 동일한 암호를 다시 생성할 수 있습니다.
                </p>
            </div>

            {/* Manual Number */}
            <div className="pt-2 border-t border-white/5">
                <div className="flex items-center gap-2 mb-2">
                    <input
                        type="checkbox"
                        id="manual-num"
                        checked={!!manualNumber}
                        onChange={(e) => setManualNumber(e.target.checked ? '0000' : '')}
                        className="rounded border-slate-600 bg-slate-800 text-primary focus:ring-0 w-3 h-3"
                    />
                    <label htmlFor="manual-num" className="text-xs text-slate-400">숫자 직접 지정하기 (옵션)</label>
                </div>
                {!!manualNumber && (
                    <input
                        type="tel"
                        value={manualNumber === '0000' ? '' : manualNumber}
                        onChange={(e) => setManualNumber(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="원하는 숫자 입력"
                        className="w-full bg-slate-900/30 border border-slate-700/30 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-500"
                    />
                )}
            </div>

            {/* Generate Button */}
            <button
                onClick={handleSuggest}
                disabled={!serviceName.trim() || isSuggesting}
                className={`
                    w-full py-4 rounded-xl font-bold text-lg shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2
                    ${!serviceName.trim()
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-primary to-indigo-600 text-white shadow-primary/30'
                    }
                `}
            >
                {isSuggesting ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                    <Sparkles className="w-5 h-5 text-yellow-300 fill-current" />
                )}
                <span>AI 암호 생성하기</span>
            </button>
        </div>
    );
}
