import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { GlobalChatWrapper } from "../components/GlobalChatWrapper";
import { AuthProvider } from "../context/AuthContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "StayBook",
  description: "Bespoke Concierge & Trip Planner",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
            >
              <div className="h-screen w-screen bg-[var(--color-neutral-bg)] flex flex-col overflow-hidden transition-colors duration-300">
                <Navbar />
                <div className="flex flex-1 w-full overflow-hidden">
                  <Sidebar />
                  <main className="flex-1 min-w-0 h-[calc(100vh-5rem)] overflow-y-auto">
                    {children}
                  </main>
                </div>
              </div>
              <Toaster position="top-right" richColors />
              <GlobalChatWrapper />
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
