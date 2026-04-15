import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { parseMachineIds, serializeMachineIds } from '@/lib/licenseKey';
import { normalizePem } from '@/lib/keyMaterial';
import { ApiValidationError, readJsonBody, readLicenseKeyField, readStringField } from '@/lib/apiValidation';

export async function POST(req: Request) {
    try {
        const body = await readJsonBody(req);
        const key = readLicenseKeyField(body);
        const machineId = readStringField(body, 'machineId', { minLength: 1, maxLength: 512 });
        const authToken = extractBearerToken(req.headers.get('authorization'));

        if (!authToken) {
            return NextResponse.json({ error: 'Missing authorization token' }, { status: 400 });
        }

        let license = await prisma.licenseKey.findUnique({ where: { key } });

        if (!license) {
            return NextResponse.json({ error: 'Invalid license key' }, { status: 404 });
        }

        const publicKey = normalizePem(process.env.JWT_PUBLIC_KEY_PEM);
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
        
        const mIds = parseMachineIds(license.machineIds).filter((id) => id !== machineId);
        
        await prisma.licenseKey.update({
             where: { key },
             data: { machineIds: serializeMachineIds(mIds) }
        });
        
        return NextResponse.json({ success: true });

    } catch (error) {
        if (error instanceof ApiValidationError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }
        return NextResponse.json({ error: 'Server validation error' }, { status: 500 });
    }
}

function extractBearerToken(headerValue: string | null) {
    if (!headerValue || !headerValue.startsWith('Bearer ')) return null;
    return headerValue.slice(7).trim();
}
