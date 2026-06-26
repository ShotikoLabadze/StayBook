"use client";

import api from "@/services/api";
import { Hotel } from "@/services/destinationService";
import {
  Calendar as CalendarIcon,
  Loader2,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarModal } from "./CalendarModal";

interface BookingCardProps {
  hotel: Hotel;
}

export default function BookingCard({ hotel }: BookingCardProps) {
  const router = useRouter();
  const [guests, setGuests] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [rangeStart, setRangeStart] = useState<Date | null>(new Date());
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);

  const formatDisplayDate = (date: Date | null) => {
    if (!date) return "...";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rangeStart || !rangeEnd) {
      setErrorMessage("Please select both Check-In and Check-Out dates.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const diffTime = Math.abs(rangeEnd.getTime() - rangeStart.getTime());
      const nightsCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

      const response = await api.post("/trips", {
        title: `Escape to ${hotel.name}`,
        destination: hotel.neighborhood || "Luxury Sanctuary",
        startDate: rangeStart.toISOString().split("T")[0],
        endDate: rangeEnd.toISOString().split("T")[0],
        checkIn: rangeStart.toISOString(),
        checkOut: rangeEnd.toISOString(),
        guests: Number(guests),
        totalPrice: hotel.pricePerNight * nightsCount,
        hotelId: String(hotel._id || hotel.id),
        latitude: hotel.coordinates?.lat,
        longitude: hotel.coordinates?.lng,
        budget: {
          totalLimit: hotel.pricePerNight * nightsCount + 1000,
          currency: "USD",
        },
      });

      if (response.data?._id) router.push(`/planner/${response.data._id}`);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Booking failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card-bg border border-border-subtle rounded-3xl p-6 shadow-2xs space-y-6 text-left relative">
      <div className="flex items-baseline justify-between border-b border-border-subtle pb-4">
        <div>
          <span className="font-headline text-2xl font-extrabold text-primary">
            ${hotel.pricePerNight.toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-text-muted">
            {" "}
            / night
          </span>
        </div>
      </div>

      <form onSubmit={handleBooking} className="space-y-4">
        {errorMessage && (
          <div className="text-[11px] font-semibold text-red-500 bg-red-50/50 p-2.5 rounded-xl text-center">
            {errorMessage}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold tracking-wider text-text-muted uppercase block pl-1">
            Sanctuary Dates
          </label>
          <button
            type="button"
            onClick={() => setIsCalendarOpen(true)}
            className="w-full bg-neutral-bg border border-border-subtle hover:border-primary rounded-xl px-4 py-3 text-xs font-bold text-primary flex items-center justify-between transition-all text-left cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <CalendarIcon className="w-4 h-4 text-text-muted" />
              <span>
                {rangeStart && rangeEnd
                  ? `${formatDisplayDate(rangeStart)} — ${formatDisplayDate(rangeEnd)}`
                  : rangeStart
                    ? `${formatDisplayDate(rangeStart)} — Select Check-Out`
                    : "Select Travel Dates"}
              </span>
            </div>
          </button>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold tracking-wider text-text-muted uppercase block pl-1">
            Guests
          </label>
          <div className="relative">
            <Users className="w-4 h-4 text-text-muted absolute top-1/2 -translate-y-1/2 pointer-events-none left-3" />
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full bg-neutral-bg border border-border-subtle rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold text-primary focus:outline-none focus:border-secondary transition-colors appearance-none cursor-pointer"
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
          disabled={isSubmitting || !rangeStart || !rangeEnd}
          className="w-full py-3.5 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-xl transition-all shadow-xs tracking-wider uppercase cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99] border-none"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Book This Sanctuary</span>
            </>
          )}
        </button>
      </form>

      <div className="pt-2 flex items-center gap-2.5 justify-center text-[11px] font-medium text-text-muted border-t border-border-subtle">
        <ShieldCheck className="w-4 h-4 text-text-muted opacity-80" />
        <span>Bespoke Concierge Protection Included</span>
      </div>

      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        onDatesSelect={(start, end) => {
          setRangeStart(start);
          setRangeEnd(end);
        }}
      />
    </div>
  );
}
