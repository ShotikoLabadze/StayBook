"use client";

import { useEffect } from "react";
import AuthBanner from "./components/AuthBanner";
import LoginForm from "./components/LoginForm";

export default function LoginPage() {
  useEffect(() => {
    const navbar = document.querySelector("nav");
    const sidebar = document.querySelector("aside");
    const mainArea = document.querySelector("main");

    if (navbar) navbar.style.display = "none";
    if (sidebar) sidebar.style.display = "none";
    if (mainArea) {
      mainArea.style.minHeight = "100vh";
      mainArea.style.height = "100vh";
    }

    return () => {
      if (navbar) navbar.style.display = "";
      if (sidebar) sidebar.style.display = "";
      if (mainArea) {
        mainArea.style.minHeight = "";
        mainArea.style.height = "";
      }
    };
  }, []);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 font-body bg-neutral-bg selection:bg-secondary/20 transition-colors duration-300">
      <AuthBanner />

      <div className="col-span-1 lg:col-span-7 flex flex-col justify-center px-6 sm:px-16 lg:px-24 xl:px-36 bg-card-bg transition-colors duration-300">
        <LoginForm />
      </div>
    </div>
  );
}
