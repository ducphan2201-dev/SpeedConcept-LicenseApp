import { NextResponse } from 'next/server';

declare global {
  var dbKeys: any[];
}
if (!global.dbKeys) {
  global.dbKeys = [{ key: 'SC-TEST-1234', duration: 1, machineIds: [], activated: false }];
}

export async function GET() {
    return NextResponse.json(global.dbKeys);
}

export async function POST(req: Request) {
    const { duration } = await req.json();
    const r = Math.random().toString(36).substring(2,6).toUpperCase();
    const n = Math.random().toString().substring(2,6);
    const key = `SC-${r}-${n}`;
    global.dbKeys.push({ key, duration, machineIds: [], activated: false });
    return NextResponse.json({ success: true, key });
}

export async function DELETE(req: Request) {
    const { key } = await req.json();
    global.dbKeys = global.dbKeys.filter(k => k.key !== key);
    return NextResponse.json({ success: true });
}
