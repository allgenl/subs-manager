import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** GET /api/webhooks — list user's webhooks (stored in profile metadata) */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const webhooks = user.user_metadata?.webhooks || [];
  return NextResponse.json({ data: webhooks });
}

/** POST /api/webhooks — register a new webhook URL */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { url: string; events: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.url || !body.url.startsWith('http')) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 422 });
  }

  const existing = user.user_metadata?.webhooks || [];
  const webhook = {
    id: crypto.randomUUID(),
    url: body.url,
    events: body.events || ['subscription.created', 'subscription.deleted'],
    createdAt: new Date().toISOString(),
  };

  const { error } = await supabase.auth.updateUser({
    data: { webhooks: [...existing, webhook] },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: webhook }, { status: 201 });
}

/** DELETE /api/webhooks — remove a webhook by id (pass ?id=xxx) */
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
  }

  const existing = user.user_metadata?.webhooks || [];
  const filtered = existing.filter((w: { id: string }) => w.id !== id);

  const { error } = await supabase.auth.updateUser({
    data: { webhooks: filtered },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
