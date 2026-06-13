"use client";

import { destinationService } from "@/services/destinationService";
import { RotateCcw, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const RATING_OPTIONS = [4.9, 4.8, 4.5, 4.0];

interface FilterSidebarProps {
  onFilterChange: (filters: {
    minPrice: number;
    maxPrice: number;
    rating: number | null;
    propertyTypes: string[];
  }) => void;
}

export default function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);

  const sliderMin = 0;
  const sliderMax = 3200;

  const [minPrice, setMinPrice] = useState(200);
  const [maxPrice, setMaxPrice] = useState(1200);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const types = await destinationService.getPropertyTypes();
        setPropertyTypes(types);
      } catch (err) {
        console.error("Failed to load property types:", err);
      }
    };
    fetchTypes();
  }, []);

  useEffect(() => {
    onFilterChange({
      minPrice,
      maxPrice,
      rating: selectedRating,
      propertyTypes: selectedTypes,
    });
  }, [minPrice, maxPrice, selectedRating, selectedTypes]);

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
      if (newMin < maxPrice && newMin >= sliderMin) setMinPrice(newMin);
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
      if (newMax > minPrice && newMax <= sliderMax) setMaxPrice(newMax);
    };
    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const togglePropertyType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleReset = () => {
    setMinPrice(200);
    setMaxPrice(1200);
    setSelectedRating(null);
    setSelectedTypes([]);
  };

  const minPercent = ((minPrice - sliderMin) / (sliderMax - sliderMin)) * 100;
  const maxPercent = ((maxPrice - sliderMin) / (sliderMax - sliderMin)) * 100;

  return (
    <aside className="w-72 shrink-0 space-y-7 text-left font-body text-primary bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-primary font-headline">
          Filters
        </h3>
      </div>

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
            className="absolute top-0.5 h-4 w-4 cursor-pointer rounded-full border-2 border-secondary bg-white shadow-xs -ml-2"
            style={{ left: `${minPercent}%` }}
          />
          <div
            onMouseDown={handleMaxMouseDown}
            className="absolute top-0.5 h-4 w-4 cursor-pointer rounded-full border-2 border-secondary bg-white shadow-xs -ml-2"
            style={{ left: `${maxPercent}%` }}
          />
        </div>
        <div className="flex justify-between pt-1 text-[11px] font-bold text-slate-500 font-headline">
          <span>${minPrice.toLocaleString()}</span>
          <span>
            $
            {maxPrice >= sliderMax
              ? `${sliderMax.toLocaleString()}+`
              : maxPrice.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold text-slate-700">Property Rating</p>
        <div className="flex flex-wrap gap-1.5">
          {RATING_OPTIONS.map((num) => {
            const active = selectedRating === num;
            return (
              <button
                key={num}
                type="button"
                onClick={() => setSelectedRating(active ? null : num)}
                className={`flex h-10 w-11 cursor-pointer flex-col items-center justify-center rounded-xl border text-xs font-bold transition-all duration-200 ${
                  active
                    ? "border-secondary/60 bg-secondary/10 text-primary"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                }`}
              >
                <span>{num.toFixed(1)}</span>
                <Star
                  className={`h-2.5 w-2.5 ${active ? "fill-secondary text-secondary" : "fill-slate-300 text-slate-300"}`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3 border-t border-slate-100 pt-5">
        <p className="text-xs font-semibold text-slate-700">Property Type</p>
        <div className="flex flex-wrap gap-1.5 w-full">
          {propertyTypes.length === 0 ? (
            <span className="text-xs text-slate-400">Loading types...</span>
          ) : (
            propertyTypes.map((type) => {
              const active = selectedTypes.includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => togglePropertyType(type)}
                  className={`px-3 py-1.5 cursor-pointer rounded-xl border text-xs font-semibold transition-all duration-200 ${
                    active
                      ? "border-secondary/60 bg-secondary/10 text-primary font-bold shadow-xs"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-primary"
                  }`}
                >
                  {type}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 py-2.5 border border-red-100 bg-red-50/30 hover:bg-red-50 text-red-500 font-semibold text-xs rounded-xl transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear All Filters
        </button>
      </div>
    </aside>
  );
}
