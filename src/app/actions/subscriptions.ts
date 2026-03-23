'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getSubscriptions() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .order('next_payment_date');

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createSubscription(formData: {
  name: string;
  price: number;
  currency: string;
  frequency: string;
  custom_frequency_days?: number;
  category: string;
  next_payment_date: string;
  start_date: string;
  notes?: string;
  is_active: boolean;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Не авторизован');

  const { error } = await supabase
    .from('subscriptions')
    .insert({ ...formData, user_id: user.id });

  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/subscriptions');
}

export async function updateSubscription(
  id: string,
  updates: Record<string, unknown>
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Не авторизован');

  const { error } = await supabase
    .from('subscriptions')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/subscriptions');
}

export async function deleteSubscription(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Не авторизован');

  const { error } = await supabase
    .from('subscriptions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/subscriptions');
}

export async function toggleSubscriptionActive(id: string, isActive: boolean) {
  return updateSubscription(id, { is_active: isActive });
}

export async function getUserProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return data;
}

export async function updateUserProfile(updates: {
  default_currency?: string;
  monthly_budget?: number | null;
  theme?: string;
  display_name?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Не авторизован');

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id);

  if (error) throw new Error(error.message);
  revalidatePath('/settings');
}
