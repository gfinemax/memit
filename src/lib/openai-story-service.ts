import OpenAI from 'openai';
import { supabaseMemoryService } from './supabase-memory-service';
import { getApiUrl } from './api-utils';

// Helper to check if running in browser
const isBrowser = typeof window !== 'undefined';

export interface StorySegment {
    number: string;
    keywords: string[];
    selectedKeyword?: string;
}

export class OpenAIStoryService {
    private _openai: OpenAI | null = null;

    private getOpenAIClient() {
        if (isBrowser) return null;
        if (this._openai) return this._openai;

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            console.error('OPENAI_API_KEY is not set on the server');
            return null;
        }

        this._openai = new OpenAI({ apiKey });
        return this._openai;
    }

    /**
     * Chunks a number string into 2-digit or 3-digit segments
     */
    chunkNumber(input: string): string[] {
        const cleanInput = input.replace(/[^0-9]/g, '');
        const chunks: string[] = [];
        let remaining = cleanInput;

        while (remaining.length > 0) {
            if (remaining.length % 2 === 0) {
                chunks.push(remaining.substring(0, 2));
                remaining = remaining.substring(2);
            } else {
                if (remaining.length >= 3) {
                    chunks.push(remaining.substring(0, 3));
                    remaining = remaining.substring(3);
                } else {
                    chunks.push(remaining);
                    remaining = "";
                }
            }
        }
        return chunks;
    }

    async getCandidates(chunks: string[]): Promise<StorySegment[]> {
        const segments: StorySegment[] = [];
        for (const chunk of chunks) {
            let keywords: string[] = [];
            const res = await supabaseMemoryService.convertNumberToKeywords(chunk);
            if (res && res.length > 0) keywords = res;
            else keywords = [chunk];

            segments.push({
                number: chunk,
                keywords: keywords
            });
        }
        return segments;
    }

    async generateStory(
        inputNumber: string,
        options: {
            candidates?: { chunk: string, words: string[] }[],
            context?: string,
            strategy?: 'SCENE' | 'PAO' | 'STORY_BEAT',
            manualKeywords?: string[]
        }
    ): Promise<{ story: string, keywords: string[] }> {
        const { candidates, context, strategy = 'SCENE', manualKeywords } = options;
        let wordsInfo = "";

        if (manualKeywords && manualKeywords.length > 0) {
            wordsInfo = manualKeywords.map((word, index) => `${index + 1}번째 덩어리: **${word}**`).join('\n');
        } else if (candidates) {
            wordsInfo = candidates.map((item, index) => `${index + 1}번째 덩어리 - 숫자 '${item.chunk}': (${item.words.join(', ')})`).join('\n');
        } else {
            wordsInfo = `Number: ${inputNumber}`;
        }

        const prompt = `
      You are a creative memory expert using the 'Major System'.
      Number: ${inputNumber}.
      Keywords: ${wordsInfo}
      ${context ? `Context: "${context}"` : ''}
      Strategy: ${strategy}
      
      Instructions:
      1. Sequence Order must be kept.
      2. Highlight keywords with **double asterisks**.
      3. Return JSON: { "keywords": [], "story": "" }
      4. Language: Korean.
    `;

        try {
            if (isBrowser) {
                const response = await fetch(getApiUrl('/api/ai/generate-story'), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt })
                });
                if (!response.ok) throw new Error("API Route failure");
                const data = await response.json();
                return {
                    story: data.story || "스토리 생성 실패",
                    keywords: data.keywords || []
                };
            } else {
                const client = this.getOpenAIClient();
                if (!client) throw new Error("Server OpenAI key missing");
                const completion = await client.chat.completions.create({
                    messages: [{ role: "system", content: "You are a mnemonic expert. Return JSON." }, { role: "user", content: prompt }],
                    model: "gpt-4o",
                    response_format: { type: "json_object" }
                });
                const parsed = JSON.parse(completion.choices[0].message.content || "{}");
                return {
                    story: parsed.story || "스토리 생성 실패",
                    keywords: parsed.keywords || []
                };
            }
        } catch (error) {
            console.error("Story Generation Error:", error);
            return { story: "연결 오류: 오프라인 모드로 변환합니다.", keywords: [] };
        }
    }

    async generateImage(story: string, context?: string, isQuad: boolean = false, keywords?: string[]): Promise<string> {
        try {
            if (isBrowser) {
                const response = await fetch(getApiUrl('/api/ai/generate-image'), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ story, context, isQuad, keywords })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    if (errorData.error === "SAFETY_FILTER_TRIGGERED") throw new Error("SAFETY_FILTER_TRIGGERED");
                    throw new Error(errorData.error || "Failed");
                }
                const data = await response.json();
                return data.imageUrl;
            } else {
                const client = this.getOpenAIClient();
                if (!client) throw new Error("Server OpenAI key missing");
                const response = await client.images.generate({
                    model: "dall-e-3",
                    prompt: story,
                    n: 1,
                    size: "1024x1024",
                    response_format: "b64_json"
                });
                return `data:image/png;base64,${response.data?.[0]?.b64_json}`;
            }
        } catch (error) {
            console.error("Image Generation Error:", error);
            throw error;
        }
    }

    async generateStoryResponse(prompt: string): Promise<any> {
        try {
            if (isBrowser) {
                const response = await fetch(getApiUrl('/api/ai/generate-story'), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt })
                });
                if (!response.ok) throw new Error("API Route failure");
                return await response.json();
            } else {
                const client = this.getOpenAIClient();
                if (!client) throw new Error("Server OpenAI key missing");
                const completion = await client.chat.completions.create({
                    messages: [{ role: "system", content: "Return ONLY JSON." }, { role: "user", content: prompt }],
                    model: "gpt-4o",
                    response_format: { type: "json_object" }
                });
                return JSON.parse(completion.choices[0].message.content || "{}");
            }
        } catch (error) {
            console.error("JSON Generation Error:", error);
            throw error;
        }
    }
}

export const openAIStoryService = new OpenAIStoryService();
