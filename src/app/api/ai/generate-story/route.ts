import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';
export const maxDuration = 30;

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Bypass-Tunnel-Reminder',
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
        const { prompt } = await req.json();

        if (!prompt) {
            return jsonWithCors({ error: 'Prompt is required' }, 400);
        }

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a creative memory mnemonist. Return only JSON." },
                { role: "user", content: prompt }
            ],
            model: "gpt-4o",
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error("No content generated");

        const parsed = JSON.parse(content);
        return jsonWithCors(parsed);
    } catch (error: any) {
        console.error("Server Story Generation Error:", error);
        return jsonWithCors({ error: error.message || 'Failed to generate story' }, 500);
    }
}
