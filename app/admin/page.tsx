'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminPage() {
    const [isAuth, setIsAuth] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth/check');
                const data = await response.json();

                if (!data.isAuth) {
                    router.push('/login');
                } else {
                    setIsAuth(true);
                }
            } catch (error) {
                router.push('/login');
            }
        };

        checkAuth();
    }, [router]);

    const handleLogout = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
            });

            if (response.ok) {
                localStorage.removeItem('isAuth');
                setIsAuth(false);

                // Use router.push with a slight delay to ensure cookie is cleared
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

    if (!isAuth) {
        return null;
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>Admin Dashboard</h1>
                <button
                    onClick={handleLogout}
                    style={{ ...styles.logoutButton, opacity: loading ? 0.7 : 1 }}
                    disabled={loading}
                >
                    {loading ? 'Logging out...' : 'Logout'}
                </button>
            </div>
            <div style={styles.content}>
                <p>Welcome to the admin panel!</p>
                <p>This is your protected admin area.</p>
            </div>
        </div>
    );
}

// Styles remain the same...

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
    },
    logoutButton: {
        padding: '0.5rem 1rem',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    content: {
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
};