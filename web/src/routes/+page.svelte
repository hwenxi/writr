<script lang="ts">
	import type { PageData } from './$types';
	import { currentConfig, currentSystemPrompt, currentUserTemplate } from './stores.js';
	export let data: PageData;

	import { SSE } from 'sse.js';

	let scrollToDiv: HTMLDivElement;
	let loading: boolean = false;
	let output: string;

	function scrollToBottom() {
		setTimeout(function () {
			scrollToDiv.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
		}, 100);
	}

	function handleError<T>(err: T) {
		loading = false;
		output = 'An error occured...';
		console.log('ERROR: ', err);
	}

	async function handleGenerate() {
		let input = '';
		output = '';

		for (const key in $currentUserTemplate) {
			input += $currentUserTemplate[key].trim() + '\n';
			if (!document.getElementsByName('userInput-' + key)) {
				return handleError('No input');
			}
			input += document.getElementsByName('userInput-' + key)[0].value + '\n"""\n';
		}

		loading = true;

		const eventSource = new SSE('/api/chat', {
			headers: {
				'Content-Type': 'application/json'
			},
			payload: JSON.stringify({
				config: $currentConfig,
				systemPrompt: $currentSystemPrompt,
				userInput: input
			})
		});

		eventSource.addEventListener('error', handleError);

		eventSource.addEventListener('message', (e) => {
			scrollToBottom();
			try {
				loading = false;
				if (e.data === '[DONE]') {
					return;
				}
				const generatedStream = JSON.parse(e.data);
				const [{ delta }] = generatedStream.choices;

				if (delta.content) {
					output = (output ?? '') + delta.content;
				}
			} catch (err) {
				handleError(err);
			}
		});
		eventSource.stream();
		scrollToBottom();
	}
</script>

<div class="container mx-auto max-w-7xl sm:px-6 lg:px-8 h-fit pb-10 min-h-full">
	<form class="h-fit justify-between" on:submit|preventDefault={() => handleGenerate()}>
		{#each Object.keys($currentUserTemplate) as key}
			<label for="userInput" class="text-2xl mx-1">Your draft</label>
			<textarea
				name={'userInput-' + key}
				class="textarea textarea-bordered textarea-lg w-full h-80 my-2"
				placeholder="Hi Bob, I've looked at the account..."
			/>
		{/each}
		<input type="hidden" name="config" value={JSON.stringify($currentConfig)} />
		<input type="hidden" name="systemPrompt" value={$currentSystemPrompt} />
		<input type="hidden" name="userTemplate" value={JSON.stringify($currentUserTemplate)} />
		<button type="submit" class="btn button-xl w-full my-6 bg-primary text-xl">
			{#if loading}
				<span class="loading loading-dots loading-lg" />
			{:else}
				Generate!
			{/if}
		</button>
		<label for="generatedOutput" class="text-2xl mx-1">Generated Output</label>
		<div class="w-full text-lg mt-2 mb-10 rounded-lg border border-slate-700/20 min-h-fit">
			<p class="m-5" style="white-space: pre-line">{output ?? '\n'}</p>
		</div>
		<div bind:this={scrollToDiv} />
	</form>
</div>
