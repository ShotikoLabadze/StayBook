"use client";

import { Car, Hotel, Plane, Plus, Sparkles, Utensils, X } from "lucide-react";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: any) => void;
  dayTitle: string;
}

export function AddActivityModal({
  isOpen,
  onClose,
  onSave,
  dayTitle,
}: AddActivityModalProps) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("activity");

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const newActivity = {
      id: `act-${nanoid(6)}`,
      title,
      time: time || undefined,
      note: note || undefined,
      category,
      cost: 0,
      location: {
        name: "Selected Destination Location",
        lat: 41.7151,
        lng: 44.8271,
      },
    };

    onSave(newActivity);

    setTitle("");
    setTime("");
    setNote("");
    setCategory("activity");
    onClose();
  }

  const renderCategoryIcon = () => {
    switch (category) {
      case "activity":
        return <Sparkles className="h-4 w-4 text-slate-500 shrink-0" />;
      case "flight":
        return <Plane className="h-4 w-4 text-slate-500 shrink-0" />;
      case "hotel":
        return <Hotel className="h-4 w-4 text-slate-500 shrink-0" />;
      case "food":
        return <Utensils className="h-4 w-4 text-slate-500 shrink-0" />;
      case "transport":
        return <Car className="h-4 w-4 text-slate-500 shrink-0" />;
      default:
        return <Sparkles className="h-4 w-4 text-slate-500 shrink-0" />;
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-md p-6 rounded-2xl border border-slate-100 shadow-2xl z-50 text-left animate-in fade-in zoom-in-95 duration-150">
        <header className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Add New Plan</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Adding item to: {dayTitle}
            </p>
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
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Activity Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Dinner at Ristorante Bruno"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-primary transition-colors text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Category
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 pointer-events-none">
                  {renderCategoryIcon()}
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs font-medium outline-none focus:border-primary transition-colors text-slate-700 h-[34px] cursor-pointer appearance-none"
                >
                  <option value="activity">Activity</option>
                  <option value="flight">Flight</option>
                  <option value="hotel">Hotel</option>
                  <option value="food">Dining</option>
                  <option value="transport">Transport</option>
                </select>

                <div className="absolute right-3 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-400 w-0 h-0" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Time (Optional)
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g., 20:30"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-primary transition-colors text-slate-800 h-[34px]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Notes / Details
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any specific confirmation numbers, dress codes or tips..."
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-primary transition-colors text-slate-800 resize-none"
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
              Save Plan
            </button>
          </footer>
        </form>
      </div>
    </div>,
    document.body,
  );
}
