"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { AiChatWidget } from "./ai-chat-widget";

export function GlobalChatWrapper() {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const blacklistedRoutes = ["/", "/login", "/register", "/admin", "/profile"];
  const isBlacklisted = blacklistedRoutes.some(
    (route) => pathname === route || pathname?.startsWith(`${route}/`),
  );

  if (isBlacklisted) return null;

  return <AiChatWidget />;
}
