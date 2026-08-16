'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type LogoutButtonProps = {
    className?: string;
    style?: React.CSSProperties;
};

export default function LogoutButton({ className, style }: LogoutButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/auth/logout', { method: 'POST' });

            if (response.ok) {
                localStorage.removeItem('isAuth');

                setTimeout(() => {
                    router.push('/login');
                }, 100);
            } else {
                console.error('Logout failed');
                setLoading(false);
            }
        } catch (error) {
            console.error('Logout error:', error);
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className={className}
            style={{
                ...style,
            }}
            disabled={loading}
        >
            {loading ? 'Logging out...' : 'Logout'}
        </button>
    );
}
