"use client";

import Link from "next/link";

export default function Footer({ variant = "landing" }) {
  if (variant === "landing") {
    return (
      <footer className="border-t border-border-subtle bg-card-bg px-8 lg:px-20 py-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm font-semibold text-text-muted w-full">
        <div className="text-center sm:text-left space-y-1">
          <p className="font-extrabold text-primary text-base tracking-tight font-headline">
            StayBook
          </p>
          <p className="text-xs text-[13px] font-medium">
            Luxury Travel Reimagined.
          </p>
        </div>
        <div className="flex gap-8 text-[13px]">
          <Link
            href="/explore"
            className="hover:text-primary transition-colors decoration-none text-text-muted"
          >
            Destinations
          </Link>
          <Link
            href="/dashboard"
            className="hover:text-primary transition-colors decoration-none text-text-muted"
          >
            Pricing
          </Link>
          <Link
            href="/profile"
            className="hover:text-primary transition-colors decoration-none text-text-muted"
          >
            Privacy Policy
          </Link>
          <Link
            href="/profile"
            className="hover:text-primary transition-colors decoration-none text-text-muted"
          >
            Terms of Service
          </Link>
        </div>
        <p className="text-[13px] font-medium">
          © 2026 StayBook Luxury Travel. All rights reserved.
        </p>
      </footer>
    );
  }

  return (
    <footer className="border-t border-border-subtle pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-[13px] font-semibold text-text-muted w-full mt-auto mb-4">
      <div className="space-y-1 text-center sm:text-left">
        <p className="font-extrabold text-primary font-headline text-sm tracking-tight">
          StayBook
        </p>
        <p className="font-medium">
          © 2026 StayBook Luxury Travel. All rights reserved.
        </p>
      </div>
      <div className="flex gap-8">
        <Link
          href="/explore"
          className="hover:text-primary transition-colors decoration-none text-text-muted"
        >
          Destinations
        </Link>
        <Link
          href="/dashboard"
          className="hover:text-primary transition-colors decoration-none text-text-muted"
        >
          Pricing
        </Link>
        <Link
          href="/profile"
          className="hover:text-primary transition-colors decoration-none text-text-muted"
        >
          Privacy Policy
        </Link>
        <Link
          href="/profile"
          className="hover:text-primary transition-colors decoration-none text-text-muted"
        >
          Terms of Service
        </Link>
      </div>
    </footer>
  );
}
