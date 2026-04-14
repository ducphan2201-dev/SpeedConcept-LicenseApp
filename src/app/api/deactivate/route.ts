import { NextResponse } from 'next/server';

declare global {
  var dbKeys: any[];
}
if (!global.dbKeys) {
  global.dbKeys = [{ key: 'SC-TEST-1234', duration: 1, machineIds: [], activated: false }];
}

export async function POST(req: Request) {
    try {
        const { key, machineId } = await req.json();
        
        if (!key || !machineId) {
            return NextResponse.json({ error: 'Missing key or machineId' }, { status: 400 });
        }

        let license = global.dbKeys.find(l => l.key === key);

        if (!license) {
            return NextResponse.json({ error: 'Invalid license key' }, { status: 404 });
        }
        
        // Remove from memory array
        if (Array.isArray(license.machineIds)) {
            license.machineIds = license.machineIds.filter((id: string) => id !== machineId);
        } else {
             // In case it was stored as string during manual testing earlier
             try {
                let ms = JSON.parse(license.machineIds);
                license.machineIds = ms.filter((id: string) => id !== machineId);
             } catch {}
        }
        
        return NextResponse.json({ success: true });

    } catch (e) {
        return NextResponse.json({ error: 'Server validation error' }, { status: 500 });
    }
}
