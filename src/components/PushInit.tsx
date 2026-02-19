'use client';

import { useEffect } from 'react';
import { initPushNotifications } from '@/lib/notification-service';

export default function PushInit() {
    useEffect(() => {
        // Temporarily disabled to prevent native crash while Firebase sync is in progress
        // initPushNotifications();
    }, []);

    return null; // This component doesn't render anything
}
