import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getGoogleAPIKey } from '@/lib/utils';

const MODEL_NAME = 'gemini-pro';
const API_KEY = getGoogleAPIKey();
const genAI = new GoogleGenerativeAI(API_KEY);

async function generate(prompt: string) {
	const model = genAI.getGenerativeModel({ model: MODEL_NAME });
	const result = await model.generateContent(prompt);

	return result.response;
}

export async function POST(request: NextRequest) {
	const body = await request.json();
	const prompt = body.prompt;

	if (!prompt) {
		return NextResponse.json('Bad Request', { status: 400 });
	}

	const response = await generate(prompt);

	return NextResponse.json(response, { status: 200 });
}
