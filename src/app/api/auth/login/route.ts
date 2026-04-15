import { NextResponse } from 'next/server';
import { createAdminSessionToken, getAdminCookieName, getAdminLoginCreds } from '@/lib/adminSession';
import { ApiValidationError, readJsonBody, readStringField } from '@/lib/apiValidation';

export async function POST(req: Request) {
    try {
        const creds = getAdminLoginCreds();
        if (!creds) {
            return NextResponse.json({ error: 'Admin auth not configured' }, { status: 503 });
        }

        const body = await readJsonBody(req);
        const user = readStringField(body, 'user', { minLength: 1, maxLength: 128 });
        const pass = readStringField(body, 'pass', { minLength: 1, maxLength: 256, trim: false });
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
    } catch (error) {
        if (error instanceof ApiValidationError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
