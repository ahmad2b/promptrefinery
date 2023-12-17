import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import OpenAI from 'openai';

import { getOpenAIKey } from '@/lib/utils';
import { PromptValidator } from '@/lib/utils';

import { Assistant } from 'openai/resources/beta/index.mjs';
import {
	ThreadMessage,
	Run,
	Thread,
} from 'openai/resources/beta/threads/index.mjs';

const openai = new OpenAI({ apiKey: getOpenAIKey() });

export async function POST(request: NextRequest) {
	const cookieStore = cookies();
	const body = await request.json();
	const data = PromptValidator.parse(body);

	if (!data.prompt) {
		return NextResponse.json('Invalid request', { status: 400 });
	}

	// return NextResponse.json(resp, { status: 200 });

	let thread_id = cookieStore.get('thread_id')?.value;
	const assistant_id = 'asst_zCWOWYX34hKwVhUf6CAPJFH9';

	// Retriving assistant
	const assistant: Assistant = await openai.beta.assistants.retrieve(
		assistant_id
	);

	// Creating thread if not exists or retriving it
	let thread: Thread;

	if (thread_id) {
		thread = await openai.beta.threads.retrieve(thread_id);
	} else {
		thread = await openai.beta.threads.create();
		cookieStore.set('thread_id', thread.id);
	}

	// Adding user message to thread
	const message: ThreadMessage = await openai.beta.threads.messages.create(
		(thread_id = thread.id),
		{ role: 'user', content: data.prompt }
	);

	// Run the assistant
	const run: Run = await openai.beta.threads.runs.create(
		(thread_id = thread.id),
		{ assistant_id: assistant.id }
	);

	// Check the run status
	let run_status: Run = await openai.beta.threads.runs.retrieve(
		(thread_id = thread.id),
		(run.id = run.id)
	);

	// Wait for the run to complete
	while (run_status.status !== 'completed') {
		run_status = await openai.beta.threads.runs.retrieve(
			(thread_id = thread.id),
			(run.id = run.id)
		);

		await new Promise((resolve) => setTimeout(resolve, 1000));

		console.log(run_status.status);
	}

	// Display the run response
	const response = await openai.beta.threads.messages.list(
		(thread_id = thread.id)
	);

	// const messages_list: ThreadMessage[] = response.data;

	// console.log(response.data[0].content[0]);

	return NextResponse.json(response.data, { status: 200 });
}

