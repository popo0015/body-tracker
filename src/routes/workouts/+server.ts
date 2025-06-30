import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { prisma } from '$lib/prisma.js';

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) throw error(401, 'Unauthorized');

  const data = await request.json();

  if (!data.date || !data.exercises) throw error(400, 'Date and exercises are required');

  if (!Array.isArray(data.exercises) || data.exercises.length === 0) {
    throw error(400, 'Exercises must be a non-empty array');
  }

  const workout = await prisma.workout.create({
    data: {
      userId: locals.user.id,
      date: new Date(data.date),
      exercises: data.exercises
    }
  });

  return json(workout);
};
