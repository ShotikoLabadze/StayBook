"use client";

import { Star } from "lucide-react";
import { useRef, useState } from "react";

export default function FilterSidebar() {
  const amenities = [
    { id: "pool", label: "Infinity Pool", checked: true },
    { id: "view", label: "Ocean View", checked: false },
    { id: "butler", label: "Private Butler", checked: true },
    { id: "spa", label: "Spa & Wellness", checked: false },
  ];

  const neighborhoods = [
    { id: "oia", label: "Oia Village", checked: true },
    { id: "imerovigli", label: "Imerovigli", checked: false },
    { id: "fira", label: "Fira Center", checked: false },
  ];

  const [selectedRating, setSelectedRating] = useState(5);

  const [minPrice, setMinPrice] = useState(200);
  const [maxPrice, setMaxPrice] = useState(1200);

  const sliderMin = 0;
  const sliderMax = 2000;

  const sliderRef = useRef<HTMLDivElement>(null);

  const convertPosToPrice = (clientX: number) => {
    if (!sliderRef.current) return 0;
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(
      0,
      Math.min(1, (clientX - rect.left) / rect.width),
    );
    const rawPrice = sliderMin + percentage * (sliderMax - sliderMin);
    return Math.round(rawPrice / 50) * 50;
  };

  const handleMinMouseDown = () => {
    const handleMouseMove = (e: MouseEvent) => {
      const newMin = convertPosToPrice(e.clientX);
      if (newMin < maxPrice && newMin >= sliderMin) {
        setMinPrice(newMin);
      }
    };
    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMaxMouseDown = () => {
    const handleMouseMove = (e: MouseEvent) => {
      const newMax = convertPosToPrice(e.clientX);
      if (newMax > minPrice && newMax <= sliderMax) {
        setMaxPrice(newMax);
      }
    };
    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const minPercent = ((minPrice - sliderMin) / (sliderMax - sliderMin)) * 100;
  const maxPercent = ((maxPrice - sliderMin) / (sliderMax - sliderMin)) * 100;

  return (
    <aside className="w-56 shrink-0 space-y-7 text-left">
      <h3 className="text-sm font-bold uppercase tracking-wider text-primary font-headline">
        Filters
      </h3>

      <div className="space-y-3">
        <p className="text-xs font-semibold text-slate-700">
          Price Range (per night)
        </p>

        <div ref={sliderRef} className="relative px-1 pt-2 h-5 select-none">
          <div className="h-1 w-full rounded-full bg-slate-100" />

          <div
            className="absolute h-1 rounded-full bg-secondary top-2"
            style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
          />

          <div
            onMouseDown={handleMinMouseDown}
            className="absolute top-0.5 h-4 w-4 cursor-pointer rounded-full border-2 border-secondary bg-white shadow-xs -ml-2 active:scale-110 transition-transform touch-none"
            style={{ left: `${minPercent}%` }}
          />

          <div
            onMouseDown={handleMaxMouseDown}
            className="absolute top-0.5 h-4 w-4 cursor-pointer rounded-full border-2 border-secondary bg-white shadow-xs -ml-2 active:scale-110 transition-transform touch-none"
            style={{ left: `${maxPercent}%` }}
          />
        </div>

        <div className="flex justify-between pt-1 text-[11px] font-bold text-slate-500">
          <span>${minPrice.toLocaleString()}</span>
          <span>
            $
            {maxPrice >= sliderMax
              ? `${sliderMax.toLocaleString()}+`
              : `${maxPrice.toLocaleString()}`}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold text-slate-700">Property Rating</p>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((num) => {
            const active = num === selectedRating;
            return (
              <button
                key={num}
                type="button"
                onClick={() => setSelectedRating(num)}
                className={`flex h-10 w-9 cursor-pointer flex-col items-center justify-center rounded-xl border text-xs font-bold transition-all ${
                  active
                    ? "border-secondary/60 bg-secondary/10 text-primary"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                }`}
              >
                <span>{num}</span>
                <Star
                  className={`h-2.5 w-2.5 ${
                    active
                      ? "fill-secondary text-secondary"
                      : "fill-slate-300 text-slate-300"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold text-slate-700">Amenities</p>
        <div className="space-y-2.5">
          {amenities.map((item) => (
            <label
              key={item.id}
              className="flex cursor-pointer select-none items-center gap-2.5 text-xs font-semibold text-slate-600 hover:text-primary transition-colors"
            >
              <input
                type="checkbox"
                defaultChecked={item.checked}
                className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-secondary focus:ring-secondary/20"
              />
              {item.label}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3 border-t border-slate-100 pt-5">
        <p className="text-xs font-semibold text-slate-700">Neighborhood</p>
        <div className="space-y-2.5">
          {neighborhoods.map((item) => (
            <label
              key={item.id}
              className="flex cursor-pointer select-none items-center gap-2.5 text-xs font-semibold text-slate-600 hover:text-primary transition-colors"
            >
              <input
                type="radio"
                name="neighborhood"
                defaultChecked={item.checked}
                className="h-4 w-4 cursor-pointer accent-secondary focus:ring-secondary/20"
              />
              {item.label}
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
