import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/prisma';

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.user) throw error(401, 'Unauthorized');

  const meals = await prisma.meal.findMany({
    where: { userId: locals.user.id },
    orderBy: { date: 'desc' }
  });

  return json(meals);
};

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) throw error(401, 'Unauthorized');
  const data = await request.json();

  if (!data.date) throw error(400, 'Date required');
  if (!data.items) throw error(400, 'Meal items required');

  const meal = await prisma.meal.create({
    data: {
      userId: locals.user.id,
      date: new Date(data.date),
      items: data.items // stored as JSON (array of products)
    }
  });

  return json(meal);
};
