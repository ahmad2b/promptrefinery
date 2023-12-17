import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import dotenv from 'dotenv';
import * as z from 'zod';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getOpenAIKey = () => {
	dotenv.config();

	if (!process.env.OPENAI_API_KEY) {
		throw new Error('OPENAI_API_KEY not found');
	}

	return process.env.OPENAI_API_KEY;
};

export const getGoogleAPIKey = () => {
	dotenv.config();

	if (!process.env.GOOGLE_API_KEY) {
		throw new Error('OPENAI_API_KEY not found');
	}

	return process.env.GOOGLE_API_KEY;
}

export const PromptValidator = z.object({
	prompt: z.string().min(10, {
		message: 'Prompt must be at least 10 characters.',
	}),
});

export type PromptRequest = z.infer<typeof PromptValidator>;
