"use client";

import {
  Car,
  Clock,
  Compass,
  Hotel,
  Plane,
  Plus,
  Utensils,
} from "lucide-react";

interface Activity {
  id: string;
  title: string;
  note?: string;
  time?: string;
  cost?: number;
  category: "flight" | "hotel" | "food" | "activity" | "transport";
  image?: string;
}

interface ItineraryDay {
  dayNumber: number;
  date: string;
  activities: Activity[];
}

const categoryConfig = {
  flight: { icon: Plane, bg: "bg-cyan-50 text-cyan-500 border-cyan-100" },
  hotel: { icon: Hotel, bg: "bg-blue-50 text-blue-500 border-blue-100" },
  food: { icon: Utensils, bg: "bg-amber-50 text-amber-500 border-amber-100" },
  activity: {
    icon: Compass,
    bg: "bg-purple-50 text-purple-500 border-purple-100",
  },
  transport: {
    icon: Car,
    bg: "bg-emerald-50 text-emerald-500 border-emerald-100",
  },
};

const mockItinerary: ItineraryDay[] = [
  {
    dayNumber: 1,
    date: "Tuesday, September 13",
    activities: [
      {
        id: "act-1",
        title: "Flight to Naples (NAP)",
        note: "EuroWings EW-8422 • Terminal 1",
        time: "09:30 AM",
        category: "flight",
      },
      {
        id: "act-2",
        title: "Check-in at Villa Katikies",
        note: "Confirmation #8921A • Luxury Sea View Suite",
        time: "02:00 PM",
        category: "hotel",
        image:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=300&auto=format&fit=crop",
      },
      {
        id: "act-3",
        title: "Dinner at Ristorante Marina Grande",
        note: "Reservation under 'Alex' • Seafood specials",
        time: "08:30 PM",
        category: "food",
      },
    ],
  },
  {
    dayNumber: 2,
    date: "Wednesday, September 14",
    activities: [
      {
        id: "act-4",
        title: "Amalfi Coast Boat Tour",
        note: "Private skipper • Capri & Positano caves",
        time: "10:00 AM",
        category: "activity",
        image:
          "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=300&auto=format&fit=crop",
      },
    ],
  },
];

export default function Timeline() {
  return (
    <div className="space-y-10">
      {mockItinerary.map((day) => (
        <div key={day.dayNumber} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-1">
            <div className="flex items-baseline gap-2.5">
              <h3 className="font-headline font-bold text-lg text-primary tracking-tight">
                Day {String(day.dayNumber).padStart(2, "0")}
              </h3>
              <span className="text-xs font-semibold text-slate-400">
                {day.date}
              </span>
            </div>
            <span className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">
              {day.activities.length}{" "}
              {day.activities.length === 1 ? "Activity" : "Activities"}
            </span>
          </div>

          <div className="relative border-l border-slate-200/80 ml-4 pl-8 space-y-6">
            {day.activities.map((act) => {
              const config = categoryConfig[act.category];
              const Icon = config.icon;

              return (
                <div
                  key={act.id}
                  className="relative group flex items-start justify-between bg-white border border-slate-100/70 p-4 rounded-2xl shadow-xs hover:shadow-sm hover:border-slate-200/60 transition-all gap-4"
                >
                  <span className="absolute -left-[45px] top-4 w-8 h-8 rounded-full flex items-center justify-center border-4 border-neutral-bg bg-white shadow-xs z-10">
                    <div className={`p-1.5 rounded-lg border ${config.bg}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </span>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span className="text-[10px] font-semibold tracking-wide uppercase">
                        {act.time}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-primary truncate">
                      {act.title}
                    </h4>
                    {act.note && (
                      <p className="text-xs text-slate-400/90 font-medium">
                        {act.note}
                      </p>
                    )}
                  </div>

                  {act.image && (
                    <div className="w-20 h-14 rounded-xl overflow-hidden shadow-xs bg-slate-50 shrink-0">
                      <img
                        src={act.image}
                        alt={act.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                </div>
              );
            })}

            <div className="pt-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-dashed border-slate-200 hover:border-slate-400 text-slate-500 hover:text-primary rounded-xl text-xs font-semibold transition-all cursor-pointer bg-white/50">
                <Plus className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" />
                Add Activity
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
