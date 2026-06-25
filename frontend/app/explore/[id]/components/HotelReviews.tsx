"use client";

import { useAuth } from "@/context/AuthContext";
import { Hotel } from "@/services/destinationService";
import { reviewService } from "@/services/reviewService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MessageSquare, Star, User } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface HotelReviewsProps {
  hotel: Hotel;
}

export default function HotelReviews({ hotel }: HotelReviewsProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews", hotel._id || hotel.id],
    queryFn: () => reviewService.getByTarget(hotel._id || hotel.id),
  });

  const reviewMutation = useMutation({
    mutationFn: (newReview: { rating: number; comment: string }) =>
      reviewService.create("hotel", hotel._id || hotel.id, newReview),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", hotel._id || hotel.id],
      });
      toast.success("Thank you for your testimonial! ✨");
      setComment("");
      setRating(5);
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message || "Failed to submit testimonial.",
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please write your experience before posting.");
      return;
    }
    reviewMutation.mutate({ rating, comment });
  };

  return (
    <div className="bg-card-bg border border-border-subtle p-7 rounded-3xl shadow-2xs text-left space-y-6 transition-colors duration-300">
      <div className="space-y-1">
        <h3 className="font-headline text-lg font-bold text-primary tracking-tight">
          Guest Testimonials
        </h3>
        <p className="text-xs font-medium text-text-muted">
          Verified ratings from travelers who stayed at this sanctuary.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-neutral-bg p-6 rounded-2xl border border-border-subtle">
        <div className="text-center md:border-r border-border-subtle py-2 space-y-1">
          <p className="text-4xl font-extrabold text-primary font-headline">
            {hotel.rating ? hotel.rating.toFixed(2) : "4.50"}
          </p>
          <div className="flex items-center justify-center gap-0.5 text-secondary">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
            Out of 5 Stars
          </p>
        </div>

        <div className="col-span-2 px-2 md:px-6 space-y-3">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-secondary shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-primary">
                {reviews.length} Total Verified Reviews
              </h4>
              <p className="text-[11px] font-medium text-text-muted leading-relaxed mt-0.5">
                100% of reviews come from guests who completed their premium
                concierge booking through StayBook.
              </p>
            </div>
          </div>
        </div>
      </div>

      {user ? (
        <form
          onSubmit={handleSubmit}
          className="border-t border-border-subtle pt-6 space-y-4"
        >
          <h4 className="font-headline text-xs font-bold text-primary uppercase tracking-wider">
            Leave a Testimonial
          </h4>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="cursor-pointer transition-transform hover:scale-110 p-0 bg-transparent border-none focus:outline-none"
              >
                <Star
                  className={`w-5 h-5 ${
                    star <= rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300 dark:text-slate-600"
                  }`}
                />
              </button>
            ))}
          </div>

          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share the details of your stay at this sanctuary..."
            className="w-full px-4 py-3 bg-neutral-bg border border-border-subtle rounded-xl text-xs focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all font-medium text-primary placeholder:text-text-muted resize-none"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={reviewMutation.isPending}
              className="px-4 py-2 bg-primary hover:bg-primary/95 dark:bg-secondary dark:hover:bg-secondary/90 text-white dark:text-neutral-bg text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50 border-none"
            >
              {reviewMutation.isPending ? "Posting..." : "Submit Testimonial"}
            </button>
          </div>
        </form>
      ) : (
        <p className="text-[11px] text-text-muted font-medium text-center border-t border-border-subtle pt-4">
          Please log in to share your personal experience.
        </p>
      )}

      <div className="space-y-4 border-t border-border-subtle pt-6">
        <h4 className="font-headline text-xs font-bold text-primary uppercase tracking-wider">
          Reviews Timeline
        </h4>

        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-20 bg-neutral-bg border border-border-subtle rounded-2xl w-full" />
            <div className="h-20 bg-neutral-bg border border-border-subtle rounded-2xl w-full" />
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-xs text-text-muted font-medium py-2">
            No testimonials posted for this property yet.
          </p>
        ) : (
          reviews.map((rev) => (
            <motion.div
              key={rev._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-neutral-bg rounded-2xl border border-border-subtle space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {rev.user?.avatar ? (
                    <img
                      src={rev.user.avatar}
                      alt={rev.user.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-secondary/10"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-card-bg flex items-center justify-center border border-border-subtle">
                      <User className="w-3.5 h-3.5 text-text-muted" />
                    </div>
                  )}
                  <div>
                    <h5 className="text-xs font-bold text-primary leading-none">
                      {rev.user?.name || "Verified Guest"}
                    </h5>
                    <span className="text-[9px] text-text-muted font-medium mt-1 block">
                      {new Date(rev.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 bg-card-bg px-2 py-0.5 rounded-md border border-border-subtle">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-[10px] font-bold text-primary">
                    {rev.rating}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed pl-0.5">
                {rev.comment}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
