import { NextResponse } from 'next/server';

function getBasicAuthPair(headerValue: string | null): { user: string; pass: string } | null {
    if (!headerValue || !headerValue.startsWith('Basic ')) return null;

    try {
        const decoded = Buffer.from(headerValue.slice(6), 'base64').toString('utf8');
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

export function assertAdminAuth(request: Request): boolean {
    const user = process.env.ADMIN_BASIC_USER;
    const pass = process.env.ADMIN_BASIC_PASS;

    if (!user || !pass) {
        return process.env.NODE_ENV !== 'production';
    }

    const pair = getBasicAuthPair(request.headers.get('authorization'));
    return pair?.user === user && pair?.pass === pass;
}

export function unauthorizedResponse() {
    return NextResponse.json(
        { error: 'Unauthorized' },
        {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="SpeedConcept Admin", charset="UTF-8"'
            }
        }
    );
}
