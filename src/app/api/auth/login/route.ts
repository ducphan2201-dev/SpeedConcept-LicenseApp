import { NextResponse } from 'next/server';
import { createAdminSessionToken, getAdminCookieName, getAdminLoginCreds } from '@/lib/adminSession';

export async function POST(req: Request) {
    try {
        const creds = getAdminLoginCreds();
        if (!creds) {
            return NextResponse.json({ error: 'Admin auth not configured' }, { status: 503 });
        }

        const { user, pass } = await req.json();
        if (user !== creds.user || pass !== creds.pass) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const token = createAdminSessionToken();
        const res = NextResponse.json({ success: true });
        res.cookies.set(getAdminCookieName(), token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 12
        });
        return res;
    } catch {
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
