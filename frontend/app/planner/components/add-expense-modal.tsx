"use client";

import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dayIndex: number, newExpense: any) => void;
  totalDays: number;
}

export function AddExpenseModal({
  isOpen,
  onClose,
  onSave,
  totalDays,
}: AddExpenseModalProps) {
  const [category, setCategory] = useState("hotel");
  const [date, setDate] = useState("2026-06-19");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [note, setNote] = useState("");
  const [dayIndex, setDayIndex] = useState(0);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    const newExpenseActivity = {
      title: note.trim() || `Expense: ${category.toUpperCase()}`,
      category: category,
      cost: Number(amount),
      time: "00:00",
      note: `Logged as separate expense (${currency})`,
      location: {
        name: "Logged Expense Location",
        lat: 41.8902,
        lng: 12.4922,
      },
    };

    onSave(dayIndex, newExpenseActivity);
    setAmount("");
    setNote("");
    onClose();
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-md p-6 rounded-2xl border border-slate-100 shadow-2xl z-50 text-left animate-in fade-in zoom-in-95 duration-150">
        <header className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Log a new expense
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors border-none bg-transparent outline-none cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-primary transition-colors text-slate-700 h-[34px]"
              >
                <option value="hotel">🏨 Hotels</option>
                <option value="flight">✈️ Flights</option>
                <option value="food">🍽️ Dining</option>
                <option value="activity">✨ Activities</option>
                <option value="transport">🚗 Transport</option>
                <option value="other">📍 Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-primary transition-colors text-slate-800 h-[34px]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Assign to Trip Day
            </label>
            <select
              value={dayIndex}
              onChange={(e) => setDayIndex(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-primary transition-colors text-slate-700 h-[34px]"
            >
              {Array.from({ length: totalDays }).map((_, idx) => (
                <option key={idx} value={idx}>
                  Day {idx + 1} Schedule
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Amount
              </label>
              <input
                type="text"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-primary transition-colors text-slate-800"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-primary transition-colors text-slate-700 h-[34px]"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GEL">GEL</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Note
            </label>
            <input
              type="text"
              placeholder="e.g., Sunset dinner at Selene"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-primary transition-colors text-slate-800"
            />
          </div>

          <footer className="flex items-center justify-end gap-2 border-t border-slate-50 pt-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors bg-transparent border-none cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1 px-4 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-xl transition-all shadow-xs border-none cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
              Save Expense
            </button>
          </footer>
        </form>
      </div>
    </div>,
    document.body,
  );
}
