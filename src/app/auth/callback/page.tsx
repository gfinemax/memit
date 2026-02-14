'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';

// Debug logger that persists to sessionStorage
function debugLog(msg: string) {
    const logs = JSON.parse(sessionStorage.getItem('auth_debug_logs') || '[]');
    logs.push(`[${new Date().toISOString()}] ${msg}`);
    sessionStorage.setItem('auth_debug_logs', JSON.stringify(logs));
    console.log('[AUTH]', msg);
}

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState('인증 처리 중...');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        // Clear previous logs
        sessionStorage.setItem('auth_debug_logs', '[]');

        const next = searchParams.get('next') ?? '/dashboard';

        const processAuth = async () => {
            debugLog(`Callback started. URL: ${window.location.href}`);
            debugLog(`Hash present: ${!!window.location.hash}, Hash length: ${window.location.hash.length}`);
            debugLog(`Hash content (first 100 chars): ${window.location.hash.substring(0, 100)}`);
            debugLog(`Search params: ${window.location.search}`);

            const supabase = createClient();
            if (!supabase) {
                debugLog('ERROR: Supabase client is null');
                setError('Supabase client not initialized');
                return;
            }
            debugLog('Supabase client created');

            // Step 1: Check existing session
            setStatus('세션 확인 중...');
            debugLog('Step 1: Checking existing session...');
            const { data: { session: existingSession }, error: sessionErr } = await supabase.auth.getSession();
            debugLog(`Step 1 result: session=${!!existingSession}, error=${sessionErr?.message || 'none'}`);

            if (existingSession && !cancelled) {
                debugLog('Session exists! Redirecting...');
                setStatus('로그인 완료! 이동 중...');
                router.replace(next);
                return;
            }

            // Step 2: Manual hash token extraction and setSession
            const hash = window.location.hash;
            if (hash && hash.includes('access_token')) {
                setStatus('토큰 처리 중...');
                debugLog('Step 2: Hash has access_token, parsing...');

                try {
                    const params = new URLSearchParams(hash.substring(1));
                    const access_token = params.get('access_token');
                    const refresh_token = params.get('refresh_token');
                    const token_type = params.get('token_type');
                    const expires_in = params.get('expires_in');

                    debugLog(`Tokens: access=${!!access_token} (${access_token?.substring(0, 20)}...), refresh=${!!refresh_token}, type=${token_type}, expires=${expires_in}`);

                    if (access_token && refresh_token) {
                        debugLog('Step 2a: Calling setSession with both tokens...');
                        const { data, error: setErr } = await supabase.auth.setSession({
                            access_token,
                            refresh_token,
                        });
                        debugLog(`Step 2a result: session=${!!data.session}, user=${!!data.user}, error=${setErr?.message || 'none'}`);

                        if (data.session && !cancelled) {
                            // Verify it was saved to localStorage
                            await new Promise(r => setTimeout(r, 500));
                            const keys = Object.keys(localStorage).filter(k => k.includes('sb-') || k.includes('supabase'));
                            debugLog(`localStorage after setSession: ${JSON.stringify(keys)}`);
                            setStatus('로그인 완료! 이동 중...');
                            router.replace(next);
                            return;
                        }
                    } else if (access_token && !refresh_token) {
                        debugLog('Step 2b: Only access_token, no refresh_token. Trying setSession with empty refresh...');
                        // Try with empty string for refresh_token
                        const { data, error: setErr } = await supabase.auth.setSession({
                            access_token,
                            refresh_token: '',
                        });
                        debugLog(`Step 2b result: session=${!!data.session}, error=${setErr?.message || 'none'}`);

                        if (data.session && !cancelled) {
                            await new Promise(r => setTimeout(r, 500));
                            setStatus('로그인 완료! 이동 중...');
                            router.replace(next);
                            return;
                        }
                    }
                } catch (e: any) {
                    debugLog(`Step 2 ERROR: ${e.message}`);
                }
            } else {
                debugLog(`Step 2 SKIPPED: No hash with access_token. Hash="${hash.substring(0, 50)}"`);
            }

            // Step 3: Listen for onAuthStateChange
            setStatus('인증 이벤트 대기 중...');
            debugLog('Step 3: Listening for onAuthStateChange...');
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                debugLog(`onAuthStateChange fired: event=${event}, session=${!!session}`);
                if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session && !cancelled) {
                    setStatus('로그인 완료! 이동 중...');
                    setTimeout(() => {
                        if (!cancelled) router.replace(next);
                    }, 300);
                }
            });

            // Step 4: Timeout fallback
            setTimeout(() => {
                if (!cancelled) {
                    debugLog('Step 4: TIMEOUT reached (5s). Redirecting to dashboard anyway.');
                    const keys = Object.keys(localStorage).filter(k => k.includes('sb-') || k.includes('supabase'));
                    debugLog(`localStorage at timeout: ${JSON.stringify(keys)}`);
                    subscription.unsubscribe();
                    router.replace(next);
                }
            }, 5000);

            return () => { subscription.unsubscribe(); };
        };

        processAuth();
        return () => { cancelled = true; };
    }, [router, searchParams]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background-dark text-white p-4">
                <div className="text-red-400 mb-2">인증 오류</div>
                <div className="text-sm text-slate-400">{error}</div>
                <button onClick={() => router.push('/login')} className="mt-4 px-4 py-2 bg-primary rounded-lg text-sm">
                    로그인으로 돌아가기
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background-dark text-white">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-slate-400">{status}</p>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-screen bg-background-dark text-white">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-slate-400">로딩 중...</p>
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}
