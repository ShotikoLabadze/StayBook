"use client";

import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

import FilterSidebar from "./components/FilterSidebar";
import HotelCard from "./components/HotelCard";
import SearchHeader from "./components/SearchHeader";

export default function ExplorePage() {
  const mockHotels = [
    {
      id: "h-1",
      title: "Grace Hotel, Auberge Resorts",
      location: "Imerovigli, Santorini",
      rating: 4.9,
      reviews: 124,
      price: 850,
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=500&auto=format&fit=crop",
      features: ["Infinity Pool", "Ocean View"],
      initiallyFavorited: true,
    },
    {
      id: "h-2",
      title: "Canaves Oia Epitome",
      location: "Oia Village, Santorini",
      rating: 4.8,
      reviews: 96,
      price: 920,
      image:
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=500&auto=format&fit=crop",
      features: ["Private Butler", "Ocean View"],
    },
    {
      id: "h-3",
      title: "Katikies Santorini",
      location: "Oia Village, Santorini",
      rating: 4.7,
      reviews: 142,
      price: 780,
      image:
        "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=500&auto=format&fit=crop",
      features: ["Caldera View", "Spa & Wellness"],
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-bg font-body flex">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-100 px-10 py-5 flex items-center justify-end sticky top-0 z-40 h-[65px]">
          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-100 shadow-sm cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </header>

        <div className="p-10 space-y-8 max-w-7xl w-full mx-auto flex-1 flex flex-col">
          <SearchHeader />

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start flex-1 w-full">
            <div className="xl:col-span-4">
              <FilterSidebar />
            </div>

            <div className="xl:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              {mockHotels.map((hotel) => (
                <HotelCard key={hotel.id} {...hotel} />
              ))}
            </div>
          </div>

          <Footer />
        </div>
      </main>
    </div>
  );
}
