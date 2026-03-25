import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import RegisterSW from "@/components/pwa/RegisterSW";
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
  title: {
    default: "SubsManager — Менеджер подписок",
    template: "%s | SubsManager",
  },
  description: "Управляйте подписками, отслеживайте расходы и планируйте бюджет",
  manifest: "/manifest.json",
  metadataBase: new URL("https://subs.allgenl.pro"),
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "SubsManager",
    title: "SubsManager — Менеджер подписок",
    description: "Управляйте подписками, отслеживайте расходы и планируйте бюджет",
  },
  twitter: {
    card: "summary",
    title: "SubsManager — Менеджер подписок",
    description: "Управляйте подписками, отслеживайте расходы и планируйте бюджет",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SubsManager",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value;
  const isDark = theme === "dark";

  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased${isDark ? " dark" : ""}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-full bg-background text-foreground">
        {children}
        <RegisterSW />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
