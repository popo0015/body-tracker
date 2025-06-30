import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/prisma';

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.user) throw error(401, 'Unauthorized');

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const measurements = await prisma.measurement.findFirst({
    where: {
      userId: locals.user.id,
      date: {
        gte: todayStart,
        lte: todayEnd
      }
    }
  });

  const meals = await prisma.meal.findMany({
    where: {
      userId: locals.user.id,
      date: {
        gte: todayStart,
        lte: todayEnd
      }
    }
  });

  const workouts = await prisma.workout.findMany({
    where: {
      userId: locals.user.id,
      date: {
        gte: todayStart,
        lte: todayEnd
      }
    }
  });

  return json({ measurements, meals, workouts });
};
