import LogoutButton from '@/components/LogoutButton';
import React from 'react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-6">
            {/* Optional Subpage Sub-header or Breadcrumbs */}
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: 25
            }}>
                <div style={{
                    fontSize: 24
                }}>Admin Dashboard</div>
                <LogoutButton className="btn" />
            </header>
            <main className="max-w-4xl mx-auto">
                {children}
            </main>
        </section>
    );
}