export function normalizePem(value: string | undefined | null) {
    if (!value) return null;
    return value.includes('-----BEGIN') ? value : value.replace(/\\n/g, '\n');
}
