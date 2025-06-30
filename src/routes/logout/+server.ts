import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/prisma';

export const POST: RequestHandler = async ({ cookies }) => {
  const sessionToken = cookies.get('session_token');
  if (sessionToken) {
    await prisma.session.deleteMany({ where: { token: sessionToken } });
    cookies.delete('session_token', { path: '/' });
  }
  throw redirect(303, '/login');
};
