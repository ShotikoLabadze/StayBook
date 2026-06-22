"use client";

import { useAuth } from "@/context/AuthContext";
import { destinationService, Hotel } from "@/services/destinationService";
import { motion } from "framer-motion";
import { Loader2, LogOut, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import HotelsTab from "./components/HotelsTab";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [loadingData, setLoadingData] = useState(true);
  const [hotels, setHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    if (!user) return;

    if (user.role !== "admin") {
      router.replace("/dashboard");
    } else {
      destinationService
        .getHotelsByDestination("all")
        .then((hotelsData) => {
          setHotels(hotelsData);
          setLoadingData(false);
        })
        .catch((err) => {
          console.error("Fetch error in admin dashboard", err);
          setLoadingData(false);
        });
    }
  }, [user, router]);

  if (!user || user.role !== "admin" || loadingData) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#38bdf8] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans antialiased py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#38bdf8]/10 flex items-center justify-center text-[#38bdf8]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-headline text-[#0f172a]">
                StayBook Control Panel
              </h1>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <HotelsTab hotels={hotels} setHotels={setHotels} />
        </motion.div>
      </div>
    </div>
  );
}
