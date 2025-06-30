import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/prisma';

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.user) throw error(401, 'Unauthorized');
  const measurements = await prisma.measurement.findMany({
    where: { userId: locals.user.id },
    orderBy: { date: 'desc' }
  });
  return json(measurements);
};

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) throw error(401, 'Unauthorized');
  const data = await request.json();

  // Validation (basic)
  if (!data.date) throw error(400, 'Date required');

  const measurement = await prisma.measurement.create({
    data: {
      userId: locals.user.id,
      date: new Date(data.date),
      waist: data.waist,
      hips: data.hips,
      thigh: data.thigh,
      arm: data.arm,
      chest: data.chest,
      underNavel: data.underNavel,
      weight: data.weight
    }
  });

  return json(measurement);
};
