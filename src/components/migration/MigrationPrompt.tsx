'use client';

import { useState, useEffect } from 'react';
import { Button } from '@heroui/react';
import Card from '@/components/ui/Card';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/hooks/useUser';
import { Subscription } from '@/types/subscription';
import { Upload, Check, X } from 'lucide-react';
import { toast } from 'sonner';

const STORAGE_KEY = 'subs-manager-data';
const MIGRATION_FLAG = 'subs-migration-done';

export default function MigrationPrompt() {
  const { user } = useUser();
  const [localSubs, setLocalSubs] = useState<Subscription[]>([]);
  const [show, setShow] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!user) return;
    if (localStorage.getItem(MIGRATION_FLAG)) return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const subs = JSON.parse(raw) as Subscription[];
      if (subs.length > 0) {
        setLocalSubs(subs);
        setShow(true);
      }
    } catch {
      // Invalid localStorage data
    }
  }, [user]);

  const handleMigrate = async () => {
    if (!user || localSubs.length === 0) return;
    setMigrating(true);

    const supabase = createClient();
    let completed = 0;

    for (const sub of localSubs) {
      const { error } = await supabase.from('subscriptions').insert({
        user_id: user.id,
        name: sub.name,
        price: sub.price,
        currency: sub.currency,
        frequency: sub.frequency,
        custom_frequency_days: sub.customFrequencyDays,
        category: sub.category,
        next_payment_date: sub.nextPaymentDate,
        start_date: sub.startDate,
        notes: sub.notes,
        is_active: sub.isActive,
        reminder_days_before: sub.reminderDaysBefore,
      });

      if (!error) {
        completed++;
        setProgress(Math.round((completed / localSubs.length) * 100));
      }
    }

    localStorage.setItem(MIGRATION_FLAG, 'true');
    setShow(false);
    toast.success(`Импортировано ${completed} из ${localSubs.length} подписок`);
  };

  const handleDismiss = () => {
    localStorage.setItem(MIGRATION_FLAG, 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/10">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
          <Upload size={20} className="text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Перенести данные в облако?
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Найдено {localSubs.length} подписок в локальном хранилище.
            Перенесите их в Supabase для синхронизации между устройствами.
          </p>

          {migrating && (
            <div className="mt-3">
              <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">{progress}%</p>
            </div>
          )}

          {!migrating && (
            <div className="mt-3 flex gap-2">
              <Button size="sm" onPress={handleMigrate}>
                <Check size={14} />
                Перенести
              </Button>
              <Button size="sm" variant="ghost" onPress={handleDismiss}>
                <X size={14} />
                Не сейчас
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
