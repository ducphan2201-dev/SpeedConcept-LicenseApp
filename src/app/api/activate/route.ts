import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
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

        if (!mIds.includes(machineId)) {
            if (mIds.length >= 2) {
                return NextResponse.json({ error: 'License over limit (Max 2 computers)' }, { status: 403 });
            }
            mIds.push(machineId);
            
            let updateData: any = {
                machineIds: JSON.stringify(mIds)
            };
            
            if (!license.isActivated) {
                updateData.isActivated = true;
                updateData.activatedAt = new Date();
                if (license.duration > 0) {
                    const expires = new Date();
                    expires.setMonth(expires.getMonth() + license.duration);
                    updateData.expiresAt = expires;
                    license.expiresAt = expires; // sync for token
                }
            }
            
            license = await prisma.licenseKey.update({
                where: { key },
                data: updateData
            });
        }

        const privateKey = normalizePrivateKey(process.env.JWT_PRIVATE_KEY_PEM || process.env.JWT_PRIVATE_KEY);
        if (!privateKey) {
            return NextResponse.json({ error: 'JWT private key not configured' }, { status: 500 });
        }

        const token = jwt.sign(
            { 
                key: key, 
                machineId: machineId,
                expDate: license.duration === 0 ? "lifetime" : license.expiresAt?.toISOString()
            }, 
            privateKey, 
            {
                algorithm: 'RS256',
                expiresIn: license.duration === 0 ? '10y' : `${license.duration * 30}d`
            }
        );

        return NextResponse.json({ 
            success: true, 
            token: token,
            machineCount: mIds.length 
        });

    } catch (e) {
        return NextResponse.json({ error: 'Server validation error' }, { status: 500 });
    }
}

function normalizePrivateKey(value: string | undefined) {
    if (!value) return null;
    return value.includes('-----BEGIN') ? value : value.replace(/\\n/g, '\n');
}
