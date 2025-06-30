import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import bcrypt from 'bcryptjs';
import { prisma } from '$lib/prisma';
import { randomUUID } from 'crypto';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const { email, password } = await request.json();

  if (!email || !password) throw error(400, 'Email and password required');

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw error(401, 'Invalid credentials');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw error(401, 'Invalid credentials');

  // Create session token
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

  await prisma.session.create({
    data: {
      token,
      userId: user.id,
      expiresAt
    }
  });

  cookies.set('session_token', token, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7
  });

  return json({ message: 'Logged in' });
};
