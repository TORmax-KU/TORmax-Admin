'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface AuthContextType {
    isAuth: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Check localStorage
        const authStatus = localStorage.getItem('isAuth') === 'true';
        setIsAuth(authStatus);
        setLoading(false);
    }, []);

    const login = async (username: string, password: string): Promise<boolean> => {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.error('Non-JSON response:', await response.text());
            return false;
        }

        const data = await response.json();

        if (response.ok) {
            setIsAuth(true);
            localStorage.setItem('isAuth', 'true');
            return true;
        }
        return false;
    } catch (error) {
        console.error('Login error:', error);
        return false;
    }
};

    const logout = () => {
        setIsAuth(false);
        localStorage.removeItem('isAuth');
    };

    return (
        <AuthContext.Provider value={{ isAuth, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}