import OpenAI from 'openai';
import { supabaseMemoryService } from './supabase-memory-service';
import { getApiCandidateUrls } from './api-utils';
import { chunkNumberLogic, shuffleArray } from './mnemonic-utils';
import { Capacitor, CapacitorHttp } from '@capacitor/core';

// Helper to check if running in browser
const isBrowser = typeof window !== 'undefined';

export interface StorySegment {
    number: string;
    keywords: string[];
    selectedKeyword?: string;
}

export class OpenAIStoryService {
    private _openai: OpenAI | null = null;

    private getClientOpenAIKey(): string | null {
        const key = process.env.NEXT_PUBLIC_OPENAI_API_KEY?.trim();
        return key || null;
    }

    private parseMaybeJson(input: unknown): any {
        if (typeof input === 'string') {
            try {
                return input ? JSON.parse(input) : {};
            } catch {
                return { raw: input };
            }
        }
        return input ?? {};
    }

    private async postOpenAIDirect(path: '/chat/completions' | '/images/generations', payload: Record<string, unknown>): Promise<any> {
        const apiKey = this.getClientOpenAIKey();
        if (!apiKey) {
            throw new Error('NEXT_PUBLIC_OPENAI_API_KEY is not configured.');
        }

        const url = `https://api.openai.com/v1${path}`;
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        };

