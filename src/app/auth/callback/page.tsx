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

            // Check if we already have a session (e.g. from detectSessionInUrl)
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.push(next);
                return;
            }

            if (code) {
                processingRef.current = true; // Mark as processing
                try {
                    console.log('Exchanging code for session...', { code });
                    const { error } = await supabase.auth.exchangeCodeForSession(code);
                    if (error) throw error;
                    router.push(next);
                } catch (err: any) {
                    console.error('Auth error during code exchange:', err);
                    setError(err.message || 'Authentication failed');
                    processingRef.current = false; // Reset on error to allow retry if needed
                }
            } else {
                // If no code and no session, maybe it's an error or implicit flow redirect
                const hash = window.location.hash;
                if (hash && (hash.includes('access_token') || hash.includes('error'))) {
                    // detectSessionInUrl should handle this, but let's wait a bit
                    setTimeout(async () => {
                        const { data: { session: delayedSession } } = await supabase.auth.getSession();
                        if (delayedSession) router.push(next);
                        else router.push('/login');
                    }, 500);
                } else {
                    router.push('/login');
                }
            }
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
