type DashboardSearchProps = {
    value: string;
    onChange: (value: string) => void;
    total: number;
    visible: number;
};

export function DashboardSearch({ value, onChange, total, visible }: DashboardSearchProps) {
    return (
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-700 bg-slate-900/70 p-4 md:flex-row md:items-center md:justify-between">
            <div>
                <div className="text-sm font-semibold text-slate-200">Filter keys</div>
                <div className="text-xs text-slate-500">
                    {visible} of {total} shown
                </div>
            </div>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search by key, status, or count"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 focus:border-cyan-500 md:max-w-sm"
                autoComplete="off"
            />
        </div>
    );
}
