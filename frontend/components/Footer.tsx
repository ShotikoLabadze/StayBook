"use client";

export default function Footer({ variant = "landing" }) {
  if (variant === "landing") {
    return (
      <footer className="border-t border-border-subtle bg-card-bg px-6 lg:px-16 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-text-muted w-full">
        <div className="text-center sm:text-left space-y-0.5">
          <p className="font-bold text-primary text-sm tracking-tight font-headline">
            StayBook
          </p>
          <p className="text-[11px]">Luxury Travel Reimagined.</p>
        </div>
        <div className="flex gap-6 text-[11px]">
          <a href="#" className="hover:text-primary transition-colors">
            Destinations
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Pricing
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Terms of Service
          </a>
        </div>
        <p className="text-[11px]">
          © 2026 StayBook Luxury Travel. All rights reserved.
        </p>
      </footer>
    );
  }

  return (
    <footer className="border-t border-border-subtle pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-medium text-text-muted w-full mt-auto">
      <div className="space-y-0.5 text-center sm:text-left">
        <p className="font-bold text-primary font-headline text-xs tracking-tight">
          StayBook
        </p>
        <p>© 2026 StayBook Luxury Travel. All rights reserved.</p>
      </div>
      <div className="flex gap-6">
        <a href="#" className="hover:text-primary transition-colors">
          Destinations
        </a>
        <a href="#" className="hover:text-primary transition-colors">
          Pricing
        </a>
        <a href="#" className="hover:text-primary transition-colors">
          Privacy Policy
        </a>
        <a href="#" className="hover:text-primary transition-colors">
          Terms of Service
        </a>
      </div>
    </footer>
  );
}
