'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { PromptRequest, PromptValidator } from '@/lib/utils';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { PromptResponse } from '@/lib/types';

import { Card } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';

export const dynamic = 'force-dynamic';

export default function Home() {
	const [responseData, setResponseData] = useState<PromptResponse | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<PromptRequest>({
		resolver: zodResolver(PromptValidator),
	});

	async function onSubmit(value: PromptRequest) {
		try {
			setIsLoading(true);

			const data = PromptValidator.safeParse(value);

			if (!data.success) {
				return;
			}

			const response = await fetch(`/api/google`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data.data),
				cache: 'no-store',
			});

			if (!response.ok) {
				console.error(response.statusText[0]);
				return;
			}

			// console.log(response);

			const json = await response.json();

			// console.log(json.candidates[0].content.parts[0].text);

			setResponseData(JSON.parse(json.candidates[0].content.parts[0].text)); // Set the JSON response to the state variable
		} catch (error) {
			console.log(
				(error as Error).message ||
					'An error occurred while connecting to the model.'
			);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<main className='flex flex-col items-center w-full mx-auto py-10 px-6 space-y-4'>
			<h1 className='scroll-m-20 text-3xl text-center font-extrabold tracking-tight lg:text-5xl text-gray-900'>
				Prompt Refinery
			</h1>
			<p className='font-semibold scroll-m-20 text-center text-xl'>
				Analyze, Refine, Generate ⚡
			</p>

			<div className='w-full '>
				<Separator className='bg-gray-900' />
			</div>

			<div className='grid md:grid-cols-2 grid-cols-1 w-full md:gap-8 sm:gap-4 gap-0'>
				<div className='col-span-1'>
					<Card className='md:p-6 p-2'>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className='w-full space-y-4'
							>
								<FormField
									control={form.control}
									name='prompt'
									render={({ field }) => (
										<FormItem>
											<FormLabel className='font-bold'>Prompt</FormLabel>
											<FormControl>
												<Textarea
													placeholder='Enter a prompt to refine or construct.'
													className='resize-none'
													{...field}
												/>
											</FormControl>
											{/* <FormDescription>
								Enter a prompt to refine or construct.
							</FormDescription> */}
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button
									type='submit'
									size={'sm'}
									className='bg-fuchsia-950 hover:bg-fuchsia-900'
									isLoading={form.formState.isSubmitting || isLoading}
									disabled={form.formState.isSubmitting || isLoading}
								>
									Submit
								</Button>
							</form>
						</Form>
					</Card>
				</div>

				<div className='col-span-1 hidden md:block'>
					<div className='flex flex-col space-y-4 max-w-xl '>
						<h3 className='scroll-m-20 text-xl text-left font-semibold tracking-tight'>
							Elevate your AI interactions with Prompt Refinery
						</h3>
						<p className='text-left text-sm'>
							Prompt Refinery dissects your input on five key components:{' '}
							<b className='font-semibold'>
								Task, Content, Exemplar, Persona, Format, Tone
							</b>
							.
						</p>
						<p className='text-left text-sm'>
							Get ranked importance of each component, with Task (action) taking
							center stage, followed by Content (subject) and Exemplar (example)
							as vital elements. Persona, Format, and Tone add the finishing
							touches for a truly polished prompt.
						</p>
						<p className='text-left text-sm'>
							Receive a prompt quality rating based on its clarity,
							completeness, and effectiveness.
						</p>
					</div>
				</div>
			</div>

			{/* Prompt Input */}
			<div className='md:py-8 py-4 w-full'>
				{responseData && (
					<RatingBar
						rating={responseData?.response_evaluation.prompt_score ?? 0}
						maxRating={10}
					/>
				)}
			</div>

			{/* Prompt Response */}
			<div>
				{responseData && <RenderData data={responseData.response_evaluation} />}
			</div>
		</main>
	);
}

function RatingBar({
	rating,
	maxRating,
}: {
	rating: number;
	maxRating: number;
}) {
	const percentage = (rating / maxRating) * 100;

	return (
		<div className='flex flex-col md:flex-row space-y-2 md:space-y-0 items-center w-full space-x-0 md:space-x-4 md:px-6 sm:px-4 px-2'>
			<Badge className='w-fit py-0.5 md:py-2 bg-fuchsia-950 flex-shrink-0'>
				Prompt rating
			</Badge>

			<div className='relative h-3 w-full bg-gray-200 rounded shadow'>
				<div
					className='absolute h-full bg-purple-400 rounded transition-all duration-500 ease-in-out'
					role='progressbar'
					style={{
						width: `${percentage}%`,
					}}
				>
					<span className='sr-only'>
						User rating: {rating} out of {maxRating}
					</span>
				</div>
				<div className='absolute inset-0 flex items-center justify-center font-bold tracking-wide'>
					<span className='text-[11px] flex space-x-2'>
						<span>{rating}</span>
						<span>/</span>
						<span className='tracking-widest'>{maxRating}</span>
					</span>
				</div>
			</div>
		</div>
	);
}

const RenderData = ({ data }: { data: any }) => {
	const [promptResponse, setPromptResponse] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	async function getPromptResponse(prompt: string) {
		try {
			setIsLoading(true);
			console.log('RECIEVED RESPONSE: ', prompt);

			const response = await fetch(`/api/google/create`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(prompt),
				cache: 'no-store',
			});

			if (!response.ok) {
				console.error(response.statusText[0]);
				return;
			}

			const json = await response.json();

			console.log('RESPONSE RECIEVED', json);

			setPromptResponse(json.candidates[0].content.parts[0].text);
			console.log('RESPONSE PARSED', promptResponse);
		} catch (error) {
			console.log(
				(error as Error).message ||
					'An error occurred while connecting to the model.'
			);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className='md:p-4 sm:p-2 p-0'>
			<div className='grid md:grid-cols-3 grid-cols-1 gap-2 md:gap-4'>
				{['task', 'content', 'exemplar', 'persona', 'format', 'tone'].map(
					(type) => (
						<div
							key={type}
							className='p-4 border rounded-2xl shadow bg-white'
						>
							<div className='flex items-center justify-between'>
								<h2 className='text-lg font-semibold tracking-tight text-fuchsia-950 capitalize'>
									{type}
								</h2>
								<Badge className='bg-fuchsia-950'>
									Score: {data[type].score} / 10
								</Badge>
							</div>
							<p className='text-sm tracking-wide font-normal mt-2'>
								{data[type].description}
							</p>
						</div>
					)
				)}
			</div>

			<div className='mt-4 flex flex-col space-y-2 py-8'>
				<h2 className='text-xl font-bold text-fuchsia-950'>
					Improvement Suggestions
				</h2>
				<p>{data.improvement_suggestions.description}</p>
			</div>

			<div className='mt-4 flex flex-col space-y-3'>
				<h2 className='text-xl font-bold text-fuchsia-950'>Improved Prompts</h2>

				{data.improved_prompt.map((prompt: any, index: number) => (
					<div key={index}>
						<div className='relative mt-2 p-4 border-l-4 border-yellow-600 pl-4 italic shadow bg-white rounded-xl'>
							<button
								className='absolute top-0 right-0 m-2 text-gray-500 hover:text-gray-800'
								onClick={() => {
									navigator.clipboard.writeText(prompt.description);
								}}
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
									className='h-6 w-6'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
									/>
								</svg>
							</button>
							<blockquote className='italic pr-4'>
								<p>{prompt.description}</p>
							</blockquote>
						</div>
						<Button
							className='bg-fuchsia-950 hover:bg-fuchsia-900 mt-2'
							size={'sm'}
							onClick={() => {
								getPromptResponse(prompt.description);
							}}
							isLoading={isLoading}
							disabled={isLoading}
						>
							Try the prompt now!
						</Button>

						<div className='mt-4'>
							{promptResponse && (
								<ReactMarkdown>{promptResponse}</ReactMarkdown>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
