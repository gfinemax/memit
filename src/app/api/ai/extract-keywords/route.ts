import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
        if (!apiKey) {
            console.error('OPENAI_API_KEY is not set');
            return NextResponse.json({ error: 'AI Service unavailable' }, { status: 500 });
        }

        const openai = new OpenAI({ apiKey });
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are a professional keyword extractor for a memory application. Extract 3 to 5 most important keywords from the provided text. Return ONLY the keywords separated by commas, no other text."
                },
                {
                    role: "user",
                    content: `Extract keywords from: ${text}`
                }
            ],
            temperature: 0.3,
        });

        const keywordsText = response.choices[0].message?.content || "";
        const keywords = keywordsText.split(',').map(k => k.trim()).filter(k => k.length > 0);

        return NextResponse.json({ keywords });
    } catch (error: any) {
        console.error('AI Keyword Extraction Error:', error);
        return NextResponse.json({ error: 'Failed to extract keywords' }, { status: 500 });
    }
}
