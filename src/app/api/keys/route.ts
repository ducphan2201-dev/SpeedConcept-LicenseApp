import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { assertAdminAuth, unauthorizedResponse } from '@/lib/adminAuth';
import { ensureLicenseSchema } from '@/lib/ensureLicenseSchema';
import { generateLicenseKey, mapLicenseKeyRow } from '@/lib/licenseKey';
import { ApiValidationError, readDurationField, readJsonBody, readLicenseKeyField } from '@/lib/apiValidation';

export async function GET(req: Request) {
    if (!assertAdminAuth(req)) {
        return unauthorizedResponse();
    }

    try {
        await ensureLicenseSchema();
        const keys = await prisma.licenseKey.findMany({
             orderBy: { createdAt: 'desc' }
        });
        
        return NextResponse.json(keys.map(mapLicenseKeyRow));
    } catch (e) {
        console.error("GET /api/keys ERROR:", e);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    if (!assertAdminAuth(req)) {
        return unauthorizedResponse();
    }

    try {
        await ensureLicenseSchema();
        const body = await readJsonBody(req);
        const duration = readDurationField(body);
        const keyStr = generateLicenseKey();
        
        await prisma.licenseKey.create({
            data: {
                key: keyStr,
                duration
            }
        });
        
        return NextResponse.json({ success: true, key: keyStr });
    } catch (error) {
        if (error instanceof ApiValidationError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }
        console.error("POST /api/keys ERROR:", error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    if (!assertAdminAuth(req)) {
        return unauthorizedResponse();
    }

    try {
        await ensureLicenseSchema();
        const body = await readJsonBody(req);
        const key = readLicenseKeyField(body);
        await prisma.licenseKey.delete({
            where: { key }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        if (error instanceof ApiValidationError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}
