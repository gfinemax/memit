'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function DebugPage() {
    const [info, setInfo] = useState<any>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const check = async () => {
            const supabase = createClient();
            const debugInfo: any = {
                supabaseClientExists: !!supabase,
                url: process.env.NEXT_PUBLIC_SUPABASE_URL,
                hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                currentUrl: window.location.href,
                hash: window.location.hash ? 'present' : 'none',
                localStorage_keys: Object.keys(localStorage).filter(k => k.includes('supabase') || k.includes('sb-') || k.includes('auth')),
            };

            if (supabase) {
                try {
                    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                    debugInfo.session = session ? {
                        user_id: session.user.id,
                        email: session.user.email,
                        provider: session.user.app_metadata?.provider,
                        expires_at: session.expires_at,
                        name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
                    } : null;
                    debugInfo.sessionError = sessionError?.message || null;

                    const { data: { user }, error: userError } = await supabase.auth.getUser();
                    debugInfo.user = user ? {
                        id: user.id,
                        email: user.email,
                        name: user.user_metadata?.full_name || user.user_metadata?.name,
                    } : null;
                    debugInfo.userError = userError?.message || null;
                } catch (e: any) {
                    debugInfo.error = e.message;
                }
            }

            setInfo(debugInfo);
            setLoading(false);
        };
        check();
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <h1 className="text-2xl font-bold mb-6">🔍 Auth Debug</h1>
            {loading ? (
                <p className="text-slate-400">Checking...</p>
            ) : (
                <pre className="bg-slate-900 p-6 rounded-xl text-sm overflow-auto whitespace-pre-wrap border border-slate-700">
                    {JSON.stringify(info, null, 2)}
                </pre>
            )}
            <div className="mt-6 flex gap-4">
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-primary rounded-lg text-sm"
                >
                    새로고침
                </button>
                <button
                    onClick={() => window.location.href = '/login'}
                    className="px-4 py-2 bg-slate-800 rounded-lg text-sm border border-slate-700"
                >
                    로그인 페이지로
                </button>
            </div>
        </div>
    );
}
