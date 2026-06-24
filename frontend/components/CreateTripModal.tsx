"use client";

import { destinationService, Hotel } from "@/services/destinationService";
import { tripService } from "@/services/tripService";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTripModal({
  isOpen,
  onClose,
}: CreateTripModalProps) {
  const router = useRouter();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("4000");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [rangeStart, setRangeStart] = useState<Date | null>(today);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);

  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const nextMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    1,
  );

  useEffect(() => {
    if (isOpen) {
      destinationService
        .getHotelsByDestination("all")
        .then((data) => {
          setHotels(data);
          if (data.length > 0) {
            setSelectedHotel(data[0]);
            setTitle(`Escape to ${data[0].name}`);
          }
        })
        .catch((err) => console.error("Failed to load hotels for modal:", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOffset = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const isDayInRange = (date: Date) => {
    if (!rangeStart || !rangeEnd) return false;
    return date >= rangeStart && date <= rangeEnd;
  };

  const handleDayClick = (date: Date) => {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(date);
      setRangeEnd(null);
    } else if (rangeStart && !rangeEnd) {
      if (date < rangeStart) {
        setRangeStart(date);
      } else {
        setRangeEnd(date);
      }
    }
  };

  const formatDisplayDate = (date: Date | null) => {
    if (!date) return "...";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHotel || !title || !rangeStart || !rangeEnd) return;

    try {
      setIsSubmitting(true);

      const payload = {
        title: title,
        destination: selectedHotel.neighborhood || selectedHotel.name,
        startDate: rangeStart.toISOString().split("T")[0],
        endDate: rangeEnd.toISOString().split("T")[0],
        budget: {
          totalLimit: Number(budget),
          currency: selectedHotel.currency || "USD",
        },
      };

      const createdTrip = await tripService.create(payload);

      onClose();

      router.push(`/planner/${createdTrip._id}`);
    } catch (err) {
      console.error("Failed to spin up a new luxury trip architecture:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const changeMonth = (offset: number) => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1),
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto font-body select-none">
      <div className="bg-card-bg border border-border-subtle rounded-3xl max-w-3xl w-full text-primary shadow-xl overflow-hidden my-8 transition-all">
        <div className="p-6 border-b border-border-subtle flex items-center justify-between">
          <div>
            <h2 className="font-headline text-base font-bold text-primary">
              Plan a new trip
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Pick a sanctuary hotel, set your dates and budget limit.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-primary transition-colors p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleCreateTrip} className="p-6 space-y-6 text-left">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
              Available Sanctuaries
            </label>
            <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-slate-200 snap-x">
              {hotels.map((hotel) => {
                const isSelected =
                  selectedHotel?._id === hotel._id ||
                  selectedHotel?.id === hotel.id;
                return (
                  <div
                    key={hotel._id || hotel.id}
                    onClick={() => {
                      setSelectedHotel(hotel);
                      setTitle(`Escape to ${hotel.name}`);
                    }}
                    className={`min-w-[200px] max-w-[200px] snap-start rounded-2xl overflow-hidden cursor-pointer border-2 transition-all bg-card-bg shadow-3xs ${
                      isSelected
                        ? "border-primary scale-[0.98] ring-4 ring-primary/5"
                        : "border-border-subtle opacity-75 hover:opacity-100"
                    }`}
                  >
                    <div className="relative aspect-[4/3] w-full bg-neutral-bg">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-card-bg/90 backdrop-blur-xs px-2 py-0.5 rounded-md text-[9px] font-bold text-primary shadow-3xs">
                        ${hotel.pricePerNight}/n
                      </div>
                    </div>
                    <div className="p-3 space-y-0.5">
                      <p className="text-xs font-bold text-primary truncate">
                        {hotel.name}
                      </p>
                      <p className="text-[10px] text-text-muted font-medium truncate">
                        {hotel.neighborhood}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                Trip title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Luxury Honeymoon in Kyoto"
                className="w-full px-4 py-2.5 bg-neutral-bg border border-border-subtle rounded-xl text-xs font-medium focus:outline-none focus:border-primary transition-all text-primary placeholder:text-text-muted"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                Budget (USD)
              </label>
              <div className="relative">
                <DollarSign className="w-3.5 h-3.5 text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  required
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-neutral-bg border border-border-subtle rounded-xl text-xs font-medium focus:outline-none focus:border-primary transition-all text-primary"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                <CalendarIcon className="w-3.5 h-3.5 text-text-muted" />
                <span>Dates</span>
              </div>
              <span className="text-[11px] font-bold text-primary bg-neutral-bg border border-border-subtle px-2.5 py-1 rounded-md transition-all">
                {formatDisplayDate(rangeStart)} → {formatDisplayDate(rangeEnd)}
              </span>
            </div>

            <div className="border border-border-subtle rounded-2xl p-4 bg-neutral-bg grid grid-cols-1 md:grid-cols-2 gap-8 relative">
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-primary">
                    {currentMonth.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <button
                    type="button"
                    onClick={() => changeMonth(-1)}
                    className="text-text-muted hover:text-primary cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-y-1 text-center text-[10px] font-semibold text-text-muted">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                    <span key={d} className="py-1">
                      {d}
                    </span>
                  ))}
                  {[...Array(getFirstDayOffset(currentMonth))].map((_, i) => (
                    <span key={`empty-1-${i}`} />
                  ))}
                  {[...Array(getDaysInMonth(currentMonth))].map((_, i) => {
                    const day = i + 1;
                    const currentDayDate = new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth(),
                      day,
                    );
                    const isPast = currentDayDate < today;

                    const isStart =
                      rangeStart && isSameDay(currentDayDate, rangeStart);
                    const isEnd =
                      rangeEnd && isSameDay(currentDayDate, rangeEnd);
                    const inRange = isDayInRange(currentDayDate);

                    return (
                      <button
                        type="button"
                        key={`m1-${day}`}
                        disabled={isPast}
                        onClick={() => handleDayClick(currentDayDate)}
                        className={`py-1.5 text-xs transition-all relative cursor-pointer outline-none ${
                          isStart || isEnd
                            ? "bg-primary text-white dark:text-neutral-bg font-bold rounded-md z-10 shadow-3xs"
                            : inRange
                              ? "bg-primary/10 text-primary font-semibold rounded-none"
                              : isPast
                                ? "text-text-muted opacity-30 pointer-events-none"
                                : "text-primary hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-md"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-primary">
                    {nextMonth.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <button
                    type="button"
                    onClick={() => changeMonth(1)}
                    className="text-text-muted hover:text-primary cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-y-1 text-center text-[10px] font-semibold text-text-muted">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                    <span key={d} className="py-1">
                      {d}
                    </span>
                  ))}
                  {[...Array(getFirstDayOffset(nextMonth))].map((_, i) => (
                    <span key={`empty-2-${i}`} />
                  ))}
                  {[...Array(getDaysInMonth(nextMonth))].map((_, i) => {
                    const day = i + 1;
                    const currentDayDate = new Date(
                      nextMonth.getFullYear(),
                      nextMonth.getMonth(),
                      day,
                    );
                    const isPast = currentDayDate < today;

                    const isStart =
                      rangeStart && isSameDay(currentDayDate, rangeStart);
                    const isEnd =
                      rangeEnd && isSameDay(currentDayDate, rangeEnd);
                    const inRange = isDayInRange(currentDayDate);

                    return (
                      <button
                        type="button"
                        key={`m2-${day}`}
                        disabled={isPast}
                        onClick={() => handleDayClick(currentDayDate)}
                        className={`py-1.5 text-xs transition-all relative cursor-pointer outline-none ${
                          isStart || isEnd
                            ? "bg-primary text-white dark:text-neutral-bg font-bold rounded-md z-10 shadow-3xs"
                            : inRange
                              ? "bg-primary/10 text-primary font-semibold rounded-none"
                              : isPast
                                ? "text-text-muted opacity-30 pointer-events-none"
                                : "text-primary hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-md"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border-subtle pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-neutral-bg hover:bg-slate-100 dark:hover:bg-slate-800 text-text-muted hover:text-primary text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isSubmitting || !selectedHotel || !rangeStart || !rangeEnd
              }
              className="px-5 py-2 bg-primary hover:bg-primary/95 dark:bg-secondary dark:hover:bg-secondary/90 text-white dark:text-neutral-bg text-xs font-bold rounded-xl transition-all shadow-sm active:scale-[0.98] disabled:opacity-40 cursor-pointer"
            >
              {isSubmitting ? "Creating space..." : "Create trip"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
