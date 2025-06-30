import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import bcrypt from 'bcryptjs';
import { prisma } from '$lib/prisma';

export const POST: RequestHandler = async ({ request }) => {
  const { email, password } = await request.json();

  if (!email || !password) throw error(400, 'Email and password required');

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw error(409, 'User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { email, password: hashedPassword }
  });

  return json({ message: 'User created' });
};
