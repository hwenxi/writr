import OpenAI from 'openai';
import dotenv from 'dotenv';
import type { RequestHandler } from './$types';
import { getTokens } from '$lib/utils';
dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_KEY
});

function craftAPICall(data: { config: any; systemPrompt: string; userInput: string }) {
	const config = data.config;

	let messages = [
		{
			role: 'system',
			content: data.systemPrompt
		},
		{
			role: 'user',
			content: data.userInput
		}
	];

	let body = {
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

	return body;
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

		// 128k is the default for gpt-4-1106-preview (turbo), this should flex depending on the selected model
		if (tokensCount > 128000) {
			throw new Error('Query too large');
		}

		let body = craftAPICall(requestData);
		const {data: streamRunner, response: streamResponse} = await openai.chat.completions.create(body).withResponse(); // Returns raw from fetch (default cant be passed as SSE)
	
		return new Response(streamResponse.body, {
			headers: {
				'Content-Type': 'text/event-stream',
			}
		});
	} catch (err) {
		console.log('ERROR: ', err);
		return new Response(
			JSON.stringify({
				body: { text: 'Error: there was an error processing your request' },
				status: 500
			})
		);
	}
};
