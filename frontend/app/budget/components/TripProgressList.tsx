interface TripProgressItem {
  id: string;
  name: string;
  status: string;
  nights: number;
  spent: number;
  planned: number;
  progress: number;
  color: string;
}

interface TripProgressListProps {
  trips: TripProgressItem[];
}

export default function TripProgressList({ trips }: TripProgressListProps) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-card-bg p-6 flex flex-col">
      <h2 className="text-sm font-bold text-primary font-headline">
        Trip progress
      </h2>
      <p className="mt-1 text-xs text-text-muted font-medium">
        Click any trip to open its budget view.
      </p>
      <div className="mt-6 flex-1 overflow-y-auto max-h-[250px] pr-1 custom-scrollbar">
        <ul className="flex flex-col gap-3 list-none p-0 m-0">
          {trips.map((trip, idx) => (
            <li key={`${trip.id}-${idx}`}>
              <a
                className="block rounded-2xl border border-border-subtle bg-card-bg/50 px-4 py-3 transition-colors hover:bg-neutral-bg decoration-none"
                href={`/planner/${trip.id}?tab=budget`}
              >
                <div className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0 text-left">
                    <p className="truncate font-semibold text-primary m-0">
                      {trip.name}
                    </p>
                    <p className="text-xs text-text-muted font-medium capitalize m-0 mt-0.5">
                      {trip.status} · {trip.nights} nights
                    </p>
                  </div>
                  <p className="text-xs font-bold text-primary m-0 shrink-0">
                    €{trip.spent.toLocaleString()} / €
                    {trip.planned.toLocaleString()}
                  </p>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-neutral-bg">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${trip.color}`}
                    style={{ width: `${trip.progress}%` }}
                  ></div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
