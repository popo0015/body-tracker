import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/prisma';

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.user) throw error(401, 'Unauthorized');

  const workouts = await prisma.workout.findMany({
    where: { userId: locals.user.id },
    orderBy: { date: 'desc' }
  });

  return json(workouts);
};

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) throw error(401, 'Unauthorized');
  const data = await request.json();

  if (!data.date) throw error(400, 'Date required');

  // Adjust properties to match your Prisma schema for workouts
  const workout = await prisma.workout.create({
    data: {
      userId: locals.user.id,
      date: new Date(data.date),
      exercises: data.exercises // Assuming exercises is JSON or array, adapt as needed
    }
  });

  return json(workout);
};
