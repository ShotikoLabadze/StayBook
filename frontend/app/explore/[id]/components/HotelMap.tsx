"use client";

import { Hotel } from "@/services/destinationService";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

interface HotelMapProps {
  hotel: Hotel;
}

export default function HotelMap({ hotel }: HotelMapProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const position: [number, number] =
    hotel.coordinates && hotel.coordinates.lat && hotel.coordinates.lng
      ? [hotel.coordinates.lat, hotel.coordinates.lng]
      : [48.8566, 2.3522];

  const tileUrl =
    mounted && theme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  const customIcon = L.divIcon({
    className: "hotel-details-marker",
    html: `
      <div class="flex items-center justify-center w-8 h-8 bg-sky-500 dark:bg-amber-400 rounded-full border-2 border-white dark:border-slate-900 shadow-md text-white dark:text-slate-900 animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  return (
    <div className="bg-card-bg border border-border-subtle p-7 rounded-3xl shadow-2xs space-y-5 text-left transition-colors duration-300">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-primary">
          <MapPin className="w-4 h-4 text-secondary stroke-[2.5]" />
          <h3 className="font-headline text-lg font-bold tracking-tight">
            Location
          </h3>
        </div>
        <p className="text-xs font-medium text-text-muted">
          {hotel.neighborhood} — explore the surroundings of this sanctuary.
        </p>
      </div>

      <div className="w-full h-[280px] rounded-2xl overflow-hidden border border-border-subtle shadow-3xs relative z-10">
        <MapContainer
          center={position}
          zoom={14}
          className="w-full h-full"
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            url={tileUrl}
          />
          <Marker position={position} icon={customIcon}>
            <Popup>
              <div className="font-body text-xs font-bold text-slate-900 dark:text-slate-100 p-0.5">
                {hotel.name}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
