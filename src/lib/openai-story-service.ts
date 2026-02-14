
import OpenAI from 'openai';
import { supabaseMemoryService } from './supabase-memory-service';

// OpenAI instance cache
let _openai: OpenAI | null = null;

function getOpenAIClient() {
    if (_openai) return _openai;

    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!apiKey || apiKey === 'undefined' || apiKey === '') {
        // Return null instead of throwing to avoid build-time crashes during prerendering
        return null;
    }

    _openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true
    });
    return _openai;
}

export interface StorySegment {
    number: string;
    keywords: string[];
    selectedKeyword?: string;
}

export class OpenAIStoryService {
    /**
     * Chunks a number string into 2-digit or 3-digit segments
     * Even length: all 2 digits
     * Odd length: mix of 2 and 3/1 digits (preferring 2 and 3 for better words)
     */
    chunkNumber(input: string): string[] {
        const cleanInput = input.replace(/[^0-9]/g, '');
        const chunks: string[] = [];
        let remaining = cleanInput;

        while (remaining.length > 0) {
            if (remaining.length % 2 === 0) {
                // Even length: take 2
                chunks.push(remaining.substring(0, 2));
                remaining = remaining.substring(2);
            } else {
                // Odd length
                if (remaining.length === 1) {
                    // Handle single digit remainder if necessary, or combine with previous?
                    // Strategy: If 1 digit left, it means we must have had a 3-digit chunk earlier or just 1.
                    // Let's prefer 3 digits if possible at the start or end.
                    // Simple strategy for odd: Take 3 first, then rest are even.
                    // 12345 -> 123, 45 (Good)
                    // 123 -> 123
                    // 1 -> 1
                    if (remaining.length >= 3) {
                        chunks.push(remaining.substring(0, 3));
                        remaining = remaining.substring(3);
                    } else {
                        chunks.push(remaining);
                        remaining = "";
                    }
                } else {
                    // > 1 and odd (e.g. 5, 7)
                    // Take 3 first
                    if (remaining.length >= 3) {
                        chunks.push(remaining.substring(0, 3));
                        remaining = remaining.substring(3);
                    } else {
                        // Should not happen if logic is correct
                        chunks.push(remaining.substring(0, 2));
                        remaining = remaining.substring(2);
                    }
                }
            }
        }
        return chunks;
    }

