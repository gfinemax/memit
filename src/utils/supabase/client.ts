import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey || supabaseUrl === 'https://placeholder.supabase.co') {
        return null;
    }

    if (supabaseInstance) return supabaseInstance;

    supabaseInstance = createSupabaseClient(supabaseUrl, supabaseKey, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            storageKey: 'memit-auth-v1',
            storage: typeof window !== 'undefined' ? window.localStorage : undefined,
            flowType: 'pkce',
            debug: process.env.NODE_ENV === 'development',
        }
    });

    return supabaseInstance;
}
