"use client";

import { Bell, Search, Settings } from "lucide-react";

interface DashboardHeaderProps {
  userAvatar?: string;
}

export default function DashboardHeader({ userAvatar }: DashboardHeaderProps) {
  return (
    <header className="bg-card-bg border-b border-border-subtle px-10 py-4 flex items-center justify-between sticky top-0 z-40 transition-colors duration-300">
      <div className="relative w-80">
        <Search className="w-4 h-4 text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search trips or analytics..."
          className="w-full pl-11 pr-4 py-2 bg-neutral-bg border border-border-subtle rounded-xl text-xs font-medium focus:outline-none focus:border-secondary transition-all text-primary placeholder:text-text-muted"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-text-muted hover:text-primary transition-colors relative cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-secondary rounded-full" />
        </button>
        <button className="p-2 text-text-muted hover:text-primary transition-colors cursor-pointer">
          <Settings className="w-4 h-4" />
        </button>
        <div className="w-8 h-8 rounded-full bg-neutral-bg overflow-hidden border border-border-subtle shadow-sm cursor-pointer">
          <img
            src={
              userAvatar ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
            }
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
