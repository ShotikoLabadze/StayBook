"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";

interface SecurityFormProps {
  currentPassword: string;
  setCurrentPassword: (pass: string) => void;
  newPassword: string;
  setNewPassword: (pass: string) => void;
  variants: any;
}

export default function SecurityForm({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  variants,
}: SecurityFormProps) {
  return (
    <motion.div
      variants={variants}
      className="bg-card-bg p-6 rounded-2xl border border-border-subtle shadow-xs space-y-4"
    >
      <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
        <Shield className="w-4 h-4 text-tertiary" />
        <h3 className="text-base font-bold font-headline text-primary">
          Security
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
            Current Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border-subtle bg-neutral-bg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
            New Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border-subtle bg-neutral-bg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent transition"
          />
        </div>
      </div>
    </motion.div>
  );
}
