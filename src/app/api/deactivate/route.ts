import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { key, machineId } = await req.json();
        
        if (!key || !machineId) {
            return NextResponse.json({ error: 'Missing key or machineId' }, { status: 400 });
        }

        let license = await prisma.licenseKey.findUnique({ where: { key } });

        if (!license) {
            return NextResponse.json({ error: 'Invalid license key' }, { status: 404 });
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
