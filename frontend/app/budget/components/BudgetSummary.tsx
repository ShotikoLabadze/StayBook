import { ArrowUpRight, TrendingDown, Wallet } from "lucide-react";

interface BudgetSummaryProps {
  planned: number;
  spent: number;
  remaining: number;
}

export default function BudgetSummary({
  planned,
  spent,
  remaining,
}: BudgetSummaryProps) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-border-subtle bg-card-bg p-5">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-text-muted">
          <Wallet className="h-4 w-4 text-sky-500" />
          Planned budget
        </div>
        <p className="mt-3 text-2xl font-bold text-primary font-headline">
          €{planned.toLocaleString()}
        </p>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-card-bg p-5">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-text-muted">
          <ArrowUpRight className="h-4 w-4 text-amber-500" />
          Spent so far
        </div>
        <p className="mt-3 text-2xl font-bold text-primary font-headline">
          €{spent.toLocaleString()}
        </p>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-card-bg p-5">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-text-muted">
          <TrendingDown className="h-4 w-4 text-emerald-500" />
          Remaining
        </div>
        <p className="mt-3 text-2xl font-bold text-primary font-headline">
          €{remaining.toLocaleString()}
        </p>
      </div>
    </section>
  );
}
