'use client';

import { Share as CapShare } from '@capacitor/share';
import { Clipboard } from '@capacitor/clipboard';
import { Toast } from '@capacitor/toast';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { ChevronDown, Check, Save, Share2, RefreshCw, KeyRound, Zap, Maximize2, X, Lock, Unlock, Brain, Loader2, Phone } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { createPortal } from 'react-dom';
import { MNEMONIC_MAP } from '@/lib/mnemonic-map';
import { KeywordItem } from './MobileHome';
import { saveCustomKeywordAction } from '@/app/actions';
import { ChevronUp } from 'lucide-react';

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
    useFourCut?: boolean;
    setUseFourCut?: (val: boolean) => void;
}

// ─── Canvas-based share card generator ───────────────────────────────
function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number, r: number
) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
}

function loadImageAsync(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined') {
            reject(new Error('Window not defined during SSR'));
            return;
        }
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
        img.crossOrigin = "anonymous";
        img.src = src;
    });
}

function wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number, y: number,
    maxWidth: number, lineHeight: number
): number {
    const words = text.split('');
    let line = '';
    let currentY = y;

    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && line.length > 0) {
            ctx.fillText(line, x, currentY);
            line = words[i];
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, currentY);
    return currentY + lineHeight;
}

interface ShareCardOptions {
    prefix010: boolean;
    customLabel: string;
    customTitle?: string;
}

