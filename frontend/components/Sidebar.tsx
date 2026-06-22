"use client";

import { useAuth } from "@/context/AuthContext";
import {
  Bookmark,
  Calendar,
  Compass,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CreateTripModal from "./CreateTripModal";

export default function Sidebar() {
  const { logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    { id: "planner", label: "Planner", icon: Calendar, href: "/planner" },
    { id: "explore", label: "Explore", icon: Compass, href: "/explore" },
    { id: "saved", label: "Saved", icon: Bookmark, href: "/saved" },
  ];

  const toggleMobile = () => setMobileOpen((prev) => !prev);
  const closeMobile = () => setMobileOpen(false);

  const isProfileActive = pathname === "/profile";

  return (
    <>
      <button
        onClick={toggleMobile}
        className="fixed top-4 left-4 z-50 rounded-lg border border-slate-100 bg-white p-2 shadow-md md:hidden cursor-pointer"
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
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 flex flex-col justify-between p-6 shrink-0 h-screen transition-transform duration-300 ease-in-out md:sticky md:top-0 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-8">
          <div className="flex items-center justify-between font-headline font-bold text-lg text-primary tracking-tight">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-primary shadow-md shadow-secondary/10">
                <Compass className="w-4 h-4 stroke-[2.5]" />
              </div>
              StayBook
            </div>

            <button
              onClick={closeMobile}
              className="rounded-md p-1 hover:bg-slate-50 md:hidden cursor-pointer"
              aria-label="Close menu"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>

          <button
            onClick={() => {
              closeMobile();
              setIsModalOpen(true);
            }}
            className="w-full py-3 bg-primary hover:bg-primary/95 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer group"
          >
            <svg
              className="w-4 h-4 text-secondary stroke-[2.5]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Trip
          </button>

          <nav className="space-y-1.5">
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
                  onClick={closeMobile}
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
          <Link
            href="/profile"
            onClick={closeMobile}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer decoration-none ${
              isProfileActive
                ? "bg-slate-100 text-primary font-semibold"
                : "text-slate-500 hover:bg-slate-50 hover:text-primary"
            }`}
          >
            <User
              className={`w-4 h-4 ${isProfileActive ? "text-primary" : "text-slate-400"}`}
            />
            Profile
          </Link>

          <Link
            href="/help"
            onClick={closeMobile}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-primary rounded-xl text-sm font-medium transition-all cursor-pointer decoration-none"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" /> Help
          </Link>

          <button
            onClick={() => {
              closeMobile();
              logout();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50/50 rounded-xl text-sm font-medium transition-all cursor-pointer"
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
