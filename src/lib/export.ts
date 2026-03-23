import { Subscription, Currency } from '@/types/subscription';
import { formatCurrency } from '@/lib/utils';
import { toMonthlyCost, totalMonthlySpending } from '@/lib/calculations';
import { CATEGORY_CONFIG, FREQUENCY_LABELS } from '@/lib/constants';

export function exportToCSV(subscriptions: Subscription[]) {
  const Papa = require('papaparse');

  const data = subscriptions.map((sub) => ({
    Название: sub.name,
    Цена: sub.price,
    Валюта: sub.currency,
    'В месяц': Math.round(toMonthlyCost(sub) * 100) / 100,
    Частота: FREQUENCY_LABELS[sub.frequency],
    Категория: CATEGORY_CONFIG[sub.category].label,
    'Следующий платёж': sub.nextPaymentDate,
    Статус: sub.isActive ? 'Активна' : 'На паузе',
  }));

  const csv = Papa.unparse(data);
  downloadFile(csv, 'subscriptions.csv', 'text/csv');
}

export async function exportToPDF(subscriptions: Subscription[], currency: Currency) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();

  const active = subscriptions.filter((s) => s.isActive);
  const total = totalMonthlySpending(subscriptions);

  // Title
  doc.setFontSize(18);
  doc.text('SubsManager - Отчёт по подпискам', 14, 20);

  // Summary
  doc.setFontSize(12);
  doc.text(`Дата: ${new Date().toLocaleDateString('ru-RU')}`, 14, 32);
  doc.text(`Всего подписок: ${subscriptions.length} (${active.length} активных)`, 14, 40);
  doc.text(`Ежемесячные расходы: ${formatCurrency(total, currency)}`, 14, 48);
  doc.text(`Годовые расходы: ${formatCurrency(total * 12, currency)}`, 14, 56);

  // Table header
  let y = 70;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Название', 14, y);
  doc.text('Цена', 90, y);
  doc.text('В месяц', 120, y);
  doc.text('Категория', 155, y);

  doc.setFont('helvetica', 'normal');
  y += 8;

  // Table rows
  for (const sub of subscriptions) {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(sub.name.substring(0, 25), 14, y);
    doc.text(formatCurrency(sub.price, sub.currency), 90, y);
    doc.text(formatCurrency(toMonthlyCost(sub), sub.currency), 120, y);
    doc.text(CATEGORY_CONFIG[sub.category].label, 155, y);
    y += 7;
  }

  doc.save('subscriptions-report.pdf');
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
