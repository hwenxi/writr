declare module 'sse' {
	export type SSEOptions = EventSourceInit & {
		headers?: Record<string, string>;
		payload?: string;
		method?: string;
	};

	export class SSE extends EventSource {
		constructor(url: string | URL, sseOptions?: SSEOptions);
		stream(): void;
	}
}
