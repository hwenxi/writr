import OpenAI from 'openai';
import dotenv from 'dotenv';
import type { RequestHandler } from './$types';
import { getTokens } from '$lib/utils';
import { json } from '@sveltejs/kit';

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_KEY
});

interface Config {
	model: any;
	maxTokens: any;
	topP: any;
	temperature: any;
	frequencyPenalty: any;
	presencePenalty: any;
}

interface InputData {
	config: Config;
	systemPrompt: string;
	userInput: string;
}

interface Message {
	role: string;
	content: string;
}

interface OpenAIPayload {
	model: any;
	messages: Message[];
	temperature: any;
	max_tokens: any;
	top_p: any;
	frequency_penalty: any;
	presence_penalty: any;
	stream: boolean;
	n: number;
}

function craftOpenAIPayload({ data }: { data: InputData }): OpenAIPayload {
	const { config, systemPrompt, userInput } = data;

	let messages: Message[] = [
		{
			role: 'system',
			content: systemPrompt
		},
		{
			role: 'user',
			content: userInput
		}
	];

	let payload: OpenAIPayload = {
		model: config.model,
		messages: messages,
		temperature: config.temperature,
		max_tokens: config.maxTokens,
		top_p: config.topP,
		frequency_penalty: config.frequencyPenalty,
		presence_penalty: config.presencePenalty,
		stream: true,
		n: 1 //TODO: increase this to 2-5 to generate multiple options
	};

	return payload;
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const requestData = await request.json();

		if (!requestData) {
			throw new Error('No request data');
		}

		let tokensCount = getTokens(
			requestData.systemPrompt + ' ' + requestData.userInput,
			requestData.config.model
		);
		console.log('Tokens: ' + tokensCount);

		// GPT-4-turbo (Nov. preview) will accept 128k input tokens and max_tokens refers to generation only (max 4096)
		// For GPT-4 March and June, max_token is shared between input and output -> this limit only allows GPT-4 ~500 tokens response
		if (tokensCount > 3500) {
			throw new Error('Query too large');
		}

		let body: any = craftOpenAIPayload({ data: requestData });
		const { data: streamRunner, response: streamResponse } = await openai.chat.completions
			.create(body)
			.withResponse(); // Returns raw from fetch and streamRunner (see OpenAI Node.js documentation)

		return new Response(streamResponse.body, {
			headers: {
				'Content-Type': 'text/event-stream'
			}
		});
	} catch (err) {
		console.log('API Server ERROR: ', err);
		// return new Response(
		// 	JSON.stringify({
		// 		body: { text: 'Error: there was an error processing your request' },
		// 		status: err
		// 	})
		// );
		return json({ error: err.error.message }, { status: err.status });
	}
};
