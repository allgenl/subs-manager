import { Subscription } from '@/types/subscription';
import { formatCurrency } from './utils';

export function shareSubscriptionList(subscriptions: Subscription[]) {
  const active = subscriptions.filter((s) => s.isActive);
  const text = active
    .map((s) => `${s.name} — ${formatCurrency(s.price, s.currency)}`)
    .join('\n');

  const fullText = `Мои подписки (${active.length}):\n${text}`;

  if (navigator.share) {
    navigator.share({ title: 'Мои подписки', text: fullText });
  } else {
    navigator.clipboard.writeText(fullText);
  }
}

export function copySubscriptionLink(id: string) {
  const url = `${window.location.origin}/subscriptions/${id}`;
  navigator.clipboard.writeText(url);
}
