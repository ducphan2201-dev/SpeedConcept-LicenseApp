import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
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
    try {
        const { duration } = await req.json();
        const r = Math.random().toString(36).substring(2,6).toUpperCase();
        const n = Math.random().toString().substring(2,6);
        const keyStr = `SC-${r}-${n}`;
        
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
