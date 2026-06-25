import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface CategoryPieChartProps {
  data: Array<{ name: string; value: number; color: string }>;
  totalSpent: number;
}

export default function CategoryPieChart({
  data,
  totalSpent,
}: CategoryPieChartProps) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-card-bg p-6 flex flex-col justify-between">
      <h2 className="text-sm font-bold text-primary font-headline">
        Where the money goes
      </h2>
      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
        <div className="relative h-48 w-48 flex items-center justify-center mx-auto shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <p className="text-[10px] uppercase font-bold tracking-wider text-text-muted">
              Total
            </p>
            <p className="text-base font-bold text-primary font-headline">
              €{totalSpent.toLocaleString()}
            </p>
          </div>
        </div>

        <ul className="flex-1 grid grid-cols-1 gap-2.5 text-xs list-none p-0 m-0">
          {data.map((item) => (
            <li key={item.name} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              ></span>
              <span className="flex-1 truncate capitalize text-text-muted font-semibold">
                {item.name}
              </span>
              <span className="font-bold text-primary">{item.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
