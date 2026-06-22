"use client";

import { destinationService, Hotel } from "@/services/destinationService";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, MapPin, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import HotelModal from "./HotelModal";

interface HotelsTabProps {
  hotels: Hotel[];
  setHotels: React.Dispatch<React.SetStateAction<Hotel[]>>;
  triggerCreateHotel: number;
}

export default function HotelsTab({
  hotels,
  setHotels,
  triggerCreateHotel,
}: HotelsTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (triggerCreateHotel > 0) {
      setSelectedHotel(null);
      setIsModalOpen(true);
    }
  }, [triggerCreateHotel]);

  const handleOpenView = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setIsModalOpen(true);
  };

  const handleSaveHotel = async (payload: Partial<Hotel>) => {
    setFormLoading(true);
    setMessage(null);

    try {
      if (selectedHotel) {
        const updatedHotel = await destinationService.updateHotel(
          selectedHotel.id,
          payload,
        );
        setHotels((prev) =>
          prev.map((h) => (h.id === selectedHotel.id ? updatedHotel : h)),
        );
        setMessage({ type: "success", text: "Property updated successfully!" });
        setTimeout(() => setIsModalOpen(false), 800);
      } else {
        const destPrefix =
          payload.destinationId?.substring(0, 3).toLowerCase() || "htl";
        payload.id = `htl-${destPrefix}-${Date.now().toString().slice(-4)}`;
        payload.reviewCount = 0;

        const newHotel = await destinationService.createHotel(payload);
        setHotels((prev) => [newHotel, ...prev]);
        setMessage({ type: "success", text: "Hotel successfully published!" });
        setTimeout(() => setIsModalOpen(false), 800);
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save hotel data." });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, hotelId: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this property?"))
      return;

    try {
      await destinationService.deleteHotel(hotelId);
      setHotels((prev) => prev.filter((h) => h.id !== hotelId));
    } catch (error) {
      alert("Failed to delete property.");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
      <div className="divide-y divide-slate-100 max-h-[75vh] overflow-y-auto">
        <AnimatePresence initial={false}>
          {hotels.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-400">
              No properties found in database.
            </div>
          ) : (
            hotels.map((hotel) => (
              <motion.div
                key={hotel.id}
                onClick={() => handleOpenView(hotel)}
                className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition duration-200 cursor-pointer group"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-[#0f172a]">
                        {hotel.name}
                      </h4>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-medium">
                        {hotel.propertyType}
                      </span>
                      <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded-md text-[10px] font-bold">
                        ★ {hotel.rating}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />{" "}
                      {hotel.neighborhood}, {hotel.destinationId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition duration-150">
                    <span className="text-xs text-slate-400 flex items-center gap-1 mr-2">
                      <Eye className="w-3.5 h-3.5" /> view details
                    </span>
                    <button
                      onClick={(e) => handleDelete(e, hotel.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50/50 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-right shrink-0 min-w-[70px]">
                    <span className="text-sm font-bold text-[#10b981]">
                      ${hotel.pricePerNight}
                    </span>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                      per night
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <HotelModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            selectedHotel={selectedHotel}
            formLoading={formLoading}
            message={message}
            onSave={handleSaveHotel}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
