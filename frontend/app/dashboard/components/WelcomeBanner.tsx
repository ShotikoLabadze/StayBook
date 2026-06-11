"use client";

import { Share2 } from "lucide-react";

interface WelcomeBannerProps {
  userName?: string;
}

export default function WelcomeBanner({ userName }: WelcomeBannerProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-primary">
          Welcome back, {userName || "Alex"}
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          Your next adventure to Santorini begins in 14 days.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex -space-x-1.5">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="w-7 h-7 rounded-full border-2 border-white overflow-hidden shadow-sm"
            >
              <img
                src={`https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop&sig=${idx}`}
                alt="collaborator"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          <div className="w-7 h-7 rounded-full bg-secondary text-primary border-2 border-white flex items-center justify-center text-[10px] font-bold shadow-sm">
            +4
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-primary font-semibold border border-slate-200 bg-white px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm">
          <Share2 className="w-3.5 h-3.5 text-slate-500" /> Share Trip
        </button>
      </div>
    </div>
  );
}
