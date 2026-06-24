"use client";

import { destinationService } from "@/services/destinationService";
import { RotateCcw, Star, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const RATING_OPTIONS = [4.9, 4.7, 4.5, 4.0];

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange: (filters: {
    categories: string[];
    minPrice: number;
    maxPrice: number;
    rating: number | null;
    weather: string[];
    durations: string[];
    activities: string[];
    propertyTypes: string[];
  }) => void;
}

export default function FilterSidebar({
  isOpen,
  onClose,
  onFilterChange,
}: FilterSidebarProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [weatherConditions, setWeatherConditions] = useState<string[]>([]);
  const [durations, setDurations] = useState<string[]>([]);
  const [activities, setActivities] = useState<string[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(480);
  const [maxPrice, setMaxPrice] = useState(2450);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedWeather, setSelectedWeather] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const sliderMin = 0;
  const sliderMax = 3200;
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAllFilterTags = async () => {
      try {
        const [cats, weather, durs, acts, types] = await Promise.all([
          destinationService.getCategories(),
          destinationService.getWeatherConditions(),
          destinationService.getDurations(),
          destinationService.getActivities(),
          destinationService.getPropertyTypes(),
        ]);
        setCategories(cats);
        setWeatherConditions(weather);
        setDurations(durs);
        setActivities(acts);
        setPropertyTypes(types);
      } catch (err) {
        console.error("Failed to load filter tags:", err);
      }
    };
    fetchAllFilterTags();
  }, []);

  useEffect(() => {
    onFilterChange({
      categories: selectedCategories,
      minPrice,
      maxPrice,
      rating: selectedRating,
      weather: selectedWeather,
      durations: selectedDurations,
      activities: selectedActivities,
      propertyTypes: selectedTypes,
    });
  }, [
    selectedCategories,
    minPrice,
    maxPrice,
    selectedRating,
    selectedWeather,
    selectedDurations,
    selectedActivities,
    selectedTypes,
  ]);

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

  const toggleFilter = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    value: string,
  ) => {
    setList((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setMinPrice(480);
    setMaxPrice(2450);
    setSelectedRating(null);
    setSelectedWeather([]);
    setSelectedDurations([]);
    setSelectedActivities([]);
    setSelectedTypes([]);
  };

  const minPercent = ((minPrice - sliderMin) / (sliderMax - sliderMin)) * 100;
  const maxPercent = ((maxPrice - sliderMin) / (sliderMax - sliderMin)) * 100;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`w-74 shrink-0 overflow-y-auto space-y-7 text-left font-body text-primary bg-card-bg border border-border-subtle p-5 rounded-3xl shadow-sm transition-transform duration-300 ease-in-out fixed lg:sticky top-0 bottom-0 lg:top-24 z-50 lg:z-0 right-0 h-full lg:h-fit ${
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border-subtle pb-2 lg:border-none lg:pb-0">
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary font-headline">
            Filters
          </h3>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-primary transition-colors lg:hidden p-1 rounded-lg hover:bg-neutral-bg"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold text-primary">Category</p>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => {
              const active = selectedCategories.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() =>
                    toggleFilter(selectedCategories, setSelectedCategories, cat)
                  }
                  className={`px-3 py-1.5 cursor-pointer rounded-xl border text-xs font-semibold transition-all duration-200 ${
                    active
                      ? "border-secondary/60 bg-secondary/10 text-primary font-bold"
                      : "border-border-subtle bg-neutral-bg text-text-muted hover:border-slate-300 dark:hover:border-slate-600 hover:text-primary"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 border-t border-border-subtle pt-5">
          <p className="text-xs font-semibold text-primary">
            Price Range (per night)
          </p>
          <div ref={sliderRef} className="relative px-1 pt-2 h-5 select-none">
            <div className="h-1 w-full rounded-full bg-neutral-bg" />
            <div
              className="absolute h-1 rounded-full bg-secondary top-2"
              style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
            />
            <div
              onMouseDown={handleMinMouseDown}
              className="absolute top-0.5 h-4 w-4 cursor-pointer rounded-full border-2 border-secondary bg-card-bg shadow-xs -ml-2"
              style={{ left: `${minPercent}%` }}
            />
            <div
              onMouseDown={handleMaxMouseDown}
              className="absolute top-0.5 h-4 w-4 cursor-pointer rounded-full border-2 border-secondary bg-card-bg shadow-xs -ml-2"
              style={{ left: `${maxPercent}%` }}
            />
          </div>
          <div className="flex justify-between pt-1 text-[11px] font-bold text-text-muted font-headline">
            <span>${minPrice.toLocaleString()}</span>
            <span>
              $
              {maxPrice >= sliderMax
                ? `${sliderMax.toLocaleString()}+`
                : maxPrice.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="space-y-3 border-t border-border-subtle pt-5">
          <p className="text-xs font-semibold text-primary">Property Rating</p>
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
                      : "border-border-subtle bg-neutral-bg text-text-muted hover:border-slate-300 dark:hover:border-slate-600 hover:text-primary"
                  }`}
                >
                  <span>{num.toFixed(1)}+</span>
                  <Star
                    className={`h-2.5 w-2.5 ${active ? "fill-secondary text-secondary" : "fill-slate-300 dark:fill-slate-600 text-slate-300 dark:text-slate-600"}`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 border-t border-border-subtle pt-5">
          <p className="text-xs font-semibold text-primary">Weather</p>
          <div className="flex flex-wrap gap-1.5">
            {weatherConditions.map((cond) => {
              const active = selectedWeather.includes(cond);
              return (
                <button
                  key={cond}
                  type="button"
                  onClick={() =>
                    toggleFilter(selectedWeather, setSelectedWeather, cond)
                  }
                  className={`px-3 py-1.5 cursor-pointer rounded-xl border text-xs font-semibold transition-all duration-200 ${
                    active
                      ? "border-secondary/60 bg-secondary/10 text-primary font-bold"
                      : "border-border-subtle bg-neutral-bg text-text-muted hover:border-slate-300 dark:hover:border-slate-600 hover:text-primary"
                  }`}
                >
                  {cond}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 border-t border-border-subtle pt-5">
          <p className="text-xs font-semibold text-primary">Duration</p>
          <div className="flex flex-wrap gap-1.5">
            {durations.map((dur) => {
              const active = selectedDurations.includes(dur);
              return (
                <button
                  key={dur}
                  type="button"
                  onClick={() =>
                    toggleFilter(selectedDurations, setSelectedDurations, dur)
                  }
                  className={`px-3 py-1.5 cursor-pointer rounded-xl border text-xs font-semibold transition-all duration-200 ${
                    active
                      ? "border-secondary/60 bg-secondary/10 text-primary font-bold"
                      : "border-border-subtle bg-neutral-bg text-text-muted hover:border-slate-300 dark:hover:border-slate-600 hover:text-primary"
                  }`}
                >
                  {dur}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 border-t border-border-subtle pt-5">
          <p className="text-xs font-semibold text-primary">Activities</p>
          <div className="flex flex-wrap gap-1.5">
            {activities.map((act) => {
              const active = selectedActivities.includes(act);
              return (
                <button
                  key={act}
                  type="button"
                  onClick={() =>
                    toggleFilter(selectedActivities, setSelectedActivities, act)
                  }
                  className={`px-3 py-1.5 cursor-pointer rounded-xl border text-xs font-semibold transition-all duration-200 ${
                    active
                      ? "border-secondary/60 bg-secondary/10 text-primary font-bold"
                      : "border-border-subtle bg-neutral-bg text-text-muted hover:border-slate-300 dark:hover:border-slate-600 hover:text-primary"
                  }`}
                >
                  {act}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 border-t border-border-subtle pt-5">
          <p className="text-xs font-semibold text-primary">Property Type</p>
          <div className="flex flex-wrap gap-1.5 w-full">
            {propertyTypes.map((type) => {
              const active = selectedTypes.includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    toggleFilter(selectedTypes, setSelectedTypes, type)
                  }
                  className={`px-3 py-1.5 cursor-pointer rounded-xl border text-xs font-semibold transition-all duration-200 ${
                    active
                      ? "border-secondary/60 bg-secondary/10 text-primary font-bold shadow-xs"
                      : "border-border-subtle bg-neutral-bg text-text-muted hover:border-slate-300 dark:hover:border-slate-600 hover:text-primary"
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-border-subtle pt-4">
          <button
            type="button"
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 py-2.5 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 font-semibold text-xs rounded-xl transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear All Filters
          </button>
        </div>
      </aside>
    </>
  );
}
