import { z } from 'zod';
import { COUNTRIES } from './countries';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg'];

export const formSchema = z
    .object({
        name: z
            .string()
            .min(1, 'Name is required')
            .refine((val) => val.charAt(0) === val.charAt(0).toUpperCase() && val.charAt(0) !== val.charAt(0).toLowerCase(), {
                message: 'First letter must be uppercase',
            }),
        age: z
            .union([z.string(), z.number()])
            .transform((val) => Number(val))
            .refine((val) => !isNaN(val), { message: 'Age must be a number' })
            .refine((val) => val >= 0, { message: 'Age must not be negative' })
            .refine((val) => val <= 150, { message: 'Age must be realistic' }),
        email: z
            .string()
            .min(1, 'Email is required')
            .refine(
                (val) => {
                    const parts = val.split('@');
                    if (parts.length !== 2) return false;
                    const [local, domain] = parts;
                    if (!local || local.length === 0) return false;
                    if (!domain || !domain.includes('.')) return false;
                    return true;
                },
                { message: 'Invalid email address' }
            ),
        gender: z.string().min(1, 'Gender is required'),
        acceptTerms: z.boolean().refine((val) => val === true, {
            message: 'You must accept the Terms and Conditions',
        }),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
        country: z
            .string()
            .min(1, 'Country is required')
            .refine((val) => COUNTRIES.includes(val), {
                message: 'Country must be from the list',
            }),
        image: z
            .custom<FileList>()
            .optional()
            .refine(
                (files) => {
                    if (!files || files.length === 0) return true;
                    return ALLOWED_TYPES.includes(files[0].type);
                },
                { message: 'Only PNG and JPEG images are allowed' }
            )
            .refine(
                (files) => {
                    if (!files || files.length === 0) return true;
                    return files[0].size <= MAX_FILE_SIZE;
                },
                { message: 'Image must be smaller than 2MB' }
            ),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export type FormSchemaType = z.infer<typeof formSchema>;