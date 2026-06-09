"use client";

import { motion } from "framer-motion";
import { ArrowRight, Compass, Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 font-body bg-neutral-bg selection:bg-secondary/20">
      <div className="hidden lg:flex lg:col-span-5 bg-primary relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.15),transparent_50%)]" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-tertiary/10 rounded-full blur-[100px]" />

        <div className="relative z-10 flex items-center gap-2.5 font-headline font-bold text-xl tracking-tight">
          <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-primary shadow-lg shadow-secondary/20">
            <Compass className="w-5 h-5 stroke-[2.5]" />
          </div>
          StayBook
        </div>

        <div className="relative z-10 my-auto max-w-sm space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-headline text-4xl font-semibold leading-tight tracking-tight"
          >
            Plan your next journey with style.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-slate-4xl text-sm leading-relaxed text-slate-400"
          >
            Experience 2026's most advanced smart travel planner, featuring
            real-time collaboration and intuitive itinerary mapping.
          </motion.p>
        </div>

        <div className="relative z-10 text-xs text-slate-500 font-medium">
          © 2026 StayBook Technologies Inc.
        </div>
      </div>

      <div className="col-span-1 lg:col-span-7 flex flex-col justify-center px-6 sm:px-16 lg:px-24 xl:px-36 bg-white">
        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="space-y-2">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-primary">
              Welcome back
            </h2>
            <p className="text-sm text-slate-500">
              Enter your details to access your dashboard
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-4xl absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-neutral-bg border border-slate-200/80 rounded-xl text-sm focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all font-medium text-primary placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-4xl absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 bg-neutral-bg border border-slate-200/80 rounded-xl text-sm focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all font-medium text-primary placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-primary hover:bg-primary/95 text-white rounded-xl text-sm font-semibold tracking-wide shadow-lg shadow-primary/10 transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin text-secondary" />
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4 text-secondary" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-secondary hover:underline transition-all"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
