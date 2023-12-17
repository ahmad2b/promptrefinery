import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
	GoogleGenerativeAI,
	HarmCategory,
	HarmBlockThreshold,
} from '@google/generative-ai';

import { PromptValidator, getGoogleAPIKey } from '@/lib/utils';

const MODEL_NAME = 'gemini-pro';
const API_KEY = getGoogleAPIKey();

const genAI = new GoogleGenerativeAI(API_KEY);

async function generate(prompt: string) {
	const model = genAI.getGenerativeModel({ model: MODEL_NAME });
	const generationConfig = {
		temperature: 0.9,
		topK: 1,
		topP: 1,
		maxOutputTokens: 2048,
	};

	const safetySettings = [
		{
			category: HarmCategory.HARM_CATEGORY_HARASSMENT,
			threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
		},
		{
			category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
			threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
		},
		{
			category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
			threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
		},
		{
			category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
			threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
		},
	];

	const result = await model.generateContent(prompt);

	const response = await result.response;

	return response;
}

export async function POST(request: NextRequest) {
	console.log('GOOGLE CREATE REQUEST RECIEVED');

	const cookieStore = cookies();
	const body = await request.json();

	console.log(body);

	const data = body.data;

	const response = await generate(body);

	// console.log(response);

	return NextResponse.json(response, { status: 200 });
}
