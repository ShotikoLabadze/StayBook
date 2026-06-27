"use client";

import { tripService } from "@/services/tripService";
import { useNotificationStore } from "@/store/useNotificationStore";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Check, CheckCircle, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  metadata?: {
    tripId?: string;
    senderId?: string;
  };
}

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead } = useNotificationStore();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAccept = async (tripId: string, notificationId: string) => {
    setAcceptLoading(notificationId);
    try {
      await tripService.acceptInvitation(tripId);
      toast.success("Awesome! You joined the trip! ✈️");

      await markAsRead(notificationId);

      setIsOpen(false);

      router.push(`/planner/${tripId}`);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Could not join trip.";
      toast.error(errorMsg);
    } finally {
      setAcceptLoading(null);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-card-bg border border-border-subtle text-text-muted hover:text-primary hover:bg-neutral-bg transition-all cursor-pointer shadow-3xs focus:outline-none focus:ring-2 focus:ring-secondary/20"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 stroke-[1.8]" />

        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-extrabold text-white ring-2 ring-card-bg"
            >
              {unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-card-bg border border-border-subtle shadow-xl z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-border-subtle flex items-center justify-between bg-neutral-bg/50">
              <h4 className="font-headline text-xs font-bold text-primary uppercase tracking-wider">
                Notifications
              </h4>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 bg-secondary/10 text-secondary rounded-full">
                  {unreadCount} New
                </span>
              )}
            </div>

            <div className="max-h-[360px] overflow-y-auto divide-y divide-border-subtle">
              {notifications.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-neutral-bg border border-border-subtle flex items-center justify-center mx-auto text-text-muted">
                    <Bell className="w-4 h-4 opacity-60" />
                  </div>
                  <p className="text-xs text-text-muted font-medium">
                    Your luxury notification center is empty.
                  </p>
                </div>
              ) : (
                notifications.map((notif: any) => {
                  const isInvite =
                    notif.type === "invite" && notif.metadata?.tripId;

                  return (
                    <div
                      key={notif._id}
                      className={`p-4 flex gap-3 items-start transition-colors ${
                        !notif.isRead
                          ? "bg-secondary/5 dark:bg-secondary/5"
                          : "hover:bg-neutral-bg/40"
                      }`}
                    >
                      <div className="mt-0.5 p-1.5 rounded-lg bg-card-bg border border-border-subtle text-secondary shrink-0">
                        <MessageSquare className="w-3.5 h-3.5 stroke-[2]" />
                      </div>

                      <div className="flex-1 space-y-0.5 text-left min-w-0">
                        <h5
                          className={`text-xs font-bold text-primary leading-tight ${
                            !notif.isRead ? "font-semibold" : "font-medium"
                          }`}
                        >
                          {notif.title}
                        </h5>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed break-words">
                          {notif.message}
                        </p>

                        {isInvite && !notif.isRead && (
                          <div className="pt-2">
                            <button
                              disabled={acceptLoading === notif._id}
                              onClick={() =>
                                handleAccept(notif.metadata.tripId, notif._id)
                              }
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] rounded-lg cursor-pointer transition-all border-none disabled:opacity-50 shadow-2xs"
                            >
                              <CheckCircle className="w-3 h-3" />
                              {acceptLoading === notif._id
                                ? "Joining..."
                                : "Accept Invite"}
                            </button>
                          </div>
                        )}

                        <span className="text-[9px] text-text-muted font-medium block pt-1">
                          {new Date(notif.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </div>

                      {!notif.isRead && (
                        <button
                          onClick={() => markAsRead(notif._id)}
                          className="p-1 text-text-muted hover:text-emerald-500 rounded-md hover:bg-card-bg border border-transparent hover:border-border-subtle transition-all cursor-pointer shrink-0 focus:outline-none"
                          title="Mark as read"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
