import type { PageLoad } from './$types.js';
export const load: PageLoad = async ({ fetch }: Parameters<PageLoad>[0]) => {
  const res = await fetch('/history');
  if (!res.ok) throw new Error('Failed to load history data');
  const data = await res.json();

  return {
    measurements: data.measurements,
    meals: data.meals
  };
};