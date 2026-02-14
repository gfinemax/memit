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
                    router.push(next);
                }
            });

            // Fallback: If hash is present but no event fires quickly, try explicit check after delay
            if (window.location.hash && (window.location.hash.includes('access_token') || window.location.hash.includes('error'))) {
                setTimeout(async () => {
                    const { data: { session: delayedSession } } = await supabase.auth.getSession();
                    if (delayedSession) router.push(next);
                    // If error in hash, we might want to show it, but for now redirecting to login on fail
                }, 1000);
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