        if (Capacitor.isNativePlatform()) {
            const response = await CapacitorHttp.post({
                url,
                headers,
                data: payload,
            });

            const parsed = this.parseMaybeJson(response.data);
            if (response.status < 200 || response.status >= 300) {
                const message = parsed?.error?.message || parsed?.message || `HTTP ${response.status}`;
                throw new Error(`[${response.status}] ${message}`);
            }
            return parsed;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
        });
        const parsed = this.parseMaybeJson(await response.text());
        if (!response.ok) {
            const message = parsed?.error?.message || parsed?.message || `HTTP ${response.status}`;
            throw new Error(`[${response.status}] ${message}`);
        }
        return parsed;
    }

    private async generateStoryDirect(prompt: string): Promise<{ story: string; keywords: string[] }> {
        const data = await this.postOpenAIDirect('/chat/completions', {
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a mnemonic expert. Return JSON.' },
                { role: 'user', content: prompt },
            ],
            response_format: { type: 'json_object' },
        });

        const content = data?.choices?.[0]?.message?.content;
        const parsed = this.parseMaybeJson(content);
        return {
            story: parsed?.story || '스토리 생성 실패',
            keywords: parsed?.keywords || [],
        };
    }

    private async generateImageDirect(story: string, context?: string, isQuad: boolean = false, keywords?: string[]): Promise<string> {
        const keywordHint = keywords?.length ? `Include these objects clearly: ${keywords.join(', ')}.` : '';
        const quadHint = isQuad ? 'Create a clean 2x2 four-panel comic layout.' : 'Create a single vivid webtoon-style scene.';
        const directPrompt = `${quadHint} ${keywordHint} Story: ${story}. Context: ${context || 'General Memory'}. No text in image.`;

        const data = await this.postOpenAIDirect('/images/generations', {
            model: 'dall-e-3',
            prompt: directPrompt,
            n: 1,
            size: '1024x1024',
            quality: 'hd',
            response_format: 'b64_json',
        });

        const b64 = data?.data?.[0]?.b64_json;
        if (!b64) {
            throw new Error('No image data returned from OpenAI direct API.');
        }
        return `data:image/png;base64,${b64}`;
    }

    private async postJsonWithFallback(path: string, body: Record<string, unknown>): Promise<any> {
        const urls = getApiCandidateUrls(path);
        let lastError: unknown = null;

        for (const url of urls) {
            try {
                console.log(`[API] Attempting fetch: ${url}`);
                const headers: Record<string, string> = {
                    'Content-Type': 'application/json',
                };
                // LocalTunnel interstitial bypass header should only be sent to *.loca.lt.
                if (url.includes('.loca.lt')) {
                    headers['Bypass-Tunnel-Reminder'] = 'true';
                }

                if (Capacitor.isNativePlatform()) {
                    const nativeResponse = await CapacitorHttp.post({
                        url,
                        headers,
                        data: body,
                    });

                    const nativeRaw =
                        typeof nativeResponse.data === 'string'
                            ? nativeResponse.data
                            : JSON.stringify(nativeResponse.data ?? {});

                    let nativeParsed: any = {};
                    try {
                        nativeParsed = nativeRaw ? JSON.parse(nativeRaw) : {};
                    } catch {
                        nativeParsed = nativeResponse.data ?? { raw: nativeRaw };
                    }

                    if (nativeResponse.status < 200 || nativeResponse.status >= 300) {
                        const errorMessage =
                            nativeParsed?.error ||
                            nativeParsed?.message ||
                            `HTTP ${nativeResponse.status}`;
                        console.error(`[API][native] Failed @ ${url}: ${errorMessage}`);
                        lastError = new Error(`[${nativeResponse.status}] ${errorMessage} @ ${url}`);
                        continue;
                    }

                    console.log(`[API][native] Success @ ${url}`);
                    return nativeParsed;
                }

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 25000);
                let response: Response;
                try {
                    response = await fetch(url, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify(body),
                        signal: controller.signal,
                    });
                } finally {
                    clearTimeout(timeoutId);
                }

                const raw = await response.text();
                let parsed: any = {};
                try {
                    parsed = raw ? JSON.parse(raw) : {};
                } catch {
                    parsed = { raw };
                }

                if (!response.ok) {
                    const errorMessage =
                        parsed?.error ||
                        parsed?.message ||
                        `HTTP ${response.status}`;
                    console.error(`[API] Failed @ ${url}:`, { status: response.status, message: errorMessage, parsed });
                    lastError = new Error(`[${response.status}] ${errorMessage} @ ${url}`);
                    continue; // Try next fallback URL
                }

                console.log(`[API] Success @ ${url}`);
                return parsed;
            } catch (error) {
                console.warn(`[API] Attempt failed @ ${url}:`, error);
                if (error instanceof Error) {
                    lastError = new Error(`${error.message} @ ${url}`);
                } else {
                    lastError = error;
                }
            }
        }

        if (lastError instanceof Error) {
            console.error(`[API] All candidates failed. Final error:`, lastError);
            throw lastError;
        }
        throw new Error(`API request failed for ${path} after trying all available endpoints.`);
    }

    private getOpenAIClient() {
        if (isBrowser) return null;
        if (this._openai) return this._openai;

        const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
        if (!apiKey) {
            console.error('OPENAI_API_KEY is not set on the server');
            return null;
        }

        this._openai = new OpenAI({ apiKey });
        return this._openai;
    }

    /**
     * Chunks a number string using the unified logic in mnemonic-utils.
     */
    chunkNumber(input: string): string[] {
        return chunkNumberLogic(input);
    }

    async getCandidates(chunks: string[]): Promise<StorySegment[]> {
        const segments: StorySegment[] = [];
        const usedWords = new Set<string>();

        for (const chunk of chunks) {
            let keywords: string[] = [];
            const res = await supabaseMemoryService.convertNumberToKeywords(chunk);

            if (res && res.length > 0) {
                // Get all candidates and shuffle them for variety
                const allCandidates = shuffleArray(res[0].candidates);

                // Prioritize words not used in this story beat yet
                const freshWords = allCandidates.filter(w => !usedWords.has(w));
                keywords = freshWords.length > 0 ? freshWords : allCandidates;
            } else {
                keywords = [chunk];
            }

            const chosenWord = keywords[0];
            segments.push({
                number: chunk,
                keywords: keywords // Shuffled candidates
            });

            if (chosenWord) usedWords.add(chosenWord);
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
                try {
                    const data = await this.postJsonWithFallback('/api/ai/generate-story', { prompt });
                    return {
                        story: data.story || "스토리 생성 실패",
                        keywords: data.keywords || []
                    };
                } catch (error: any) {
                    console.error('[API] Story generation failed:', error);
                    throw error;
                }
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
            if (isBrowser) {
                if (error instanceof Error) throw error;
                throw new Error('Story generation failed');
            }
            return { story: "연결 오류: 오프라인 모드로 변환합니다.", keywords: [] };
        }
    }

    async generateImage(story: string, context?: string, isQuad: boolean = false, keywords?: string[]): Promise<string> {
        try {
            if (isBrowser) {
                try {
                    const data = await this.postJsonWithFallback('/api/ai/generate-image', { story, context, isQuad, keywords });
                    if (data.error === "SAFETY_FILTER_TRIGGERED") throw new Error("SAFETY_FILTER_TRIGGERED");
                    return data.imageUrl;
                } catch (error: any) {
                    console.error('[API] Image generation failed:', error);
                    throw error;
                }
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
                return await this.postJsonWithFallback('/api/ai/generate-story', { prompt });
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
