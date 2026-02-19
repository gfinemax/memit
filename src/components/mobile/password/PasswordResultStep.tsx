'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, EyeOff, ShieldAlert, Share2, Wand2, Brain, Loader2, Maximize2, X } from 'lucide-react';
import { PasswordGenerationResult } from '@/lib/mnemonic-password';
import { openAIStoryService } from '@/lib/openai-story-service';
import { generateShareCardCanvas } from '@/lib/share-card-utils';
import { Share as CapShare } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';

interface PasswordResultStepProps {
    result: PasswordGenerationResult;
    onClose: () => void;
}

export default function PasswordResultStep({ result, onClose }: PasswordResultStepProps) {
    const [copied, setCopied] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [generatingImage, setGeneratingImage] = useState(false);
    const [generationProgress, setGenerationProgress] = useState(0);
    const [generatingMessageIndex, setGeneratingMessageIndex] = useState(0);
    const [isSharing, setIsSharing] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);

    const generationMessages = [
        "스토리에서 핵심 이미지를 추출하는 중...",
        "캔버스에 기억의 조각들을 배치 중...",
        "AI가 초안 스케치를 진행하고 있습니다...",
        "DALL-E가 정교한 붓 터치를 시작합니다...",
        "마지막 디테일을 다듬고 있습니다...",
        "이미지를 현상 중..."
    ];

    useEffect(() => {
        let interval: NodeJS.Timeout;
        let msgInterval: NodeJS.Timeout;

        if (generatingImage) {
            setGenerationProgress(0);
            setGeneratingMessageIndex(0);

            interval = setInterval(() => {
                setGenerationProgress(prev => {
                    if (prev >= 95) return prev;
                    return prev + (100 / (25 * 10)); // Roughly 25 seconds
                });
            }, 100);

            msgInterval = setInterval(() => {
                setGeneratingMessageIndex(prev => (prev + 1) % generationMessages.length);
            }, 4000);
        }

        return () => {
            clearInterval(interval);
            clearInterval(msgInterval);
        };
    }, [generatingImage]);

    const handleCopy = () => {
        navigator.clipboard.writeText(result.password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleGenerateImage = async () => {
        if (generatingImage || !result.story) return;
        setGeneratingImage(true);
        try {
            const url = await openAIStoryService.generateImage(
                result.story,
                "PIN Password Memory",
                false,
                result.images.map(img => img.keyword)
            );
            setImageUrl(url);
            setGenerationProgress(100);
        } catch (error) {
            console.error("Image generation failed:", error);
            Toast.show({ text: '이미지 생성에 실패했습니다.', duration: 'short' });
        } finally {
            setGeneratingImage(false);
        }
    };

    const handleShare = async () => {
        if (isSharing) return;
        setIsSharing(true);

        try {
            // Prepare card keywords for utility
            const shareKeywords = result.images.map(img => ({
                word: img.keyword,
                code: img.number
            }));

            const previewUrl = await generateShareCardCanvas(
                result.password,
                shareKeywords,
                result.story,
                imageUrl || undefined,
                {
                    prefix010: false,
                    customLabel: '암호 기억법',
                    customTitle: `✨ 메밋 AI가 암호를 기억하기 쉽게 변환했습니다.\n아래 그림에서 [${result.images.map(img => img.keyword).join(', ')}] 이미지를 떠올려보세요.`,
                    isPinMode: true
                }
            );

            const isNative = Capacitor.isNativePlatform();
            const shareTitle = 'Memit - 암호 기억 카드';

            if (isNative) {
                const filename = `memit_pin_card_${Date.now()}.png`;
                const base64Data = previewUrl.split(',')[1];

                await Filesystem.writeFile({
                    path: filename,
                    data: base64Data,
                    directory: Directory.Cache
                });

                const uriResult = await Filesystem.getUri({
                    path: filename,
                    directory: Directory.Cache
                });

                await CapShare.share({
                    title: shareTitle,
                    files: [uriResult.uri],
                    dialogTitle: '기억 카드 공유하기'
                });
            } else if (navigator.share) {
                const blob = await (await fetch(previewUrl)).blob();
                const file = new File([blob], 'memit_pin_card.png', { type: 'image/png' });
                await navigator.share({ title: shareTitle, files: [file] });
            } else {
                const link = document.createElement('a');
                link.download = 'memit_pin_card.png';
                link.href = previewUrl;
                link.click();
                Toast.show({ text: '카드가 다운로드되었습니다.', duration: 'short' });
            }
        } catch (error) {
            console.error('Share failed:', error);
            Toast.show({ text: '공유에 실패했습니다.', duration: 'short' });
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <div className="space-y-6 animate-in zoom-in-95 duration-500 pb-8">
            {/* Loading Overlay */}
            {generatingImage && (
                <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-6 backdrop-blur-xl">
                    <div className="w-full max-w-sm space-y-8 text-center">
                        <div className="relative aspect-square w-full max-w-[280px] mx-auto overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 animate-pulse"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative">
                                    <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                    <Brain className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-white tracking-tight animate-pulse">
                                {generationMessages[generatingMessageIndex]}
                            </h3>
                            <div className="w-full space-y-2">
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-300 ease-out"
                                        style={{ width: `${generationProgress}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                                    <span>AI Drawing</span>
                                    <span>{Math.round(generationProgress)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Password Display Card */}
            <div className="bg-slate-900/80 rounded-2xl p-6 border border-primary/30 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500"></div>

                <div className="text-center mb-6 relative z-10">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 block">
                        Generated PIN
                    </span>
                    <div
                        onClick={handleCopy}
                        className="text-4xl font-mono font-bold text-white tracking-[0.2em] cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                    >
                        {result.password}
                    </div>
                    <button
                        onClick={handleCopy}
                        className="mt-3 text-xs flex items-center justify-center gap-1.5 text-primary hover:text-white transition-colors mx-auto px-4 py-1.5 rounded-full hover:bg-white/5 border border-primary/20"
                    >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? '복사됨' : '암호 복사하기'}
                    </button>
                </div>

                {/* AI Image / Mnemonic Section */}
                <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-xs font-bold text-yellow-500 flex items-center gap-1">
                            <EyeOff className="w-3.5 h-3.5" /> 눈으로만 기억하세요
                        </span>
                    </div>

                    {imageUrl ? (
                        <div
                            className="aspect-[4/3] w-full bg-slate-800 rounded-xl relative overflow-hidden shadow-inner group cursor-zoom-in"
                            onClick={() => setIsZoomed(true)}
                        >
                            <img
                                src={imageUrl}
                                alt="Memory Visualization"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <Maximize2 className="w-8 h-8 text-white/80" />
                            </div>
                        </div>
                    ) : (
                        <div className={`grid gap-2 ${result.images.length <= 2 ? 'grid-cols-2' :
                            result.images.length <= 4 ? 'grid-cols-2' :
                                'grid-cols-3'
                            }`}>
                            {result.images.map((image, index) => (
                                <div
                                    key={index}
                                    className="aspect-square bg-slate-800/50 rounded-lg flex flex-col items-center justify-center border border-white/5 p-2"
                                >
                                    <span className="text-2xl mb-1">
                                        {getEmojiForKeyword(image.keyword)}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">
                                        {image.number} {image.keyword}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {result.story && (
                        <div className="bg-white/5 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
                            <p className="text-center text-sm text-slate-300 font-medium leading-relaxed italic">
                                &quot;{result.story}&quot;
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
                {!imageUrl ? (
                    <button
                        onClick={handleGenerateImage}
                        disabled={generatingImage}
                        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 group"
                    >
                        {generatingImage ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
                        연상 이미지 생성하기
                    </button>
                ) : (
                    <button
                        onClick={handleShare}
                        disabled={isSharing}
                        className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        {isSharing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Share2 className="w-5 h-5" />}
                        기억 카드 공유하기 (개인톡)
                    </button>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={handleShare}
                        className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2"
                    >
                        <Share2 className="w-4 h-4" /> 카드 공유
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 bg-slate-100 dark:bg-white/5 text-slate-400 font-bold rounded-xl hover:bg-slate-200 transition-all text-sm"
                    >
                        기록 삭제 및 닫기
                    </button>
                </div>
            </div>

            {/* Security Warning */}
            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                    <h4 className="text-sm font-bold text-red-400 mb-1">주의: 저장되지 않습니다</h4>
                    <p className="text-xs text-red-300/80 leading-relaxed">
                        이 화면을 닫으면 암호 데이터는 즉시 삭제됩니다. 이미지 카드로 공유하여 안전하게 보관하세요.
                    </p>
                </div>
            </div>

            {/* Image Zoom Portal */}
            {isZoomed && imageUrl && (
                <div
                    className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-300"
                    onClick={() => setIsZoomed(false)}
                >
                    <button className="absolute top-6 right-6 text-white/70 hover:text-white p-2">
                        <X className="w-8 h-8" />
                    </button>
                    <img
                        src={imageUrl}
                        alt="Zoomed Memory"
                        className="max-w-full max-h-[80vh] rounded-xl shadow-2xl animate-in zoom-in-95 duration-300"
                    />
                    <div className="absolute bottom-10 left-0 right-0 text-center">
                        <p className="text-slate-400 text-sm italic">&quot;{result.story}&quot;</p>
                    </div>
                </div>
            )}
        </div>
    );
}

/**
 * Map common Korean keywords to emoji for visual display.
 * Falls back to a generic icon.
 */
function getEmojiForKeyword(keyword: string): string {
    const emojiMap: Record<string, string> = {
        // Animals
        '고래': '🐋', '대문': '🚪', '마술사': '🎩', '피리': '🎺',
        '고양이': '🐱', '강아지': '🐶', '토끼': '🐰', '사자': '🦁',
        '호랑이': '🐯', '판다': '🐼', '곰': '🐻', '여우': '🦊',
        '용': '🐉', '독수리': '🦅', '부엉이': '🦉', '코끼리': '🐘',
        // Food
        '김치': '🥬', '불고기': '🥩', '떡볶이': '🌶️', '피자': '🍕',
        '햄버거': '🍔', '초밥': '🍣', '라면': '🍜', '케이크': '🎂',
        // Sports
        '축구': '⚽', '야구': '⚾', '농구': '🏀', '테니스': '🎾',
        // Music
        '피아노': '🎹', '기타': '🎸', '드럼': '🥁',
        // Nature
        '산': '⛰️', '바다': '🌊', '별': '⭐', '달': '🌙',
        '해': '☀️', '꽃': '🌸', '나무': '🌳',
        // Objects
        '차': '🚗', '집': '🏠', '책': '📕', '시계': '⏰',
        // People / Characters
        '토토로': '🧸', '나루토': '🍥', '원피스': '☠️',
        '포켓몬': '⚡', '드래곤볼': '🐉', '슬램덩크': '🏀',
        // Movies
        '매트릭스': '🕶️', '아바타': '🌿', '타이타닉': '🚢',
        '인셉션': '🌀', '기생충': '🏠', '올드보이': '🔨',
        // IT
        '리눅스': '🐧', '파이썬': '🐍', '리액트': '⚛️',
        '자바': '☕', '노드': '💚', '도커': '🐳',
        // Travel
        '파리': '🗼', '도쿄': '🗾', '뉴욕': '🗽',
        '런던': '🎡', '바르셀로나': '⛪', '방콕': '🛕',
    };

    return emojiMap[keyword] || '🔮';
}
