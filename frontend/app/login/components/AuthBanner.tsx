"use client";

import { motion } from "framer-motion";
import { Compass } from "lucide-react";

interface AuthBannerProps {
  title?: string;
  description?: string;
}

export default function AuthBanner({
  title = "Plan your next journey with style.",
  description = "Experience 2026's most advanced smart travel planner, featuring real-time collaboration and intuitive itinerary mapping.",
}: AuthBannerProps) {
  return (
    <div className="hidden lg:flex lg:col-span-5 bg-[#0f172a] relative overflow-hidden flex-col justify-between p-12 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12),transparent_60%)]" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-sky-500/10 rounded-full blur-[100px]" />

      <div className="relative z-10 flex items-center gap-2.5 font-headline font-bold text-xl tracking-tight text-white">
        <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-[#0f172a] shadow-lg shadow-secondary/20">
          <Compass className="w-5 h-5 stroke-[2.5]" />
        </div>
        StayBook
      </div>

      <div className="relative z-10 my-auto max-w-sm space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-headline text-4xl font-semibold leading-tight tracking-tight text-white"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-sm leading-relaxed text-slate-300"
        >
          {description}
        </motion.p>
      </div>

      <div className="relative z-10 text-xs text-slate-400 font-medium">
        © 2026 StayBook Technologies Inc.
      </div>
    </div>
  );
}
