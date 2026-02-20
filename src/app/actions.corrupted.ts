// 'use server'; // Disabled for static mobile build

import { supabaseMemoryService } from '@/lib/supabase-memory-service';
import { openAIStoryService } from '@/lib/openai-story-service';
import { KeywordResult } from '@/lib/memory-service';
import digits2Full from '../../digits_2_full.json';

// Helper for Chunking Logic
function chunkNumberLogic(number: string): string[] {
    const cleanInput = number.replace(/[^0-9]/g, '');
    const chunks: string[] = [];
    let remaining = cleanInput;

    while (remaining.length > 0) {
        if (remaining.length >= 2) {
            chunks.push(remaining.substring(0, 2));
            remaining = remaining.substring(2);
        } else {
            chunks.push(remaining);
            remaining = '';
        }
    }
    return chunks;
}

export async function convertNumberAction(number: string) {
    if (!number) return { success: false, error: 'Input is empty' };

    try {
        const chunks = chunkNumberLogic(number);
        const keywords: string[] = [];
        const candidates: { chunk: string, words: string[] }[] = [];

        for (const chunk of chunks) {
            let foundKeywords: string[] = [];

            if (chunk.length === 2) {
                // @ts-ignore
                const mapping = digits2Full.digits_2.find((d: any) => d.code === chunk);
                if (mapping && mapping.keywords) {
                    foundKeywords = mapping.keywords;
                }
            }

            if (foundKeywords.length === 0) {
                const results = await supabaseMemoryService.convertNumberToKeywords(chunk);
                if (results && results.length > 0) {
                    foundKeywords = results[0].candidates;
                }
            }

            if (foundKeywords.length === 0) foundKeywords = [chunk];

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

        const digits3Full = await import('../../digits_3_full.json');
        const digits2Full = await import('../../digits_2_full.json');

        const mapping: { word: string; code: string }[] = [];
        let password = '';

        for (const word of extracted) {
            let code = '';
            const match3 = digits3Full.digits_3.find((d: any) => d.keywords.includes(word));
            if (match3) {
                code = match3.code;
            } else {
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

export async function saveCustomKeywordAction(code: string, word: string) {
    try {
        const result = await supabaseMemoryService.saveCustomKeyword(code, word);
        return result;
    } catch (error) {
        console.error("Save custom keyword action error:", error);
        return { success: false, error: '시스템 오류가 발생했습니다.' };
    }
}
