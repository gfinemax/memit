'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { App } from '@capacitor/app';

export default function AppUrlListener() {
    const router = useRouter();

    useEffect(() => {
        const setupListener = async () => {
            // Only run on client-side and native platforms logic can be added if needed,
            // but 'App' plugin works on web too (no-op or specific behavior).
            // Ideally we check if it's native or just rely on the event not firing on web in this context.

            // 1. Check if app was launched with a URL (Cold start)
            const launchUrl = await App.getLaunchUrl();
            if (launchUrl && launchUrl.url) {
                const slug = launchUrl.url.split('com.memit.app://').pop();
                if (slug) {
                    const path = slug.startsWith('/') ? slug : `/${slug}`;
                    // alert(`Debug: Launch URL detected, Redirecting to ${path}`);
                    router.push(path);
                }
            }

            // 2. Listen for URL opens while app is running (Warm start)
            App.addListener('appUrlOpen', (data) => {
                // Example url: com.memit.app://auth/callback?code=...
                // We want to extract: /auth/callback?code=...

                const slug = data.url.split('com.memit.app://').pop();

                if (slug) {
                    // Normalize slug to ensure it starts with /
                    const path = slug.startsWith('/') ? slug : `/${slug}`;
                    // alert(`Debug: Deep link detected, Redirecting to ${path}`);
                    router.push(path);
                }
            });
        };

        setupListener();

        // Cleanup listener usually not needed for singleton root component but good practice if API supported it simpler
        // App.removeAllListeners(); 
    }, [router]);

    return null;
}
