"use client";

import { Briefcase, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

interface FinancialSwitcherProps {
  activeTripId: string;
  allWorkspaceTrips: any[];
}

export function FinancialSwitcher({
  activeTripId,
  allWorkspaceTrips,
}: FinancialSwitcherProps) {
  const router = useRouter();

  if (allWorkspaceTrips.length === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-card-bg border border-border-subtle rounded-2xl shadow-xs gap-3">
      <div className="text-left">
        <h4 className="text-xs font-bold text-primary">
          Financial Analytics Filter
        </h4>
        <p className="text-[10px] text-text-muted mt-0.5">
          Select a travel package to view its dedicated budget blueprint.
        </p>
      </div>

      <div className="relative w-full sm:w-64 flex items-center">
        <Briefcase className="absolute left-3 h-3.5 w-3.5 text-text-muted pointer-events-none opacity-60" />
        <select
          value={activeTripId || ""}
          onChange={(e) => {
            if (e.target.value) {
              router.push(`/planner/${e.target.value}?tab=budget`);
            }
          }}
          className="w-full rounded-xl border border-border-subtle bg-neutral-bg pl-9 pr-8 py-2 text-xs font-bold outline-none focus:border-secondary text-primary cursor-pointer h-[36px] appearance-none"
        >
          {allWorkspaceTrips.map((trip: any) => (
            <option key={trip._id} value={trip._id}>
              {trip.title || "Untitled Package"} (
              {trip.destination || "Sanctuary"})
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 h-3.5 w-3.5 text-text-muted pointer-events-none opacity-80" />
      </div>
    </div>
  );
}
