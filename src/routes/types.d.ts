import type { User } from '@prisma/client';

declare namespace App {
  interface Locals {
    user: User | null;
  }
}
