'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleCallback = async () => {
            const code = searchParams.get('code');
            const next = searchParams.get('next') ?? '/dashboard';

            if (code) {
                const supabase = createClient();
                if (!supabase) {
                    setError('Supabase client not initialized');
                    return;
                }

                try {
                    const { error } = await supabase.auth.exchangeCodeForSession(code);
                    if (error) throw error;

                    // Profile creation logic could be here if needed, 
                    // but triggers are better. Or we can do a quick check.
                    // For static export simplicity, we'll verify profile on dashboard or separate hook.

                    router.push(next);
                } catch (err: any) {
                    console.error('Auth error:', err);
                    setError(err.message || 'Authentication failed');
                    // router.push('/login?error=auth_failed');
                }
            } else {
                // No code, redirect to login
                router.push('/login');
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
