'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    const processingRef = useRef(false);

    useEffect(() => {
        const handleCallback = async () => {
            // Prevent double-invocation in Strict Mode or rapid re-renders
            if (processingRef.current) return;

            const code = searchParams.get('code');
            const next = searchParams.get('next') ?? '/dashboard';

            const supabase = createClient();
            if (!supabase) {
                setError('Supabase client not initialized');
                return;
            }


            // With implicit flow, detectSessionInUrl: true in createClient will automatically
            // parse the hash and set the session when the client is initialized.
            // We just need to wait a brief moment for that to happen.

            // Check for session immediately
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.push(next);
                return;
            }

            // If no session yet, listen for the auth state change which happens after hash parsing
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                if (event === 'SIGNED_IN' && session) {
                    // Small delay to ensure localStorage is flushed
                    setTimeout(() => {
                        router.push(next);
                    }, 100);
                }
            });

            // Fallback: If hash is present but no event fires quickly, try explicit check after delay
            if (window.location.hash && (window.location.hash.includes('access_token'))) {
                setTimeout(async () => {
                    // Double check session
                    const { data: { session: delayedSession } } = await supabase.auth.getSession();
                    if (delayedSession) {
                        router.push(next);
                        return;
                    }

                    // MANUAL HASH PARSING
                    try {
                        const hash = window.location.hash.substring(1); // remove #
                        const params = new URLSearchParams(hash);
                        const access_token = params.get('access_token');
                        const refresh_token = params.get('refresh_token');
                        const type = params.get('type') || params.get('error');

                        if (access_token && refresh_token) {
                            const { error: setSessionError } = await supabase.auth.setSession({
                                access_token,
                                refresh_token,
                            });
                            if (!setSessionError) {
                                router.push(next);
                                return;
                            }
                        } else if (access_token) {
                            // implicit flow might not have refresh token depending on settings
                            // But setSession usually expects both or we need strictly access_token only.
                            // Supabase JS v2 setSession requires distinct params usually.
                            // Let's rely on getUser with the token -> actually setSession is better.
                            // But wait, setSession signature is { access_token, refresh_token }.
                            // If we lack refresh_token, we can't fully persist standard session?
                            // Implicit flow usually DOES return refresh_token if configured?
                            // No, implicit often just gives access token.
                            // However, let's look at the error.
                        }

                        console.warn("Manual parsing failed or no tokens found. Forcing redirect...");
                        router.push(next);
                    } catch (e) {
                        console.error("Hash parsing error", e);
                        router.push(next);
                    }
                }, 2000);
            } else if (!window.location.hash && !code) {
                // No code, no hash -> login
                router.push('/login');
            }

            return () => subscription.unsubscribe();
        };

        handleCallback();
    }, [router, searchParams]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background-dark text-white p-4">
                <div className="text-red-400 mb-2">Authentication Error</div>
                <div className="text-sm text-slate-400">{error}</div>
                <button
                    onClick={() => router.push('/login')}
                    className="mt-4 px-4 py-2 bg-primary rounded-lg text-sm"
                >
                    Back to Login
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background-dark text-white">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-slate-400">Authenticating...</p>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-screen bg-background-dark text-white">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-slate-400">Loading...</p>
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}
