import { MNEMONIC_MAP } from './mnemonic-map';

// Interfaces for sharing
export interface ShareKeywordItem {
    word: string;
    code: string;
}

export interface ShareCardOptions {
    prefix010: boolean;
    customLabel: string;
    customTitle?: string;
    isPinMode?: boolean;
}

/**
 * Shared Canvas Utility Functions
 */
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

/**
 * Core Canvas Generation Logic
 */
export async function generateShareCardCanvas(
    input: string,
    keywords: ShareKeywordItem[],
    storyText: string,
    imageUrl?: string,
    options?: ShareCardOptions
): Promise<string> {
    if (typeof document === 'undefined') return '';

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

    let headerH = 140;
    if (options?.customTitle) {
        tmpCtx.font = 'bold 32px "Pretendard", "Apple SD Gothic Neo", sans-serif';
        const titleLines = wrapText(tmpCtx, options.customTitle, 0, 0, maxTextW, 44);
        headerH = titleLines + 40 + 140;
    }
    const keywordsH = 100;
    const brandingH = 60;
    const mnemonicTableH = 160;
    const spacings = 40 + 30 + 30 + 30 + 15 + 10;
    const totalH = PAD + headerH + imgAreaH + 16 + storyH + keywordsH + mnemonicTableH + brandingH + spacings + PAD - 20;

    // --- Create real canvas ---
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = totalH;
    const ctx = canvas.getContext('2d')!;

    // BG gradient
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

    ctx.strokeStyle = 'rgba(71, 85, 105, 0.5)';
    ctx.lineWidth = 1;
    roundRect(ctx, cardX, cardY, cardW, cardH, 20);
    ctx.stroke();

    let cursorY = cardY + CARD_PAD + 20;

    // ─── Custom Title ───
    if (options?.customTitle) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 32px "Pretendard", "Apple SD Gothic Neo", sans-serif';
        cursorY = wrapText(ctx, options.customTitle, cardX + CARD_PAD, cursorY + 30, maxTextW, 44);
        cursorY += 10;
    }

    // ─── Number ───
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px "Pretendard", "Apple SD Gothic Neo", sans-serif';
    ctx.fillText(displayNumber || '', cardX + CARD_PAD, cursorY + 44);

    const numW = ctx.measureText(displayNumber || '').width;
    let afterNumX = cardX + CARD_PAD + numW + 20;

    if (labelText) {
        ctx.fillStyle = '#818cf8';
        ctx.font = 'bold 28px "Pretendard", "Apple SD Gothic Neo", sans-serif';
        ctx.fillText(labelText, afterNumX, cursorY + 41);
    }

    cursorY += 60;

    // ─── AI Image ───
    const imgX = cardX + CARD_PAD;
    const imgY = cursorY + 8;

    if (imageUrl) {
        try {
            const img = await loadImageAsync(imageUrl);
            ctx.save();
            roundRect(ctx, imgX, imgY, imgAreaW, imgAreaH, 16);
            ctx.clip();
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

    // ─── Header label ───
    ctx.fillStyle = '#818cf8';
    ctx.font = 'bold 28px "Pretendard", "Apple SD Gothic Neo", sans-serif';
    ctx.fillText(options?.isPinMode ? '🔒 암호 기억 스토리' : '📖 기억 스토리', cardX + CARD_PAD, cursorY + 28);
    cursorY += 48;

    // ─── Keywords row ───
    const chipGap = 12;
    const chipH = 48;
    const totalChips = keywords.length;
    const chipW = Math.floor((imgAreaW - chipGap * (totalChips - 1)) / totalChips);
    let chipX = cardX + CARD_PAD;

    for (const kw of keywords) {
        ctx.fillStyle = '#1e1c30';
        roundRect(ctx, chipX, cursorY, chipW, chipH, 10);
        ctx.fill();
        ctx.strokeStyle = 'rgba(51, 65, 85, 0.6)';
        ctx.lineWidth = 1;
        roundRect(ctx, chipX, cursorY, chipW, chipH, 10);
        ctx.stroke();

        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 26px "Pretendard", "Apple SD Gothic Neo", sans-serif';
        const displayText = `${kw.word}(${kw.code})`;
        const textW = ctx.measureText(displayText).width;
        ctx.fillText(displayText, chipX + (chipW - textW) / 2, cursorY + 31);

        chipX += chipW + chipGap;
    }
    cursorY += chipH + 24;

    // ─── Story text ───
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '500 28px "Pretendard", "Apple SD Gothic Neo", sans-serif';
    cursorY = wrapText(ctx, storyClean, cardX + CARD_PAD, cursorY + 30, maxTextW, 44);
    cursorY += 25;

    // ─── Mnemonic Key Table ───
    ctx.fillStyle = '#a78bfa';
    ctx.font = 'bold 27px "Pretendard", "Apple SD Gothic Neo", sans-serif';
    ctx.fillText('🔑 기억의 열쇠 (Mnemonic Key)', cardX + CARD_PAD, cursorY);
    cursorY += 30;

    const gridW = cardW - CARD_PAD * 2;
    const cellGap = 8;
    const cellW = (gridW - cellGap * 4) / 5;
    const cellH = 75;

    const mapData = MNEMONIC_MAP;

    for (let i = 0; i < 10; i++) {
        const item = mapData.find(m => m.num === i.toString());
        if (!item) continue;

        const row = Math.floor(i / 5);
        const col = i % 5;

        const cellX = cardX + CARD_PAD + col * (cellW + cellGap);
        const cellY = cursorY + row * (cellH + cellGap);

        const isActive = input.includes(item.num);

        if (isActive) {
            ctx.fillStyle = 'rgba(139, 92, 246, 0.2)';
            ctx.strokeStyle = '#8b5cf6';
        } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
        }

        roundRect(ctx, cellX, cellY, cellW, cellH, 8);
        ctx.fill();
        ctx.lineWidth = isActive ? 1.5 : 1;
        ctx.stroke();

        ctx.font = `bold 27px "Pretendard", sans-serif`;
        ctx.fillStyle = isActive ? '#ffffff' : '#94a3b8';
        const combinedText = `${item.num}(${item.consonants})`;
        const textW = ctx.measureText(combinedText).width;
        ctx.fillText(combinedText, cellX + cellW / 2 - textW / 2, cellY + cellH / 2 + 10);
    }

    // ─── Branding ───
    const brandY = totalH - PAD - 12;
    ctx.fillStyle = '#818cf8';
    ctx.font = 'bold 20px "Pretendard", "Apple SD Gothic Neo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ Memit AI - 나만의 기억법', W / 2, brandY);
    ctx.textAlign = 'start';

    const smText = '⚡ SUPER MEMORY';
    ctx.font = 'bold 14px "Pretendard", sans-serif';
    const smW = ctx.measureText(smText).width + 24;
    const smH = 28;
    const smX = cardX + (cardW - smW) / 2;
    const smY = cardY - 8;
    const smGrad = ctx.createLinearGradient(smX, smY, smX + smW, smY + smH);
    smGrad.addColorStop(0, '#4f46e5');
    smGrad.addColorStop(1, '#6366f1');
    ctx.fillStyle = smGrad;
    roundRect(ctx, smX, smY, smW, smH, 14);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillText(smText, smX + 12, smY + 19);

    return canvas.toDataURL('image/png');
}
