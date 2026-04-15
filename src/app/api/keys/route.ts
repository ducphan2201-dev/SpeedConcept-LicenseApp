import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { assertAdminAuth, unauthorizedResponse } from '@/lib/adminAuth';
import { randomBytes } from 'crypto';

export async function GET(req: Request) {
    if (!assertAdminAuth(req)) {
        return unauthorizedResponse();
    }

    try {
        const keys = await prisma.licenseKey.findMany({
             orderBy: { createdAt: 'desc' }
        });
        
        // Transform data to match existing frontend shape
        const formattedKeys = keys.map(k => ({
             key: k.key,
             duration: k.duration,
             machineIds: JSON.parse(k.machineIds),
             activated: k.isActivated
        }));
        
        return NextResponse.json(formattedKeys);
    } catch (e) {
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    if (!assertAdminAuth(req)) {
        return unauthorizedResponse();
    }

    try {
        const { duration } = await req.json();
        const raw = randomBytes(10).toString('hex').toUpperCase();
        const keyStr = `SC-${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}-${raw.slice(16, 20)}`;
        
        await prisma.licenseKey.create({
            data: {
                key: keyStr,
                duration: duration
            }
        });
        
        return NextResponse.json({ success: true, key: keyStr });
    } catch (e) {
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    if (!assertAdminAuth(req)) {
        return unauthorizedResponse();
    }

    try {
        const { key } = await req.json();
        await prisma.licenseKey.delete({
            where: { key: key }
        });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}
