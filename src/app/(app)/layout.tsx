'use client';

import { SubscriptionProvider } from "@/context/SubscriptionContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SubscriptionProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Перейти к содержимому
      </a>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 lg:pl-64">
          <Header />
          <main id="main-content" className="p-4 pb-20 lg:p-6 lg:pb-6">{children}</main>
        </div>
      </div>
      <MobileNav />
    </SubscriptionProvider>
  );
}
