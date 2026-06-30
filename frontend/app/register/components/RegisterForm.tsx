"use client";

import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function RegisterForm() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await register(name, email, password);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Email might be taken.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <div className="space-y-2">
        <h2 className="font-headline text-3xl font-bold tracking-tight text-primary">
          Create an account
        </h2>
        <p className="text-sm text-text-muted">
          Join StayBook and start planning your next luxury escape
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl text-xs text-red-600 dark:text-red-400 font-medium"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-primary tracking-wide uppercase">
            Full Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full pl-11 pr-4 py-3.5 bg-neutral-bg border border-border-subtle rounded-xl text-sm focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all font-medium text-primary placeholder:text-text-muted"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-primary tracking-wide uppercase">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full pl-11 pr-4 py-3.5 bg-neutral-bg border border-border-subtle rounded-xl text-sm focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all font-medium text-primary placeholder:text-text-muted"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-primary tracking-wide uppercase">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-11 pr-4 py-3.5 bg-neutral-bg border border-border-subtle rounded-xl text-sm focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all font-medium text-primary placeholder:text-text-muted"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-primary hover:bg-primary/95 dark:bg-secondary dark:hover:bg-secondary/90 text-white dark:text-neutral-bg rounded-xl text-sm font-semibold tracking-wide shadow-lg shadow-primary/10 transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer border-none"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin text-secondary dark:text-neutral-bg" />
          ) : (
            <>
              Get Started{" "}
              <ArrowRight className="w-4 h-4 text-secondary dark:text-neutral-bg" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-text-muted">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-secondary hover:underline transition-all"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
