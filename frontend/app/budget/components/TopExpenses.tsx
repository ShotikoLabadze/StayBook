import { Plane } from "lucide-react";

interface ExpenseItem {
  title: string;
  location: string;
  date: string;
  amount: number;
}

interface TopExpensesProps {
  expenses: ExpenseItem[];
}

export default function TopExpenses({ expenses }: TopExpensesProps) {
  return (
    <section className="rounded-2xl border border-border-subtle bg-card-bg p-6">
      <h2 className="text-sm font-bold text-primary font-headline mb-4">
        Top expenses
      </h2>
      {expenses.length === 0 ? (
        <div className="py-6 text-center text-xs text-text-muted font-medium">
          No reported activity transactions found.
        </div>
      ) : (
        <ul className="divide-y divide-border-subtle list-none p-0 m-0">
          {expenses.map((expense, idx) => (
            <li key={idx} className="flex items-center gap-4 py-3.5 text-sm">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500 shrink-0">
                <Plane className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate font-semibold text-primary m-0">
                  {expense.title}
                </p>
                <p className="text-xs text-text-muted font-medium m-0 mt-0.5">
                  {expense.location} · {expense.date}
                </p>
              </div>
              <p className="font-bold text-primary m-0">
                €{expense.amount.toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
