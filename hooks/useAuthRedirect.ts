'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuthRedirect(redirectTo: string = '/login') {
    const { isAuth, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuth) {
            router.push(redirectTo);
        }
    }, [isAuth, loading, router, redirectTo]);

    return { isAuth, loading };
}