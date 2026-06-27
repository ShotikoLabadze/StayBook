"use client";

import { TripData, tripService } from "@/services/tripService";
import { Loader2, Send, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ShareTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId?: string;
  trips?: TripData[];
}

export default function ShareTripModal({
  isOpen,
  onClose,
  tripId,
  trips = [],
}: ShareTripModalProps) {
  const [email, setEmail] = useState("");
  const [selectedTripId, setSelectedTripId] = useState(tripId || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tripId) setSelectedTripId(tripId);
    else if (trips.length > 0 && !selectedTripId) {
      setSelectedTripId(trips[0]._id);
    }
  }, [tripId, trips]);

  if (!isOpen) return null;

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !selectedTripId) {
      toast.error("Please select a trip and enter an email.");
      return;
    }

    setLoading(true);
    try {
      await tripService.shareTrip(selectedTripId, email);
      toast.success("Invitation sent successfully! 🚀");
      setEmail("");
      onClose();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to share trip.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[100] flex items-center justify-center p-4">
      <div className="bg-card-bg border border-border-subtle rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-primary cursor-pointer border-none bg-transparent"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-headline text-lg font-bold text-primary mb-1">
          Share your adventure
        </h3>
        <p className="text-xs text-text-muted mb-4">
          Select a trip and enter your friend's email to collaborate.
        </p>

        <form onSubmit={handleShare} className="space-y-4 text-left">
          {!tripId && trips.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                Select Trip
              </label>
              <select
                value={selectedTripId}
                onChange={(e) => setSelectedTripId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border-subtle bg-neutral-bg text-sm text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all appearance-none cursor-pointer"
              >
                {trips.map((trip) => (
                  <option
                    key={trip._id}
                    value={trip._id}
                    className="bg-card-bg text-primary"
                  >
                    {trip.title || trip.destination}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
              Friend's Email
            </label>
            <input
              type="email"
              required
              placeholder="friend@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border-subtle bg-neutral-bg text-sm text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !selectedTripId}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-secondary text-primary font-extrabold text-sm rounded-xl cursor-pointer hover:bg-opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" /> Send Invitation
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
