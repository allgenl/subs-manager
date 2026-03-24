import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email и пароль обязательны' }, { status: 400 });
    }

    const user = await authenticateUser(email, password);
    await createSession(user.id, user.email, user.display_name);

    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.display_name } });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Ошибка входа';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
