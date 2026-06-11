"use client";

import { useAuth } from "@/context/AuthContext";
import {
  Bookmark,
  Calendar,
  Compass,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Map,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const { logout } = useAuth();
  const pathname = usePathname();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    { id: "planner", label: "Planner", icon: Calendar, href: "/planner" },
    { id: "trips", label: "Trips", icon: Map, href: "/trips" },
    { id: "explore", label: "Explore", icon: Compass, href: "/explore" },
    { id: "saved", label: "Saved", icon: Bookmark, href: "/saved" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between p-6 shrink-0 sticky top-0 h-screen z-50">
      <div className="space-y-8">
        <div className="flex items-center gap-2.5 font-headline font-bold text-lg text-primary tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-primary shadow-md shadow-secondary/10">
            <Compass className="w-4 h-4 stroke-[2.5]" />
          </div>
          StayBook
        </div>

        <button className="w-full py-3 bg-primary hover:bg-primary/95 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer group">
          <Plus className="w-4 h-4 text-secondary stroke-[2.5] group-hover:scale-110 transition-transform" />{" "}
          New Trip
        </button>

        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive = pathname === item.href;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer decoration-none ${
                  isActive
                    ? "bg-slate-100 text-primary font-semibold"
                    : "text-slate-500 hover:bg-slate-50 hover:text-primary"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-primary" : "text-slate-400"}`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-1.5 border-t border-slate-100 pt-4">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-primary rounded-xl text-sm font-medium transition-all cursor-pointer">
          <HelpCircle className="w-4 h-4 text-slate-400" /> Help
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50/50 rounded-xl text-sm font-medium transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );
}
