"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  Destination,
  destinationService,
  Testimonial,
} from "@/services/destinationService";
import { useEffect, useState } from "react";

import { CallToAction } from "@/components/components-landing/CallToAction";
import { CuratedDestinations } from "@/components/components-landing/CuratedDestinations";
import { HeroSection } from "@/components/components-landing/HeroSection";
import { StatsSection } from "@/components/components-landing/StatsSection";
import { TestimonialsSection } from "@/components/components-landing/TestimonialsSection";

export default function LandingPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTestimonialsLoading, setIsTestimonialsLoading] =
    useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        setIsLoading(true);
        setIsTestimonialsLoading(true);

        const destData = await destinationService.getAll();

        const topRatedDestinations = [...destData]
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 3);

        setDestinations(topRatedDestinations);

        const reviewData = await destinationService.getTestimonials();
        setTestimonials(reviewData);
      } catch (err) {
        console.error("Failed to load landing data:", err);
        setError("Could not load fresh data. Please try again later.");
      } finally {
        setIsLoading(false);
        setIsTestimonialsLoading(false);
      }
    };

    fetchLandingData();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-bg font-body selection:bg-secondary/20 antialiased">
      <Navbar />

      <HeroSection />

      <StatsSection />

      <CuratedDestinations
        destinations={destinations}
        isLoading={isLoading}
        error={error}
      />

      <TestimonialsSection
        testimonials={testimonials}
        isLoading={isTestimonialsLoading}
      />

      <CallToAction />

      <Footer variant="landing" />
    </div>
  );
}
