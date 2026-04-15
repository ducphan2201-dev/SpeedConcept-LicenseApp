import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { key, machineId } = await req.json();
        const authToken = extractBearerToken(req.headers.get('authorization'));
        
        if (!key || !machineId || !authToken) {
            return NextResponse.json({ error: 'Missing key or machineId' }, { status: 400 });
        }

        let license = await prisma.licenseKey.findUnique({ where: { key } });

        if (!license) {
            return NextResponse.json({ error: 'Invalid license key' }, { status: 404 });
        }

        const publicKey = normalizePublicKey(process.env.JWT_PUBLIC_KEY_PEM);
        if (!publicKey) {
            return NextResponse.json({ error: 'JWT public key not configured' }, { status: 500 });
        }

        try {
            const payload = jwt.verify(authToken, publicKey, { algorithms: ['RS256'] }) as { key?: string; machineId?: string };
            if (payload.key !== key || payload.machineId !== machineId) {
                return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
            }
        } catch {
            return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
        }
        
        let mIds: string[] = [];
        try {
            mIds = JSON.parse(license.machineIds);
        } catch {}
        
        mIds = mIds.filter(id => id !== machineId);
        
        await prisma.licenseKey.update({
             where: { key },
             data: { machineIds: JSON.stringify(mIds) }
        });
        
        return NextResponse.json({ success: true });

    } catch (e) {
        return NextResponse.json({ error: 'Server validation error' }, { status: 500 });
    }
}

function extractBearerToken(headerValue: string | null) {
    if (!headerValue || !headerValue.startsWith('Bearer ')) return null;
    return headerValue.slice(7).trim();
}

function normalizePublicKey(value: string | undefined) {
    if (!value) return null;
    return value.includes('-----BEGIN') ? value : value.replace(/\\n/g, '\n');
}
