'use client';

import { useState } from 'react';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { CustomCategory } from '@/types/subscription';
import Input from '@/components/ui/input';
import Card from '@/components/ui/Card';
import { Button } from '@heroui/react';
import { Plus, Trash2, Palette } from 'lucide-react';
import { toast } from 'sonner';

const PRESET_COLORS = [
  '#E50914', '#1DB954', '#9146FF', '#4285F4', '#FF9500',
  '#1DA1F2', '#34C759', '#AF52DE', '#FF2D55', '#5856D6',
];

export default function CustomCategoryManager() {
  const { settings, updateSettings } = useSubscriptions();
  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);

  const categories = settings.customCategories || [];

  const handleAdd = () => {
    if (!name.trim()) {
      toast.error('Введите название категории');
      return;
    }

    const id = name.trim().toLowerCase().replace(/\s+/g, '-');
    if (categories.some((c) => c.id === id)) {
      toast.error('Такая категория уже существует');
      return;
    }

    const newCat: CustomCategory = { id, label: name.trim(), color };
    updateSettings({ customCategories: [...categories, newCat] });
    setName('');
    toast.success('Категория добавлена');
  };

  const handleDelete = (id: string) => {
    updateSettings({ customCategories: categories.filter((c) => c.id !== id) });
    toast.success('Категория удалена');
  };

  return (
    <Card>
      <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Свои категории
      </h2>

      {categories.length > 0 && (
        <div className="space-y-2 mb-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-sm text-gray-900 dark:text-gray-100">{cat.label}</span>
              </div>
              <button
                onClick={() => handleDelete(cat.id)}
                className="rounded p-1 text-gray-400 hover:text-red-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <Input
          id="categoryName"
          label="Название"
          placeholder="Например: Транспорт"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <Palette size={14} className="inline mr-1" />
            Цвет
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`h-7 w-7 rounded-full border-2 transition-transform ${
                  color === c ? 'border-gray-900 scale-110 dark:border-white' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
        <Button size="sm" onPress={handleAdd}>
          <Plus size={14} />
          Добавить категорию
        </Button>
      </div>
    </Card>
  );
}
