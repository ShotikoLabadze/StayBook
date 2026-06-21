"use client";

import { useAuth } from "@/context/AuthContext";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";

export function CallToAction() {
  const router = useRouter();
  const { user } = useAuth();

  const handleNavigation = (targetPath: string) => {
    if (user) {
      router.push(targetPath);
    } else {
      router.push(`/login?redirect=${targetPath}`);
    }
  };

  return (
    <section className="py-24 px-6 text-center max-w-4xl mx-auto space-y-8">
      <h2 className="font-headline text-3xl sm:text-5xl font-bold tracking-tight text-primary">
        Ready to begin your journey?
      </h2>
      <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto">
        Join our exclusive community of travelers and start planning your next
        luxury escape today.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={() => handleNavigation("/explore")}
          className="w-full sm:w-auto px-7 py-3.5 bg-primary hover:bg-primary/95 text-white text-sm font-semibold rounded-full shadow-lg shadow-primary/10 transition-all flex items-center justify-center gap-2 cursor-pointer tracking-wide"
        >
          Create Your First Plan{" "}
          <ArrowRight className="w-4 h-4 text-secondary" />
        </button>

        <button
          onClick={() => handleNavigation("/dashboard")}
          className="w-full sm:w-auto px-7 py-3.5 bg-white border border-slate-200 hover:bg-neutral-bg text-slate-700 text-sm font-semibold rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer tracking-wide shadow-sm"
        >
          Open Dashboard <LayoutDashboard className="w-4 h-4 text-primary/70" />
        </button>
      </div>
    </section>
  );
}
