"use client";

import { Hotel } from "@/services/destinationService";
import { MessageSquare, Star } from "lucide-react";

interface HotelReviewsProps {
  hotel: Hotel;
}

export default function HotelReviews({ hotel }: HotelReviewsProps) {
  return (
    <div className="bg-white border border-slate-200/60 p-7 rounded-3xl shadow-2xs text-left space-y-6">
      <div className="space-y-1">
        <h3 className="font-headline text-lg font-bold text-primary tracking-tight">
          Guest Testimonials
        </h3>
        <p className="text-xs font-medium text-slate-400">
          Verified ratings from travelers who stayed at this sanctuary.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
        <div className="text-center md:border-r border-slate-200/60 py-2 space-y-1">
          <p className="text-4xl font-extrabold text-primary font-headline">
            {hotel.rating.toFixed(2)}
          </p>
          <div className="flex items-center justify-center gap-0.5 text-secondary">
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Out of 5 Stars
          </p>
        </div>

        <div className="col-span-2 px-2 md:px-6 space-y-3">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-secondary shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-primary">
                {hotel.reviewCount} Total Verified Reviews
              </h4>
              <p className="text-[11px] font-medium text-slate-500 leading-relaxed mt-0.5">
                100% of reviews come from guests who completed their premium
                concierge booking through StayBook.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
