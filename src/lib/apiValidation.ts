export class ApiValidationError extends Error {
    status: number;

    constructor(message: string, status = 400) {
        super(message);
        this.name = 'ApiValidationError';
        this.status = status;
    }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function fail(message: string, status = 400): never {
    throw new ApiValidationError(message, status);
}

export async function readJsonBody(req: Request) {
    const body = await req.json().catch(() => null);
    if (!isPlainObject(body)) {
        fail('Invalid JSON body');
    }

    return body;
}

export function readStringField(
    body: Record<string, unknown>,
    field: string,
    options?: { minLength?: number; maxLength?: number; trim?: boolean }
) {
    const value = body[field];
    if (typeof value !== 'string') {
        fail(`Missing ${field}`);
    }

    const trim = options?.trim !== false;
    const normalized = trim ? value.trim() : value;
    const minLength = options?.minLength ?? 1;
    const maxLength = options?.maxLength ?? 256;

    if (normalized.length < minLength || normalized.length > maxLength) {
        fail(`Invalid ${field}`);
    }

    return normalized;
}

export function readDurationField(body: Record<string, unknown>, field = 'duration') {
    const value = body[field];
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 0 || value > 120) {
        fail('Invalid duration');
    }

    return value;
}

export function readLicenseKeyField(body: Record<string, unknown>, field = 'key') {
    const value = readStringField(body, field, { minLength: 10, maxLength: 64 });
    if (!/^SC(?:-[A-F0-9]{4}){5}$/.test(value)) {
        fail('Invalid key format');
    }

    return value;
}
