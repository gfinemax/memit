'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState('인증 처리 중...');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const next = searchParams.get('next') ?? '/memit';

        const processAuth = async () => {
            console.log('[AUTH] Callback started. URL:', window.location.href);

            const supabase = createClient();
            if (!supabase) {
                setError('Supabase client not initialized');
                return;
            }

            // Step 1: Check existing session (Fast path)
            setStatus('세션 확인 중...');
            try {
                const { data: { session: existingSession }, error: sessionError } = await supabase.auth.getSession();
                if (sessionError) throw sessionError;

                if (existingSession && !cancelled) {
                    console.log('[AUTH] Session already exists! Redirecting...');
                    router.replace(next);
                    return;
                }
            } catch (e: any) {
                console.error('[AUTH] Session check error:', e.message);
                // If it's a refresh token error, we might need to sign out
                if (e.message.includes("Refresh Token Not Found")) {
                    await supabase.auth.signOut();
                }
            }

            // Step 2: Handle PKCE Code (Mobile Native Only)
            const code = searchParams.get('code');
            if (code) {
                setStatus('모바일 인증 처리 중... (PKCE)');
                console.log('[AUTH] PKCE Code detected, exchanging...');

                try {
                    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
                    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

                    const mobileClient = createSupabaseClient(supabaseUrl, supabaseKey, {
                        auth: {
                            flowType: 'pkce',
                            storage: window.localStorage,
                            autoRefreshToken: true,
                            persistSession: true,
                            detectSessionInUrl: false,
                        }
                    });

                    const { data, error: exchangeError } = await mobileClient.auth.exchangeCodeForSession(code);
                    if (exchangeError) throw exchangeError;

                    if (data.session && !cancelled) {
                        console.log('[AUTH] PKCE Success!');
                        setStatus('로그인 완료! 이동 중...');
                        await new Promise(r => setTimeout(r, 300));
                        router.replace(next);
                        return;
                    }
                } catch (e: any) {
                    console.error('[AUTH] PKCE Error:', e.message);
                    setError(`인증 처리 중 오류가 발생했습니다: ${e.message}`);
                }
            }

            // Step 3: Handle Implicit Flow (Web - Hash Fragment)
            // detectSessionInUrl: true in client.ts handles this automatically
            // The hash fragment is parsed by the Supabase client on initialization
            const hash = window.location.hash;
            if (hash && hash.includes('access_token')) {
                setStatus('웹 인증 처리 중...');
                console.log('[AUTH] Hash fragment detected, Supabase auto-detecting...');
            }

            // Step 4: Listen for Auth State Change (covers both implicit auto-detection and any other method)
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                console.log('[AUTH] Auth Event:', event);
                if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session && !cancelled) {
                    setStatus('로그인 완료! 이동 중...');
                    router.replace(next);
                }
            });

            // Timeout fallback - if nothing happens in 8 seconds, redirect to login
            setTimeout(() => {
                if (!cancelled) {
                    console.log('[AUTH] Timeout. Checking session one more time...');
                    supabase.auth.getSession().then(({ data: { session } }) => {
                        if (session && !cancelled) {
                            router.replace(next);
                        } else if (!cancelled) {
                            setError('인증 시간 초과. 다시 로그인해주세요.');
                        }
                    });
                }
            }, 8000);

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
