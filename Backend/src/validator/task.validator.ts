import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().optional().default(''),
});

export const updateStatusSchema = z.object({
  newStatus: z.enum(['TODO', 'IN_PROGRESS', 'DONE'])
});