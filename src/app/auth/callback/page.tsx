'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
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

            const supabase = createClient();
            if (!supabase) {
                setError('Supabase client not initialized');
                return;
            }

            // Step 1: Check existing session (Fast path)
            setStatus('세션 확인 중...');
            const { data: { session: existingSession } } = await supabase.auth.getSession();
            if (existingSession && !cancelled) {
                debugLog('Session exists! Redirecting...');
                router.replace(next);
                return;
            }

            // Step 2: Handle PKCE Code (Mobile Flow)
            const code = searchParams.get('code');
            if (code) {
                setStatus('모바일 인증 처리 중... (PKCE)');
                debugLog('PKCE Code detected, exchanging for session...');

                try {
                    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
                    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

                    // Create temporary client for PKCE exchange using shared localStorage
                    const mobileClient = createSupabaseClient(supabaseUrl, supabaseKey, {
                        auth: {
                            flowType: 'pkce',
                            storage: window.localStorage, // Share storage with main client
                            autoRefreshToken: true,
                            persistSession: true,
                            detectSessionInUrl: false,
                        }
                    });

                    const { data, error: exchangeError } = await mobileClient.auth.exchangeCodeForSession(code);

                    if (exchangeError) throw exchangeError;

                    if (data.session && !cancelled) {
                        debugLog('PKCE Success! Session established.');
                        setStatus('로그인 완료! 이동 중...');

                        // Small delay to ensure storage sync
                        await new Promise(r => setTimeout(r, 100));
                        router.replace(next);
                        return;
                    }
                } catch (e: any) {
                    debugLog(`PKCE Error: ${e.message}`);
                    // Fallthrough to other methods or show error
                    // But if code is present, it's likely a PKCE attempt fail, so better to warn
                    console.error('PKCE Exchange failed:', e);
                }
            }

            // Step 3: Handle Implicit Flow (Web Flow - Hash Fragment)
            const hash = window.location.hash;
            if (hash && hash.includes('access_token')) {
                setStatus('웹 인증 처리 중...');
                // Supabase "detectSessionInUrl: true" handles this automatically in createClient
                // But we act as a safety net listener
                debugLog('Hash detected, waiting for auto-detection...');
            }

            // Step 4: Listen for Auth State Change (Universal)
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                debugLog(`Auth Event: ${event}`);
                if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session && !cancelled) {
                    router.replace(next);
                }
            });

            // Timeout fallback
            setTimeout(() => {
                if (!cancelled) {
                    debugLog('Timeout reached. Redirecting...');
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
