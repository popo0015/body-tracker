import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { prisma } from '$lib/prisma.js';

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.user) return new Response('Unauthorized', { status: 401 });

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const measurements = await prisma.measurement.findMany({
    where: {
      userId: locals.user.id,
      date: { gte: thirtyDaysAgo }
    },
    orderBy: { date: 'asc' }
  });

  const meals = await prisma.meal.findMany({
    where: {
      userId: locals.user.id,
      date: { gte: thirtyDaysAgo }
    },
    orderBy: { date: 'asc' }
  });

  return json({ measurements, meals });
};
