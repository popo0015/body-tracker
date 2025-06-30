import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
  cookies.delete('session_user', { path: '/' });
  return json({ message: 'Logged out' });
};
