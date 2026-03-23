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
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 lg:pl-64">
          <Header />
          <main className="p-4 pb-20 lg:p-6 lg:pb-6">{children}</main>
        </div>
      </div>
      <MobileNav />
    </SubscriptionProvider>
  );
}
