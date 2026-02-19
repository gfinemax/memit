import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';
export const maxDuration = 30;

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function jsonWithCors(body: unknown, status = 200) {
    return NextResponse.json(body, { status, headers: corsHeaders });
}

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: Request) {
    try {
        const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
        if (!apiKey) {
            console.error('OPENAI_API_KEY is not set');
            return jsonWithCors({ error: 'AI Service unavailable' }, 500);
        }

        const openai = new OpenAI({ apiKey });
        const { text } = await req.json();

        if (!text) {
            return jsonWithCors({ error: 'Text is required' }, 400);
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

        return jsonWithCors({ keywords });
    } catch (error: any) {
        console.error('AI Keyword Extraction Error:', error);
        return jsonWithCors({ error: 'Failed to extract keywords' }, 500);
    }
}
