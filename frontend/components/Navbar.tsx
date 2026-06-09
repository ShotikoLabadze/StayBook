"use client";

import { Compass } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 lg:px-16 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2.5 font-headline font-bold text-lg text-primary tracking-tight">
        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-primary shadow-md shadow-secondary/10">
          <Compass className="w-4 h-4 stroke-[2.5]" />
        </div>
        StayBook
      </div>

      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
        <a href="#" className="text-primary font-semibold">
          Home
        </a>
        <a href="#" className="hover:text-primary transition-colors">
          Destinations
        </a>
        <a href="#" className="hover:text-primary transition-colors">
          Pricing
        </a>
        <a href="#" className="hover:text-primary transition-colors">
          Concierge
        </a>
      </nav>

      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="px-4 py-2 bg-primary hover:bg-primary/95 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}
