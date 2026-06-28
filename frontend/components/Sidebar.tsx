"use client";

import { useAuth } from "@/context/AuthContext";
import { useSidebarStore } from "@/store/useSidebarStore";
import {
  Calendar,
  Compass,
  DollarSign,
  Heart,
  LayoutDashboard,
  LogOut,
  Moon,
  Plus,
  Sun,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import CreateTripModal from "./CreateTripModal";

export default function Sidebar() {
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { isOpen, closeSidebar } = useSidebarStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    { id: "planner", label: "Planner", icon: Calendar, href: "/planner" },
    { id: "explore", label: "Explore", icon: Compass, href: "/explore" },
    { id: "budget", label: "Budget", icon: DollarSign, href: "/budget" },
    { id: "favorites", label: "Favorites", icon: Heart, href: "/favorites" },
  ];

  const isProfileActive = pathname === "/profile";

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-card-bg border-r border-border-subtle flex flex-col justify-between p-6 shrink-0 transition-transform duration-300 ease-in-out lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] lg:translate-x-0 h-full transition-colors duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } pt-24 lg:pt-6`}
      >
        <div className="space-y-6 overflow-y-auto flex-1 pr-1">
          <button
            onClick={() => {
              closeSidebar();
              setIsModalOpen(true);
            }}
            className="w-full py-3 bg-primary hover:bg-primary/95 dark:bg-secondary dark:hover:bg-secondary/90 text-white dark:text-neutral-bg font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer border-none"
          >
            <Plus className="w-4 h-4 text-secondary dark:text-neutral-bg stroke-[2.5]" />
            New Trip
          </button>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.id === "planner"
                  ? pathname.startsWith("/planner")
                  : pathname === item.href;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={closeSidebar}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer decoration-none ${
                    isActive
                      ? "bg-primary text-white dark:bg-secondary dark:text-neutral-bg font-semibold shadow-2xs"
                      : "text-text-muted hover:bg-neutral-bg hover:text-primary"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${isActive ? "text-white dark:text-neutral-bg" : "text-text-muted"}`}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-1 border-t border-border-subtle pt-4 mt-auto shrink-0">
          <Link
            href="/profile"
            onClick={closeSidebar}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer decoration-none ${
              isProfileActive
                ? "bg-primary text-white dark:bg-secondary dark:text-neutral-bg font-semibold shadow-2xs"
                : "text-text-muted hover:bg-neutral-bg hover:text-primary"
            }`}
          >
            <User
              className={`w-4 h-4 ${isProfileActive ? "text-white dark:text-neutral-bg" : "text-text-muted"}`}
            />
            Profile
          </Link>

          {mounted && (
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-text-muted hover:bg-neutral-bg hover:text-primary rounded-xl text-sm font-medium transition-all cursor-pointer border-none bg-transparent outline-none"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-text-muted" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => {
              closeSidebar();
              logout();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/20 rounded-xl text-sm font-medium transition-all cursor-pointer border-none bg-transparent"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      <CreateTripModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
