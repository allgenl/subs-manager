import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import pool from '@/lib/db';

const FIELD_MAP: Record<string, string> = {
  name: 'name',
  price: 'price',
  currency: 'currency',
  frequency: 'frequency',
  customFrequencyDays: 'custom_frequency_days',
  category: 'category',
  nextPaymentDate: 'next_payment_date',
  startDate: 'start_date',
  notes: 'notes',
  color: 'color',
  isActive: 'is_active',
  isArchived: 'is_archived',
  reminderDaysBefore: 'reminder_days_before',
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body: Record<string, unknown> = await request.json();

  const sets: string[] = [];
  const values: unknown[] = [];

  for (const [key, dbCol] of Object.entries(FIELD_MAP)) {
    if (key in body) {
      values.push(body[key]);
      sets.push(`${dbCol} = $${values.length}`);
    }
  }

  if (sets.length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
  }

  values.push(new Date().toISOString());
  sets.push(`updated_at = $${values.length}`);
  values.push(id, user.id);

  const { rows } = await pool.query(
    `UPDATE subscriptions SET ${sets.join(', ')}
     WHERE id = $${values.length - 1} AND user_id = $${values.length}
     RETURNING *`,
    values
  );

  if (rows.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { rowCount } = await pool.query(
    'DELETE FROM subscriptions WHERE id = $1 AND user_id = $2',
    [id, user.id]
  );

  if (!rowCount) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ success: true });
}
