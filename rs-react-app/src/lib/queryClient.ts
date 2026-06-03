import { QueryClient } from '@tanstack/react-query';

const cacheTtlMs = Number(import.meta.env.VITE_CACHE_TTL_MS) || 5 * 60 * 1000;

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: cacheTtlMs,
            gcTime: cacheTtlMs * 2,
            retry: 1,
        },
    },
});