import type { Handle } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';

// Extend App.Locals to include 'user'
declare global {
  namespace App {
    interface Locals {
      user: any | null;
    }
  }
}

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('session_token');

  if (token) {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    });

    event.locals.user = session?.user ?? null;
  } else {
    event.locals.user = null;
  }

  return resolve(event);
};