async function generateShareCardCanvas(
    input: string,
    keywords: KeywordItem[],
    storyText: string,
    imageUrl?: string,
    options?: ShareCardOptions
): Promise<string> {
    // Format display number based on options
    const is8Digits = /^\d{8}$/.test(input);
    let displayNumber = input;
    if (is8Digits && options?.prefix010) {
        displayNumber = `010-${input.slice(0, 4)}-${input.slice(4)}`;
    }
    const labelText = options?.customLabel?.trim() || '';
    const W = 720;         // Canvas width
    const PAD = 48;        // Outer padding
    const CARD_PAD = 32;   // Inner card padding

    // --- Pre-calculate dynamic height ---
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = W;
    tempCanvas.height = 1;
    const tmpCtx = tempCanvas.getContext('2d')!;

    // Measure story text height
    tmpCtx.font = '500 24px "Pretendard", "Apple SD Gothic Neo", sans-serif';
    const storyClean = storyText.replace(/\*\*/g, '');
    const maxTextW = W - PAD * 2 - CARD_PAD * 2 - 16;
    let storyLines = 1;
    {
        let line = '';
        const chars = storyClean.split('');
        for (const ch of chars) {
            const test = line + ch;
            if (tmpCtx.measureText(test).width > maxTextW && line.length > 0) {
                storyLines++;
                line = ch;
            } else {
                line = test;
            }
        }
    }
    const storyH = storyLines * 36 + 20;

    // Image area
    const imgAreaW = W - PAD * 2 - CARD_PAD * 2;
    const imgAreaH = Math.round(imgAreaW * 0.75); // 4:3

    // Total height calculation
    // Total height calculation
    // Total height calculation
    let headerH = 140; // Increased base
    if (options?.customTitle) {
        // Measure title height
        tmpCtx.font = 'bold 32px "Pretendard", "Apple SD Gothic Neo", sans-serif';
        const titleLines = wrapText(tmpCtx, options.customTitle, 0, 0, maxTextW, 44);
        // Spacing: 30px top + 10px bottom + Number area (~140px)
        headerH = titleLines + 40 + 140;
    }
    const keywordsH = 100;
    const brandingH = 60; // Reduced branding height slightly
    const mnemonicTableH = 160;
    const spacings = 40 + 30 + 30 + 30 + 15 + 10; // Significantly reduced gaps (Story->Key, Key->Brand)
    const totalH = PAD + headerH + imgAreaH + 16 + storyH + keywordsH + mnemonicTableH + brandingH + spacings + PAD - 20; // -20 offset for tighter feel

    // --- Create real canvas ---
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = totalH;
    const ctx = canvas.getContext('2d')!;

    // BG gradient (dark theme)
    const bgGrad = ctx.createLinearGradient(0, 0, 0, totalH);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, totalH);

    // Card background
    const cardX = PAD;
    const cardY = PAD;
    const cardW = W - PAD * 2;
    const cardH = totalH - PAD * 2 - brandingH;

    ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
    roundRect(ctx, cardX, cardY, cardW, cardH, 20);
    ctx.fill();

    // Card border
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.5)';
    ctx.lineWidth = 1;
    roundRect(ctx, cardX, cardY, cardW, cardH, 20);
    ctx.stroke();

    let cursorY = cardY + CARD_PAD + 20; // Added 20px extra spacing for "SUPER MEMORY" badge

    // ─── Custom Title ───
    if (options?.customTitle) {
        ctx.fillStyle = '#94a3b8'; // Slate-400
        ctx.font = 'bold 32px "Pretendard", "Apple SD Gothic Neo", sans-serif';
        // Draw wrapped text
        cursorY = wrapText(ctx, options.customTitle, cardX + CARD_PAD, cursorY + 30, maxTextW, 44);
        cursorY += 10; // Essential spacing after title (0 -> 10)
    } else {
        // Fallback or empty
    }

    // ─── Number ───
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px "Pretendard", "Apple SD Gothic Neo", sans-serif';
    ctx.fillText(displayNumber || '', cardX + CARD_PAD, cursorY + 44);

    // ─── Custom label (next to number) ───
    ctx.font = 'bold 44px "Pretendard", "Apple SD Gothic Neo", sans-serif';
    const numW = ctx.measureText(displayNumber || '').width;
    let afterNumX = cardX + CARD_PAD + numW + 20;

    if (labelText) {
        ctx.fillStyle = '#818cf8'; // primary color for label
        ctx.font = 'bold 28px "Pretendard", "Apple SD Gothic Neo", sans-serif';
        ctx.fillText(labelText, afterNumX, cursorY + 41);
        afterNumX += ctx.measureText(labelText).width + 16;
    }

    // ─── "숫자" badge removed ───
    // const badgeText = '숫자';
    // ... removed ...

    cursorY += 60; // Increased spacing after number to prevent overlap (50 -> 60)

    // ─── AI Image ───
    const imgX = cardX + CARD_PAD;
    const imgY = cursorY + 8;

    if (imageUrl) {
        try {
            const img = await loadImageAsync(imageUrl);
            ctx.save();
            roundRect(ctx, imgX, imgY, imgAreaW, imgAreaH, 16);
            ctx.clip();
            // Cover fit
            const srcRatio = img.width / img.height;
            const dstRatio = imgAreaW / imgAreaH;
            let sx = 0, sy = 0, sw = img.width, sh = img.height;
            if (srcRatio > dstRatio) {
                sw = img.height * dstRatio;
                sx = (img.width - sw) / 2;
            } else {
                sh = img.width / dstRatio;
                sy = (img.height - sh) / 2;
            }
            ctx.drawImage(img, sx, sy, sw, sh, imgX, imgY, imgAreaW, imgAreaH);
            ctx.restore();
        } catch (e) {
            // Fallback: draw placeholder
            ctx.fillStyle = '#334155';
            roundRect(ctx, imgX, imgY, imgAreaW, imgAreaH, 16);
            ctx.fill();
            ctx.fillStyle = '#64748b';
            ctx.font = '500 20px "Pretendard", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('이미지를 불러올 수 없습니다', imgX + imgAreaW / 2, imgY + imgAreaH / 2);
            ctx.textAlign = 'start';
        }
    }
    cursorY = imgY + imgAreaH + 24;

    // ─── "기억 스토리" label ───
    ctx.fillStyle = '#818cf8'; // primary/indigo
    ctx.font = 'bold 28px "Pretendard", "Apple SD Gothic Neo", sans-serif';
    ctx.fillText('📖 기억 스토리', cardX + CARD_PAD, cursorY + 28);
    cursorY += 48;

    // ─── Keywords row ───
    const chipGap = 12;
    const chipH = 48;
    const totalChips = keywords.length;
    const chipW = Math.floor((imgAreaW - chipGap * (totalChips - 1)) / totalChips);
    let chipX = cardX + CARD_PAD;

    for (const kw of keywords) {
        // Chip bg
        ctx.fillStyle = '#1e1c30';
        roundRect(ctx, chipX, cursorY, chipW, chipH, 10);
        ctx.fill();
        ctx.strokeStyle = 'rgba(51, 65, 85, 0.6)';
        ctx.lineWidth = 1;
        roundRect(ctx, chipX, cursorY, chipW, chipH, 10);
        ctx.stroke();

        // Keyword text with code in parens
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 26px "Pretendard", "Apple SD Gothic Neo", sans-serif';

        const displayText = `${kw.word}(${kw.code})`;
        const textW = ctx.measureText(displayText).width;

        // Center text in chip
        ctx.fillText(displayText, chipX + (chipW - textW) / 2, cursorY + 31);

        chipX += chipW + chipGap;
    }
    cursorY += chipH + 24;

    // ─── Story text ───
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '500 28px "Pretendard", "Apple SD Gothic Neo", sans-serif';
    cursorY = wrapText(ctx, storyClean, cardX + CARD_PAD, cursorY + 30, maxTextW, 44);
    cursorY += 25; // Reduced spacing before Mnemonic Key (50 -> 25)

    // ─── Mnemonic Key Table (5x2 Grid) ───

    // Title
    ctx.fillStyle = '#a78bfa'; // violet-400
    ctx.font = 'bold 27px "Pretendard", "Apple SD Gothic Neo", sans-serif'; // Increased (1.3x)
    ctx.fillText('🔑 기억의 열쇠 (Mnemonic Key)', cardX + CARD_PAD, cursorY);
    cursorY += 30;

    // Grid Container
    const gridW = cardW - CARD_PAD * 2;
    const cellGap = 8;
    const cellW = (gridW - cellGap * 4) / 5;
    const cellH = 75;

    // Check if map exists
    const mapData = (typeof MNEMONIC_MAP !== 'undefined' && MNEMONIC_MAP.length > 0)
        ? MNEMONIC_MAP
        : [
            { num: '0', consonants: 'ㅇ', label: '이응', word: '알' },
            { num: '1', consonants: 'ㄱㅋ', label: '기역,키읔', word: '감' },
            { num: '2', consonants: 'ㄴㄹ', label: '니은,리을', word: '논' },
            { num: '3', consonants: 'ㄷㅌ', label: '디귿,티읕', word: '달' },
            { num: '4', consonants: 'ㅁㅂ', label: '미음,비읍', word: '물' },
            { num: '5', consonants: 'ㅅ', label: '시옷', word: '산' },
            { num: '6', consonants: 'ㅈ', label: '지읒', word: '종' },
            { num: '7', consonants: 'ㅊ', label: '치읓', word: '차' },
            { num: '8', consonants: 'ㅍ', label: '피읍', word: '파' },
            { num: '9', consonants: 'ㅎ', label: '히읗', word: '해' },
        ];

    for (let i = 0; i < 10; i++) {
        const item = mapData.find(m => m.num === i.toString());
        if (!item) continue;

        const row = Math.floor(i / 5);
        const col = i % 5;

        const cellX = cardX + CARD_PAD + col * (cellW + cellGap);
        const cellY = cursorY + row * (cellH + cellGap);

        // Highlight active number
        const isActive = input.includes(item.num);

        // Cell Background
        if (isActive) {
            ctx.fillStyle = 'rgba(139, 92, 246, 0.2)'; // violet-500/20
            ctx.strokeStyle = '#8b5cf6'; // violet-500
        } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'; // white/5 (Brighter for visibility)
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)'; // slate-400/40 (More visible border)
        }

        roundRect(ctx, cellX, cellY, cellW, cellH, 8);
        ctx.fill();
        ctx.lineWidth = isActive ? 1.5 : 1;
        ctx.stroke();

        // Combined Number(Consonant)
        ctx.font = `bold 27px "Pretendard", sans-serif`; // Increased (1.3x)
        ctx.fillStyle = isActive ? '#ffffff' : '#94a3b8'; // slate-400 (Brighter text)
        const combinedText = `${item.num}(${item.consonants})`;
        const textW = ctx.measureText(combinedText).width;
        ctx.fillText(combinedText, cellX + cellW / 2 - textW / 2, cellY + cellH / 2 + 10);
    }
    cursorY += 2 * cellH + cellGap + 0; // Removed extra gap (12 -> 0)

    // ─── Branding (Centered) ───
    const brandY = totalH - PAD - 12;
    ctx.fillStyle = '#818cf8';
    ctx.font = 'bold 20px "Pretendard", "Apple SD Gothic Neo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ Memit AI - 나만의 기억법', W / 2, brandY);
    ctx.textAlign = 'start'; // Reset alignment

    // ─── "SUPER MEMORY" badge (Centered) ───
    const smText = '⚡ SUPER MEMORY';
    ctx.font = 'bold 14px "Pretendard", sans-serif';
    const smW = ctx.measureText(smText).width + 24;
    const smH = 28;
    const smX = cardX + (cardW - smW) / 2;
    const smY = cardY - 8;
    const smGrad = ctx.createLinearGradient(smX, smY, smX + smW, smY);
    smGrad.addColorStop(0, '#6366f1');
    smGrad.addColorStop(1, '#4f46e5');
    ctx.fillStyle = smGrad;
    roundRect(ctx, smX, smY, smW, smH, 14);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillText(smText, smX + 12, smY + 19);

    return canvas.toDataURL('image/png');
}

