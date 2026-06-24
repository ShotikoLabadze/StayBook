"use client";

import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/userService";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  Loader2,
  LogOut,
  Shield,
  User,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const navbar = document.querySelector("nav");
    const sidebar = document.querySelector("aside");
    const mainArea = document.querySelector("main");

    if (navbar) navbar.style.display = "none";
    if (sidebar) sidebar.style.display = "none";
    if (mainArea) {
      mainArea.style.height = "100vh";
      mainArea.style.width = "100vw";
    }

    return () => {
      if (navbar) navbar.style.display = "";
      if (sidebar) sidebar.style.display = "";
      if (mainArea) {
        mainArea.style.height = "";
        mainArea.style.width = "";
      }
    };
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setAvatar(
        user.avatar ||
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      );
    }
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 1 * 1024 * 1024;
    if (file.size > maxSize) {
      setMessage({
        type: "error",
        text: "File is too large! Maximum allowed size is 1MB.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result as string);
      setMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await userService.updateProfile({
        name,
        avatar: avatar || undefined,
        ...(newPassword ? { password: newPassword } : {}),
      });

      setMessage({ type: "success", text: "Changes saved successfully!" });
      setCurrentPassword("");
      setNewPassword("");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-secondary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-bg text-primary font-sans antialiased py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <motion.div
        className="max-w-2xl mx-auto space-y-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-card-bg border border-border-subtle text-xs font-semibold text-text-muted rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition duration-200 shadow-3xs group decoration-none"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-text-muted group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="pt-2 text-left">
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">
            Account
          </span>
          <h1 className="text-4xl font-bold font-headline mt-1 text-primary">
            Your Profile
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Personalize how StayBook shapes your dashboard layout and security.
          </p>
        </motion.div>

        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-xl text-sm font-medium border flex items-center gap-3 ${
              message.type === "success"
                ? "bg-tertiary/10 text-tertiary border-tertiary/20"
                : "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {message.text}
          </motion.div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <motion.div
            variants={itemVariants}
            className="bg-card-bg p-6 rounded-2xl border border-border-subtle shadow-xs flex items-center space-x-6"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <div
              onClick={handleAvatarClick}
              className="relative group cursor-pointer shrink-0"
            >
              <img
                src={
                  avatar ||
                  user?.avatar ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
                }
                alt="User Avatar"
                className="w-20 h-20 rounded-full object-cover ring-4 ring-secondary/20 transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="text-left">
              <button
                type="button"
                onClick={handleAvatarClick}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-sm font-medium rounded-xl transition duration-200 active:scale-95 cursor-pointer border-none"
              >
                Change avatar
              </button>
              <p className="text-xs text-text-muted mt-1">PNG, JPG up to 1MB</p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
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

          <motion.div
            variants={itemVariants}
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

          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between pt-4"
          >
            <button
              type="button"
              onClick={() => logout()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all active:scale-98 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-tertiary text-white text-sm font-semibold rounded-xl hover:bg-opacity-95 shadow-md shadow-tertiary/10 transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-none"
            >
              {loading ? "Saving changes..." : "Save changes"}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
