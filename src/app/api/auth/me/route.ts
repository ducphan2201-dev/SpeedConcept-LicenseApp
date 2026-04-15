import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/adminSession';

export async function GET(req: Request) {
    if (!verifyAdminRequest(req)) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true });
}
