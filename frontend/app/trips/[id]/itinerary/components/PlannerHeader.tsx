"use client";

import { Bell, Settings, Share2 } from "lucide-react";

interface PlannerHeaderProps {
  tripTitle: string;
}

export default function PlannerHeader({ tripTitle }: PlannerHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <span className="hidden sm:block text-xs font-semibold text-slate-400 truncate max-w-xs">
          {tripTitle}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex -space-x-1.5 mr-2">
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
            +2
          </div>
        </div>

        <button className="p-2 text-slate-400 hover:text-primary transition-colors relative cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-secondary rounded-full" />
        </button>
        <button className="p-2 text-slate-400 hover:text-primary transition-colors cursor-pointer">
          <Settings className="w-4 h-4" />
        </button>

        <button className="flex items-center gap-1.5 text-xs text-white font-semibold bg-primary hover:bg-primary/95 px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm">
          <Share2 className="w-3.5 h-3.5 text-secondary stroke-[2.5]" /> Share
        </button>
      </div>
    </header>
  );
}
