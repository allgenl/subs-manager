'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CreditCard,
  BarChart3,
  Calendar,
  Settings,
  UserCircle,
  Archive,
} from 'lucide-react';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { formatCurrency } from '@/lib/utils';
import { toMonthlyCost } from '@/lib/calculations';
import Sparkline from '@/components/ui/Sparkline';
import { useMemo } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const navItems = [
  { href: '/', label: 'Главная', icon: LayoutDashboard },
  { href: '/subscriptions', label: 'Подписки', icon: CreditCard },
  { href: '/analytics', label: 'Аналитика', icon: BarChart3 },
  { href: '/calendar', label: 'Календарь', icon: Calendar },
  { href: '/archive', label: 'Архив', icon: Archive },
  { href: '/settings', label: 'Настройки', icon: Settings },
  { href: '/profile', label: 'Профиль', icon: UserCircle },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { totalMonthly, settings, subscriptions, convertCurrency } = useSubscriptions();
  const cur = settings.defaultCurrency;

  const monthlyData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      let total = 0;
      for (const sub of subscriptions) {
        if (!sub.isActive) continue;
        const start = new Date(sub.startDate);
        if (start <= date) total += toMonthlyCost(sub, cur, convertCurrency);
      }
      return Math.round(total);
    });
  }, [subscriptions, cur, convertCurrency]);

  return (
    <Sidebar>
      <SidebarHeader className="h-16 flex-row items-center gap-2 px-6 border-b border-sidebar-border">
        <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400 shrink-0" />
        <span className="text-lg font-bold">SubsManager</span>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={isActive}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="rounded-lg bg-sidebar-accent p-3">
          <div className="flex items-end justify-between mb-1">
            <p className="text-xs text-sidebar-foreground/60">В месяц</p>
            <Sparkline data={monthlyData} width={60} height={20} />
          </div>
          <p className="text-lg font-bold">
            {formatCurrency(totalMonthly, settings.defaultCurrency)}
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
