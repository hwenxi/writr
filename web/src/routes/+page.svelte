<script lang="ts">
	import type { PageData } from './$types';
	import { currentConfig, currentSystemPrompt, currentUserTemplate } from './stores.js';
	export let data: PageData;

	import { SSE } from 'sse.js';
	import { ALERT_TYPES, displayAlert, clearAlert } from '$lib/alertStore';

	let scrollToDiv: HTMLDivElement;
	let loading: boolean = false;
	let output: string;

	function copyOutput() {
		var copyText = document.getElementById('output')?.innerHTML;
		if (copyText) {
			navigator.clipboard.writeText(copyText);
		}
	}

	function scrollToBottom() {
		setTimeout(function () {
			scrollToDiv.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
		}, 100);
	}

	function handleError(err: any) {
		loading = false;
		let alertMessage: string;
		if (typeof err === 'string') {
			alertMessage=err;
		}
		else if (err && err.data) {
			alertMessage = JSON.parse(err.data).error;
		}
		else {
			alertMessage = "An unknown error occured"
		}
		displayAlert(alertMessage, ALERT_TYPES.DANGER);
		console.error('Generation produced an Error: ', alertMessage, err);
	}

	async function handleGenerate() {
		clearAlert();
		let input = '';
		output = '';

		for (const key in $currentUserTemplate) {
			input += $currentUserTemplate[key].trim() + '\n';
			if (!document.getElementsByName('userInput-' + key)[0].value) {
				return handleError("You did not input any text");
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
				if (e.data === '[DONE]') {
					loading = false;
					return;
				}
				const generatedStream = JSON.parse(e.data);
				const [{ delta }] = generatedStream.choices;

				if (delta.content) {
					//output = (output ?? '') + delta.content;
					output = output + delta.content;
				}
			} catch (err) {
				handleError(err);
			}
		});
		eventSource.stream();
		scrollToBottom();
	}
</script>

<div class="container mx-auto max-w-7xl sm:px-6 lg:px-8 h-fit pb-15 min-h-full">
	<form class="h-fit justify-between" on:submit|preventDefault={() => handleGenerate()}>
		{#each Object.keys($currentUserTemplate) as key}
			<label for="userInput" class="text-2xl mx-1">Your draft</label>
			<textarea
				name={'userInput-' + key}
				class="textarea textarea-bordered textarea-lg w-full h-80 my-2"
				placeholder="Hi Bob, I've looked at the account..."
			/>
		{/each}
		<button type="submit" class="btn button-xl w-full my-6 bg-primary text-xl">
			{#if loading}
				<span class="loading loading-dots loading-lg" />
			{:else}
				Generate!
			{/if}
		</button>
		<label for="generatedOutput" class="text-2xl mx-1">Generated Output</label>
		<div
			class="grid grid-flow-col auto-cols-auto w-full mt-2 mb-10 rounded-lg border border-slate-700/20 h-fit"
		>
			<p class="my-5 ml-6 text-lg" style="white-space: pre-line" id="output">
				{output ?? ''}
			</p>
			<div class="flex justify-end items-start p-2">
				<button
					class={'btn ' + (loading ? 'btn-disabled' : '')}
					type="button"
					on:click={copyOutput}
				>
					Copy
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-7 w-7"
						fill="black"
						viewBox="0 0 460 460"
						stroke="currentColor"
						stroke-width="10"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M425.934,0H171.662c-18.122,0-32.864,14.743-32.864,32.864v77.134h30V32.864c0-1.579,1.285-2.864,2.864-2.864h254.272 c1.579,0,2.864,1.285,2.864,2.864v254.272c0,1.58-1.285,2.865-2.864,2.865h-74.729v30h74.729 c18.121,0,32.864-14.743,32.864-32.865V32.864C458.797,14.743,444.055,0,425.934,0z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M288.339,139.998H34.068c-18.122,0-32.865,14.743-32.865,32.865v254.272C1.204,445.257,15.946,460,34.068,460h254.272 c18.122,0,32.865-14.743,32.865-32.864V172.863C321.206,154.741,306.461,139.998,288.339,139.998z M288.341,430H34.068 c-1.58,0-2.865-1.285-2.865-2.864V172.863c0-1.58,1.285-2.865,2.865-2.865h254.272c1.58,0,2.865,1.285,2.865,2.865v254.273h0.001 C291.206,428.715,289.92,430,288.341,430z"
						/>
					</svg>
				</button>
			</div>
		</div>
		<div bind:this={scrollToDiv} />
	</form>
</div>
