'use client';

import { useState, useRef } from 'react';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { Currency } from '@/types/subscription';
import { CURRENCIES, CURRENCY_SYMBOLS } from '@/lib/constants';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Button } from '@heroui/react';
import Card from '@/components/ui/Card';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Download, Upload, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { settings, updateSettings, subscriptions, importData } = useSubscriptions();
  const [showClear, setShowClear] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = {
      subscriptions,
      settings,
      exportedAt: new Date().toISOString(),
      version: 1,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subs-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Данные экспортированы');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (!data.subscriptions || !data.settings) {
          toast.error('Неверный формат файла');
          return;
        }
        importData(data.subscriptions, data.settings);
        toast.success(`Импортировано ${data.subscriptions.length} подписок`);
      } catch {
        toast.error('Ошибка чтения файла');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClear = () => {
    importData([], {
      defaultCurrency: 'RUB',
      theme: 'system',
    });
    toast.success('Все данные удалены');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Настройки</h1>

      <Card>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Основные</h2>
        <div className="space-y-4">
          <Select
            id="currency"
            label="Валюта по умолчанию"
            value={settings.defaultCurrency}
            onChange={(e) => updateSettings({ defaultCurrency: e.target.value as Currency })}
            options={CURRENCIES.map((c) => ({ value: c, label: `${c} (${CURRENCY_SYMBOLS[c]})` }))}
          />
          <Input
            id="budget"
            label="Месячный бюджет (необязательно)"
            type="number"
            min="0"
            step="100"
            placeholder="Например, 5000"
            value={settings.monthlyBudget?.toString() || ''}
            onChange={(e) =>
              updateSettings({
                monthlyBudget: e.target.value ? parseFloat(e.target.value) : undefined,
              })
            }
          />
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Данные</h2>
        <div className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="secondary" onPress={handleExport}>
              <Download size={16} />
              Экспорт данных
            </Button>
            <Button variant="secondary" onPress={() => fileInputRef.current?.click()}>
              <Upload size={16} />
              Импорт данных
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Экспортируйте данные в JSON для резервного копирования или переноса на другое устройство
          </p>
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-4">Опасная зона</h2>
        <Button variant="danger" onPress={() => setShowClear(true)}>
          <Trash2 size={16} />
          Удалить все данные
        </Button>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Это действие удалит все подписки и настройки. Рекомендуем сначала сделать экспорт.
        </p>
      </Card>

      <ConfirmDialog
        open={showClear}
        onClose={() => setShowClear(false)}
        onConfirm={handleClear}
        title="Удалить все данные?"
        message="Все подписки и настройки будут удалены. Это действие нельзя отменить."
        confirmText="Удалить всё"
      />
    </div>
  );
}
