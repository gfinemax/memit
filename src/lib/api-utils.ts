import { Capacitor } from '@capacitor/core';

/**
 * Resolves the API base URL depending on the platform.
 * For Native (Android/iOS), it uses the absolute production URL.
 * For Web/Dev, it uses the relative path.
 */
export function getApiUrl(path: string): string {
    const FALLBACK_PRODUCTION_URL = 'https://memit-ai.vercel.app';
    const configuredBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
    const productionBaseUrl = (configuredBaseUrl || FALLBACK_PRODUCTION_URL).replace(/\/$/, '');

    // Ensure path starts with /
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    // Native platforms (Static Export + Capacitor) need absolute URLs
    if (Capacitor.isNativePlatform()) {
        return `${productionBaseUrl}${cleanPath}`;
    }

    // Web environment can use relative paths
    return cleanPath;
}
