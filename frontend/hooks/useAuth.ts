'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, removeToken } from '@/lib/auth';
import { post } from '@/lib/api';

export function useAuth() {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    // loading = true while we check localStorage (avoid flash of login page)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check localStorage for existing token on mount
        const stored = getToken();

        if (!stored) {
            // No token found — redirect to login immediately
            router.replace('/login');
            return;
        }

        setToken(stored);
        setLoading(false);
    }, [router]);

    // Logout — revoke token on server then clear localStorage
    async function logout() {
        const stored = getToken();

        if (stored) {
            try {
                await post('/auth/logout', {}, stored);
            } catch {
                // Even if server call fails, clear local token
                // This prevents being stuck in a logged-in state
            }
        }

        removeToken();
        router.replace('/login');
    }

    return { token, loading, logout };
}
