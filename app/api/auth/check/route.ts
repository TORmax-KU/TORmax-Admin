import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const isAuth = request.cookies.get('isAuth')?.value === 'true';

    return NextResponse.json(
        { isAuth },
        { status: 200 }
    );
}