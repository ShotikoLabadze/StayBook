"use client";

import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

export default function TripsPage() {
  return (
    <div className="min-h-screen bg-neutral-bg font-body flex">
      <Sidebar />

      <main className="flex-1 flex flex-col p-8 max-w-7xl w-full mx-auto justify-between">
        <div className="space-y-4">
          <h1 className="font-headline text-3xl font-bold tracking-tight text-primary">
            My Planned Trips
          </h1>
          <p className="text-sm text-slate-400">
            Here you will see all your custom travel itineraries.
          </p>

          <div className="p-8 border border-dashed border-slate-200 bg-white rounded-3xl text-center text-sm text-slate-400">
            Trips list coming soon... 🗺️
          </div>
        </div>

        <Footer variant="dashboard" />
      </main>
    </div>
  );
}
