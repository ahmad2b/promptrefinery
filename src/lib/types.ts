export type PromptResponse = {
	response_evaluation: ResponseEvaluation;
};

export type ResponseEvaluation = {
	task: Score;
	content: Score;
	exemplar: Score;
	persona: Score;
	format: Score;
	tone: Score;
	prompt_score: number;
	improvement_suggestions: Improve;
	improved_prompt: Improve[];
};

export type Score = {
	score: number;
	description: string;
};

export type Improve = {
	description: string;
};
