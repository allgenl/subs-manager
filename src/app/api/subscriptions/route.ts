import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SubscriptionFormSchema } from '@/lib/schemas';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .order('next_payment_date');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, count: data.length });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const result = SubscriptionFormSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: result.error.issues },
      { status: 422 }
    );
  }

  const { data: sub, error } = await supabase
    .from('subscriptions')
    .insert({
      user_id: user.id,
      name: result.data.name,
      price: result.data.price,
      currency: result.data.currency,
      frequency: result.data.frequency,
      custom_frequency_days: result.data.customFrequencyDays,
      category: result.data.category,
      next_payment_date: result.data.nextPaymentDate,
      start_date: result.data.startDate,
      notes: result.data.notes,
      is_active: result.data.isActive,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: sub }, { status: 201 });
}
