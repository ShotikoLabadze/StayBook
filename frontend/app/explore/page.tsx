"use client";

import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

import SearchHeader from "./components/SearchHeader";

export default function ExplorePage() {
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

          <div className="flex flex-col lg:flex-row gap-10 items-start flex-1">
            <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 w-full">
              <div className="xl:col-span-5"></div>
            </div>
          </div>

          <Footer />
        </div>
      </main>
    </div>
  );
}
