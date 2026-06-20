"use client";

import { MapPin, Navigation } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false },
);

interface Activity {
  id: string;
  title: string;
  time?: string;
  category: string;
  location?: {
    name: string;
    lat: number;
    lng: number;
  };
}

interface Day {
  dayNumber: number;
  title: string;
  date: string;
  activities: Activity[];
}

interface MapViewProps {
  itinerary: Day[];
}

export function MapView({ itinerary }: MapViewProps) {
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    import("leaflet").then((leafletInstance) => {
      import("leaflet/dist/leaflet.css" as any);

      const CustomIcon = leafletInstance.divIcon({
        className: "custom-map-marker",
        html: `<div class="w-7 h-7 bg-[#0f172a] rounded-full flex items-center justify-center shadow-md border-2 border-white transition-transform hover:scale-110">
                 <div class="w-2 h-2 bg-[#38bdf8] rounded-full animate-pulse"></div>
               </div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14],
      });

      leafletInstance.Marker.prototype.options.icon = CustomIcon;
      setL(leafletInstance);
    });
  }, []);

  const validLocations = itinerary
    .flatMap((d) => d.activities)
    .filter(
      (act) =>
        act.location &&
        typeof act.location.lat === "number" &&
        typeof act.location.lng === "number",
    );

  const mapCenter: [number, number] =
    validLocations.length > 0
      ? [validLocations[0].location!.lat, validLocations[0].location!.lng]
      : [41.8902, 12.4922];

  const polylinePositions = validLocations.map(
    (act) => [act.location!.lat, act.location!.lng] as [number, number],
  );

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-100/50 flex-1 flex flex-col lg:flex-row gap-6 min-h-[550px] w-full">
      <div className="w-full lg:w-80 flex flex-col gap-4 border-r border-slate-100 pr-0 lg:pr-6">
        <div className="text-left">
          <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Navigation className="h-4 w-4 text-primary" /> Route Itinerary
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Map viewpoints organized by day blocks.
          </p>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto max-h-[400px] pr-1 no-scrollbar">
          {itinerary.map((day) => (
            <div key={day.dayNumber} className="space-y-2">
              <div className="flex items-center gap-2 text-left bg-slate-50 p-2 rounded-xl border border-slate-100">
                <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold">
                  {day.dayNumber}
                </span>
                <span className="text-[11px] font-bold text-slate-700 truncate">
                  {day.title}
                </span>
              </div>

              <div className="pl-3 border-l-2 border-slate-100 space-y-1.5 text-left">
                {day.activities.map((act) => (
                  <div
                    key={act.id}
                    className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group"
                  >
                    <MapPin className="h-3 w-3 text-slate-400 group-hover:text-primary transition-colors" />
                    <span className="text-[11px] text-slate-600 font-medium truncate">
                      {act.title}
                    </span>
                  </div>
                ))}
                {day.activities.length === 0 && (
                  <p className="text-[10px] text-slate-400 italic pl-5">
                    No stops pinned.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl relative overflow-hidden min-h-[400px] z-0">
        {!L || validLocations.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto text-lg font-bold shadow-2xs mb-2">
              🗺️
            </div>
            <h4 className="text-xs font-bold text-slate-800">
              No Waypoint Coordinates Found
            </h4>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto mt-1">
              Add plans with real locations to visualize them interactively on
              the map.
            </p>
          </div>
        ) : (
          <MapContainer
            key={validLocations.length > 0 ? "loaded-map" : "empty-map"}
            center={mapCenter}
            zoom={14}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
            className="clean-map-container"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />

            {validLocations.map((act) => (
              <Marker
                key={act.id}
                position={[act.location!.lat, act.location!.lng]}
              >
                <Popup className="custom-map-popup">
                  <div className="text-xs font-body text-left p-1">
                    <p className="font-bold text-slate-900">{act.title}</p>
                    {act.time && (
                      <p className="text-primary font-bold mt-0.5">
                        🕒 {act.time}
                      </p>
                    )}
                    <p className="text-slate-400 text-[10px] mt-1 border-t border-slate-100 pt-1">
                      {act.location!.name}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {polylinePositions.length > 1 && (
              <Polyline
                positions={polylinePositions}
                color="#0f172a"
                weight={2}
                dashArray="4, 6"
                opacity={0.8}
              />
            )}
          </MapContainer>
        )}
      </div>
    </div>
  );
}
