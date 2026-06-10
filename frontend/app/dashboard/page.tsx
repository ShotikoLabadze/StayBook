"use client";

import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

import DashboardHeader from "./components/DashboardHeader";
import RecentActivity from "./components/RecentActivity";

import { DollarSign, Leaf, MoreHorizontal, Plane, Share2 } from "lucide-react";

const upcomingTrips = [
  {
    id: "1",
    title: "Santorini, Greece",
    dates: "Jun 12 - Jun 20, 2026",
    progress: 45,
    daysLeft: 14,
    image:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Yosemite, USA",
    dates: "Jul 28 - Aug 05, 2026",
    progress: 30,
    daysLeft: 42,
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop",
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-neutral-bg font-body flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col min-w-0">
        <DashboardHeader userAvatar={user?.avatar} />

        <div className="p-10 space-y-10 max-w-7xl w-full mx-auto flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-primary">
                Welcome back, {user?.name || "Alex"}
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-headline text-sm font-bold text-primary tracking-tight">
                  Upcoming Trips
                </h2>
                <button className="text-xs font-semibold text-secondary hover:underline cursor-pointer">
                  View all
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {upcomingTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="bg-white border border-slate-100 rounded-2xl p-4 space-y-4 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-50">
                      <img
                        src={trip.image}
                        alt={trip.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold text-primary shadow-sm">
                        {trip.daysLeft} Days Left
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-headline font-semibold text-sm text-primary">
                          {trip.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {trip.dates}
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                          <span>Planning Progress</span>
                          <span className="text-primary">{trip.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: `${trip.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <h2 className="font-headline text-sm font-bold text-primary tracking-tight">
                Analytics
              </h2>
              <div className="space-y-4">
                {[
                  {
                    label: "Total Spent",
                    val: "$12,450",
                    icon: DollarSign,
                    bg: "bg-blue-50/50 text-blue-500",
                  },
                  {
                    label: "Miles Flown",
                    val: "24.8k",
                    icon: Plane,
                    bg: "bg-cyan-50/50 text-cyan-500",
                  },
                  {
                    label: "Carbon Footprint",
                    val: "1.2 tCO2",
                    icon: Leaf,
                    bg: "bg-emerald-50/50 text-emerald-500",
                  },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={i}
                      className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-sm"
                    >
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {stat.label}
                        </p>
                        <p className="font-headline text-xl font-bold text-primary">
                          {stat.val}
                        </p>
                      </div>
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.bg} shadow-xs`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 bg-white border border-slate-100 rounded-2xl p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-headline font-bold text-sm text-primary">
                  Budget Overview
                </h3>
                <button className="text-slate-400 hover:text-primary transition-colors cursor-pointer">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 36 36"
                  >
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="transparent"
                      stroke="#f1f5f9"
                      strokeWidth="3.5"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="transparent"
                      stroke="#0f172a"
                      strokeWidth="3.5"
                      strokeDasharray="70 100"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="font-headline text-xl font-bold text-primary">
                      70%
                    </span>
                  </div>
                </div>
                <div className="space-y-3 w-full sm:w-auto">
                  {[
                    { cat: "Flights", amt: "$4,200", color: "bg-primary" },
                    { cat: "Hotels", amt: "$2,800", color: "bg-secondary" },
                    { cat: "Dining", amt: "$1,150", color: "bg-slate-300" },
                  ].map((b, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between sm:gap-16 text-xs font-medium"
                    >
                      <div className="flex items-center gap-2 text-slate-500">
                        <span className={`w-2 h-2 rounded-full ${b.color}`} />
                        {b.cat}
                      </div>
                      <span className="text-primary font-semibold">
                        {b.amt}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <RecentActivity />
            </div>
          </div>

          <footer className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-medium text-slate-400">
            <div className="space-y-0.5 text-center sm:text-left">
              <p className="font-bold text-primary font-headline text-xs tracking-tight">
                Voyager
              </p>
              <p>© 2026 StayBook Luxury Travel. All rights reserved.</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">
                Destinations
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Pricing
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
