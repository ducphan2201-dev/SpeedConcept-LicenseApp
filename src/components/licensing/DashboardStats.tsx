type DashboardStatsProps = {
    total: number;
    active: number;
    full: number;
    visible: number;
};

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3">
            <div className="text-xs uppercase tracking-[0.3em] text-slate-500">{label}</div>
            <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
        </div>
    );
}

export function DashboardStats({ total, active, full, visible }: DashboardStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-4">
            <StatCard label="Total" value={total} />
            <StatCard label="Active" value={active} />
            <StatCard label="Full" value={full} />
            <StatCard label="Visible" value={visible} />
        </div>
    );
}
