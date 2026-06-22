"use client";

import { Hotel } from "@/services/destinationService";
import { motion } from "framer-motion";
import { AlertCircle, Edit2, Loader2, X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface HotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedHotel: Hotel | null;
  formLoading: boolean;
  message: { type: "success" | "error"; text: string } | null;
  onSave: (payload: Partial<Hotel>) => Promise<void>;
}

const initialFormState = {
  name: "",
  destinationId: "",
  neighborhood: "",
  propertyType: "Hotel",
  pricePerNight: "",
  currency: "USD",
  rating: "4.5",
  lat: "",
  lng: "",
  image: "",
  gallery: "",
  tags: "",
  amenities: "",
  highlights: "",
  description: "",
};

export default function HotelModal({
  isOpen,
  onClose,
  selectedHotel,
  formLoading,
  message,
  onSave,
}: HotelModalProps) {
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (isOpen) {
      if (selectedHotel) {
        setIsEditMode(false);
        setFormData({
          name: selectedHotel.name || "",
          destinationId: selectedHotel.destinationId || "",
          neighborhood: selectedHotel.neighborhood || "",
          propertyType: selectedHotel.propertyType || "Hotel",
          pricePerNight: selectedHotel.pricePerNight?.toString() || "",
          currency: selectedHotel.currency || "USD",
          rating: selectedHotel.rating?.toString() || "4.5",
          lat: selectedHotel.coordinates?.lat?.toString() || "",
          lng: selectedHotel.coordinates?.lng?.toString() || "",
          image: selectedHotel.image || "",
          description: selectedHotel.description || "",
          gallery: selectedHotel.gallery?.join(", ") || "",
          tags: selectedHotel.tags?.join(", ") || "",
          amenities: selectedHotel.amenities?.join(", ") || "",
          highlights: selectedHotel.highlights?.join(", ") || "",
        });
      } else {
        setIsEditMode(true);
        setFormData(initialFormState);
      }
    }
  }, [isOpen, selectedHotel]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const parseToArray = (input: string) =>
    input
      ? input
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<Hotel> = {
      destinationId: formData.destinationId.toLowerCase().trim(),
      name: formData.name,
      neighborhood: formData.neighborhood,
      propertyType: formData.propertyType,
      pricePerNight: Number(formData.pricePerNight),
      currency: formData.currency,
      rating: Number(formData.rating),
      image: formData.image,
      description: formData.description,
      coordinates: {
        lat: Number(formData.lat) || 0,
        lng: Number(formData.lng) || 0,
      },
      gallery: parseToArray(formData.gallery),
      tags: parseToArray(formData.tags),
      amenities: parseToArray(formData.amenities),
      highlights: parseToArray(formData.highlights),
    };
    onSave(payload);
  };

  const inputFields = [
    {
      label: "Hotel Name",
      name: "name",
      type: "text",
      placeholder: "Cheval Blanc Paris",
      required: true,
    },
    {
      label: "Destination Slug",
      name: "destinationId",
      type: "text",
      placeholder: "paris-france",
      required: true,
    },
    {
      label: "Neighborhood",
      name: "neighborhood",
      type: "text",
      placeholder: "1st Arrondissement",
      required: true,
    },
    {
      label: "Property Type",
      name: "propertyType",
      type: "text",
      placeholder: "Palace Hotel",
      required: true,
    },
    {
      label: "Price per night",
      name: "pricePerNight",
      type: "number",
      placeholder: "1650",
      required: true,
    },
    {
      label: "Rating",
      name: "rating",
      type: "number",
      placeholder: "4.95",
      step: "0.01",
      required: true,
    },
    {
      label: "Latitude (Lat)",
      name: "lat",
      type: "number",
      placeholder: "48.8566",
      step: "any",
      required: true,
    },
    {
      label: "Longitude (Lng)",
      name: "lng",
      type: "number",
      placeholder: "2.3522",
      step: "any",
      required: true,
    },
    {
      label: "Main Image URL",
      name: "image",
      type: "url",
      placeholder: "https://...",
      required: true,
    },
    {
      label: "Gallery (Comma separated)",
      name: "gallery",
      type: "text",
      placeholder: "url1, url2",
    },
    {
      label: "Tags (Comma separated)",
      name: "tags",
      type: "text",
      placeholder: "Luxury, Top Rated",
    },
    {
      label: "Amenities (Comma separated)",
      name: "amenities",
      type: "text",
      placeholder: "Free WiFi, Pool",
    },
    {
      label: "Highlights (Comma separated)",
      name: "highlights",
      type: "text",
      placeholder: "Overlooking the Seine",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-100"
      >
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold font-headline text-[#0f172a]">
            {selectedHotel
              ? isEditMode
                ? `Edit: ${selectedHotel.name}`
                : selectedHotel.name
              : "Create New Property"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-[#f8fafc]/50">
          {message && (
            <div
              className={`p-3 mb-4 rounded-xl text-xs font-medium border flex items-center gap-2 ${message.type === "success" ? "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20" : "bg-red-50 text-red-600 border-red-100"}`}
            >
              <AlertCircle className="w-4 h-4" /> {message.text}
            </div>
          )}

          {selectedHotel && !isEditMode && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <img
                    src={selectedHotel.image}
                    alt={selectedHotel.name}
                    className="w-full h-64 object-cover rounded-xl border border-slate-100"
                  />
                  {selectedHotel.gallery &&
                    selectedHotel.gallery.length > 0 && (
                      <div className="grid grid-cols-4 gap-2">
                        {selectedHotel.gallery.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt="gallery"
                            className="w-full h-16 object-cover rounded-lg border border-slate-100"
                          />
                        ))}
                      </div>
                    )}
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-100 space-y-4 self-start">
                  <p className="text-2xl font-black text-[#10b981]">
                    ${selectedHotel.pricePerNight}{" "}
                    <span className="text-xs text-slate-400 font-medium">
                      / night
                    </span>
                  </p>
                  <p className="text-xs font-bold text-amber-500">
                    ★ {selectedHotel.rating} ({selectedHotel.propertyType})
                  </p>
                  <p className="font-mono text-slate-500 text-[11px] bg-slate-50 p-2 rounded-md">
                    Lat: {selectedHotel.coordinates?.lat}
                    <br />
                    Lng: {selectedHotel.coordinates?.lng}
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed bg-white p-4 rounded-xl border border-slate-100">
                {selectedHotel.description}
              </p>
            </div>
          )}

          {(!selectedHotel || isEditMode) && (
            <form id="hotel-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inputFields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      step={field.step}
                      value={(formData as any)[field.name]}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition"
                      required={field.required}
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GEL">GEL (₾)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Brief overview..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition"
                  required
                />
              </div>
            </form>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          {selectedHotel && !isEditMode ? (
            <button
              onClick={() => setIsEditMode(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0f172a] text-white text-xs font-semibold rounded-xl hover:bg-opacity-90 transition cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" /> Modify Property
            </button>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-white text-slate-600 border border-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="hotel-form"
                disabled={formLoading}
                className={`flex items-center gap-2 px-5 py-2.5 text-white text-xs font-semibold rounded-xl hover:bg-opacity-90 transition cursor-pointer ${selectedHotel ? "bg-[#10b981]" : "bg-[#0f172a]"}`}
              >
                {formLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : selectedHotel ? (
                  "Save Changes"
                ) : (
                  "Publish Listing"
                )}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
