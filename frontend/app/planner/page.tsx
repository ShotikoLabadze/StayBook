"use client";

import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

import PlannerHeader from "./components/PlannerHeader";
import Timeline from "./components/Timeline";
import TripHeroBanner from "./components/TripHeroBanner";

import LiveUpdates from "./components/LiveUpdates";
import MapPreview from "./components/MapPreview";
import TripManagement from "./components/TripManagement";

export default function PlannerPage() {
  const currentTrip = {
    title: "Amalfi Coast Adventure",
    dates: "Sep 12 — Sep 22, 2026",
    image:
      "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=1200&auto=format&fit=crop",
  };

  return (
    <div className="min-h-screen bg-neutral-bg font-body flex">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <PlannerHeader tripTitle={currentTrip.title} />

        <div className="p-8 space-y-8 max-w-7xl w-full mx-auto flex-1 flex flex-col">
          <TripHeroBanner
            title={currentTrip.title}
            dates={currentTrip.dates}
            image={currentTrip.image}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <Timeline />
            </div>

            <div className="lg:col-span-4 space-y-6">
              <TripManagement />
              <MapPreview />
              <LiveUpdates />
            </div>
          </div>

          <Footer variant="dashboard" />
        </div>
      </main>
    </div>
  );
}
