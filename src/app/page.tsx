"use client";

import { useEffect, useState } from 'react';

export default function Dashboard() {
    const [keys, setKeys] = useState<any[]>([]);

    const fetchKeys = async () => {
        const res = await fetch('/api/keys');
        const data = await res.json();
        setKeys(data);
    };

    const genKey = async (duration: number) => {
        await fetch('/api/keys', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ duration })
        });
        fetchKeys();
    };

    useEffect(() => {
        fetchKeys();
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 p-10 font-sans text-white">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text">AutoCad-SpeedConcept Admin Dashboard</h1>
                
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
                                <div key={idx} className="p-4 bg-slate-700/50 rounded-xl flex items-center justify-between border border-slate-600/50 hover:border-blue-500/50 transition">
                                    <div className="flex items-center space-x-6">
                                        <strong className="text-yellow-400 font-mono text-2xl tracking-widest">{item.key}</strong>
                                        <span className="px-3 py-1 bg-slate-900 rounded-full text-sm text-slate-300 ring-1 ring-slate-600">
                                            {item.duration === 0 ? 'Gói Vĩnh Viễn 🏆' : item.duration + ' Tháng ⏱'}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-slate-400 text-sm">Thiết bị:</span>
                                        <span className={`font-bold ${isFull ? 'text-red-400' : 'text-emerald-400'}`}>
                                            {item.machineIds.length}/2
                                        </span>
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
