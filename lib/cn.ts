import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Joins class names; later Tailwind classes win over earlier ones (px-2 + px-4 -> px-4). */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
