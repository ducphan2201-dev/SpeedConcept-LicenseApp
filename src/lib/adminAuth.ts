import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/adminSession';

export function assertAdminAuth(request: Request): boolean {
    return verifyAdminRequest(request);
}

export function unauthorizedResponse() {
    return NextResponse.json(
        { error: 'Unauthorized' },
        {
            status: 401,
            headers: {}
        }
    );
}
