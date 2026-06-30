"use client";

import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/userService";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import AvatarUpload from "./components/AvatarUpload";
import IdentityForm from "./components/IdentityForm";
import SecurityForm from "./components/SecurityForm";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, when: "beforeChildren", staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function ProfilePage() {
  const { user, logout } = useAuth();

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
          <AvatarUpload
            avatar={avatar}
            onAvatarChange={setAvatar}
            onError={(errText) => setMessage({ type: "error", text: errText })}
            variants={itemVariants}
          />

          <IdentityForm
            name={name}
            setName={setName}
            email={email}
            variants={itemVariants}
          />

          <SecurityForm
            currentPassword={currentPassword}
            setCurrentPassword={setCurrentPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            variants={itemVariants}
          />

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
