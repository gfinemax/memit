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

export async function POST(req: Request) {
    try {
        const { code, word } = await req.json();
        if (!code || !word) return jsonWithCors({ error: 'Code and word are required' }, 400);

        const result = await supabaseMemoryService.saveCustomKeyword(code, word);
        return jsonWithCors(result);
    } catch (error: any) {
        console.error('Save Custom Keyword API Error:', error);
        return jsonWithCors({ success: false, error: 'Internal server error' }, 500);
    }
}
