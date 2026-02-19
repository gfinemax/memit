'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { useState, useEffect } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                gcTime: 1000 * 60 * 60 * 24, // 24 hours (successor to cacheTime)
                staleTime: 1000 * 60 * 5, // 5 minutes
                retry: 2,
            },
        },
    }));

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const localStoragePersister = createSyncStoragePersister({
                storage: window.localStorage,
            });

            persistQueryClient({
                queryClient,
                persister: localStoragePersister,
                maxAge: 1000 * 60 * 60 * 24, // 24 hours
            });
        }
    }, [queryClient]);

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
