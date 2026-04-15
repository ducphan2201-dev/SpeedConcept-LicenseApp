import { NextRequest, NextResponse } from 'next/server';

function getBasicAuthPair(headerValue: string | null): { user: string; pass: string } | null {
    if (!headerValue || !headerValue.startsWith('Basic ')) return null;

    try {
        const decoded = atob(headerValue.slice(6));
        const idx = decoded.indexOf(':');
        if (idx <= 0) return null;

        return {
            user: decoded.slice(0, idx),
            pass: decoded.slice(idx + 1)
        };
    } catch {
        return null;
    }
}

function isProtectedPath(pathname: string) {
    return pathname === '/' || pathname.startsWith('/api/keys');
}

export function middleware(request: NextRequest) {
    if (!isProtectedPath(request.nextUrl.pathname)) {
        return NextResponse.next();
    }

    const user = process.env.ADMIN_BASIC_USER;
    const pass = process.env.ADMIN_BASIC_PASS;
    if (!user || !pass) {
        return process.env.NODE_ENV !== 'production'
            ? NextResponse.next()
            : NextResponse.json({ error: 'Admin auth not configured' }, { status: 503 });
    }

    const pair = getBasicAuthPair(request.headers.get('authorization'));
    if (pair?.user === user && pair?.pass === pass) {
        return NextResponse.next();
    }

    return new NextResponse('Unauthorized', {
        status: 401,
        headers: {
            'WWW-Authenticate': 'Basic realm="SpeedConcept Admin", charset="UTF-8"'
        }
    });
}

export const config = {
    matcher: ['/', '/api/keys/:path*']
};
