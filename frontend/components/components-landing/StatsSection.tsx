"use client";

export function StatsSection() {
  const stats = [
    { value: "50k+", label: "DESTINATIONS" },
    { value: "10k+", label: "HAPPY TRAVELERS" },
    { value: "120+", label: "COUNTRIES" },
    { value: "24/7", label: "EXPERT SUPPORT" },
  ];

  return (
    <section className="bg-white border-b border-slate-100 py-12 px-6 lg:px-16">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, i) => (
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
  );
}
