"use client";

import { DashboardSearch } from '@/components/licensing/DashboardSearch';
import { DashboardStats } from '@/components/licensing/DashboardStats';
import { useLicensingDashboard } from '@/hooks/useLicensingDashboard';

export default function Dashboard() {
    const {
        actionBusy,
        genKey,
        globalError,
        handleLogin,
        handleLogout,
        isAuthed,
        isBooting,
        loginBusy,
        loginError,
        loginPass,
        loginUser,
        requestDeleteKey,
        searchTerm,
        setLoginPass,
        setLoginUser,
        setSearchTerm,
        stats,
        visibleKeys
    } = useLicensingDashboard();

    if (isBooting) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/95 px-8 py-6 shadow-2xl shadow-cyan-950/20">
                    <div className="text-sm uppercase tracking-[0.35em] text-slate-500">LicensingWeb</div>
                    <div className="mt-3 text-2xl font-semibold text-cyan-300">Loading dashboard...</div>
                </div>
            </div>
        );
    }

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
                
                {globalError ? (
                    <div className="mb-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-sm text-amber-200">
                        {globalError}
                    </div>
                ) : null}

                <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 mb-8">
                    <h2 className="text-xl font-semibold mb-6 text-slate-200">💎 Tạo Mã Kích Hoạt Mới</h2>
                    <div className="flex space-x-4">
                        <button onClick={() => genKey(1)} disabled={actionBusy} className="px-6 py-3 bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 transition hover:text-white rounded-lg font-bold shadow-lg disabled:cursor-not-allowed disabled:opacity-60">1 Tháng</button>
                        <button onClick={() => genKey(3)} disabled={actionBusy} className="px-6 py-3 bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 transition hover:text-white rounded-lg font-bold shadow-lg disabled:cursor-not-allowed disabled:opacity-60">3 Tháng</button>
                        <button onClick={() => genKey(6)} disabled={actionBusy} className="px-6 py-3 bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 transition hover:text-white rounded-lg font-bold shadow-lg disabled:cursor-not-allowed disabled:opacity-60">6 Tháng</button>
                        <button onClick={() => genKey(0)} disabled={actionBusy} className="px-6 py-3 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 transition hover:text-white rounded-lg font-bold shadow-lg disabled:cursor-not-allowed disabled:opacity-60">👑 Vĩnh Viễn</button>
                    </div>
                </div>

                <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700">
                    <h2 className="text-xl font-semibold mb-6 flex justify-between">
                        <span className="text-emerald-400">📜 Danh Sách Key Vừa Khởi Tạo</span>
                        <span className="text-slate-500 text-sm font-normal">Hỗ trợ 2 HWID / Key</span>
                    </h2>
                    <div className="space-y-4">
                        <DashboardStats
                            total={stats.total}
                            active={stats.active}
                            full={stats.full}
                            visible={visibleKeys.length}
                        />
                        <DashboardSearch
                            value={searchTerm}
                            onChange={setSearchTerm}
                            total={stats.total}
                            visible={visibleKeys.length}
                        />
                        {visibleKeys.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-10 text-center text-slate-400">
                                No keys match the current filter.
                            </div>
                        ) : null}
                        {visibleKeys.map((item) => {
                            const isFull = item.machineIds.length >= 2;
                            return (
                                <div key={item.key} className="p-4 bg-slate-700/50 rounded-xl flex items-center justify-between border border-slate-600/50 hover:border-red-500/30 transition group">
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
                                            onClick={() => {
                                                if (!confirm(`Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n XÃ“A VÄ¨NH VIá»„N Key: ${item.key}? Lá»‡nh trÃªn AutoCAD Ä‘ang xÃ i Key nÃ y sáº½ bá»‹ máº¥t quyá»n PRO ngay láº­p tá»©c!`)) return;
                                                requestDeleteKey(item.key);
                                            }}
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

