'use client';

import { useState } from 'react';
import { useSubscriptions } from '@/context/SubscriptionContext';
import Input from '@/components/ui/input';
import Card from '@/components/ui/Card';
import { Button } from '@heroui/react';
import { Plus, Trash2, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';

const FOLDER_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#22c55e', '#06b6d4'];

export default function FolderManager() {
  const { settings, updateSettings } = useSubscriptions();
  const [name, setName] = useState('');
  const [color, setColor] = useState(FOLDER_COLORS[0]);

  const folders = settings.folders || [];

  const handleAdd = () => {
    if (!name.trim()) return;
    const id = crypto.randomUUID();
    updateSettings({ folders: [...folders, { id, name: name.trim(), color }] });
    setName('');
    toast.success('Папка создана');
  };

  const handleDelete = (id: string) => {
    updateSettings({ folders: folders.filter((f) => f.id !== id) });
    toast.success('Папка удалена');
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <FolderOpen size={16} className="text-gray-500" />
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Папки</h2>
      </div>

      {folders.length > 0 && (
        <div className="space-y-2 mb-4">
          {folders.map((f) => (
            <div key={f.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: f.color }} />
                <span className="text-sm text-gray-900 dark:text-gray-100">{f.name}</span>
              </div>
              <button onClick={() => handleDelete(f.id)} className="rounded p-1 text-gray-400 hover:text-red-500">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <Input
          id="folderName"
          label="Название"
          placeholder="Например: Работа"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Цвет
          </label>
          <div className="flex flex-wrap gap-2">
            {FOLDER_COLORS.map((c) => (
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
          Добавить папку
        </Button>
      </div>
    </Card>
  );
}
