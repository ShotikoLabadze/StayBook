"use client";

import { Testimonial } from "@/services/testimonialService";
import { Star } from "lucide-react";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  isLoading: boolean;
}

export function TestimonialsSection({
  testimonials,
  isLoading,
}: TestimonialsSectionProps) {
  return (
    <section className="py-20 bg-slate-50 border-y border-slate-100 px-6 lg:px-16 text-center space-y-12">
      <div className="space-y-2">
        <h2 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-primary">
          Testimonials
        </h2>
        <p className="text-sm text-slate-500">
          Experiences shared by our community of global explorers.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        {isLoading
          ? [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm animate-pulse space-y-4"
              >
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-3 bg-slate-200 rounded w-full" />
                <div className="pt-4 border-t border-slate-50 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            ))
          : testimonials.map((t) => (
              <div
                key={t._id}
                className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex gap-0.5 text-secondary">
                    {[...Array(t.rating || 5)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600 font-medium italic">
                    "{t.quote}"
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-50">
                  <p className="text-sm font-semibold text-primary">
                    {t.author}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">
                    {t.role}{" "}
                    {t.destinationTitle && `• Trip to ${t.destinationTitle}`}
                  </p>
                </div>
              </div>
            ))}
      </div>
    </section>
  );
}
