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
      <p className="text-sm sm:text-base text-text-muted max-w-md mx-auto">
        Join our exclusive community of travelers and start planning your next
        luxury escape today.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={() => handleNavigation("/explore")}
          className="w-full sm:w-auto px-7 py-3.5 bg-primary hover:bg-primary/95 dark:bg-secondary dark:hover:bg-secondary/90 text-white dark:text-neutral-bg text-sm font-semibold rounded-full shadow-lg shadow-primary/10 transition-all flex items-center justify-center gap-2 cursor-pointer tracking-wide"
        >
          Create Your First Plan{" "}
          <ArrowRight className="w-4 h-4 text-secondary dark:text-neutral-bg" />
        </button>

        <button
          onClick={() => handleNavigation("/dashboard")}
          className="w-full sm:w-auto px-7 py-3.5 bg-card-bg border border-border-subtle hover:bg-neutral-bg text-primary text-sm font-semibold rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer tracking-wide shadow-sm"
        >
          Open Dashboard <LayoutDashboard className="w-4 h-4 text-text-muted" />
        </button>
      </div>
    </section>
  );
}
