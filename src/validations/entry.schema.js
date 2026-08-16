import { z } from 'zod';
import { CATEGORIES } from '../constants/categories';

/**
 * Zod schema for the Add/Edit Time Entry form.
 * Human-friendly error messages are shown inline by react-hook-form.
 */
export const entrySchema = z.object({
  description: z
    .string()
    .trim()
    .min(3, 'Description must be at least 3 characters')
    .max(200, 'Description must be under 200 characters'),
  hours: z
    .number({ invalid_type_error: 'Hours must be a number' })
    .positive('Hours must be greater than 0')
    .max(24, 'Hours cannot exceed 24 in a single entry'),
  entryDate: z
    .any()
    .refine((val) => val !== null && val !== undefined && val !== '', {
      message: 'Please select a date',
    }),
  category: z.enum(CATEGORIES, {
    errorMap: () => ({ message: 'Please select a category' }),
  }),
  isBillable: z.boolean().default(true),
});

export const defaultEntryValues = {
  description: '',
  hours: undefined,
  entryDate: null,
  category: undefined,
  isBillable: true,
};
