import { randomBytes } from 'crypto';

export interface LicenseKeyRow {
    key: string;
    duration: number;
    machineIds: string;
    isActivated: boolean;
}

export interface LicenseKeyItem {
    key: string;
    duration: number;
    machineIds: string[];
    activated: boolean;
}

export function parseMachineIds(value: string | null | undefined) {
    if (!value) return [];

    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
    } catch {
        return [];
    }
}

export function serializeMachineIds(machineIds: string[]) {
    return JSON.stringify(machineIds);
}

export function mapLicenseKeyRow(row: LicenseKeyRow): LicenseKeyItem {
    return {
        key: row.key,
        duration: row.duration,
        machineIds: parseMachineIds(row.machineIds),
        activated: row.isActivated
    };
}

export function generateLicenseKey() {
    const raw = randomBytes(10).toString('hex').toUpperCase();
    return `SC-${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}-${raw.slice(16, 20)}`;
}

export function getLicenseExpiry(duration: number) {
    if (duration <= 0) return null;

    const expires = new Date();
    expires.setMonth(expires.getMonth() + duration);
    return expires;
}
