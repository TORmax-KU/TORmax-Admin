import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest): NextResponse {
    const isAuth = request.cookies.get('isAuth')?.value === 'true';
    const { pathname } = request.nextUrl;

    // Define public paths
    const publicPaths = ['/login', '/api/auth/login', '/api/auth/logout', '/api/auth/check'];
    const isPublicPath = publicPaths.includes(pathname);

    // Protect all /admin routes
    if (pathname.startsWith('/admin') && !isAuth) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirect to admin if already logged in
    if (isPublicPath && isAuth && pathname !== '/api/auth/logout' && pathname !== '/api/auth/check') {
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/login', '/api/auth/:path*'],
};