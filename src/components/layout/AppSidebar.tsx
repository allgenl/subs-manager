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
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { formatCurrency, cn } from '@/lib/utils';
import { toMonthlyCost } from '@/lib/calculations';
import Sparkline from '@/components/ui/Sparkline';
import { useMemo, useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  SidebarSeparator,
} from '@/components/ui/sidebar';

const navItems = [
  { href: '/', label: 'Главная', icon: LayoutDashboard },
  { href: '/subscriptions', label: 'Подписки', icon: CreditCard },
  { href: '/analytics', label: 'Аналитика', icon: BarChart3 },
  { href: '/calendar', label: 'Календарь', icon: Calendar },
  { href: '/archive', label: 'Архив', icon: Archive },
  { href: '/settings', label: 'Настройки', icon: Settings },
];

const menuButtonClass = (isActive: boolean) =>
  cn(
    'rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
    isActive
      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'
  );

export function AppSidebar() {
  const pathname = usePathname();
  const { totalMonthly, settings, subscriptions, convertCurrency } = useSubscriptions();
  const { user, signOut } = useUser();
  const [mounted, setMounted] = useState(false);
  const cur = settings.defaultCurrency;

  useEffect(() => { setMounted(true); }, []);

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

  const displayName = mounted && user
    ? (user.displayName || user.email.split('@')[0])
    : '—';
  const initials = displayName !== '—'
    ? displayName.slice(0, 2).toUpperCase()
    : 'SM';

  return (
    <Sidebar className="border-r-0">
      {/* User section */}
      <SidebarHeader className="px-5 py-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 shrink-0">
            <AvatarFallback className="bg-linear-to-br from-blue-300 via-blue-400 to-indigo-500 text-white text-sm font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-sidebar-foreground leading-tight">
              {displayName}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/50 mt-0.5">
              {mounted && user ? user.email : ''}
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* Nav */}
      <SidebarContent className="px-3">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
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
                      className={menuButtonClass(isActive)}
                    >
                      <item.icon className="h-4.5 w-4.5 shrink-0" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="px-3 py-4 gap-0">
        {/* Monthly spend widget */}
        <div className="mx-2 mb-3 rounded-xl bg-sidebar-accent/60 px-3 py-2.5">
          <div className="flex items-end justify-between mb-0.5">
            <p className="text-xs text-sidebar-foreground/50">В месяц</p>
            <Sparkline data={monthlyData} width={56} height={18} />
          </div>
          <p className="text-base font-bold text-sidebar-foreground">
            {formatCurrency(totalMonthly, settings.defaultCurrency)}
          </p>
        </div>

        <SidebarSeparator className="mx-2 my-2" />

        <SidebarMenu className="gap-0.5">
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/profile" />}
              isActive={pathname === '/profile'}
              className={menuButtonClass(pathname === '/profile')}
            >
              <UserCircle className="h-4.5 w-4.5 shrink-0" />
              <span>Профиль</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/faq" />}
              className={menuButtonClass(false)}
            >
              <HelpCircle className="h-4.5 w-4.5 shrink-0" />
              <span>Помощь</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={signOut}
              className={menuButtonClass(false)}
            >
              <LogOut className="h-4.5 w-4.5 shrink-0" />
              <span>Выйти</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