// ─── Component ───────────────────────────────────────────────────────
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
    onRememit,
    useFourCut = false,
    setUseFourCut
}: ResultCardProps) {
    const [isZoomed, setIsZoomed] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [isOptionsOpen, setIsOptionsOpen] = useState(false); // New state for accordion

    // Share card options
    const [sharePrefix010, setSharePrefix010] = useState(false);
    const [shareLabel, setShareLabel] = useState('');
    const [shareTitle, setShareTitle] = useState('');
    const labelInputRef = useRef<HTMLInputElement>(null);
    const titleInputRef = useRef<HTMLTextAreaElement>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const isComposingRef = useRef(false);
    const is8Digits = /^\d{8}$/.test(input || '');

    // Initialize share title with default text logic
    useEffect(() => {
        if (keywords && keywords.length > 0) {
            const words = keywords.map(k => k.word).join(', ');
            const lastWord = keywords[keywords.length - 1].word;
            const lastChar = lastWord.charAt(lastWord.length - 1);
            // Check for Batchim (support Korean syllable range 0xAC00-0xD7A3)
            const hasBatchim = (lastChar.charCodeAt(0) - 0xAC00) % 28 > 0;
            const particle = hasBatchim ? '을' : '를';

            setShareTitle(`✨ 핸드폰 번호를 쉽게 기억하세요.\n아래 그림에서 [${words}] ${particle} 찾아보세요.\n기억의 열쇠가 됩니다.`);
        }
    }, [keywords]);

    // Debounced regeneration for inputs
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

    // Keyword selection state
    const [activeKeywordIndex, setActiveKeywordIndex] = useState<number | null>(null);
    const keywordRefs = useRef<(HTMLButtonElement | null)[]>([]);

    // Close popover on click outside
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
        const shareTitle = 'Memit - 나만의 기억법';
        setIsSharing(true);

        try {
            if (isNative) {
                const filename = `memit_card_${Date.now()}.png`;
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
                const file = new File([blob], 'memit_card.png', { type: 'image/png' });
                await navigator.share({ title: shareTitle, files: [file] });
            } else {
                const link = document.createElement('a');
                link.download = 'memit_card.png';
                link.href = previewUrl;
                link.click();
                alert("카드가 다운로드되었습니다.");
            }
            setPreviewUrl(null);
        } catch (error: any) {
            console.error('Share failed:', error);
            if (isNative) {
                await Toast.show({ text: '공유에 실패했습니다.', duration: 'short' });
            } else {
                alert("공유 기능을 사용할 수 없습니다.");
            }
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <div className="flex flex-col h-full overflow-y-auto no-scrollbar relative w-full max-w-md mx-auto">
            {/* Particles */}
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

            {/* Memory Card */}
            <div className="flex-grow flex flex-col justify-center py-4 z-20">
                <div
                    className="relative bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-lg p-6 shadow-2xl transition-transform duration-300"
                >
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
                                                            if (item.isLocked) return;
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

                                                    {/* Code Badge */}
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

                {/* Image Zoom Modal */}
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

                {/* Share Preview Modal */}
                {previewUrl && typeof document !== 'undefined' && createPortal(
                    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <h3 className="font-bold text-slate-900 dark:text-white">공유 카드 미리보기</h3>
                                <button
                                    onClick={() => { setPreviewUrl(null); setSharePrefix010(false); setShareLabel(''); }}
                                    className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>

                            {/* Scrollable Content Container */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                {/* Collapsible Options Panel */}
                                <div className="border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300">
                                    <button
                                        onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                                        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="bg-primary/10 text-primary p-1 rounded-md"><Maximize2 className="w-3.5 h-3.5" /></span>
                                            <span>카드 설정</span>
                                        </div>
                                        {isOptionsOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                    </button>

                                    {/* Accordion Content */}
                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOptionsOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <div className="px-4 pb-4 space-y-3">
                                            {/* Share Title Input */}
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">상단 문구</span>
                                                <textarea
                                                    ref={titleInputRef}
                                                    defaultValue={shareTitle}
                                                    className="text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:outline-none transition-colors resize-none h-20"
                                                    placeholder="상단 문구를 입력하세요"
                                                    onCompositionStart={() => isComposingRef.current = true}
                                                    onCompositionEnd={() => {
                                                        isComposingRef.current = false;
                                                        handleDebouncedInput();
                                                    }}
                                                    onChange={handleDebouncedInput}
                                                />
                                            </div>

                                            {/* 010 Toggle & Custom Label */}
                                            <div className="flex flex-col gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                                                {is8Digits && (
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="w-3.5 h-3.5 text-primary" />
                                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">010 붙이기</span>
                                                        </div>
                                                        <button
                                                            onClick={async () => {
                                                                const next = !sharePrefix010;
                                                                setSharePrefix010(next);
                                                                const currentTitle = titleInputRef.current?.value || shareTitle;
                                                                const currentLabel = labelInputRef.current?.value || shareLabel;
                                                                const dataUrl = await generateShareCardCanvas(
                                                                    input || '', keywords || [], displayStory.text || '', imageUrl,
                                                                    { prefix010: next, customLabel: currentLabel, customTitle: currentTitle }
                                                                );
                                                                setPreviewUrl(dataUrl);
                                                            }}
                                                            className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${sharePrefix010 ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                                                        >
                                                            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${sharePrefix010 ? 'translate-x-4' : ''}`} />
                                                        </button>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap shrink-0">문자 추가</span>
                                                    <input
                                                        ref={labelInputRef}
                                                        type="text"
                                                        defaultValue={shareLabel}
                                                        placeholder="예: 홍길동"
                                                        className="flex-1 min-w-0 text-sm px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:outline-none transition-colors"
                                                        onCompositionStart={() => isComposingRef.current = true}
                                                        onCompositionEnd={() => {
                                                            isComposingRef.current = false;
                                                            handleDebouncedInput();
                                                        }}
                                                        onChange={handleDebouncedInput}
                                                    />
                                                    <button
                                                        onClick={async () => {
                                                            const currentTitle = titleInputRef.current?.value || shareTitle;
                                                            const currentLabel = labelInputRef.current?.value || shareLabel;
                                                            setIsCapturing(true);
                                                            try {
                                                                const dataUrl = await generateShareCardCanvas(
                                                                    input || '', keywords || [], displayStory.text || '', imageUrl,
                                                                    { prefix010: sharePrefix010, customLabel: currentLabel, customTitle: currentTitle }
                                                                );
                                                                setPreviewUrl(dataUrl);
                                                            } finally {
                                                                setIsCapturing(false);
                                                            }
                                                        }}
                                                        className="shrink-0 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg active:scale-95 transition-all"
                                                    >
                                                        적용
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Image Preview Area */}
                                <div className="p-4 bg-slate-100 dark:bg-black/20 flex items-center justify-center min-h-[300px]">
                                    <div className="relative shadow-lg rounded-lg overflow-hidden w-full max-w-[320px]">
                                        <img src={previewUrl} alt="Share Preview" className="w-full h-auto object-contain" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                                <button
                                    onClick={handleShare}
                                    disabled={isSharing}
                                    className="w-full py-3.5 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSharing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>공유 준비 중...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Share2 className="w-5 h-5" />
                                            <span>이대로 공유하기</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
            </div>

            {/* Action Stack */}
            <div className="flex-none pt-4 pb-8 space-y-4 z-10 relative">
                {/* Style Selector Toggle inside ResultCard */}
                <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-slate-700/50">
                    <button
                        onClick={() => setUseFourCut?.(false)}
                        className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${!useFourCut
                                ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                            }`}
                    >
                        <span>🎨 단일 컷</span>
                    </button>
                    <button
                        onClick={() => setUseFourCut?.(true)}
                        className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${useFourCut
                                ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                            }`}
                    >
                        <span>🧩 4컷 만화</span>
                    </button>
                </div>

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
                        disabled={isCapturing}
                        onClick={async () => {
                            try {
                                setIsCapturing(true);

                                // Use Canvas API to generate the share card
                                const dataUrl = await generateShareCardCanvas(
                                    input || '',
                                    keywords || [],
                                    displayStory.text || '',
                                    imageUrl,
                                    {
                                        prefix010: sharePrefix010,
                                        customLabel: labelInputRef.current?.value || shareLabel,
                                        customTitle: titleInputRef.current?.value || shareTitle
                                    }
                                );

                                setPreviewUrl(dataUrl);
                            } catch (error) {
                                console.error('Capture failed:', error);
                                const isNative = Capacitor.isNativePlatform();
                                if (isNative) {
                                    await Toast.show({ text: '카드 생성 실패: ' + (error as Error).message, duration: 'long' });
                                } else {
                                    alert('카드 생성에 실패했습니다: ' + (error as Error).message);
                                }
                            } finally {
                                setIsCapturing(false);
                            }
                        }}
                    >
                        {isCapturing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Share2 className="w-4 h-4" />
                        )}
                        <span>{isCapturing ? '생성 중...' : '공유하기'}</span>
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
        </div>
    );
}
