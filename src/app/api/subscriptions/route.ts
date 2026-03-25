import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import pool from '@/lib/db';
import { Subscription } from '@/types/subscription';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbToSub(row: any): Subscription {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    currency: row.currency,
    frequency: row.frequency,
    customFrequencyDays: row.custom_frequency_days ?? undefined,
    category: row.category,
    nextPaymentDate: row.next_payment_date,
    startDate: row.start_date,
    notes: row.notes ?? undefined,
    color: row.color ?? undefined,
    isActive: row.is_active,
    isArchived: row.is_archived ?? false,
    reminderDaysBefore: row.reminder_days_before ?? undefined,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { rows } = await pool.query(
    'SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY next_payment_date',
    [user.id]
  );

  return NextResponse.json({ data: rows.map(dbToSub) });
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();

  const { rows } = await pool.query(
    `INSERT INTO subscriptions
      (user_id, name, price, currency, frequency, custom_frequency_days,
       category, next_payment_date, start_date, notes, color, is_active, reminder_days_before)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
     RETURNING *`,
    [
      user.id, body.name, body.price, body.currency, body.frequency,
      body.customFrequencyDays ?? null, body.category, body.nextPaymentDate,
      body.startDate, body.notes ?? null, body.color ?? null,
      body.isActive ?? true, body.reminderDaysBefore ?? null,
    ]
  );

  return NextResponse.json({ data: dbToSub(rows[0]) }, { status: 201 });
}
