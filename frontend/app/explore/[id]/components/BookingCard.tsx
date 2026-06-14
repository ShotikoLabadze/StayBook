"use client";

import { Hotel } from "@/services/destinationService";
import { Calendar, ShieldCheck, Sparkles, Users } from "lucide-react";
import { useState } from "react";

interface BookingCardProps {
  hotel: Hotel;
}

export default function BookingCard({ hotel }: BookingCardProps) {
  const [guests, setGuests] = useState("1");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Bespoke booking requested for ${hotel.name}! Dates: ${checkIn || "Flexible"} to ${checkOut || "Flexible"}.`,
    );
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6 text-left">
      <div className="flex items-baseline justify-between border-b border-slate-50 pb-4">
        <div>
          <span className="font-headline text-2xl font-extrabold text-primary">
            ${hotel.pricePerNight.toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-slate-400"> / night</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/50">
            Available
          </span>
        </div>
      </div>

      <form onSubmit={handleBooking} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block pl-1">
              Check-In
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold text-primary focus:outline-none focus:border-secondary transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block pl-1">
              Check-Out
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold text-primary focus:outline-none focus:border-secondary transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block pl-1">
            Guests
          </label>
          <div className="relative">
            <Users className="w-4 h-4 text-slate-400 absolute left-37 top-1/2 -translate-y-1/2 pointer-events-none left-3" />
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold text-primary focus:outline-none focus:border-secondary transition-colors appearance-none cursor-pointer"
            >
              <option value="1">1 Guest</option>
              <option value="2">2 Guests</option>
              <option value="3">3 Guests</option>
              <option value="4">4+ Guests</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-xl transition-all shadow-xs tracking-wider uppercase cursor-pointer flex items-center justify-center gap-2 mt-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-secondary fill-current" />
          Book This Sanctuary
        </button>
      </form>

      <div className="pt-2 flex items-center gap-2.5 justify-center text-[11px] font-medium text-slate-400 border-t border-slate-50">
        <ShieldCheck className="w-4 h-4 text-slate-300 shrink-0" />
        <span>Bespoke Concierge Protection Included</span>
      </div>
    </div>
  );
}
