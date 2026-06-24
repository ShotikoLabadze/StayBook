"use client";

import { useAuth } from "@/context/AuthContext";
import { TripData, tripService } from "@/services/tripService";
import { Bell, Compass, Settings, Share2 } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();

  const [dynamicLocation, setDynamicLocation] = useState("Global Workspace");
  const [trips, setTrips] = useState<TripData[]>([]);

  const navItems = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard" },
    { id: "planner", label: "Planner", href: "/planner" },
    { id: "explore", label: "Explore", href: "/explore" },
    { id: "saved", label: "Saved", href: "/saved" },
  ];

  useEffect(() => {
    if (user) {
      tripService
        .getAll()
        .then((data) => {
          setTrips(data);
        })
        .catch((err) => console.error(err));
    }
  }, [user]);

  useEffect(() => {
    const currentTripId = params?.tripId;

    if (currentTripId) {
      const activeTrip = trips.find((t: any) => t._id === currentTripId) as any;
      if (activeTrip?.destination) {
        setDynamicLocation(activeTrip.destination);
        return;
      }
    }

    if (trips.length > 0) {
      const firstTrip = trips[0] as any;
      setDynamicLocation(firstTrip.destination || "Global Workspace");
    } else {
      setDynamicLocation("Global Workspace");
    }
  }, [trips, params, pathname]);

  return (
    <nav className="w-full h-20 bg-[var(--color-card-bg)] border-b border-[var(--color-border-subtle)] flex items-center justify-between px-8 sticky top-0 z-40 transition-colors duration-300">
      <div className="flex items-center gap-6 text-base font-semibold">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 font-headline font-bold text-lg text-primary tracking-tight decoration-none"
        >
          <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-primary shadow-xs">
            <Compass className="w-5 h-5 stroke-[2.5]" />
          </div>
          StayBook
        </Link>
        <div className="h-5 h-[20px] w-px bg-[var(--color-border-subtle)]" />
        <span className="text-[var(--color-text-muted)] text-sm font-bold tracking-wide">
          {dynamicLocation}
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-base font-semibold">
        {navItems.map((item) => {
          const isActive =
            item.id === "planner"
              ? pathname.startsWith("/planner")
              : pathname === item.href;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`transition-colors decoration-none py-2 border-b-2 cursor-pointer tracking-wide ${
                isActive
                  ? "text-secondary border-secondary font-extrabold"
                  : "text-[var(--color-text-muted)] hover:text-primary border-transparent"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center -space-x-2">
          <img
            src={
              user?.avatar ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=50&q=80"
            }
            alt="User"
            className="w-9 h-9 rounded-full object-cover border-2 border-[var(--color-card-bg)]"
          />
          <div className="w-9 h-9 rounded-full bg-secondary text-primary font-extrabold text-xs flex items-center justify-center border-2 border-[var(--color-card-bg)] shadow-xs">
            +2
          </div>
        </div>

        <button className="relative p-2.5 text-[var(--color-text-muted)] hover:text-primary transition-colors cursor-pointer rounded-xl hover:bg-[var(--color-neutral-bg)] border-none bg-transparent">
          <Bell className="w-5 h-5 stroke-[2]" />
          <span className="absolute top-2 right-2 w-4 h-4 bg-rose-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-[var(--color-card-bg)]">
            9+
          </span>
        </button>

        <button
          onClick={() => router.push("/profile")}
          className="p-2.5 text-[var(--color-text-muted)] hover:text-primary transition-colors cursor-pointer rounded-xl hover:bg-[var(--color-neutral-bg)] border-none bg-transparent"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 stroke-[2]" />
        </button>

        <button className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-primary font-extrabold text-sm rounded-xl shadow-sm hover:bg-opacity-90 transition-all cursor-pointer border-none">
          <Share2 className="w-4 h-4 stroke-[2.5]" />
          Share
        </button>
      </div>
    </nav>
  );
}
