"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function HeroSection() {
  const router = useRouter();

  const [whereInput, setWhereInput] = useState("");
  const [whenInput, setWhenInput] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!whereInput.trim()) {
      router.push("/explore");
      return;
    }

    router.push(`/explore?search=${encodeURIComponent(whereInput.trim())}`);
  };

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-primary text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12),transparent_60%)]" />
      <div
        className="absolute top-0 inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop')`,
        }}
      />

      <div className="relative z-10 max-w-3xl space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-headline text-4xl sm:text-6xl font-bold tracking-tight leading-[1.1]"
        >
          The World’s Most{" "}
          <span className="text-secondary font-medium">Refined</span> <br />{" "}
          Travel Experiences
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-medium"
        >
          Curated by experts, enhanced by AI. Plan the next generation of luxury
          itineraries seamlessly with StayBook.
        </motion.p>

        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/90 backdrop-blur-md p-2 sm:p-2.5 rounded-2xl sm:rounded-full shadow-xl max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-12 gap-2 items-center text-primary mt-10 border border-white/20"
        >
          <div className="sm:col-span-5 flex items-center gap-3 px-4 border-b sm:border-b-0 sm:border-r border-slate-200/60 py-2 sm:py-0">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={whereInput}
              onChange={(e) => setWhereInput(e.target.value)}
              placeholder="Where do you want to go?"
              className="w-full text-sm font-medium focus:outline-none placeholder:text-slate-400 bg-transparent text-primary"
            />
          </div>
          <div className="sm:col-span-4 flex items-center gap-3 px-4 py-2 sm:py-0">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={whenInput}
              onChange={(e) => setWhenInput(e.target.value)}
              placeholder="When?"
              className="w-full text-sm font-medium focus:outline-none placeholder:text-slate-400 bg-transparent text-primary"
            />
          </div>
          <button
            type="submit"
            className="sm:col-span-3 w-full py-3 bg-secondary hover:bg-secondary/90 text-primary text-sm font-bold rounded-xl sm:rounded-full transition-all flex items-center justify-center gap-2 shadow-lg shadow-secondary/10 cursor-pointer tracking-wide"
          >
            <Search className="w-4 h-4 text-primary stroke-[3]" /> Search
          </button>
        </motion.form>
      </div>
    </section>
  );
}
