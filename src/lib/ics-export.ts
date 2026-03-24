import { Subscription } from '@/types/subscription';
import { FREQUENCY_LABELS } from '@/lib/constants';

function formatICSDate(dateStr: string): string {
  return dateStr.replace(/-/g, '') + 'T090000';
}

function getRecurrenceRule(sub: Subscription): string {
  switch (sub.frequency) {
    case 'monthly':
      return 'RRULE:FREQ=MONTHLY';
    case 'yearly':
      return 'RRULE:FREQ=YEARLY';
    case 'weekly':
      return 'RRULE:FREQ=WEEKLY';
    case 'custom':
      return `RRULE:FREQ=DAILY;INTERVAL=${sub.customFrequencyDays || 30}`;
    default:
      return '';
  }
}

export function exportToICS(subscriptions: Subscription[]) {
  const active = subscriptions.filter((s) => s.isActive);

  const events = active.map((sub) => {
    const dtStart = formatICSDate(sub.nextPaymentDate);
    const rrule = getRecurrenceRule(sub);

    return [
      'BEGIN:VEVENT',
      `DTSTART:${dtStart}`,
      `DURATION:PT1H`,
      `SUMMARY:💳 ${sub.name} — платёж`,
      `DESCRIPTION:${sub.price} ${sub.currency} (${FREQUENCY_LABELS[sub.frequency]})`,
      rrule,
      `UID:${sub.id}@subsmanager`,
      'END:VEVENT',
    ].join('\r\n');
  });

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SubsManager//Payments//RU',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:SubsManager Платежи',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'subsmanager-payments.ics';
  a.click();
  URL.revokeObjectURL(url);
}
