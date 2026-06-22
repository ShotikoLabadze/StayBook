"use client";

import { destinationService, Hotel } from "@/services/destinationService";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2, MapPin, Plus } from "lucide-react";
import React, { useState } from "react";

interface HotelsTabProps {
  hotels: Hotel[];
  setHotels: React.Dispatch<React.SetStateAction<Hotel[]>>;
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function HotelsTab({ hotels, setHotels }: HotelsTabProps) {
  const [hotelName, setHotelName] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [propertyType, setPropertyType] = useState("Hotel");
  const [price, setPrice] = useState("");
  const [hotelImage, setHotelImage] = useState("");
  const [description, setDescription] = useState("");

  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleAddHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage(null);

    const generatedId =
      hotelName.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();

    try {
      const payload = {
        id: generatedId,
        destinationId: destinationId.toLowerCase().trim(),
        name: hotelName,
        neighborhood,
        propertyType,
        pricePerNight: Number(price),
        image:
          hotelImage ||
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
        coordinates: { lat: 41.7151, lng: 44.8271 },
        description,
        gallery: [],
        tags: [],
        amenities: [],
        highlights: [],
      };

      const newHotel = await destinationService.createHotel(payload);
      setHotels((prev) => [newHotel, ...prev]);
      setMessage({ type: "success", text: "Hotel successfully published!" });

      setHotelName("");
      setDestinationId("");
      setNeighborhood("");
      setPrice("");
      setHotelImage("");
      setDescription("");
    } catch (error) {
      setMessage({ type: "error", text: "Failed to create hotel entry." });
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
    >
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-50 bg-slate-50/50">
          <h3 className="font-bold font-headline text-xs text-slate-700 uppercase tracking-wider">
            Active Properties ({hotels.length})
          </h3>
        </div>

        <div className="divide-y divide-slate-100 max-h-[65vh] overflow-y-auto">
          <AnimatePresence initial={false}>
            {hotels.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-400">
                No properties found in database.
              </div>
            ) : (
              hotels.map((hotel) => (
                <motion.div
                  key={hotel.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition duration-200"
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
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />{" "}
                        {hotel.neighborhood}, {hotel.destinationId}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#10b981]">
                      ${hotel.pricePerNight}
                    </span>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                      per night
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
          <Plus className="w-4 h-4 text-[#38bdf8]" />
          <h3 className="text-base font-bold font-headline text-[#0f172a]">
            Create Property
          </h3>
        </div>

        {message && (
          <div
            className={`p-3 rounded-xl text-xs font-medium border flex items-center gap-2 ${
              message.type === "success"
                ? "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20"
                : "bg-red-50 text-red-600 border-red-100"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {message.text}
          </div>
        )}

        <form onSubmit={handleAddHotel} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Hotel Name
            </label>
            <input
              type="text"
              placeholder="Grand Plaza Resort"
              value={hotelName}
              onChange={(e) => setHotelName(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Destination Slug
              </label>
              <input
                type="text"
                placeholder="batumi"
                value={destinationId}
                onChange={(e) => setDestinationId(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Neighborhood
              </label>
              <input
                type="text"
                placeholder="Old Boulevard"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition"
              >
                <option value="Hotel">Hotel</option>
                <option value="Apartment">Apartment</option>
                <option value="Resort">Resort</option>
                <option value="Villa">Villa</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Price per night ($)
              </label>
              <input
                type="number"
                placeholder="120"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Main Image URL
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={hotelImage}
              onChange={(e) => setHotelImage(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              placeholder="Brief overview..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition"
            />
          </div>

          <button
            type="submit"
            disabled={formLoading}
            className="w-full py-2.5 bg-[#0f172a] text-white text-sm font-semibold rounded-xl hover:bg-opacity-90 transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {formLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Publish Listing"
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
