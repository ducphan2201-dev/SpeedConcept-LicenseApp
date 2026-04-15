import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/adminSession';

export async function GET(req: Request) {
    return NextResponse.json({
        authenticated: verifyAdminRequest(req)
    });
}
