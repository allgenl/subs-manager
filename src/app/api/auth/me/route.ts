import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser, createSession } from '@/lib/auth';
import pool from '@/lib/db';

export async function GET() {
  const user = await getSessionUser();
  return NextResponse.json({ user: user ?? null });
}

export async function PATCH(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { displayName } = await request.json();

  await pool.query(
    'UPDATE public.users SET display_name = $1 WHERE id = $2',
    [displayName, user.id]
  );

  // Refresh session with new name
  await createSession(user.id, user.email, displayName);

  return NextResponse.json({ success: true });
}
