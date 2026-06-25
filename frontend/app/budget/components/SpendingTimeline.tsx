import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface SpendingTimelineProps {
  data: Array<{ date: string; Cumulative: number; Daily: number }>;
}

export default function SpendingTimeline({ data }: SpendingTimelineProps) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-card-bg p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-primary font-headline">
          Spending over time
        </h2>
        <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
          Cumulative vs daily
        </p>
      </div>
      <div className="mt-6 h-64 w-full">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs font-semibold text-text-muted">
            No active timeline metrics reported yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00668a" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#00668a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 6"
                stroke="var(--border-subtle)"
              />
              <XAxis
                dataKey="date"
                tick={{
                  fill: "var(--text-muted)",
                  fontSize: 11,
                  fontWeight: 500,
                }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v: number) => {
                  const val = v ?? 0;
                  return `€${val >= 1000 ? `${val / 1000}K` : val}`;
                }}
                tick={{
                  fill: "var(--text-muted)",
                  fontSize: 11,
                  fontWeight: 500,
                }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value: any) => {
                  const num = Number(value) || 0;
                  return `€${num.toLocaleString()}`;
                }}
              />
              <Area
                type="monotone"
                dataKey="Cumulative"
                stroke="#00668a"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#spendGradient)"
              />
              <Area
                type="monotone"
                dataKey="Daily"
                stroke="#131b2e"
                strokeWidth={1.5}
                fill="transparent"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
