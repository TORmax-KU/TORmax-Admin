"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LogoutButton from "@/components/LogoutButton";
import AdminHeader from "./AdminHeader";
import AdminNavigator from "./AdminNavigator";

export function AdminAuthWrapper({ children }: { children: React.ReactNode }) {
    const [isAuth, setIsAuth] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth/check');
                const data = await response.json();

                if (!data.isAuth) router.push('/login');
                else setIsAuth(true);
            } catch {
                router.push('/login');
            }
        };

        checkAuth();
    }, [router]);

    if (!isAuth) return null;

    return (
        <div>
            <AdminHeader/>
            <div style={{
                display: 'flex'
            }}>
                <AdminNavigator/>
                <main>
                    {children}
                </main>
            </div>
        </div>

    );
}