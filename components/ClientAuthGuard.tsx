'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface ClientAuthGuardProps {
    children: ReactNode;
}

export function ClientAuthGuard({ children }: ClientAuthGuardProps) {
    const { isAuth, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuth) {
            router.push('/login');
        }
    }, [isAuth, loading, router]);

    if (loading || !isAuth) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
}