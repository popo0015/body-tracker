import type { PageLoad } from './$types.js';

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch('/history');
  if (!res.ok) throw new Error('Failed to load history data');

  const { measurements, meals, workouts } = await res.json();

  return { measurements, meals, workouts };
};
