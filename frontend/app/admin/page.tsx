"use client";

import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!user) return;

    if (user.role !== "admin") {
      router.replace("/dashboard");
    } else {
      api
        .get("/admin/dashboard-data")
        .then(() => {
          setLoadingData(false);
        })
        .catch((err) => {
          console.error("Unauthorized admin access", err);
          router.replace("/dashboard");
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
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans antialiased flex items-center justify-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center space-y-2"
      >
        <span className="text-xs font-semibold text-[#38bdf8] uppercase tracking-widest block">
          Secure Area
        </span>
        <h1 className="text-4xl font-extrabold font-headline text-[#0f172a] tracking-tight sm:text-5xl">
          admin fashboarss
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Welcome back, {user.name}. Control panel is ready.
        </p>
      </motion.div>
    </div>
  );
}
