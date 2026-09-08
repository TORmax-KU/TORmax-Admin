'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';

export default function AdminHeader() {
    const pathname = usePathname();

    const navItems = [
        {
            href: '/admin',
            label: 'แดชบอร์ดหลัก',
            icon: 'ri-dashboard-3-line',
            exact: true,
        },
        {
            href: '/admin/overview',
            label: 'สถิติและภาพรวม',
            icon: 'ri-bar-chart-box-line',
            exact: false,
        },
    ];

    const isActive = (href: string, exact: boolean) => {
        return exact ? pathname === href : pathname.startsWith(href);
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

                {/* Brand & System Status */}
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm">
                        <i className="ri-shield-keyhole-line text-lg" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                                TORmax Admin
                            </span>
                            <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                PROD
                            </span>
                        </div>
                        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            ระบบผู้ดูแลและจัดการข้อมูล
                        </p>
                    </div>
                </div>

                {/* Navigation & Actions */}
                <div className="flex items-center gap-1 sm:gap-2">
                    <nav className="flex items-center gap-1 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 p-1 border border-slate-200/50 dark:border-slate-700/50">
                        {navItems.map((item) => {
                            const active = isActive(item.href, item.exact);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${active
                                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                >
                                    <i className={`${item.icon} text-sm ${active ? 'text-primary' : ''}`} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mx-2 h-4 w-px bg-slate-200 dark:bg-slate-800" />

                    <LogoutButton className="btn btn-ghost btn-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg gap-1.5 font-semibold text-xs h-8 px-2.5" />
                </div>

            </div>
        </header>
    );
}