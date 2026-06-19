"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Maximize2 } from "lucide-react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapComponent() {
  const position: [number, number] = [40.6491, 14.6124];

  return (
    <div className="bg-white border border-slate-100/80 rounded-3xl p-4 shadow-xs space-y-4 w-full max-w-sm">
      <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-100/50 z-0">
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={false}
          zoomControl={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <Marker position={position} icon={customIcon} />
        </MapContainer>

        <div className="absolute inset-0 bg-primary/5 pointer-events-none z-10" />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-md text-primary text-[10px] font-bold rounded-full shadow-sm hover:bg-white transition-all cursor-pointer pointer-events-auto">
            <Maximize2 className="w-3 h-3 stroke-[2.5]" /> Expand Map
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 text-left">
        <div className="space-y-0.5">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
            Upcoming Stop
          </p>
          <p className="text-xs font-bold text-primary">Ravello Viewpoint</p>
          <p className="text-[10px] text-slate-400 font-medium">
            Recommended for lunch on Day 3
          </p>
        </div>
        <span className="text-[10px] font-bold text-secondary bg-secondary/5 px-2 py-1 rounded-md shrink-0">
          45km away
        </span>
      </div>
    </div>
  );
}
