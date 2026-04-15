import jwt from 'jsonwebtoken';

const COOKIE_NAME = 'sc_admin_session';

function getPrivateKey() {
    return process.env.JWT_PRIVATE_KEY_PEM || process.env.JWT_PRIVATE_KEY || null;
}

function getPublicKey() {
    return process.env.JWT_PUBLIC_KEY_PEM || null;
}

function getBasicCreds() {
    const user = process.env.ADMIN_BASIC_USER;
    const pass = process.env.ADMIN_BASIC_PASS;
    if (!user || !pass) return null;
    return { user, pass };
}

function getCookieValue(headerValue: string | null, name: string) {
    if (!headerValue) return null;
    const parts = headerValue.split(';');
    for (const part of parts) {
        const [rawName, ...rest] = part.trim().split('=');
        if (rawName === name) {
            return rest.join('=');
        }
    }
    return null;
}

export function verifyAdminRequest(request: Request) {
    const session = getCookieValue(request.headers.get('cookie'), COOKIE_NAME);
    if (session) {
        const publicKey = getPublicKey();
        if (publicKey) {
            try {
                jwt.verify(session, publicKey, { algorithms: ['RS256'] });
                return true;
            } catch {
                // fall through to basic auth
            }
        }
    }

    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Basic ')) {
        try {
            const decoded = Buffer.from(authHeader.slice(6), 'base64').toString('utf8');
            const idx = decoded.indexOf(':');
            if (idx > 0) {
                const creds = getBasicCreds();
                if (creds && decoded.slice(0, idx) === creds.user && decoded.slice(idx + 1) === creds.pass) {
                    return true;
                }
            }
        } catch {
            return false;
        }
    }

    return false;
}

export function createAdminSessionToken() {
    const privateKey = getPrivateKey();
    if (!privateKey) {
        throw new Error('JWT private key not configured');
    }

    return jwt.sign(
        { sub: 'admin' },
        privateKey,
        {
            algorithm: 'RS256',
            expiresIn: '12h'
        }
    );
}

export function getAdminCookieName() {
    return COOKIE_NAME;
}

export function getAdminLoginCreds() {
    return getBasicCreds();
}

export function isAdminConfigured() {
    return !!getBasicCreds() && !!getPrivateKey() && !!getPublicKey();
}
