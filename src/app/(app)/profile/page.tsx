'use client';

import { useState, useEffect } from 'react';
import { Button } from '@heroui/react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import PageTransition from '@/components/motion/PageTransition';
import { useUser } from '@/hooks/useUser';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { formatCurrency } from '@/lib/utils';
import { User, Calendar, CreditCard, Save } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

export default function ProfilePage() {
  const { user, loading: userLoading } = useUser();
  const { subscriptions, totalMonthly, activeCount, settings } = useSubscriptions();

  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.user_metadata?.full_name || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: { full_name: displayName },
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Профиль обновлён');
    }
    setSaving(false);
  };

  if (userLoading) {
    return (
      <div className="space-y-6 max-w-2xl animate-pulse">
        <div className="h-7 w-24 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="space-y-2">
              <div className="h-5 w-32 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-48 rounded bg-gray-100 dark:bg-gray-800" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const createdAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '—';

  const totalSubs = subscriptions.length;
  const pausedCount = totalSubs - activeCount;

  return (
    <PageTransition>
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Профиль</h1>

        <Card>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {displayName || 'Пользователь'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              id="displayName"
              label="Имя"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Ваше имя"
            />
            <Button onPress={handleSave} isDisabled={saving}>
              <Save size={16} />
              {saving ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Статистика
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/30">
                <CreditCard size={18} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Подписок</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {activeCount} активных, {pausedCount} на паузе
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-50 p-2 dark:bg-emerald-900/30">
                <CreditCard size={18} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">В месяц</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {formatCurrency(totalMonthly, settings.defaultCurrency)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-violet-50 p-2 dark:bg-violet-900/30">
                <Calendar size={18} className="text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Дата регистрации</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {createdAt}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
