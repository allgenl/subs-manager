'use client';

import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { AppSidebar } from "@/components/layout/AppSidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import CommandPalette from "@/components/layout/CommandPalette";
import OnboardingTour from "@/components/onboarding/OnboardingTour";
import ScrollToTop from "@/components/ui/ScrollToTop";
import NavigationLoader from "@/components/ui/NavigationLoader";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function ClientAppLayout({
  children,
  defaultSidebarOpen,
}: {
  children: React.ReactNode;
  defaultSidebarOpen: boolean;
}) {
  return (
    <SubscriptionProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Перейти к содержимому
      </a>
      <SidebarProvider defaultOpen={defaultSidebarOpen}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <main id="main-content" className="p-4 pb-20 lg:p-6 lg:pb-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
      <MobileNav />
      <CommandPalette />
      <OnboardingTour />
      <ScrollToTop />
      <NavigationLoader />
    </SubscriptionProvider>
  );
}
