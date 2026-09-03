import { NextRequest, NextResponse } from 'next/server';

interface LoginBody {
    username: string;
    password: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: LoginBody = await request.json();
        const { username, password } = body;

        const validUsername = process.env.ADMIN_USERNAME;
        const validPassword = process.env.ADMIN_PASSWORD;

        if (username === validUsername && password === validPassword) {
            const response = NextResponse.json(
                { success: true, message: 'Login successful' },
                { status: 200 }
            );

            // Set the cookie
            response.cookies.set('isAuth', 'true', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24, // 1 day
                path: '/',
            });

            return response;
        }

        return NextResponse.json(
            { success: false, message: 'Invalid credentials' },
            { status: 401 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Invalid request' },
            { status: 400 }
        );
    }
}