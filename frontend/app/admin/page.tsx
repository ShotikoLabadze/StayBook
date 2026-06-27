"use client";

import { useAuth } from "@/context/AuthContext";
import { destinationService, Hotel } from "@/services/destinationService";
import { userService } from "@/services/userService";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  Loader2,
  LogOut,
  Plus,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import HotelsTab from "./components/HotelsTab";
import UsersTab from "./components/UsersTab";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"hotels" | "users">("hotels");
  const [loadingData, setLoadingData] = useState(true);

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);

  const [triggerCreateHotel, setTriggerCreateHotel] = useState(0);

  useEffect(() => {
    const navbar = document.querySelector("nav");
    const sidebar = document.querySelector("aside");
    const mainArea = document.querySelector("main");

    if (navbar) navbar.style.display = "none";
    if (sidebar) sidebar.style.display = "none";
    if (mainArea) {
      mainArea.style.height = "100vh";
      mainArea.style.width = "100vw";
    }

    return () => {
      if (navbar) navbar.style.display = "";
      if (sidebar) sidebar.style.display = "";
      if (mainArea) {
        mainArea.style.height = "";
        mainArea.style.width = "";
      }
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    if (user.role !== "admin") {
      router.replace("/dashboard");
    } else {
      Promise.all([
        destinationService.getHotelsByDestination("all"),
        userService.getAllUsers().catch(() => []),
      ])
        .then(([hotelsData, usersData]) => {
          setHotels(hotelsData);
          setRegisteredUsers(usersData || []);
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
              <p className="text-xs text-slate-400">
                Welcome back, {user.name} (Admin)
              </p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>

        <div className="flex justify-between items-end pb-2">
          <div className="space-y-3">
            <div className="flex bg-slate-200/60 p-1 rounded-xl border border-slate-100/50 shadow-xs">
              <button
                onClick={() => setActiveTab("hotels")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === "hotels"
                    ? "bg-[#0f172a] text-white shadow-xs"
                    : "text-slate-500 hover:text-[#0f172a]"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" /> Hotels
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === "users"
                    ? "bg-[#0f172a] text-white shadow-xs"
                    : "text-slate-500 hover:text-[#0f172a]"
                }`}
              >
                <Users className="w-3.5 h-3.5" /> Users
              </button>
            </div>

            <div className="text-xs text-slate-400 font-medium tracking-wide pl-1">
              amount ({" "}
              {activeTab === "hotels" ? hotels.length : registeredUsers.length}{" "}
              )
            </div>
          </div>

          {activeTab === "hotels" && (
            <button
              onClick={() => setTriggerCreateHotel((prev) => prev + 1)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] text-white text-xs font-semibold rounded-xl hover:bg-opacity-90 transition shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add New Property
            </button>
          )}
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="wait">
            {activeTab === "hotels" ? (
              <HotelsTab
                key="hotels"
                hotels={hotels}
                setHotels={setHotels}
                triggerCreateHotel={triggerCreateHotel}
              />
            ) : (
              <UsersTab
                key="users"
                users={registeredUsers}
                setUsers={setRegisteredUsers}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
