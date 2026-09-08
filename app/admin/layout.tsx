import React from 'react';
import AdminHeader from '@/components/AdminHeader';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-6">
           <AdminHeader/>
            <main className="mx-auto">
                {children}
            </main>
        </section>
    );
}