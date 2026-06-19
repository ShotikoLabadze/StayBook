"use client";

export default function LiveUpdates() {
  const logs = [
    {
      id: 1,
      user: "Marco",
      action: 'added "Boat Tour" to Day 4',
      time: "2 minutes ago",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=50&auto=format&fit=crop&sig=1",
    },
    {
      id: 2,
      user: "Sofia",
      action: "updated the flight status",
      time: "1 hour ago",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=50&auto=format&fit=crop&sig=2",
    },
  ];

  return (
    <div className="bg-white border border-slate-100/80 rounded-3xl p-5 shadow-xs space-y-4">
      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
        Live Updates
      </h3>
      <div className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-3 text-left">
            <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 shadow-2xs border border-white">
              <img
                src={log.avatar}
                alt={log.user}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-0.5 min-w-0">
              <p className="text-xs text-primary font-medium leading-tight">
                <span className="font-bold">{log.user}</span> {log.action}
              </p>
              <span className="block text-[10px] text-slate-400/80 font-medium">
                {log.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
