import { NextResponse } from 'next/server';
import { supabaseMemoryService } from '@/lib/supabase-memory-service';

export const runtime = 'nodejs';

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

export async function POST(req: Request) {
    try {
        const { number } = await req.json();
        if (!number) return jsonWithCors({ error: 'Number is required' }, 400);

        const chunks = chunkNumberLogic(number);
        const keywords: string[] = [];
        const candidates: { chunk: string, words: string[] }[] = [];

        for (const chunk of chunks) {
            let foundKeywords: string[] = [];


            if (foundKeywords.length === 0) foundKeywords = [chunk];

            keywords.push(foundKeywords[0]);
            candidates.push({ chunk, words: foundKeywords });
        }

        return jsonWithCors({ success: true, data: keywords, candidates });
    } catch (error: any) {
        console.error('Convert Number API Error:', error);
        return jsonWithCors({ error: 'Internal server error' }, 500);
    }
}
