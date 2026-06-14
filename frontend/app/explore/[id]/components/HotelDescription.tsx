"use client";

import { Hotel } from "@/services/destinationService";
import { CheckCircle2, Sparkles } from "lucide-react";

interface HotelDescriptionProps {
  hotel: Hotel;
}

export default function HotelDescription({ hotel }: HotelDescriptionProps) {
  return (
    <div className="space-y-8 text-left">
      <div className="bg-white border border-slate-100 p-7 rounded-3xl shadow-2xs space-y-4">
        <h3 className="font-headline text-lg font-bold text-primary tracking-tight">
          About this sanctuary
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed font-medium">
          {hotel.description ||
            "Experience unprecedented luxury and bespoke art de vivre in this hand-picked sanctuary, where every detail is meticulously tailored to elevate your travel experience."}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-secondary stroke-[2.5]" />
          <h3 className="font-headline text-lg font-bold text-primary tracking-tight">
            Why we love it
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {hotel.highlights && hotel.highlights.length > 0 ? (
            hotel.highlights.map((highlight, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-100 p-4 rounded-2xl shadow-2xs flex items-start gap-3 hover:border-slate-200 transition-all duration-200"
              >
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                  {highlight}
                </p>
              </div>
            ))
          ) : (
            <>
              <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-2xs flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                  Bespoke curated expert itineraries tailored to your rhythm.
                </p>
              </div>
              <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-2xs flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                  Unmatched privacy with signature sanctuary butler services.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
