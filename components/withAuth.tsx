import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect, ComponentType } from 'react';

export function withAuth<P extends object>(
    WrappedComponent: ComponentType<P>
): ComponentType<P> {
    return function WithAuth(props: P) {
        const { isAuth, loading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!loading && !isAuth) {
                router.push('/login');
            }
        }, [isAuth, loading, router]);

        if (loading) {
            return <div>Loading...</div>;
        }

        if (!isAuth) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };
}