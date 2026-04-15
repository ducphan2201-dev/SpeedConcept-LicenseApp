"use client";

import { useEffect, useState } from 'react';

export default function Dashboard() {
    const [isAuthed, setIsAuthed] = useState(false);
    const [loginUser, setLoginUser] = useState('admin');
    const [loginPass, setLoginPass] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loginBusy, setLoginBusy] = useState(false);
    const [keys, setKeys] = useState<any[]>([]);

    const checkSession = async () => {
        try {
            const res = await fetch('/api/auth/me');
            setIsAuthed(res.ok);
        } catch {
            setIsAuthed(false);
        }
    };

    const fetchKeys = async () => {
        try {
            const res = await fetch('/api/keys', { credentials: 'include' });
            const data = await res.json();
            setKeys(Array.isArray(data) ? data : []);
        } catch {
            setKeys([]);
        }
    };

    const genKey = async (duration: number) => {
        try {
            await fetch('/api/keys', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ duration }),
                credentials: 'include'
            });
            fetchKeys();
        } catch {
            setKeys([]);
        }
    };

    const deleteKey = async (key: string) => {
        if (!confirm(`Bạn có chắc chắn muốn XÓA VĨNH VIỄN Key: ${key}? Lệnh trên AutoCAD đang xài Key này sẽ bị mất quyền PRO ngay lập tức!`)) return;
        try {
            await fetch('/api/keys', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ key }),
                credentials: 'include'
            });
            fetchKeys();
        } catch {
            setKeys([]);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginBusy(true);
        setLoginError('');
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ user: loginUser, pass: loginPass })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                setLoginError(data?.error || 'Đăng nhập thất bại');
                return;
            }

            setIsAuthed(true);
            await fetchKeys();
        } catch {
            setLoginError('Đăng nhập thất bại');
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
    };

    useEffect(() => {
        checkSession();
    }, []);

    useEffect(() => {
        if (isAuthed) {
            fetchKeys();
        }
    }, [isAuthed]);

    if (!isAuthed) {
        return (
            <div className="min-h-screen bg-slate-950 px-6 py-12 text-white">
                <div className="mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-cyan-950/20">
                    <h1 className="text-3xl font-bold text-cyan-300">Đăng nhập quản trị</h1>
                    <p className="mt-2 text-sm text-slate-400">Nhập đúng thông tin để mở trang quản lý key.</p>
                    <form onSubmit={handleLogin} className="mt-8 space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-300">Tên đăng nhập</label>
                            <input
                                value={loginUser}
                                onChange={(e) => setLoginUser(e.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 focus:border-cyan-500"
                                autoComplete="username"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-300">Mật khẩu</label>
                            <input
                                type="password"
                                value={loginPass}
                                onChange={(e) => setLoginPass(e.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 focus:border-cyan-500"
                                autoComplete="current-password"
                            />
                        </div>
                        {loginError ? (
                            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                {loginError}
                            </div>
                        ) : null}
                        <button
                            type="submit"
                            disabled={loginBusy}
                            className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loginBusy ? 'Đang vào...' : 'Đăng nhập'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 p-10 font-sans text-white">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex items-center justify-between gap-4">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text">KAS-SpeedConcept Dashboard by DucPhan</h1>
                    <button
                        onClick={handleLogout}
                        className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-red-400 hover:text-red-300"
                    >
                        Đăng xuất
                    </button>
                </div>
                
                <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 mb-8">
                    <h2 className="text-xl font-semibold mb-6 text-slate-200">💎 Tạo Mã Kích Hoạt Mới</h2>
                    <div className="flex space-x-4">
                        <button onClick={() => genKey(1)} className="px-6 py-3 bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 transition hover:text-white rounded-lg font-bold shadow-lg">1 Tháng</button>
                        <button onClick={() => genKey(3)} className="px-6 py-3 bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 transition hover:text-white rounded-lg font-bold shadow-lg">3 Tháng</button>
                        <button onClick={() => genKey(6)} className="px-6 py-3 bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 transition hover:text-white rounded-lg font-bold shadow-lg">6 Tháng</button>
                        <button onClick={() => genKey(0)} className="px-6 py-3 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 transition hover:text-white rounded-lg font-bold shadow-lg">👑 Vĩnh Viễn</button>
                    </div>
                </div>

                <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700">
                    <h2 className="text-xl font-semibold mb-6 flex justify-between">
                        <span className="text-emerald-400">📜 Danh Sách Key Vừa Khởi Tạo</span>
                        <span className="text-slate-500 text-sm font-normal">Hỗ trợ 2 HWID / Key</span>
                    </h2>
                    <div className="space-y-4">
                        {[...keys].reverse().map((item, idx) => {
                            const isFull = item.machineIds.length >= 2;
                            return (
                                <div key={idx} className="p-4 bg-slate-700/50 rounded-xl flex items-center justify-between border border-slate-600/50 hover:border-red-500/30 transition group">
                                    <div className="flex items-center space-x-6">
                                        <strong className="text-yellow-400 font-mono text-2xl tracking-widest">{item.key}</strong>
                                        <span className="px-3 py-1 bg-slate-900 rounded-full text-sm text-slate-300 ring-1 ring-slate-600">
                                            {item.duration === 0 ? 'Gói Vĩnh Viễn 🏆' : item.duration + ' Tháng ⏱'}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-6">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-slate-400 text-sm">Thiết bị:</span>
                                            <span className={`font-bold ${isFull ? 'text-red-400' : 'text-emerald-400'}`}>
                                                {item.machineIds.length}/2
                                            </span>
                                        </div>
                                        <button 
                                            onClick={() => deleteKey(item.key)} 
                                            className="ml-4 opacity-30 group-hover:opacity-100 px-3 py-1 bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600 transition hover:text-white rounded font-bold shadow-lg text-sm"
                                            title="Hủy/Xóa Key này vĩnh viễn"
                                        >
                                            Chặn / Xóa
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
