import { NextRequest, NextResponse } from 'next/server';
import { registerUser, createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email и пароль обязательны' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Пароль минимум 6 символов' }, { status: 400 });
    }

    const user = await registerUser(email, password, name);
    await createSession(user.id, user.email, user.display_name);

    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.display_name } });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Ошибка регистрации';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
