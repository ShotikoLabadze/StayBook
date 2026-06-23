"use client";

import { motion } from "framer-motion";
import { AlertCircle, Loader2, Mail, Shield, X } from "lucide-react";
import { useEffect, useState } from "react";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: any;
  formLoading: boolean;
  message: { type: "success" | "error"; text: string } | null;
  onUpdateRole: (userId: string, newRole: string) => Promise<void>;
}

export default function UserModal({
  isOpen,
  onClose,
  selectedUser,
  formLoading,
  message,
  onUpdateRole,
}: UserModalProps) {
  const [role, setRole] = useState("user");

  useEffect(() => {
    if (selectedUser) {
      setRole(selectedUser.role || "user");
    }
  }, [selectedUser]);

  if (!isOpen || !selectedUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col"
      >
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-base font-bold font-headline text-[#0f172a]">
            Manage User Status
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-[#f8fafc]/50 space-y-4">
          {message && (
            <div
              className={`p-3 rounded-xl text-xs font-medium border flex items-center gap-2 ${
                message.type === "success"
                  ? "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20"
                  : "bg-red-50 text-red-600 border-red-100"
              }`}
            >
              <AlertCircle className="w-4 h-4" /> {message.text}
            </div>
          )}

          <div className="space-y-6 text-center">
            <img
              src={
                selectedUser.avatar ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
              }
              alt={selectedUser.name}
              className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-slate-100 shadow-sm"
            />

            <div>
              <h4 className="font-bold text-lg text-[#0f172a]">
                {selectedUser.name}
              </h4>
              <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5 mt-1">
                <Mail className="w-3.5 h-3.5" /> {selectedUser.email}
              </p>
            </div>

            <div className="text-left bg-white p-4 rounded-xl border border-slate-100 space-y-2 shadow-xs">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Account System Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition"
              >
                <option value="user">Standard User</option>
                <option value="admin">Administrator (Full Access)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-slate-600 border border-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onUpdateRole(selectedUser._id, role)}
            disabled={formLoading || role === selectedUser.role}
            className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] text-white text-xs font-semibold rounded-xl hover:bg-opacity-90 transition active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            {formLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
