// import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { createClient } from '@/utils/supabase/client';

export const initPushNotifications = async () => {
    if (Capacitor.getPlatform() === 'web') {
        console.log('Push notifications are not supported on web.');
        return;
    }

    try {
        /*
        // 1. Request Permission
        let perm = await PushNotifications.checkPermissions();
        if (perm.receive === 'prompt') {
            perm = await PushNotifications.requestPermissions();
        }

        if (perm.receive !== 'granted') {
            console.warn('Push notification permission denied.');
            return;
        }

        // 2. Register for Push
        // CAUTION: This will crash on Android if google-services.json is missing.
        if (localStorage.getItem('skip_push_registration') === 'true') {
            console.warn('Push registration skipped via local storage flag.');
            return;
        }

        try {
            await PushNotifications.register();
        } catch (regError) {
            console.error('PushNotifications.register failed. Verify google-services.json is present in android/app/:', regError);
            return; // Stop here if native registration fails
        }

        // 3. Listen for Registration Success
        PushNotifications.addListener('registration', async (token) => {
            console.log('Push registration success, token:', token.value);

            const supabase = createClient();
            if (!supabase) return;

            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                try {
                    const { Device } = await import('@capacitor/device');
                    const info = await Device.getInfo();

                    await supabase
                        .from('user_tokens')
                        .upsert({
                            user_id: session.user.id,
                            fcm_token: token.value,
                            device_type: info.platform,
                            device_name: info.model,
                            last_seen_at: new Date().toISOString()
                        }, { onConflict: 'fcm_token' });
                } catch (e) {
                    console.error('Failed to save push token to user_tokens:', e);
                }
            }
        });

        // 4. Listen for Registration Error
        PushNotifications.addListener('registrationError', (error) => {
            console.error('Push registration error:', JSON.stringify(error));
        });

        // 5. Handle Incoming Notifications (App in Foreground)
        PushNotifications.addListener('pushNotificationReceived', (notification) => {
            console.log('Push received:', notification);
        });

        // 6. Handle Interaction (Clicking Notification)
        PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
            console.log('Push action performed:', action);
            // Redirect to a specific page based on notification data
            // window.location.href = '/memit/storage';
        });
        */
        console.log('Push notifications are currently disabled.');
    } catch (error) {
        console.error('Failed to initialize push notifications:', error);
    }
};

/**
 * Schedules a local reminder (Spaced Repetition logic could go here)
 * For simplicity, we can use local notifications if FCM is overkill for reminders.
 */
export const scheduleReminder = async (title: string, body: string, delaySeconds: number) => {
    // Local notifications would require @capacitor/local-notifications
    // For now, this is a placeholder for FCM-based reminders triggered from the server.
    console.log(`Scheduling reminder: ${title} in ${delaySeconds}s`);
};
