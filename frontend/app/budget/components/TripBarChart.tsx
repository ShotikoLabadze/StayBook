import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface TripBarChartProps {
  data: Array<{ name: string; planned: number; spent: number }>;
}

export default function TripBarChart({ data }: TripBarChartProps) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-card-bg p-6">
      <h2 className="text-sm font-bold text-primary font-headline">
        Trip budgets at a glance
      </h2>
      <p className="mt-1 text-xs text-text-muted font-medium">
        Spent vs. planned across your trips.
      </p>
      <div className="mt-6 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
            <CartesianGrid
              strokeDasharray="3 6"
              stroke="var(--border-subtle)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
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
              contentStyle={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-subtle)",
                borderRadius: "12px",
                color: "var(--text-primary)",
              }}
              cursor={{ fill: "rgba(255, 255, 255, 0.03)" }}
            />

            <Bar
              dataKey="planned"
              fill="#334155"
              radius={[3, 3, 0, 0]}
              maxBarSize={10}
              activeBar={{ fill: "#475569" }}
            />

            <Bar
              dataKey="spent"
              fill="#00668a"
              radius={[3, 3, 0, 0]}
              maxBarSize={10}
              activeBar={{ fill: "#0082b3" }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
