import { NextResponse } from 'next/server';
import OpenAI from 'openai';

/**
 * Server-side route for DALL-E 3 image generation.
 * This keeps the API key secure and prevents CORS issues.
 */
export async function POST(req: Request) {
    try {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            console.error('OPENAI_API_KEY is not set on the server');
            return NextResponse.json({ error: 'AI Service configuration missing' }, { status: 500 });
        }

        const openai = new OpenAI({ apiKey });
        const { story, context, isQuad, keywords } = await req.json();

        if (!story) {
            return NextResponse.json({ error: 'Story is required' }, { status: 400 });
        }

        // 1. Refine the prompt (server-side for better quality and consistency)
        const keywordsSection = keywords && keywords.length > 0
            ? `\n**MANDATORY VISUAL OBJECTS (Include ALL)**: ${keywords.join(', ')}\n`
            : "";

        const refinementPrompt = `
      You are an expert prompt engineer for DALL-E 3.
      Take the following story and its context, then transform and expand them into a single, highly detailed, and visually descriptive English prompt optimized for DALL-E 3.
      
      **Story**: "${story}"
      **Context**: "${context || 'General Memory'}"
      
      **DALL-E 3 PROMPT STRUCTURE**:
      - **Type**: "High-quality, vibrant Webtoon/Anime style" (Strictly enforced). Do NOT create photorealistic or oil painting images.
      - **Subject**: Describe the main characters or objects in vivid detail.
      - **Features**: Add specific attributes (textures, materials, facial expressions).
      - **Setting/Composition**: Describe the background, foreground, and specific placement of elements. Mention camera angles (e.g., wide-angle, macro, low-angle) and lighting (e.g., cinematic lighting, volumetric fog, golden hour).
      - **Mood/Style**: Dynamic, colorful, and clean lines typical of modern high-end webtoons or Studio Ghibli. clean background.
      
      ${isQuad ? `**CRITICAL: 4-PANEL LAYOUT REQUIREMENTS**: 
      1. COMPOSITION: The image MUST be split into EXACTLY four equal-sized panels arranged in a 2x2 grid. Each panel represents a different moment in the story.
      2. VISUAL STYLE: "Studio Ghibli Animation Style" (Hayao Miyazaki style). Use soft, painterly watercolor backgrounds, vibrant but natural color palettes, hand-drawn aesthetics, and whimsical details. High-quality, cinematic anime finish.
      3. MNEMONIC FOCUS: In each panel, the primary object or action MUST be the absolute central focus, drawn with dramatic exaggeration for memorability.
      4. PANELS NARRATIVE: 
         - Top-left: Introduction of the first key element.
         - Top-right: Development or first interaction.
         - Bottom-left: The climax or surprising twist.
         - Bottom-right: The resolution or final impactful scene.
      5. FRAMING: Clean, lush backgrounds (e.g., blue skies with fluffy clouds, grassy fields) to make the primary objects pop.` : ''}

       **STRICT PRINCIPLES**:
      1. **Keyword Visual Weighting (CRITICAL)**: Identify words surrounded by **double asterisks** in the story. These are the core memory objects.
         - For EACH keyword, you MUST describe its unique physical appearance (e.g., "A huge, antique golden trumpet with detailed engravings and three silver valves").
         - Give these objects the most prominence and visual weight in the scene. They must NOT be background details.
         - If any keyword is missing in the final image, the task is a failure. Ensure they are the PRIMARY subjects or interacted with by the primary subjects.
      2. **Mandatory Inclusion**: ${keywordsSection} If "MANDATORY VISUAL OBJECTS" are listed above, you MUST translate them to English and ensure they are the ABSOLUTE focal point of the artwork.
      3. **Vivid Expansion**: Transform simple nouns into hyper-descriptive phrases to give DALL-E 3 rich detail.
      4. **Safety Transformation**: Rephrase any sensitive or violent concepts into epic, mystical, or grand metaphors (e.g., "explosion" -> "erupting supernova of stardust").
      5. **Absolutely No Text**: Do not include any speech bubbles, labels, text, or letters in the image.
      
      Return ONLY the final English prompt string.
    `;

        const refinementResponse = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are a specialized prompt engineer. Return ONLY text." },
                { role: "user", content: refinementPrompt }
            ],
            temperature: 0.7,
        });

        const safeFinalPrompt = refinementResponse.choices[0].message.content || story;
        console.log("[Server DALL-E Prompt]:", safeFinalPrompt);

        // 2. Generate the image
        const imageResponse = await openai.images.generate({
            model: "dall-e-3",
            prompt: safeFinalPrompt,
            n: 1,
            size: "1024x1024",
            quality: "hd",
            response_format: "b64_json"
        });

        const b64Data = imageResponse.data?.[0]?.b64_json;
        if (!b64Data) {
            throw new Error("No image data returned from OpenAI");
        }

        return NextResponse.json({
            imageUrl: `data:image/png;base64,${b64Data}`,
            refinedPrompt: safeFinalPrompt
        });

    } catch (error: any) {
        console.error("Server Image Generation Error:", error);

        // Handle safety filter specially
        if (error.status === 400 && error.message?.includes('safety system')) {
            return NextResponse.json({ error: 'SAFETY_FILTER_TRIGGERED' }, { status: 400 });
        }

        return NextResponse.json({
            error: error.message || 'Failed to generate image',
            details: error.status === 429 ? 'Rate limit exceeded' : undefined
        }, { status: error.status || 500 });
    }
}
