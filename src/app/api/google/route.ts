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

	const parts = [
		{ text: ' ' },
		{
			text: 'input: Write an article about the benefits of meditation for mental health.',
		},
		{
			text: 'output: {\n    "response_evaluation": {\n        "task": {\n            "score": 8,\n            "description": "Clear task of writing an article about meditation\'s benefits for mental health."\n        },\n        "content": {\n            "score": 6,\n            "description": "Mentions meditation and mental health but lacks specificity on aspects like type of meditation or specific mental health benefits."\n        },\n        "exemplar": {\n            "score": 0,\n            "description": "No exemplars provided. Including a sample paragraph or reference article could improve clarity."\n        },\n        "persona": {\n            "score": 0,\n            "description": "No persona defined. Is the article for beginners, practitioners, or healthcare professionals?"\n        },\n        "format": {\n            "score": 7,\n            "description": "Format is implied to be a written article."\n        },\n        "tone": {\n            "score": 5,\n            "description": "Tone is neutral, but specifying whether it should be academic, casual, or inspiring could be helpful."\n        },\n        "prompt_score": 4.3,\n        "improvement_suggestions": {\n            "description": "Include specific aspects of meditation and mental health to explore, provide an exemplar or style guide, define the target audience (persona), and clarify the desired tone."\n        },\n        "improved_prompt": [{\n            "description": "Can you write a comprehensive article about mindfulness meditation and its benefits for reducing anxiety and stress in beginners? Please use a casual and inspiring tone, similar to the style found in \'Mindful Magazine\'."\n        }]\n    }\n}',
		},
		{
			text: 'input: I need a script for a 3-minute YouTube video on the latest smartphone trends.',
		},
		{
			text: 'output: {\n    "response_evaluation": {\n        "task": {\n            "score": 9,\n            "description": "The task is specific – creating a script for a short YouTube video on smartphone trends."\n        },\n        "content": {\n            "score": 7,\n            "description": "The content is clear but could benefit from more details like the specific aspects of smartphone trends to cover."\n        },\n        "exemplar": {\n            "score": 2,\n            "description": "No exemplar provided. A sample script or a link to a similar video could enhance the prompt."\n        },\n        "persona": {\n            "score": 3,\n            "description": "The user\'s expertise in tech and scriptwriting is unclear, impacting the response\'s depth and style."\n        },\n        "format": {\n            "score": 10,\n            "description": "The format is well-defined as a script for a YouTube video."\n        },\n        "tone": {\n            "score": 4,\n            "description": "Tone is not specified. Should it be professional, casual, or humorous?"\n        },\n        "prompt_score": 5.8,\n        "improvement_suggestions": {\n            "description": "Specify the key focus areas in smartphone trends, provide a link to a similar video for style reference, clarify your expertise level in the subject, and mention the desired tone."\n        },\n        "improved_prompt": [{\n            "description": "Please write a script for a 3-minute YouTube video focusing on the latest advances in smartphone cameras and battery life. I\'m looking for a style similar to MKBHD\'s tech reviews, engaging and informative for a tech-savvy audience. I have basic knowledge of the subject."\n        }]\n    }\n}',
		},
		{
			text: 'input: Give me some tips for improving my public speaking skills.',
		},
		{
			text: 'output: {\n    "response_evaluation": {\n        "task": {\n            "score": 8,\n            "description": "Task is to provide tips on improving public speaking."\n        },\n        "content": {\n            "score": 6,\n            "description": "General request for public speaking tips, but lacks specificity in areas of interest or current skill level."\n        },\n        "exemplar": {\n            "score": 0,\n            "description": "No specific exemplars or scenarios provided where these skills are applied."\n        },\n        "persona": {\n            "score": 2,\n            "description": "User\'s experience level in public speaking is unclear, affecting the depth of the response."\n        },\n        "format": {\n            "score": 7,\n            "description": "Implied format is a list of tips or advice."\n        },\n        "tone": {\n            "score": 5,\n            "description": "Tone is undefined. Should the tips be formal, casual, or motivational?"\n        },\n        "prompt_score": 4.7,\n        "improvement_suggestions": {\n            "description": "Include specific areas of public speaking to focus on, provide context about your current level, and specify the tone you prefer for the tips."\n        },\n        "improved_prompt": [{\n            "description": "Could you offer detailed tips for beginners to enhance their public speaking, particularly in managing nervousness and engaging the audience? I\'d like the advice to be motivational and easy to understand."\n        }]\n    }\n}',
		},
		{ text: 'input: Describe the history of the Roman Empire.' },
		{
			text: 'output: {\n    "response_evaluation": {\n        "task": {\n            "score": 10,\n            "description": "Direct task of describing the history of the Roman Empire."\n        },\n        "content": {\n            "score": 8,\n            "description": "Broad topic but clearly defined. Could specify particular aspects like political, military, or cultural history."\n        },\n        "exemplar": {\n            "score": 0,\n            "description": "No exemplar given. A specific historical analysis or style of presentation could guide the response."\n        },\n        "persona": {\n            "score": 1,\n            "description": "No indication of the user\'s knowledge level on the topic, which would influence the complexity of the content."\n        },\n        "format": {\n            "score": 6,\n            "description": "Format seems to be a written historical description but could be more specific."\n        },\n        "tone": {\n            "score": 4,\n            "description": "Tone is unspecified. Academic, storytelling, or summarized?"\n        },\n        "prompt_score": 4.8,\n        "improvement_suggestions": {\n            "description": "Narrow down the focus to specific eras or aspects of the Roman Empire, provide a style guide or exemplar, clarify your background knowledge on the subject, and specify the tone and format."\n        },\n        "improved_prompt": [{\n            "description": "Can you provide a detailed narrative on the political evolution of the Roman Empire, especially during the reign of Augustus? I\'m new to this subject and would appreciate an engaging and educational style."\n        }]\n    }\n}',
		},
		{
			text: 'input: Help me plan a vacation to Japan focusing on cultural experiences.',
		},
		{
			text: 'output: {\n    "response_evaluation": {\n        "task": {\n            "score": 9,\n            "description": "The task is clear – planning a culturally-focused vacation to Japan."\n        },\n        "content": {\n            "score": 7,\n            "description": "Mentions a cultural vacation in Japan but lacks specifics like duration, interests, or budget."\n        },\n        "exemplar": {\n            "score": 0,\n            "description": "No exemplar provided. Including a previous travel itinerary or desired experiences would be helpful."\n        },\n        "persona": {\n            "score": 2,\n            "description": "The traveler\'s experience with Japan or cultural trips is not mentioned, which could tailor the plan more effectively."\n        },\n        "format": {\n            "score": 8,\n            "description": "The format is implied to be a travel itinerary."\n        },\n        "tone": {\n            "score": 5,\n            "description": "Tone is neutral. Specifying a tone like adventurous, relaxed, or informative could enhance the response."\n        },\n        "prompt_score": 5.2,\n        "improvement_suggestions": {\n            "description": "Detail the length of stay, specific cultural interests, budget, previous travel experience, desired itinerary format, and the tone of the guidance."\n        },\n        "improved_prompt": [{\n            "description": "I\'m planning a 10-day trip to Japan and am interested in traditional and contemporary cultural experiences, with a moderate budget. I\'ve never been to Asia before. Can you create a detailed itinerary with a mix of well-known and off-the-beaten-path activities, presented in an inspiring and informative manner?"\n        }]\n    }\n}',
		},
		{ text: `input: ${prompt}` },
		{ text: 'output: ' },
	];

	const result = await model.generateContent({
		contents: [{ role: 'user', parts }],
		generationConfig,
		safetySettings,
	});

	const response = await result.response;

	return response;
}

export async function POST(request: NextRequest) {
	const cookieStore = cookies();
	const body = await request.json();
	const data = PromptValidator.parse(body);

	if (!data.prompt) {
		return NextResponse.json('Invalid request', { status: 400 });
	}

	const response = await generate(data.prompt);

	// console.log(response);

	return NextResponse.json(response, { status: 200 });
}
