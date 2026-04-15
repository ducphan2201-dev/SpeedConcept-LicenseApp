'use client';

import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import type { LicenseKeyItem } from '@/lib/licenseKey';

function normalizeSearch(value: string) {
    return value.trim().toLowerCase();
}

export function useLicensingDashboard() {
    const [isAuthed, setIsAuthed] = useState(false);
    const [isBooting, setIsBooting] = useState(true);
    const [loginUser, setLoginUser] = useState('admin');
    const [loginPass, setLoginPass] = useState('');
    const [loginError, setLoginError] = useState('');
    const [globalError, setGlobalError] = useState('');
    const [loginBusy, setLoginBusy] = useState(false);
    const [actionBusy, setActionBusy] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [keys, setKeys] = useState<LicenseKeyItem[]>([]);

    const fetchKeys = async () => {
        try {
            const res = await fetch('/api/keys', { credentials: 'include' });
            const data = await res.json().catch(() => null);
            if (!res.ok) {
                setKeys([]);
                setGlobalError(typeof data?.error === 'string' ? data.error : 'Failed to load keys');
                return;
            }
            setKeys(Array.isArray(data) ? data : []);
            setGlobalError('');
        } catch {
            setKeys([]);
            setGlobalError('Failed to load keys');
        }
    };

    const checkSession = async () => {
        setIsBooting(true);
        try {
            const res = await fetch('/api/auth/me');
            const data = await res.json();
            setIsAuthed(data?.authenticated === true);
        } catch {
            setIsAuthed(false);
        } finally {
            setIsBooting(false);
        }
    };

    const genKey = async (duration: number) => {
        try {
            setActionBusy(true);
            setGlobalError('');
            const res = await fetch('/api/keys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ duration }),
                credentials: 'include'
            });
            const data = await res.json().catch(() => null);
            if (res.ok && data?.key) {
                setKeys((prev) => [
                    {
                        key: data.key,
                        duration,
                        machineIds: [],
                        activated: false
                    },
                    ...prev
                ]);
                return;
            }

            setGlobalError(typeof data?.error === 'string' ? data.error : 'Failed to create key');
            await fetchKeys();
        } catch {
            setGlobalError('Failed to create key');
            setKeys([]);
        } finally {
            setActionBusy(false);
        }
    };

    const requestDeleteKey = async (key: string) => {
        if (!confirm(`Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n XÃ“A VÄ¨NH VIá»„N Key: ${key}? Lá»‡nh trÃªn AutoCAD Ä‘ang xÃ i Key nÃ y sáº½ bá»‹ máº¥t quyá»n PRO ngay láº­p tá»©c!`)) return;

        try {
            setActionBusy(true);
            setGlobalError('');
            await fetch('/api/keys', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key }),
                credentials: 'include'
            });
            await fetchKeys();
        } catch {
            setGlobalError('Failed to delete key');
            setKeys([]);
        } finally {
            setActionBusy(false);
        }
    };

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoginBusy(true);
        setLoginError('');
        setGlobalError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ user: loginUser, pass: loginPass })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                setLoginError(data?.error || 'ÄÄƒng nháº­p tháº¥t báº¡i');
                return;
            }

            setIsAuthed(true);
        } catch {
            setLoginError('ÄÄƒng nháº­p tháº¥t báº¡i');
        } finally {
            setLoginBusy(false);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
        setIsAuthed(false);
        setKeys([]);
        setLoginPass('');
        setSearchTerm('');
        setGlobalError('');
    };

    useEffect(() => {
        checkSession();
    }, []);

    useEffect(() => {
        if (isAuthed) {
            fetchKeys();
        }
    }, [isAuthed]);

    const stats = useMemo(() => {
        const total = keys.length;
        const active = keys.filter((item) => item.activated).length;
        const full = keys.filter((item) => item.machineIds.length >= 2).length;
        return { total, active, full };
    }, [keys]);

    const visibleKeys = useMemo(() => {
        const normalized = normalizeSearch(searchTerm);
        if (!normalized) return keys;

        return keys.filter((item) => {
            const haystack = `${item.key} ${item.duration} ${item.machineIds.length} ${item.activated ? 'active' : 'idle'}`.toLowerCase();
            return haystack.includes(normalized);
        });
    }, [keys, searchTerm]);

    return {
        actionBusy,
        genKey,
        globalError,
        handleLogin,
        handleLogout,
        isAuthed,
        isBooting,
        keys,
        loginBusy,
        loginError,
        loginPass,
        loginUser,
        searchTerm,
        setLoginPass,
        setLoginUser,
        setSearchTerm,
        setKeys,
        setLoginError,
        stats,
        visibleKeys,
        requestDeleteKey
    };
}
