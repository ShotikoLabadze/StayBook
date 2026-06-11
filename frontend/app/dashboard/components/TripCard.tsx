"use client";

interface TripCardProps {
  title: string;
  dates: string;
  progress: number;
  daysLeft: number;
  image: string;
}

export default function TripCard({
  title,
  dates,
  progress,
  daysLeft,
  image,
}: TripCardProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-4 shadow-sm hover:shadow-md transition-all group">
      <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-50">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold text-primary shadow-sm">
          {daysLeft} Days Left
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <h3 className="font-headline font-semibold text-sm text-primary">
            {title}
          </h3>
          <p className="text-[11px] text-slate-400 font-medium">{dates}</p>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-semibold text-slate-400">
            <span>Planning Progress</span>
            <span className="text-primary">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
