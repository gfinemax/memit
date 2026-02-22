import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';
export const maxDuration = 30;

const corsHeaders = (origin: string | null) => ({
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Bypass-Tunnel-Reminder',
    'Access-Control-Allow-Credentials': 'true',
});

function jsonWithCors(body: unknown, status = 200, origin: string | null = null) {
    return NextResponse.json(body, { status, headers: corsHeaders(origin) });
}

export async function OPTIONS(req: Request) {
    const origin = req.headers.get('origin');
    return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(req: Request) {
    const origin = req.headers.get('origin');
    try {
        const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
        if (!apiKey) {
            console.error('OPENAI_API_KEY is not set');
            return jsonWithCors({ error: 'AI Service unavailable (API Key missing)' }, 500, origin);
        }

        const openai = new OpenAI({ apiKey });
        const { prompt } = await req.json();

        if (!prompt) {
            return jsonWithCors({ error: 'Prompt is required' }, 400, origin);
        }

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a creative memory mnemonist. Return only JSON: { story: string, keywords: string[] }" },
                { role: "user", content: prompt }
            ],
            model: "gpt-4o", // Stronger model for better instruction adherence
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error("No content generated");

        const parsed = JSON.parse(content);
        return jsonWithCors(parsed, 200, origin);
    } catch (error: any) {
        console.error("Server Story Generation Error:", error);
        return jsonWithCors({ error: error.message || 'Failed to generate story', details: error.toString() }, 500, origin);
    }
}
