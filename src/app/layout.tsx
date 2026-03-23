import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import { ThemeScript } from "./theme-script";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SubsManager — Менеджер подписок",
  description: "Управляйте подписками, отслеживайте расходы и планируйте бюджет",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <SubscriptionProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 lg:pl-64">
              <Header />
              <main className="p-4 pb-20 lg:p-6 lg:pb-6">{children}</main>
            </div>
          </div>
          <MobileNav />
          <Toaster position="top-right" richColors />
        </SubscriptionProvider>
      </body>
    </html>
  );
}
