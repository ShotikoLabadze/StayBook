"use client";

import api from "@/services/api";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, Mail, Trash2, User as UserIcon } from "lucide-react";
import React, { useState } from "react";
import UserModal from "./UserModal";

interface UsersTabProps {
  users: any[];
  setUsers: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function UsersTab({ users, setUsers }: UsersTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleOpenView = (user: any) => {
    setSelectedUser(user);
    setMessage(null);
    setIsModalOpen(true);
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    setFormLoading(true);
    setMessage(null);
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)),
      );

      setMessage({ type: "success", text: "User role updated successfully!" });
      setTimeout(() => setIsModalOpen(false), 800);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update user role." });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this user account?",
      )
    )
      return;

    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      alert("Failed to delete user account.");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
      <div className="divide-y divide-slate-100 max-h-[75vh] overflow-y-auto">
        <AnimatePresence initial={false}>
          {users.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-400">
              No registered users found.
            </div>
          ) : (
            users.map((u) => (
              <motion.div
                key={u._id}
                onClick={() => handleOpenView(u)}
                className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition duration-200 cursor-pointer group"
              >
                <div className="flex items-center space-x-4">
                  {u.avatar ? (
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-100 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-50 shrink-0">
                      <UserIcon className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-[#0f172a]">
                        {u.name}
                      </h4>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          u.role === "admin"
                            ? "bg-red-50 text-red-600 border border-red-100/50"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {u.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> {u.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition duration-150">
                    <span className="text-xs text-slate-400 flex items-center gap-1 mr-2">
                      <Eye className="w-3.5 h-3.5" /> view details
                    </span>
                    <button
                      onClick={(e) => handleDeleteUser(e, u._id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50/50 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-right shrink-0 min-w-[70px] hidden sm:block">
                    <span className="text-xs font-mono text-slate-300">
                      #{u._id.slice(-4)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <UserModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            selectedUser={selectedUser}
            formLoading={formLoading}
            message={message}
            onUpdateRole={handleUpdateRole}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
