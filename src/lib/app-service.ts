import { InAppReview } from '@capacitor-community/in-app-review';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { createClient } from '@/utils/supabase/client';

export const AppService = {
    /**
     * Triggers the native in-app review prompt.
     * Should be called after meaningful milestones.
     */
    requestReview: async () => {
        if (Capacitor.getPlatform() === 'web') return;

        try {
            await InAppReview.requestReview();
        } catch (e) {
            console.error('In-App Review failed:', e);
        }
    },

    /**
     * Checks for app updates by comparing local version with remote version in Supabase.
     */
    checkForUpdates: async () => {
        if (Capacitor.getPlatform() === 'web') return;

        try {
            const info = await App.getInfo();
            const localVersion = info.version;

            const supabase = createClient();
            if (!supabase) return;

            // Assuming a 'config' table with a key 'latest_version'
            const { data, error } = await supabase
                .from('app_config')
                .select('value')
                .eq('key', 'latest_version')
                .single();

            if (data && data.value !== localVersion) {
                // Return true if an update is available
                return { updateAvailable: true, latestVersion: data.value };
            }
        } catch (e) {
            console.error('Update check failed:', e);
        }
        return { updateAvailable: false, latestVersion: undefined };
    },

    /**
     * Logic to decide if we should ask for a review
     */
    shouldRequestReview: () => {
        const createCount = parseInt(localStorage.getItem('memories_created_count') || '0');
        const lastPromptDate = localStorage.getItem('last_review_prompt_date');

        // Example: Ask after 5 memories created, and not more than once every 30 days
        if (createCount >= 5) {
            if (!lastPromptDate) return true;

            const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
            if (Date.now() - parseInt(lastPromptDate) > thirtyDaysMs) {
                return true;
            }
        }
        return false;
    },

    markReviewPrompted: () => {
        localStorage.setItem('last_review_prompt_date', Date.now().toString());
    }
};
