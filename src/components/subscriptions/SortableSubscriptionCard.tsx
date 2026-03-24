'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import SubscriptionCard from './SubscriptionCard';
import { Subscription } from '@/types/subscription';

export default function SortableSubscriptionCard({ subscription }: { subscription: Subscription }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: subscription.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <button
        className="absolute left-1 top-1/2 -translate-y-1/2 z-10 cursor-grab rounded p-1 text-gray-300 hover:text-gray-500 active:cursor-grabbing dark:text-gray-600 dark:hover:text-gray-400"
        {...attributes}
        {...listeners}
        aria-label="Перетащить"
      >
        <GripVertical size={16} />
      </button>
      <div className="pl-6">
        <SubscriptionCard subscription={subscription} />
      </div>
    </div>
  );
}
