import { get_encoding, encoding_for_model, Tiktoken } from 'tiktoken';

let encoding: Tiktoken;
try {
	encoding = encoding_for_model('gpt-4-1106-preview');
} catch (error) {
	console.log("Defaulting to cl100k_base");
	encoding = get_encoding('cl100k_base');
}

export function getTokens(input: string, model: string): number {
	if (model != 'gpt-4-1106-preview'){
		try {
			encoding = encoding_for_model(model);
		} catch (error) {
			console.log("No encoding model for " + model + " defaulting to cl100k_base");
			encoding = get_encoding('cl100k_base');
		}
	}

	let numTokens = 8; // every message follows <im_start>{role/name}\n{content}<im_end>\n and there are 2 messages - 1 system prompt and 1 user input
	numTokens += encoding.encode(input).length;

	numTokens += 2; // every reply is primed with <im_start>assistant
	return numTokens;
}

export const serializeNonPOJOs = (obj: any) => {
	return structuredClone(obj);
};
