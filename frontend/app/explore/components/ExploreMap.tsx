"use client";

import { Hotel } from "@/services/destinationService";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

interface ExploreMapProps {
  hotels: Hotel[];
}

function MapController({ hotels }: { hotels: Hotel[] }) {
  const map = useMap();

  useEffect(() => {
    if (hotels.length > 0) {
      const validCoordinates = hotels
        .filter((h) => h.coordinates && h.coordinates.lat && h.coordinates.lng)
        .map(
          (h) => [h.coordinates.lat, h.coordinates.lng] as L.LatLngExpression,
        );

      if (validCoordinates.length > 0) {
        const bounds = L.latLngBounds(validCoordinates);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
      }
    }
  }, [hotels, map]);

  return null;
}

export default function ExploreMap({ hotels }: ExploreMapProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tileUrl =
    mounted && theme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <div className="w-full h-[650px] rounded-3xl overflow-hidden border border-border-subtle shadow-sm relative z-10 bg-card-bg transition-colors duration-300">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={tileUrl}
        />

        {hotels.map((hotel) => {
          if (
            !hotel.coordinates ||
            !hotel.coordinates.lat ||
            !hotel.coordinates.lng
          )
            return null;

          const displayPrice =
            hotel.pricePerNight >= 1000
              ? `$${(hotel.pricePerNight / 1000).toFixed(1).replace(".0", "")}k`
              : `$${hotel.pricePerNight}`;

          const customIcon = L.divIcon({
            className: "custom-price-marker",
            html: `
              <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-[11px] font-bold px-2.5 py-1.5 rounded-xl shadow-xs whitespace-nowrap hover:border-sky-500 dark:hover:border-sky-400 hover:text-sky-500 dark:hover:text-sky-400 transition-all duration-200 cursor-pointer">
                ${displayPrice}
              </div>
            `,
            iconSize: [60, 30],
            iconAnchor: [30, 15],
          });

          return (
            <Marker
              key={hotel._id}
              position={[hotel.coordinates.lat, hotel.coordinates.lng]}
              icon={customIcon}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-2 space-y-2 max-w-[200px] font-body text-primary">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-24 object-cover rounded-xl"
                  />
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-xs font-headline truncate text-primary">
                      {hotel.name}
                    </h4>
                    <p className="text-[10px] text-text-muted font-medium truncate">
                      {hotel.neighborhood}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-bold text-secondary">
                        ${hotel.pricePerNight}/night
                      </span>
                      <span className="text-[10px] font-bold text-amber-500 flex items-center gap-0.5">
                        ★ {hotel.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <MapController hotels={hotels} />
      </MapContainer>
    </div>
  );
}
