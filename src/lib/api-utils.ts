import { Capacitor } from '@capacitor/core';

/**
 * Resolves the API base URL depending on the platform.
 * For Native (Android/iOS), it uses the absolute production URL.
 * For Web/Dev, it uses the relative path.
 */
export function getApiUrl(path: string): string {
    return getApiCandidateUrls(path)[0];
}

export function getApiCandidateUrls(path: string): string[] {
    const PRIMARY_FALLBACK_URL = 'https://memit-ai.vercel.app';
    const SECONDARY_FALLBACK_URL = 'https://memit.vercel.app';
    const configuredBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim()?.replace(/\/$/, '');

    // Ensure path starts with /
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    // Native platforms need absolute URLs and may require fallback domains.
    if (Capacitor.isNativePlatform()) {
        const candidates = [
            configuredBaseUrl ? `${configuredBaseUrl}${cleanPath}` : null,
            `${PRIMARY_FALLBACK_URL}${cleanPath}`,
            `${SECONDARY_FALLBACK_URL}${cleanPath}`,
        ].filter((v): v is string => Boolean(v));

        return Array.from(new Set(candidates));
    }

    // Web environment should use relative paths first.
    const webCandidates = [
        cleanPath,
        configuredBaseUrl ? `${configuredBaseUrl}${cleanPath}` : null,
    ].filter((v): v is string => Boolean(v));

    return Array.from(new Set(webCandidates));
}
