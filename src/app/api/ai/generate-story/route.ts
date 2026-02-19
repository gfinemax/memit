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
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
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
        return NextResponse.json(parsed);
    } catch (error: any) {
        console.error("Server Story Generation Error:", error);
        return NextResponse.json({ error: error.message || 'Failed to generate story' }, { status: 500 });
    }
}