const resp = [
	{
		id: 'msg_waoP6DiAkoq2WpFJgkFRLRCM',
		object: 'thread.message',
		created_at: 1702781857,
		thread_id: 'thread_yB8z0rJPYyY5L3Bj63Xau0HG',
		role: 'assistant',
		content: [
			{
				type: 'text',
				text: {
					value:
						'```json\n{\n    "response_evaluation": {\n        "task": {\n            "score": 7,\n            "description": "The task is understandable. It suggests a representation of AI involved in education but lacks specificity about the desired outcome or context."\n        },\n        "content": {\n            "score": 5,\n            "description": "The content is somewhat vague. It implies teaching happening in schools, but more details would be needed for precision, such as the subject being taught or the level of schooling."\n        },\n        "exemplar": {\n            "score": 1,\n            "description": "No exemplar is provided to clarify the intent or style of the AI\'s representation in the educational context."\n        },\n        "persona": {\n            "score": 1,\n            "description": "The prompt does not specify the persona of the AI, such as whether it\'s a digital assistant or humanoid robot, which would help visualize and understand the interaction."\n        },\n        "format": {\n            "score": 4,\n            "description": "There is no clear format mentioned. The user could be seeking a written description, a visual illustration, or an actual AI educational program without further information."\n        },\n        "tone": {\n            "score": 3,\n            "description": "The tone is not clearly defined, though one might infer a neutral educational tone. It would be beneficial to specify if a certain mood or emotional response is desired."\n        },\n        "prompt_score": 21,\n        "improvement_suggestions": {\n            "description": "To improve the prompt, specify whether you\'re seeking a written description, a visual depiction, or a conceptual design for AI in education. Include details such as the subject of teaching, education level (e.g., elementary school, university), and provide an exemplar for style or content reference. Clarifying the persona of the AI and the tone of the concept could also enhance the prompt."\n        },\n        "improved_prompt": [{\n            "description": "Describe a scenario where an AI, in the form of an interactive virtual assistant, teaches mathematics to elementary school students. The assistant should use engaging, child-friendly language and interactive visual tools to simplify complex concepts. The tone should be encouraging and supportive, designed to foster a love for learning in young students."\n        }]\n    }\n}\n```',
					annotations: [],
				},
			},
		],
		file_ids: [],
		assistant_id: 'asst_zCWOWYX34hKwVhUf6CAPJFH9',
		run_id: 'run_vFbep6Ip7bJ55fUzPw3sBvZh',
		metadata: {},
	},
	{
		id: 'msg_Yrx9P0xMtXEl6ts3tLK7Jr9z',
		object: 'thread.message',
		created_at: 1702781855,
		thread_id: 'thread_yB8z0rJPYyY5L3Bj63Xau0HG',
		role: 'user',
		content: [
			{
				type: 'text',
				text: {
					value: 'AI teaching in schools',
					annotations: [],
				},
			},
		],
		file_ids: [],
		assistant_id: null,
		run_id: null,
		metadata: {},
	},
	{
		id: 'msg_Pkbxwf6Gg905vOBGaPg6cauh',
		object: 'thread.message',
		created_at: 1702781696,
		thread_id: 'thread_yB8z0rJPYyY5L3Bj63Xau0HG',
		role: 'assistant',
		content: [
			{
				type: 'text',
				text: {
					value:
						'```json\n{\n    "response_evaluation": {\n        "task": {\n            "score": 8,\n            "description": "The task of creating an image is clear and specific. However, the nature of the AI and the context of the school setting could be elaborated on to enhance clarity."\n        },\n        "content": {\n            "score": 7,\n            "description": "The content is implied, it is about AI helping humans learn coding in a school environment. Mentioning the age group or type of school could add more specificity."\n        },\n        "exemplar": {\n            "score": 3,\n            "description": "No specific exemplar is provided to guide the expected outcome of the image creation, such as visual style or a specific scenario where AI assists students."\n        },\n        "persona": {\n            "score": 2,\n            "description": "There is no persona crafted for the AI or the students, which would add depth to the prompt and guide the resulting image\'s emotion and interaction."\n        },\n        "format": {\n            "score": 5,\n            "description": "The format is loosely implied to be an image, but it would benefit from specifying the type (illustration, digital art, photograph, etc.) and any desired dimensions or resolutions."\n        },\n        "tone": {\n            "score": 4,\n            "description": "The tone is not specified, but one could infer a positive and educational tone. However, explicitly stating this would help in creating a more targeted image."\n        },\n        "prompt_score": 29,\n        "improvement_suggestions": {\n            "description": "To improve the prompt, specify the visual style of the image (e.g., cartoonish, realistic), the persona of the AI (e.g., humanoid robot, virtual assistant on screen), the age group or level of schooling (e.g., middle school, college), and the tone of the interaction (e.g., friendly, futuristic). Include an exemplar or reference for better guidance."\n        },\n        "improved_prompt": [{\n            "description": "Create a detailed digital illustration of a friendly humanoid robot AI helping a diverse group of high school students learn coding. The robot should be depicted interacting positively with the students in a modern classroom setting, using a large interactive display to show a programming lesson. The style should be semi-realistic with a touch of futuristic elements, and the tone should convey a sense of collaboration and innovation."\n        }]\n    }\n}\n```',
					annotations: [],
				},
			},
		],
		file_ids: [],
		assistant_id: 'asst_zCWOWYX34hKwVhUf6CAPJFH9',
		run_id: 'run_DwxX5nw5OV58kBece2EFBQ05',
		metadata: {},
	},
	{
		id: 'msg_QwUU5jXbAkdM1fi2RQrajRK1',
		object: 'thread.message',
		created_at: 1702781694,
		thread_id: 'thread_yB8z0rJPYyY5L3Bj63Xau0HG',
		role: 'user',
		content: [
			{
				type: 'text',
				text: {
					value: 'Create an Image of AI helping humans learn coding in school',
					annotations: [],
				},
			},
		],
		file_ids: [],
		assistant_id: null,
		run_id: null,
		metadata: {},
	},
];
