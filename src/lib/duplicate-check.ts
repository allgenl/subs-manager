import { Subscription } from '@/types/subscription';

export function findDuplicates(subscriptions: Subscription[], name: string): Subscription[] {
  const normalized = name.toLowerCase().trim();
  return subscriptions.filter(
    (s) => s.name.toLowerCase().trim() === normalized ||
           s.name.toLowerCase().includes(normalized) ||
           normalized.includes(s.name.toLowerCase())
  );
}
