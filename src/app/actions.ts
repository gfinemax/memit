// 'use server'; // Disabled for static mobile build

import { supabaseMemoryService } from '@/lib/supabase-memory-service';
import digits2Full from '../../digits_2_full.json';

// Helper for Chunking Logic
function chunkNumberLogic(number: string): string[] {
    const cleanInput = number.replace(/[^0-9]/g, '');
    const chunks: string[] = [];
    let remaining = cleanInput;

    // Strategy: Prefer 2 digits.
    // If even length: 2, 2, 2...
    // If odd length: 2, 2, ... 3 (at end) OR 3, 2, 2... ?
    // User complaint: '1134' -> '113', '4' (Bad). Expected '11', '34'. (Good)
    // So if length is even, strictly 2.
    // If length is odd, e.g. '123' -> '12', '3' or '1', '23'.
    // Memory Palace usually 2-digit PAO. 3-digit is 000-999.
    // Let's stick to 2-digit chunks as primary.

    while (remaining.length > 0) {
        if (remaining.length >= 2) {
            // If odd length remains (e.g. 123), should we take 2 (12) leaving 1 (3)? Yes.
            // But if exactly 3 remains, maybe take 3?
            // Only if we have 3-digit images. Do we?
            // `digits_2_full` is 2-digit.
            // `digits_3_full` exists too? User mentioned it.
            // Let's assume we prioritize 2-digits for now as per "digits_2_full".
            // If 3 digits remain (e.g. 123), and we only support 2-digits properly from JSON, 
            // taking 12 (2) and 3 (1) is safer.
            // BUT user might have 3-digit system. 
            // Let's implement robust: If even, take 2. If odd, take 2 until 3 remain?
            // Actually '1134' is even (4). So purely loop 2 is correct.

            chunks.push(remaining.substring(0, 2));
            remaining = remaining.substring(2);
        } else {
            // 1 digit left
            chunks.push(remaining);
            remaining = '';
        }
    }
    return chunks;
}

export async function convertNumberAction(number: string) {
    if (!number) return { success: false, error: 'Input is empty' };

    try {
        // 1. Chunking
        const chunks = chunkNumberLogic(number);
        const keywords: string[] = [];
        const candidates: { chunk: string, words: string[] }[] = [];

        // 2. Lookup
        for (const chunk of chunks) {
            let foundKeywords: string[] = [];

            // Try 2-digit JSON first
            if (chunk.length === 2) {
                // @ts-ignore
                const mapping = digits2Full.digits_2.find((d: any) => d.code === chunk);
                if (mapping && mapping.keywords) {
                    foundKeywords = mapping.keywords;
                }
            }

            // Fallback to Supabase Service
            if (foundKeywords.length === 0) {
                const res = await supabaseMemoryService.convertNumberToKeywords(chunk);
                if (res && res.length > 0) foundKeywords = res;
            }

            // Still nothing? Use the number itself
            if (foundKeywords.length === 0) foundKeywords = [chunk];

            // Pick the first one for display
            keywords.push(foundKeywords[0]);
            candidates.push({ chunk, words: foundKeywords });
        }

        return { success: true, data: keywords, candidates };
    } catch (error) {
        console.error("Conversion error:", error);
        return { success: false, error: 'Conversion failed' };
    }
}
