import digits2Full from '../../digits_2_full.json';
import { supabaseMemoryService } from './supabase-memory-service';

export interface KeywordResult {
    word: string;
    code: string;
    candidates: string[];
}

/**
 * Fisher-Yates shuffle algorithm for maximum randomness
 */
export function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

/**
 * Validates if the total length of chunks matches the input length
 */
export function validateChunks(input: string, chunks: string[]): boolean {
    const cleanInput = input.replace(/[^0-9]/g, '');
    const chunkSum = chunks.reduce((sum, c) => sum + c.length, 0);
    return cleanInput.length === chunkSum;
}

export function chunkNumberLogic(number: string): string[] {
    const cleanInput = number.replace(/[^0-9]/g, '');
    if (cleanInput.length <= 1) return [cleanInput];

    const chunks: string[] = [];
    let remaining = cleanInput;

    while (remaining.length > 0) {
        // Core Rules:
        // 1. Prefer 2-digit chunks (Major System standard)
        // 2. Allow 3-digit chunks for odd lengths
        // 3. NEVER leave a 1-digit chunk at the end

        if (remaining.length === 1) {
            // This should ideally not happen with logic below, but just in case:
            if (chunks.length > 0) {
                const last = chunks.pop()!;
                chunks.push(last + remaining);
            } else {
                chunks.push(remaining);
            }
            remaining = "";
        } else if (remaining.length === 2 || remaining.length === 4) {
            // Pure 2-digit path
            chunks.push(remaining.substring(0, 2));
            remaining = remaining.substring(2);
        } else if (remaining.length === 3) {
            // Pure 3-digit path
            chunks.push(remaining);
            remaining = "";
        } else if (remaining.length === 5) {
            // Split 5 into 3+2
            chunks.push(remaining.substring(0, 3));
            chunks.push(remaining.substring(3, 5));
            remaining = "";
        } else if (remaining.length % 2 !== 0) {
            // Odd length > 5: Take 3 to make rest even
            chunks.push(remaining.substring(0, 3));
            remaining = remaining.substring(3);
        } else {
            // Even length > 4: Take 2
            chunks.push(remaining.substring(0, 2));
            remaining = remaining.substring(2);
        }
    }

    // Final Audit: Strict length check
    if (!validateChunks(cleanInput, chunks)) {
        console.error(`Mnemonic Logic Error: Length mismatch for ${cleanInput}. Chunks: ${chunks}`);
    }

    return chunks;
}

/**
 * Converts a number to keywords. 
 * Can be used on client (will skip Supabase if no key) or server.
 */
export async function generateKeywordsFromNumber(number: string): Promise<KeywordResult[]> {
    if (!number) return [];

    const chunks = chunkNumberLogic(number);
    const results: KeywordResult[] = [];

    for (const chunk of chunks) {
        let foundKeywords: string[] = [];

        // 1. Try JSON lookup (always works on client since it's bundled)
        if (chunk.length === 2) {
            // @ts-ignore
            const mapping = digits2Full.digits_2.find((d: any) => d.code === chunk);
            if (mapping && mapping.keywords) {
                foundKeywords = [...mapping.keywords];
            }
        }

        // 2. Try Supabase lookup if available (could be slow on client)
        if (foundKeywords.length === 0) {
            try {
                const res = await supabaseMemoryService.convertNumberToKeywords(chunk);
                if (res && res.length > 0) {
                    foundKeywords = res[0].candidates;
                }
            } catch (e) {
                console.warn(`Supabase lookup failed for chunk ${chunk}:`, e);
            }
        }

        // 3. Fallback to the digit itself
        if (foundKeywords.length === 0) {
            foundKeywords = [chunk];
        }

        results.push({
            code: chunk,
            word: foundKeywords[0],
            candidates: foundKeywords
        });
    }

    return results;
}
