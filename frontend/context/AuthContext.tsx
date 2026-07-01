"use client";

import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useNotificationStore } from "../store/useNotificationStore";

interface AuthContextType {
  user: any;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setToken(savedToken);
      setUser(parsedUser);

      useNotificationStore
        .getState()
        .initSocket(parsedUser.id || parsedUser._id);
      useNotificationStore.getState().fetchNotifications();
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    const { accessToken, user: userData } = response.data;

    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(accessToken);
    setUser(userData);

    useNotificationStore.getState().initSocket(userData.id || userData._id);
    useNotificationStore.getState().fetchNotifications();

    await new Promise((resolve) => setTimeout(resolve, 100));

    const searchParams = new URLSearchParams(window.location.search);
    const redirectUrl = searchParams.get("redirect");

    if (redirectUrl) {
      router.push(redirectUrl);
    } else if (userData?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  const register = async (name: string, email: string, password: string) => {
    await api.post("/auth/register", { name, email, password });
    await login(email, password);
  };

  const logout = () => {
    useNotificationStore.getState().disconnectSocket();

    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
