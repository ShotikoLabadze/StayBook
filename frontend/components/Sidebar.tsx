"use client";

import { useAuth } from "@/context/AuthContext";
import {
  Calendar,
  Compass,
  DollarSign,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Moon,
  Plus,
  Sun,
  User,
  X,
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
  const [mobileOpen, setMobileOpen] = useState(false);
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
    {
      id: "budget",
      label: "Budget",
      icon: DollarSign,
      href: "/planner?tab=budget",
    },
    {
      id: "testimonials",
      label: "Testimonials",
      icon: MessageSquareQuote,
      href: "/testimonials",
    },
  ];

  const toggleMobile = () => setMobileOpen((prev) => !prev);
  const closeMobile = () => setMobileOpen(false);

  const isProfileActive = pathname === "/profile";

  return (
    <>
      <button
        onClick={toggleMobile}
        className="fixed top-4 left-4 z-50 rounded-lg border border-border-subtle bg-card-bg p-2 shadow-md lg:hidden cursor-pointer"
        aria-label="Toggle menu"
      >
        {mobileOpen ? (
          <X className="h-5 w-5 text-primary" />
        ) : (
          <Menu className="h-5 w-5 text-primary" />
        )}
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-card-bg border-r border-border-subtle flex flex-col justify-between p-6 shrink-0 transition-transform duration-300 ease-in-out lg:sticky lg:top-20 lg:translate-x-0 h-[calc(100vh-5rem)] transition-colors duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6 overflow-y-auto flex-1 pr-1">
          <div className="flex items-center justify-between font-headline font-bold text-lg text-primary tracking-tight lg:hidden">
            <button
              onClick={closeMobile}
              className="rounded-md p-1 hover:bg-neutral-bg text-text-muted hover:text-primary cursor-pointer border-none bg-transparent"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <button
            onClick={() => {
              closeMobile();
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
                item.id === "planner" || item.id === "budget"
                  ? pathname.startsWith("/planner") &&
                    ((item.id === "budget" &&
                      pathname.includes("tab=budget")) ||
                      (item.id === "planner" &&
                        !pathname.includes("tab=budget")))
                  : pathname === item.href;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={closeMobile}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer decoration-none ${
                    isActive
                      ? "bg-primary text-white dark:bg-secondary dark:text-neutral-bg font-semibold shadow-2xs"
                      : "text-text-muted hover:bg-neutral-bg hover:text-primary"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? "text-white dark:text-neutral-bg"
                        : "text-text-muted"
                    }`}
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
            onClick={closeMobile}
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

          <Link
            href="/help"
            onClick={closeMobile}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-text-muted hover:bg-neutral-bg hover:text-primary rounded-xl text-sm font-medium transition-all cursor-pointer decoration-none"
          >
            <HelpCircle className="w-4 h-4 text-text-muted" /> Help
          </Link>

          <button
            onClick={() => {
              closeMobile();
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
