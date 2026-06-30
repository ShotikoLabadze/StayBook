"use client";

import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import React, { useRef } from "react";

interface AvatarUploadProps {
  avatar: string | null;
  onAvatarChange: (base64: string) => void;
  onError: (errorText: string) => void;
  variants: any;
}

export default function AvatarUpload({
  avatar,
  onAvatarChange,
  onError,
  variants,
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      onError("File is too large! Maximum allowed size is 1MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onAvatarChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.div
      variants={variants}
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
        onClick={() => fileInputRef.current?.click()}
        className="relative group cursor-pointer shrink-0"
      >
        <img
          src={
            avatar ||
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
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-sm font-medium rounded-xl transition duration-200 active:scale-95 cursor-pointer border-none"
        >
          Change avatar
        </button>
        <p className="text-xs text-text-muted mt-1">PNG, JPG up to 1MB</p>
      </div>
    </motion.div>
  );
}
