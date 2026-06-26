"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  onDatesSelect: (start: Date | null, end: Date | null) => void;
}

export function CalendarModal({
  isOpen,
  onClose,
  rangeStart,
  rangeEnd,
  onDatesSelect,
}: CalendarModalProps) {
  const [mounted, setMounted] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

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
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

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
      onDatesSelect(date, null);
    } else if (rangeStart && !rangeEnd) {
      if (date < rangeStart) {
        onDatesSelect(date, null);
      } else {
        onDatesSelect(rangeStart, date);
      }
    }
  };

  const changeMonth = (offset: number) => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1),
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md overflow-y-auto font-body select-none">
      <div className="bg-card-bg border border-border-subtle rounded-3xl max-w-2xl w-full shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200 text-left text-primary">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <h4 className="text-xs font-bold text-primary uppercase tracking-wider">
            Select Luxury Timeline
          </h4>
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-primary p-1.5 rounded-xl hover:bg-neutral-bg cursor-pointer border-none bg-transparent outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative select-none bg-neutral-bg/40 p-4 rounded-2xl border border-border-subtle">
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
                className="text-text-muted hover:text-primary cursor-pointer p-1 rounded-lg hover:bg-card-bg border-none bg-transparent"
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
                const isEnd = rangeEnd && isSameDay(currentDayDate, rangeEnd);
                const inRange = isDayInRange(currentDayDate);

                return (
                  <button
                    type="button"
                    key={`m1-${day}`}
                    disabled={isPast}
                    onClick={() => handleDayClick(currentDayDate)}
                    className={`py-1.5 text-xs transition-all relative cursor-pointer outline-none ${
                      isStart || isEnd
                        ? "bg-primary text-white dark:text-neutral-bg font-bold rounded-md z-10 shadow-3xs border-none"
                        : inRange
                          ? "bg-primary/10 text-primary font-semibold rounded-none border-none"
                          : isPast
                            ? "text-text-muted opacity-30 pointer-events-none border-none"
                            : "text-primary hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-md border-none"
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
                className="text-text-muted hover:text-primary cursor-pointer p-1 rounded-lg hover:bg-card-bg border-none bg-transparent"
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
                const isEnd = rangeEnd && isSameDay(currentDayDate, rangeEnd);
                const inRange = isDayInRange(currentDayDate);

                return (
                  <button
                    type="button"
                    key={`m2-${day}`}
                    disabled={isPast}
                    onClick={() => handleDayClick(currentDayDate)}
                    className={`py-1.5 text-xs transition-all relative cursor-pointer outline-none ${
                      isStart || isEnd
                        ? "bg-primary text-white dark:text-neutral-bg font-bold rounded-md z-10 shadow-3xs border-none"
                        : inRange
                          ? "bg-primary/10 text-primary font-semibold rounded-none border-none"
                          : isPast
                            ? "text-text-muted opacity-30 pointer-events-none border-none"
                            : "text-primary hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-md border-none"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            disabled={!rangeStart || !rangeEnd}
            onClick={onClose}
            className="px-5 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-40 border-none outline-none"
          >
            Apply Dates
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
