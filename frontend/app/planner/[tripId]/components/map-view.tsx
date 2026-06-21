"use client";

import { MapPin, Navigation } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

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

interface Trip {
  _id: string;
  title?: string;
  destination?: string;
  latitude?: number;
  longitude?: number;
  itinerary?: {
    dayNumber: number;
    title: string;
    date: string;
    activities: Activity[];
  }[];
}

interface MapViewProps {
  trips: Trip[];
}

export function MapView({ trips }: MapViewProps) {
  const [L, setL] = useState<any>(null);
  const mapRef = useRef<any>(null);

  const safeTrips = trips || [];
  const [activeTripId, setActiveTripId] = useState<string | null>(null);

  useEffect(() => {
    if (!activeTripId && safeTrips.length > 0) {
      setActiveTripId(safeTrips[0]._id);
    }
  }, [safeTrips, activeTripId]);

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

  const handleTripClick = (trip: Trip) => {
    setActiveTripId(trip._id);

    const firstActWithCoords = trip.itinerary
      ?.flatMap((d) => d.activities || [])
      .find((act) => act?.location && typeof act.location.lat === "number");

    let targetLat = trip.latitude;
    let targetLng = trip.longitude;

    if (firstActWithCoords?.location) {
      targetLat = firstActWithCoords.location.lat;
      targetLng = firstActWithCoords.location.lng;
    }

    if (
      mapRef.current &&
      typeof targetLat === "number" &&
      typeof targetLng === "number"
    ) {
      mapRef.current.flyTo([targetLat, targetLng], 13, {
        animate: true,
        duration: 1.5,
      });
    }
  };

  const selectedTrip =
    safeTrips.find((t) => t._id === activeTripId) || safeTrips[0];
  const currentTripActs =
    selectedTrip?.itinerary?.flatMap((d) => d.activities || []) || [];

  const validLocations = currentTripActs.filter(
    (act) =>
      act?.location &&
      typeof act.location.lat === "number" &&
      typeof act.location.lng === "number",
  );

  const initialCenter: [number, number] =
    safeTrips[0] && typeof safeTrips[0].latitude === "number"
      ? [safeTrips[0].latitude, safeTrips[0].longitude!]
      : [41.8902, 12.4922];

  const polylinePositions = validLocations.map(
    (act) => [act.location!.lat, act.location!.lng] as [number, number],
  );

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-100/50 flex-1 flex flex-col lg:flex-row gap-6 min-h-[550px] w-full">
      <div className="w-full lg:w-80 flex flex-col gap-4 border-r border-slate-100 pr-0 lg:pr-6">
        <div className="text-left">
          <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Navigation className="h-4 w-4 text-primary" /> Workspace Explorer
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Click a trip package to focus and view its locations.
          </p>
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto max-h-[420px] pr-1 no-scrollbar">
          {safeTrips.map((trip, idx) => {
            const isSelected = trip._id === activeTripId;
            const tripActivities =
              trip.itinerary?.flatMap((d) => d.activities || []) || [];

            return (
              <div key={trip._id || idx} className="space-y-1.5">
                <div
                  onClick={() => handleTripClick(trip)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? "bg-[#0f172a] text-white border-[#0f172a] shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-100/80"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        isSelected
                          ? "bg-white text-slate-900"
                          : "bg-primary text-white"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-[11px] font-bold truncate">
                      {trip.title || "Luxury Sanctuary Package"}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <div className="pl-4 border-l-2 border-slate-200 space-y-1.5 text-left pt-1 pb-2">
                    {tripActivities.map((act) => (
                      <div
                        key={act.id}
                        className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-lg transition-colors group"
                      >
                        <MapPin className="h-3 w-3 text-slate-400 group-hover:text-primary transition-colors" />
                        <span className="text-[11px] text-slate-600 font-medium truncate">
                          {act.title}
                        </span>
                      </div>
                    ))}
                    {tripActivities.length === 0 && (
                      <p className="text-[10px] text-slate-400 italic pl-5">
                        No locations pinned here.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl relative overflow-hidden min-h-[400px] z-0">
        {!L ? (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400 animate-pulse">
            Initializing workspace map...
          </div>
        ) : (
          <MapContainer
            ref={mapRef}
            center={initialCenter}
            zoom={4}
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

            {validLocations.length === 0 &&
              selectedTrip &&
              typeof selectedTrip.latitude === "number" && (
                <Marker
                  position={[selectedTrip.latitude, selectedTrip.longitude!]}
                >
                  <Popup className="custom-map-popup">
                    <div className="text-xs font-body text-left p-1">
                      <p className="font-bold text-slate-900">
                        {selectedTrip.title}
                      </p>
                      <p className="text-slate-400 text-[10px] mt-1">
                        {selectedTrip.destination}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )}

            {polylinePositions.length > 1 && (
              <Polyline
                positions={polylinePositions}
                color="#0f172a"
                weight={2.5}
                dashArray="5, 7"
                opacity={0.8}
              />
            )}
          </MapContainer>
        )}
      </div>
    </div>
  );
}
