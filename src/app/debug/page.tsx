'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function DebugPage() {
    const [info, setInfo] = useState<any>({});
    const [callbackLogs, setCallbackLogs] = useState<string[]>([]);
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
                all_localStorage_keys: Object.keys(localStorage),
            };

            if (supabase) {
                try {
                    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                    debugInfo.session = session ? {
                        user_id: session.user.id,
                        email: session.user.email,
                        provider: session.user.app_metadata?.provider,
                        name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
                    } : null;
                    debugInfo.sessionError = sessionError?.message || null;

                    const { data: { user }, error: userError } = await supabase.auth.getUser();
                    debugInfo.user = user ? { id: user.id, email: user.email } : null;
                    debugInfo.userError = userError?.message || null;
                } catch (e: any) {
                    debugInfo.error = e.message;
                }
            }

            // Get callback debug logs from sessionStorage
            const logs = JSON.parse(sessionStorage.getItem('auth_debug_logs') || '[]');
            setCallbackLogs(logs);

            setInfo(debugInfo);
            setLoading(false);
        };
        check();
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6">
            <h1 className="text-2xl font-bold mb-6">🔍 Auth Debug</h1>

            {loading ? (
                <p className="text-slate-400">Checking...</p>
            ) : (
                <>
                    <h2 className="text-lg font-semibold text-primary mb-2">현재 상태</h2>
                    <pre className="bg-slate-900 p-4 rounded-xl text-xs overflow-auto whitespace-pre-wrap border border-slate-700 mb-6">
                        {JSON.stringify(info, null, 2)}
                    </pre>

                    <h2 className="text-lg font-semibold text-yellow-400 mb-2">콜백 로그 (마지막 로그인 시도)</h2>
                    {callbackLogs.length > 0 ? (
                        <div className="bg-slate-900 p-4 rounded-xl text-xs overflow-auto border border-yellow-900/50 mb-6 space-y-1">
                            {callbackLogs.map((log, i) => (
                                <div key={i} className={`font-mono ${log.includes('ERROR') ? 'text-red-400' : log.includes('SKIP') ? 'text-yellow-400' : 'text-green-300'}`}>
                                    {log}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500 text-sm mb-6">콜백 로그가 없습니다. 구글 로그인 후 이 페이지를 확인해주세요.</p>
                    )}
                </>
            )}

            <div className="flex gap-3 flex-wrap">
                <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary rounded-lg text-sm font-medium">
                    새로고침
                </button>
                <button onClick={() => window.location.href = '/login'} className="px-4 py-2 bg-slate-800 rounded-lg text-sm border border-slate-700">
                    로그인 페이지로
                </button>
                <button onClick={() => { sessionStorage.clear(); window.location.reload(); }} className="px-4 py-2 bg-red-900/30 text-red-400 rounded-lg text-sm border border-red-900/50">
                    로그 초기화
                </button>
            </div>
        </div>
    );
}
