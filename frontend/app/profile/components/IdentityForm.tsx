"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";

interface IdentityFormProps {
  name: string;
  setName: (name: string) => void;
  email: string;
  variants: any;
}

export default function IdentityForm({
  name,
  setName,
  email,
  variants,
}: IdentityFormProps) {
  return (
    <motion.div
      variants={variants}
      className="bg-card-bg p-6 rounded-2xl border border-border-subtle shadow-xs space-y-4"
    >
      <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
        <User className="w-4 h-4 text-secondary" />
        <h3 className="text-base font-bold font-headline text-primary">
          Identity
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border-subtle bg-neutral-bg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-muted opacity-80 uppercase tracking-wider mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full px-4 py-2.5 rounded-xl border border-border-subtle bg-neutral-bg/40 text-text-muted text-sm cursor-not-allowed opacity-60"
          />
          <p className="text-xs text-text-muted mt-1">
            Email cannot be modified.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
