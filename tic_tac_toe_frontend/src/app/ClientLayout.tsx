'use client';
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/utils/auth.tsx";
import { TopNav } from "@/components/TopNav";
import { Sidebar } from "@/components/Sidebar";
import React, { useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [selectedGameId, setSelectedGameId] = useState<string | null>(
    typeof window !== "undefined" && window.location.hash ? window.location.hash.slice(1) : null
  );
  return (
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <AuthProvider>
        <TopNav />
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar onSelectGame={setSelectedGameId} selectedGameId={selectedGameId} />
          <main style={{ flex: 1, padding: "2rem", background: "var(--background)" }}>
            {children}
          </main>
        </div>
      </AuthProvider>
    </body>
  );
}
