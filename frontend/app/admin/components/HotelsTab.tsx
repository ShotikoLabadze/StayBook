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

  const [currency, setCurrency] = useState("USD");
  const [rating, setRating] = useState("4.5");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [amenitiesInput, setAmenitiesInput] = useState("");
  const [highlightsInput, setHighlightsInput] = useState("");
  const [galleryInput, setGalleryInput] = useState("");

  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleAddHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage(null);

    const destPrefix = destinationId.substring(0, 3).toLowerCase();
    const generatedId = `htl-${destPrefix}-${Date.now().toString().slice(-4)}`;

    const parseToArray = (input: string) =>
      input
        ? input
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [];

    try {
      const payload: Partial<Hotel> = {
        id: generatedId,
        destinationId: destinationId.toLowerCase().trim(),
        name: hotelName,
        neighborhood,
        propertyType,
        pricePerNight: Number(price),
        currency,
        rating: Number(rating),
        reviewCount: 0,
        image: hotelImage,
        description,
        coordinates: {
          lat: Number(lat) || 0,
          lng: Number(lng) || 0,
        },

        gallery: parseToArray(galleryInput),
        tags: parseToArray(tagsInput),
        amenities: parseToArray(amenitiesInput),
        highlights: parseToArray(highlightsInput),
      };

      const newHotel = await destinationService.createHotel(payload);
      setHotels((prev) => [newHotel, ...prev]);
      setMessage({
        type: "success",
        text: "Hotel successfully published with all dynamic data!",
      });

      setHotelName("");
      setDestinationId("");
      setNeighborhood("");
      setPrice("");
      setHotelImage("");
      setDescription("");
      setRating("4.5");
      setLat("");
      setLng("");
      setTagsInput("");
      setAmenitiesInput("");
      setHighlightsInput("");
      setGalleryInput("");
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

        <div className="divide-y divide-slate-100 max-h-[85vh] overflow-y-auto">
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
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#10b981]">
                      {hotel.currency === "EUR" ? "€" : "$"}
                      {hotel.pricePerNight}
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

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 max-h-[85vh] overflow-y-auto">
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
              placeholder="Cheval Blanc Paris"
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
                placeholder="paris-france"
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
                placeholder="1st Arrondissement"
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
              <input
                type="text"
                placeholder="Palace Hotel"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Price per night
              </label>
              <input
                type="number"
                placeholder="1650"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GEL">GEL (₾)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Rating
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                max="5"
                placeholder="4.95"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Latitude (Lat)
              </label>
              <input
                type="number"
                step="any"
                placeholder="48.8566"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Longitude (Lng)
              </label>
              <input
                type="number"
                step="any"
                placeholder="2.3522"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
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
              placeholder="https://unsplash.com/..."
              value={hotelImage}
              onChange={(e) => setHotelImage(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Gallery (Comma separated URLs)
            </label>
            <input
              type="text"
              placeholder="url1, url2, url3"
              value={galleryInput}
              onChange={(e) => setGalleryInput(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              placeholder="Luxury, Top Rated, Romantic"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Amenities (Comma separated)
            </label>
            <input
              type="text"
              placeholder="Free WiFi, Pool, Spa, Gym"
              value={amenitiesInput}
              onChange={(e) => setAmenitiesInput(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Highlights (Comma separated)
            </label>
            <input
              type="text"
              placeholder="Overlooking the Seine, Fine Dining"
              value={highlightsInput}
              onChange={(e) => setHighlightsInput(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              placeholder="Overlooking the Seine, Cheval Blanc Paris captures..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={formLoading}
            className="w-full py-2.5 bg-[#0f172a] text-white text-sm font-semibold rounded-xl hover:bg-opacity-90 transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer sticky bottom-0 shadow-lg"
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
