import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { prisma } from '$lib/prisma.js';

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) throw error(401, 'Unauthorized');

  const data = await request.json();

  if (!data.date || !data.items) throw error(400, 'Date and items are required');

  // Validate items is a non-empty array
  if (!Array.isArray(data.items) || data.items.length === 0) {
    throw error(400, 'Items must be a non-empty array');
  }

  const meal = await prisma.meal.create({
    data: {
      userId: locals.user.id,
      date: new Date(data.date),
      items: data.items // Prisma handles JSON column automatically
    }
  });

  return json(meal);
};