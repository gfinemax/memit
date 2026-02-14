'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState('인증 처리 중...');

    useEffect(() => {
        let cancelled = false;
        const next = searchParams.get('next') ?? '/dashboard';

        const processAuth = async () => {
            const supabase = createClient();
            if (!supabase) {
                setError('Supabase client not initialized');
                return;
            }

            // Step 1: Check if session already exists (e.g., from detectSessionInUrl auto-parsing)
            setStatus('세션 확인 중...');
            const { data: { session: existingSession } } = await supabase.auth.getSession();
            if (existingSession && !cancelled) {
                setStatus('로그인 완료! 이동 중...');
                router.replace(next);
                return;
            }

            // Step 2: If hash contains tokens, manually set session
            const hash = window.location.hash;
            if (hash && hash.includes('access_token')) {
                setStatus('토큰 처리 중...');
                try {
                    const params = new URLSearchParams(hash.substring(1));
                    const access_token = params.get('access_token');
                    const refresh_token = params.get('refresh_token');

                    if (access_token && refresh_token) {
                        const { data, error: sessionError } = await supabase.auth.setSession({
                            access_token,
                            refresh_token,
                        });
                        if (data.session && !cancelled) {
                            setStatus('로그인 완료! 이동 중...');
                            // Wait for localStorage to flush
                            await new Promise(resolve => setTimeout(resolve, 300));
                            router.replace(next);
                            return;
                        }
                        if (sessionError) {
                            console.error('setSession error:', sessionError);
                        }
                    } else if (access_token) {
                        // Try with just access token - some implicit flows don't return refresh_token
                        const { data: { user } } = await supabase.auth.getUser(access_token);
                        if (user && !cancelled) {
                            setStatus('로그인 완료! 이동 중...');
                            await new Promise(resolve => setTimeout(resolve, 300));
                            router.replace(next);
                            return;
                        }
                    }
                } catch (e) {
                    console.error('Token processing error:', e);
                }
            }

            // Step 3: Wait for onAuthStateChange as last resort
            setStatus('인증 대기 중...');
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session && !cancelled) {
                    setStatus('로그인 완료! 이동 중...');
                    setTimeout(() => {
                        if (!cancelled) router.replace(next);
                    }, 200);
                }
            });

            // Step 4: Final timeout - if nothing works after 5 seconds, redirect anyway
            setTimeout(() => {
                if (!cancelled) {
                    subscription.unsubscribe();
                    console.warn('Auth callback timeout - redirecting to dashboard');
                    router.replace(next);
                }
            }, 5000);

            return () => {
                subscription.unsubscribe();
            };
        };

        processAuth();

        return () => {
            cancelled = true;
        };
    }, [router, searchParams]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background-dark text-white p-4">
                <div className="text-red-400 mb-2">인증 오류</div>
                <div className="text-sm text-slate-400">{error}</div>
                <button
                    onClick={() => router.push('/login')}
                    className="mt-4 px-4 py-2 bg-primary rounded-lg text-sm"
                >
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
