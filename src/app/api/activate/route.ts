import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { getLicenseExpiry, parseMachineIds, serializeMachineIds } from '@/lib/licenseKey';
import { normalizePem } from '@/lib/keyMaterial';
import { ApiValidationError, readJsonBody, readLicenseKeyField, readStringField } from '@/lib/apiValidation';

export async function POST(req: Request) {
    try {
        const body = await readJsonBody(req);
        const key = readLicenseKeyField(body);
        const machineId = readStringField(body, 'machineId', { minLength: 1, maxLength: 512 });

        let license = await prisma.licenseKey.findUnique({ where: { key } });

        if (!license) {
            return NextResponse.json({ error: 'Invalid license key' }, { status: 404 });
        }

        const mIds = parseMachineIds(license.machineIds);

        if (!mIds.includes(machineId)) {
            if (mIds.length >= 2) {
                return NextResponse.json({ error: 'License over limit (Max 2 computers)' }, { status: 403 });
            }
            mIds.push(machineId);
            
            const updateData: {
                machineIds: string;
                isActivated?: boolean;
                activatedAt?: Date;
                expiresAt?: Date | null;
            } = {
                machineIds: serializeMachineIds(mIds)
            };

            if (!license.isActivated) {
                updateData.isActivated = true;
                updateData.activatedAt = new Date();
                const expires = getLicenseExpiry(license.duration);
                if (expires) {
                    updateData.expiresAt = expires;
                }
            }

            license = await prisma.licenseKey.update({
                where: { key },
                data: updateData
            });
        }

        const privateKey = normalizePem(process.env.JWT_PRIVATE_KEY_PEM || process.env.JWT_PRIVATE_KEY);
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

    } catch (error) {
        if (error instanceof ApiValidationError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }
        return NextResponse.json({ error: 'Server validation error' }, { status: 500 });
    }
}
