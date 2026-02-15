// 'use server'; // Disabled for static mobile build

import { supabaseMemoryService } from '@/lib/supabase-memory-service';
import { openAIStoryService } from '@/lib/openai-story-service';
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

export async function saveMemoryAction(memoryData: any) {
    try {
        const result = await supabaseMemoryService.saveMemory(memoryData);
        if (result) {
            return { success: true, data: result };
        }
        return { success: false, error: '저장에 실패했습니다. 로그인이 필요할 수 있습니다.' };
    } catch (error) {
        console.error("Save memory action error:", error);
        return { success: false, error: '저장 중 시스템 오류가 발생했습니다.' };
    }
}

export async function getMemoriesAction() {
    try {
        const result = await supabaseMemoryService.getMemories();
        return { success: true, data: result };
    } catch (error) {
        console.error("Get memories action error:", error);
        return { success: false, error: '기억을 불러오는 중 오류가 발생했습니다.' };
    }
}

export async function deleteMemoryAction(id: string) {
    try {
        const result = await supabaseMemoryService.deleteMemory(id);
        return result;
    } catch (error) {
        console.error("Delete memory action error:", error);
        return { success: false, error: '삭제 중 오류가 발생했습니다.' };
    }
}

export async function updateMemoryLabelAction(id: string, label: string) {
    try {
        const result = await supabaseMemoryService.updateMemoryLabel(id, label);
        return result;
    } catch (error) {
        console.error("Update label action error:", error);
        return { success: false, error: '라벨 업데이트 중 오류가 발생했습니다.' };
    }
}
export async function generatePasswordFromStoryAction(story: string) {
    if (!story) return { success: false, error: '스토리를 입력해주세요.' };

    try {
        // 1. Extract keywords using LLM
        const prompt = `
            너는 기억법 전문가야. 사용자의 스토리에서 기억법(Major System)에 활용할 수 있는 핵심 명사나 행위를 2~4개 추출해줘.
            
            **사용자 스토리**: "${story}"
            
            **추출 규칙**:
            1. 문맥에서 가장 기억에 남는 구체적인 명사나 대상을 선택할 것.
            2. 한국어 단어여야 함.
            3. 각 단어는 2글자 또는 3글자 시스템의 키워드와 매칭될 가능성이 높은 단어 위주로 뽑을 것.
            
            **응답 형식**: JSON ONLY
            {
                "extracted": ["단어1", "단어2", "단어3"]
            }
        `;

        const completion = await openAIStoryService.generateStoryResponse(prompt);
        const extracted = completion.extracted || [];

        if (extracted.length === 0) {
            return { success: false, error: '스토리에서 핵심 키워드를 찾을 수 없습니다.' };
        }

        // 2. Load Mnemonic Systems (Dynamic import to avoid blocking)
        const digits3Full = await import('../../digits_3_full.json');
        const digits2Full = await import('../../digits_2_full.json');

        const mapping: { word: string; code: string }[] = [];
        let password = '';

        for (const word of extracted) {
            let code = '';

            // Try 3-digit first
            const match3 = digits3Full.digits_3.find((d: any) => d.keywords.includes(word));
            if (match3) {
                code = match3.code;
            } else {
                // Try 2-digit
                const match2 = digits2Full.digits_2.find((d: any) => d.keywords.includes(word));
                if (match2) {
                    code = match2.code;
                }
            }

            if (code) {
                mapping.push({ word, code });
                password += code;
            }
        }

        if (password.length === 0) {
            return { success: false, error: '시스템에 등록된 단어와 매칭되는 키워드가 없습니다. 다른 단어를 사용해 보세요.' };
        }

        return { success: true, data: { password, mapping } };
    } catch (error) {
        console.error("Story password generation error:", error);
        return { success: false, error: '비밀번호 생성 중 오류가 발생했습니다.' };
    }
}

export async function toggleFavoriteAction(id: string, isFavorite: boolean) {
    try {
        const result = await supabaseMemoryService.toggleFavorite(id, isFavorite);
        return result;
    } catch (error) {
        console.error("Toggle favorite action error:", error);
        return { success: false, error: '실패했습니다.' };
    }
}
