"use client";

import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-[248px] w-full max-w-sm rounded-3xl bg-slate-50 border border-slate-100/80 animate-pulse flex items-center justify-center text-xs text-slate-400">
      Loading Map Component...
    </div>
  ),
});

export default function MapPreview() {
  return <MapComponent />;
}
