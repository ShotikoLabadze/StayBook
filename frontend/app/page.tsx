"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Destination, destinationService } from "@/services/destinationService";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin, Search, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const testimonials = [
  {
    quote:
      "StayBook redefined how I think about travel. The level of detail in scheduling and budgeting is unmatched.",
    author: "Marcus Sterling",
    role: "Global Wealth Advisor",
  },
  {
    quote:
      "The AI concierge is hauntingly accurate. It suggested hidden gems in Lyon that made my entire family trip.",
    author: "Elena Rostova",
    role: "Interior Designer",
  },
  {
    quote:
      "Finally, a travel app that understands the value of time. The seamless organization keeps me perfectly at peace.",
    author: "David Chen",
    role: "Tech Entrepreneur",
  },
];

export default function LandingPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setIsLoading(true);
        const data = await destinationService.getAll();

        setDestinations(data.slice(0, 3));
      } catch (err) {
        console.error("Failed to load destinations:", err);
        setError("Could not load destinations. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-bg font-body selection:bg-secondary/20 antialiased">
      <Navbar />

      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12),transparent_60%)]" />
        <div
          className="absolute top-0 inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop')`,
          }}
        />

        <div className="relative z-10 max-w-3xl space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-headline text-4xl sm:text-6xl font-bold tracking-tight leading-[1.1]"
          >
            The World’s Most{" "}
            <span className="text-secondary font-medium">Refined</span> <br />{" "}
            Travel Experiences
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-medium"
          >
            Curated by experts, enhanced by AI. Plan the next generation of
            luxury itineraries seamlessly with StayBook.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/90 backdrop-blur-md p-2 sm:p-2.5 rounded-2xl sm:rounded-full shadow-xl max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-12 gap-2 items-center text-primary mt-10 border border-white/20"
          >
            <div className="sm:col-span-5 flex items-center gap-3 px-4 border-b sm:border-b-0 sm:border-r border-slate-200/60 py-2 sm:py-0">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Where do you want to go?"
                className="w-full text-sm font-medium focus:outline-none placeholder:text-slate-400 bg-transparent text-primary"
              />
            </div>
            <div className="sm:col-span-4 flex items-center gap-3 px-4 py-2 sm:py-0">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="When?"
                className="w-full text-sm font-medium focus:outline-none placeholder:text-slate-400 bg-transparent text-primary"
              />
            </div>
            <button className="sm:col-span-3 w-full py-3 bg-secondary hover:bg-secondary/90 text-primary text-sm font-bold rounded-xl sm:rounded-full transition-all flex items-center justify-center gap-2 shadow-lg shadow-secondary/10 cursor-pointer tracking-wide">
              <Search className="w-4 h-4 text-primary stroke-[3]" /> Search
            </button>
          </motion.div>
        </div>
      </section>

      <section className="bg-white border-b border-slate-100 py-12 px-6 lg:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "50k+", label: "DESTINATIONS" },
            { value: "10k+", label: "HAPPY TRAVELERS" },
            { value: "120+", label: "COUNTRIES" },
            { value: "24/7", label: "EXPERT SUPPORT" },
          ].map((stat, i) => (
            <div key={i} className="space-y-1">
              <p className="font-headline text-3xl font-bold tracking-tight text-primary">
                {stat.value}
              </p>
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 lg:px-16 max-w-6xl mx-auto space-y-12">
        <div className="space-y-2">
          <h2 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-primary">
            Curated Destinations
          </h2>
          <p className="text-sm text-slate-500 max-w-md">
            Our team of travel experts handselects every luxury experience to
            ensure your journey is perfect.
          </p>
        </div>

        {error && (
          <div className="text-red-500 text-sm font-medium">{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading
            ? [...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="aspect-[4/5] w-full rounded-2xl bg-slate-200" />
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                  <div className="h-3 bg-slate-200 rounded w-1/3" />
                </div>
              ))
            : destinations.map((dest) => (
                <div key={dest._id} className="group cursor-pointer space-y-4">
                  <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-slate-100 shadow-sm group-hover:shadow-md transition-all">
                    <img
                      src={dest.image}
                      alt={dest.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-[11px] font-bold tracking-wide text-primary shadow-sm">
                      ${dest.price}/night
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-headline font-semibold text-lg text-primary group-hover:text-secondary transition-colors">
                      {dest.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {dest.location}
                      </p>
                      <span className="text-xs font-semibold text-amber-500 flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-current" /> {dest.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </section>

      <section className="py-20 bg-slate-50 border-y border-slate-100 px-6 lg:px-16 text-center space-y-12">
        <div className="space-y-2">
          <h2 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-primary">
            Testimonials
          </h2>
          <p className="text-sm text-slate-500">
            Experiences shared by our community of global explorers.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex gap-0.5 text-secondary">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-slate-600 font-medium italic">
                  "{t.quote}"
                </p>
              </div>
              <div className="pt-4 border-t border-slate-50">
                <p className="text-sm font-semibold text-primary">{t.author}</p>
                <p className="text-xs text-slate-400 font-medium">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 text-center max-w-4xl mx-auto space-y-8">
        <h2 className="font-headline text-3xl sm:text-5xl font-bold tracking-tight text-primary">
          Ready to begin your journey?
        </h2>
        <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto">
          Join our exclusive community of travelers and start planning your next
          luxury escape today.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/register"
            className="w-full sm:w-auto px-7 py-3.5 bg-primary hover:bg-primary/95 text-white text-sm font-semibold rounded-full shadow-lg shadow-primary/10 transition-all flex items-center justify-center gap-2 cursor-pointer tracking-wide"
          >
            Create Your First Plan{" "}
            <ArrowRight className="w-4 h-4 text-secondary" />
          </Link>
          <button className="w-full sm:w-auto px-7 py-3.5 bg-white border border-slate-200 hover:bg-neutral-bg text-slate-700 text-sm font-semibold rounded-full transition-all cursor-pointer tracking-wide shadow-sm">
            Talk to a Concierge
          </button>
        </div>
      </section>

      <Footer variant="landing" />
    </div>
  );
}
