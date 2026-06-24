"use client";

import { Compass } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-card-bg/80 dark:bg-neutral-bg/80 backdrop-blur-md border-b border-border-subtle px-6 lg:px-16 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2.5 font-headline font-bold text-lg text-primary tracking-tight">
        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-primary shadow-md shadow-secondary/10">
          <Compass className="w-4 h-4 stroke-[2.5]" />
        </div>
        StayBook
      </div>

      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text-muted">
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
          className="text-sm font-medium text-text-muted hover:text-primary transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="px-4 py-2 bg-primary hover:bg-primary/95 dark:bg-secondary dark:hover:bg-secondary/90 text-white dark:text-neutral-bg text-sm font-semibold rounded-xl transition-all shadow-sm"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}