    async getCandidates(chunks: string[]): Promise<StorySegment[]> {
        const segments: StorySegment[] = [];

        for (const chunk of chunks) {
            // Use existing memory service to get keywords
            // Note: The convertNumberToKeywords returns a single "best" match usually,
            // but we want *candidates* if possible. 
            // SupabaseMemoryService.convertNumberToKeywords might return one.
            // We might need a method to get ALL candidates.
            // For now, let's assume we get a list from the service or mock it if strictly 1 is retured.

            // Actually, looking at SupabaseMemoryService, it uses `getMapping` which returns one map.
            // We might need to query the `system_code_maps` table directly for all matches.
            // For this MVP, let's use the `convertNumberToKeywords` to get the *default* ones 
            // AND potentially fetch more if we extend the service. 
            // Since `digits_2_full.json` has multiple, we want that richness.

            // Let's extend this to fetch from the JSON files imports if we can, OR
            // rely on the existing service and maybe simulate variety or just use the OpenAI to embellish.

            // User said: "AI will access here [JSONs] to select words".
            // So we should load the JSONs here.

            let keywords: string[] = [];

            // Check length to decide which file/source
            if (chunk.length === 2) {
                // Import/Require JSON is tricky in client-side dynamic.
                // Let's try to use the JSON data passed in or imported.
                // Ideally we'd fetch this from an API route.
                // For now, let's fallback to the basic service + AI creativity.
                // AI can generate the word itself if we give it the Consonant Rule!
                // BUT user said "AI selects from basic set".

                // Let's try to fetch from Supabase.
                // We can use `supabaseMemoryService` to search.
                const res = await supabaseMemoryService.convertNumberToKeywords(chunk);
                if (res && res.length > 0) keywords = res;
                else keywords = [chunk]; // Fallback
            } else {
                const res = await supabaseMemoryService.convertNumberToKeywords(chunk);
                if (res && res.length > 0) keywords = res;
                else keywords = [chunk];
            }

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

        // If candidates are provided, construct a rich prompt
        let wordsInfo = "";

        if (manualKeywords && manualKeywords.length > 0) {
            wordsInfo = manualKeywords
                .map((word, index) => `${index + 1}번째 덩어리: **${word}** (사용자 직접 선택)`)
                .join('\n');
            wordsInfo += `\n\n**[초강력 지침]**: 사용자가 각 숫자에 대해 특정 단어를 직접 선택했습니다. 다른 대안을 고려하지 말고 오직 위 단어들만 사용하여 스토리를 만드세요. 순서 변경도 절대 금지입니다.`;
        } else if (candidates) {
            // Construct: "1st: 11 (가구, 고기...), 2nd: 34 (두부, 도마...)"
            wordsInfo = candidates
                .map((item, index) => `${index + 1}번째 덩어리 - 숫자 '${item.chunk}': (${item.words.join(', ')})`)
                .join('\n');
        } else {
            // Fallback: just use input (basic)
            wordsInfo = `Number: ${inputNumber}`;
        }

        // Strategy-specific instructions
        let strategyInstructions = "";
        if (strategy === 'SCENE') {
            strategyInstructions = `
    **전략: 장면 카드 (Scene Mode)**
    - 숫자를 4자리(2덩어리)씩 묶어서 하나의 '강렬한 정지 화면'으로 상상하세요.
    - 두 단어가 서로 물리적으로 충돌하거나 결합되는 한 장면을 만드세요.
    - 예: '9896' -> '화폐'와 '한자'가 결합된 하나의 장면.
    `;
        } else if (strategy === 'PAO') {
            strategyInstructions = `
    **전략: PAO 모드 (Person-Action-Object)**
    - 숫자를 6자리(3덩어리)씩 묶어서 [인물] - [행동] - [대상]의 서사를 만드세요.
    - 단, 현재 제공된 키워드들을 이 역할(인물/행동/대상)에 맞춰 창의적으로 해석하세요.
    - 예: '98-96-19' -> '화폐(인물화)'가 '한자(행동?)'를 '공항(장소/대상)'에서 어쩌구...
    `;
        } else if (strategy === 'STORY_BEAT') {
            strategyInstructions = `
    **전략: 스토리 비트 (Story Beats)**
    - 긴 숫자를 시간 순서에 따른 '기-승-전-결' 흐름으로 만드세요.
    - "먼저 ~했고, 그 다음에 ~가 일어났다"는 식으로 인과관계를 강조하세요.
    `;
        }

        const chunkCount = candidates ? candidates.length : Math.ceil(inputNumber.length / 2);

        // Length-specific instructions
        let lengthInstructions = "";
        if (chunkCount <= 2) {
            lengthInstructions = "4자리 이하이므로, 단 하나의 짧고 강렬한 임팩트 있는 문장으로 작성하세요. (단문 결합)";
        } else if (chunkCount <= 4) {
            lengthInstructions = "6~8자리이므로, 1~2개 문장으로 구성된 기승전결이 있는 서사로 작성하세요. (중문 구성)";
        } else {
            lengthInstructions = "10자리 이상이므로, 2~3개 이상의 문장으로 이루어진 '미니 영화' 같은 흐름으로 작성하세요. 너무 한 문장에 쑤셔 넣지 말고 자연스럽게 나누어 배치하세요.";
        }

        const prompt = `
  You are a creative memory expert using the 'Major System'.
  
  I have a number: ${inputNumber}.
  I need to memorize it using these keyword candidates for each chunk IN ORDER:
  ${wordsInfo}
  
  ${context ? `**User Context (What this number represents): "${context}"**` : ''}

  **Current Mnemonic Strategy:**
  ${strategyInstructions}

  **Story Length Requirement:**
  ${lengthInstructions}

  **Core Storytelling Principles (3대 원칙):**
  1. **${manualKeywords ? 'Keyword Adherence (단어 절대 준수)' : 'Synergistic Selection (단어군 최적화)'}**: ${manualKeywords ? '사용자가 직접 선택한 단어들을 문장에 자연스럽게 녹여내세요.' : '각 숫자 덩어리의 모든 후보 단어들을 동시에 분석하여, 상호 간에 혹은 User Context와 가장 잘 어울리는 조합을 선택하세요.'}
  2. **Keyword Merging (단어 합성 및 응축)**: 두 개 이상의 키워드가 하나의 개념으로 합쳐질 수 있다면 적극적으로 합성하세요. 하나를 외우는 것이 두 개보다 효율적입니다. (예: '비'+'옷'='**우비**')
  3. **Shocking Visual (초현실적/과장된 각인)**: 이미지 생성을 감안하여 우스꽝스럽거나, 기괴하거나, 압도적인 상황을 설정하세요.

  **Instructions:**
      1. **Strict Sequence Order (가장 중요)**: 숫자의 순서를 절대 뒤섞지 마세요. 순서 유지는 필수입니다.
      2. **Exaggerated Modifiers**: 단어 앞에 강렬하고 과장된 형용사를 붙이세요. (예: '초대형', '눈부신', '광기에 찬')
      3. **Impactful Action**: 단어들이 서로 파괴적이거나 기괴하게 상호작용하게 하세요.
      4. **Highlight**: 선택된 키워드는 **double asterisks**로 감싸세요 (예: **우비**).
      5. **Return**: JSON format ONLY.

      **Format**:
      {
        "keywords": ["selected_keyword_1", "selected_keyword_2"],
        "story": "Story sentence here..."
      }

      **Language**: Korean (한국어) - Casual and punchy style (Banmal or polite but vivid).
      
      **Example**:
      Input: 11 (가구), 34 (도마), Context: "비밀번호"
      Output: { "keywords": ["가구", "도마"], "story": "비밀번호를 누르자 **초대형 가구**가 천장을 뚫고 떨어져 **피할 틈도 없이 도마**를 가루로 박살냈다!" }
    `;

        try {
            const client = getOpenAIClient();
            if (!client) {
                console.warn("OpenAI client not initialized (missing API key). Skipping story generation.");
                return { story: "스토리 생성 서비스가 현재 비활성화되어 있습니다.", keywords: [] };
            }

            const completion = await client.chat.completions.create({
                messages: [
                    { role: "system", content: "You are a creative memory mnemonist. Return only JSON." },
                    { role: "user", content: prompt }
                ],
                model: "gpt-4o", // Upgraded for competition quality
                response_format: { type: "json_object" }
            });

            const content = completion.choices[0].message.content;
            if (!content) throw new Error("No content generated");

            const parsed = JSON.parse(content);
            return {
                story: parsed.story || "스토리를 생성할 수 없습니다.",
                keywords: parsed.keywords || []
            };
        } catch (error) {
            console.error("OpenAI Error:", error);
            throw error;
        }
    }

    /**
     * Refines a story into a DALL-E safe but vivid prompt.
     * Prevents safety filter blocks by rephrasing violent/shocking terms into artistic ones.
     */
    private async refineImagePrompt(story: string, context?: string, isQuad: boolean = false): Promise<string> {
        const refinementPrompt = `
      You are an expert prompt engineer for DALL-E 3.
      Take the following story and its context, then transform and expand them into a single, highly detailed, and visually descriptive English prompt optimized for DALL-E 3.
      
      **Story**: "${story}"
      **Context**: "${context || 'General Memory'}"
      
      **DALL-E 3 PROMPT STRUCTURE**:
      - **Type**: Specify if it is a photo, digital art, oil painting, or 3D render.
      - **Subject**: Describe the main characters or objects in vivid detail.
      - **Features**: Add specific attributes (textures, materials, facial expressions).
      - **Setting/Composition**: Describe the background, foreground, and specific placement of elements. Mention camera angles (e.g., wide-angle, macro, low-angle) and lighting (e.g., cinematic lighting, volumetric fog, golden hour).
      - **Mood/Style**: Define the emotional tone and consistent artistic style.
      
      ${isQuad ? `**CRITICAL: 4-PANEL LAYOUT REQUIREMENTS**: 
      1. COMPOSITION: The image MUST be split into EXACTLY four equal-sized panels arranged in a 2x2 grid. Each panel represents a different moment in the story.
      2. VISUAL STYLE: "Vibrant, high-quality manga/webtoon style" with clean ink lines and distinct, saturated colors. Maintain perfect character and object consistency across all panels.
      3. MNEMONIC FOCUS: In each panel, the primary object or action MUST be the absolute central focus, drawn with dramatic exaggeration for memorability.
      4. PANELS NARRATIVE: 
         - Top-left: Introduction of the first key element.
         - Top-right: Development or first interaction.
         - Bottom-left: The climax or surprising twist.
         - Bottom-right: The resolution or final impactful scene.
      5. FRAMING: Clean backgrounds with high contrast to make the primary mnemonic objects pop.` : ''}

      **STRICT PRINCIPLES**:
      1. **Keyword Priority (Koreans to English)**: Identify words surrounded by **double asterisks** in the story. These are the "Memory Keys". You MUST translate them accurately and make them the most prominent visual elements in the prompt. Do NOT omit or change these objects.
      2. **Vivid Expansion**: Transform simple nouns into hyper-descriptive phrases to give DALL-E 3 rich detail.
      3. **Safety Transformation**: Rephrase any sensitive or violent concepts into epic, mystical, or grand metaphors (e.g., "explosion" -> "erupting supernova of stardust").
      4. **Absolutely No Text**: Do not include any speech bubbles, labels, text, or letters in the image.
      
      Return ONLY the final English prompt string.
    `;

        try {
            const client = getOpenAIClient();
            if (!client) {
                console.warn("OpenAI client not initialized. Skipping prompt refinement.");
                return story;
            }

            const completion = await client.chat.completions.create({
                messages: [
                    { role: "system", content: "You are a specialized prompt engineer. Return ONLY text." },
                    { role: "user", content: refinementPrompt }
                ],
                model: "gpt-4o",
            });
            const refined = completion.choices[0].message.content || story;
            console.log("[DALL-E Prompt]:", refined); // For verification
            return refined;
        } catch (error) {
            console.error("Prompt Refinement Error:", error);
            return story; // Fallback to raw story
        }
    }

    async generateImage(story: string, context?: string, isQuad: boolean = false): Promise<string> {
        // Step 1: Fully refine story + context into a safe English prompt
        const safeFinalPrompt = await this.refineImagePrompt(story, context, isQuad);

        try {
            const client = getOpenAIClient();
            if (!client) {
                throw new Error("OPENAI_CLIENT_NOT_INITIALIZED");
            }

            const response = await client.images.generate({
                model: "dall-e-3",
                prompt: safeFinalPrompt,
                n: 1,
                size: "1024x1024",
                quality: "hd",
                response_format: "b64_json" // Changed to skip CORS fetch later
            });

            const b64Data = response.data?.[0]?.b64_json;
            if (!b64Data) throw new Error("No image data returned from OpenAI");

            // Return data URL so image shows up immediately on UI
            return `data:image/png;base64,${b64Data}`;
        } catch (error: any) {
            console.error("OpenAI Image Generation Error:", error);
            // Handle safety filter error specially
            if (error.status === 400 && error.message?.includes('safety system')) {
                throw new Error("SAFETY_FILTER_TRIGGERED");
            }
            throw error;
        }
    }

    async generateStoryResponse(prompt: string): Promise<any> {
        try {
            const client = getOpenAIClient();
            if (!client) {
                throw new Error("OPENAI_CLIENT_NOT_INITIALIZED");
            }

            const completion = await client.chat.completions.create({
                messages: [
                    { role: "system", content: "You are a helpful assistant. Return ONLY JSON." },
                    { role: "user", content: prompt }
                ],
                model: "gpt-4o",
                response_format: { type: "json_object" }
            });

            const content = completion.choices[0].message.content;
            if (!content) throw new Error("No content generated");

            return JSON.parse(content);
        } catch (error) {
            console.error("OpenAI JSON Error:", error);
            throw error;
        }
    }
}

export const openAIStoryService = new OpenAIStoryService();
