"use client";

import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { DollarSign, Leaf, Plane } from "lucide-react";
import { useState } from "react";
import AnalyticsWidget from "./components/AnalyticsWidget";
import BudgetOverview from "./components/BudgetOverview";
import DashboardHeader from "./components/DashboardHeader";
import RecentActivity from "./components/RecentActivity";
import TripCard from "./components/TripCard";
import WelcomeBanner from "./components/WelcomeBanner";

import Footer from "@/components/Footer";
import { AnalyticItem } from "./components/AnalyticsWidget";

const analyticsData: AnalyticItem[] = [
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
];

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
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <DashboardHeader userAvatar={user?.avatar} />

        <div className="p-10 space-y-10 max-w-7xl w-full mx-auto flex-1">
          <WelcomeBanner userName={user?.name} />

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
                  <TripCard key={trip.id} {...trip} />
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <h2 className="font-headline text-sm font-bold text-primary tracking-tight">
                Analytics
              </h2>
              <AnalyticsWidget items={analyticsData} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6">
              <BudgetOverview />
            </div>
            <div className="lg:col-span-6">
              <RecentActivity />
            </div>
          </div>

          <Footer variant="dashboard" />
        </div>
      </main>
    </div>
  );
}
