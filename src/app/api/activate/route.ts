import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Nên lưu Private Key vào file .env
// Sinh bằng: openssl genrsa -out private.pem 2048
const PRIVATE_KEY = process.env.RSA_PRIVATE_KEY || `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQC4z5U+QjJ/yJb... 
// TODO: Thay the bang key that khi Deploy
-----END RSA PRIVATE KEY-----`;

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

        let mIds = Array.isArray(license.machineIds) ? license.machineIds : [];
        try {
            if (typeof license.machineIds === 'string') {
                mIds = JSON.parse(license.machineIds);
            }
        } catch {}
        
        if (!mIds.includes(machineId)) {
            if (mIds.length >= 2) {
                return NextResponse.json({ error: 'License over limit (Max 2 computers)' }, { status: 403 });
            }
            mIds.push(machineId);
            license.machineIds = mIds;
            
            if (!license.isActivated) {
                license.isActivated = true;
                license.activatedAt = new Date();
                if (license.duration > 0) {
                    const expires = new Date();
                    expires.setMonth(expires.getMonth() + license.duration);
                    license.expiresAt = expires;
                }
            }
        }

        // Tạo JWT Token với thông tin hết hạn và HWID
        // Dùng thuật toán đối xứng HMAC SHA256 cho đơn giản khi tích hợp C# nếu không có thư viện RSA chuẩn
        const SECRET = process.env.JWT_SECRET || "SpeedConceptSecretKey_2026_!@#";
        const token = jwt.sign(
            { 
                key: key, 
                machineId: machineId,
                expDate: license.duration === 0 ? "lifetime" : license.expiresAt?.toISOString()
            }, 
            SECRET, 
            { expiresIn: license.duration === 0 ? '10y' : `${license.duration * 30}d` }
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
