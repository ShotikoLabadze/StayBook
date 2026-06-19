"use client";

import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { PlanItem } from "./components/plan-item";

export default function PlannerPage() {
  const testItems = [
    {
      id: "1",
      title: "Flight LX1204 - Zurich to Naples",
      time: "14:00",
      note: "Terminal 1. Gate information will update live.",
      category: "flight",
    },
    {
      id: "2",
      title: "Check-in at Hotel Le Sirenuse",
      time: "15:30",
      note: "Sea View Junior Suite. Booking reference: #STAY-9921",
      category: "hotel",
    },
    {
      id: "3",
      title: "Oia Sunset Walk & Luxury Dinner",
      time: "19:00",
      note: "Dress code: Smart casual. Balcony table reserved.",
      category: "activity",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-bg font-body flex">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <div className="p-10 space-y-10 max-w-7xl w-full mx-auto flex-1 flex flex-col">
          <header className="text-left">
            <p className="text-sm font-medium text-primary">StayBook</p>
            <h1 className="mt-2 text-3xl font-bold text-primary md:text-4xl tracking-tight font-headline">
              Premium Planner Workspace
            </h1>
          </header>

          <div className="w-full max-w-sm space-y-3 flex-1">
            <p className="text-xs text-slate-400 mb-2 font-semibold text-left">
              PlanItem Components List Preview:
            </p>
            {testItems.map((singleItem) => (
              <PlanItem key={singleItem.id} item={singleItem} />
            ))}
          </div>

          <Footer variant="dashboard" />
        </div>
      </main>
    </div>
  );
}
