<script lang="ts">
	import { enhance } from '$app/forms';
	import { ALERT_TYPES, displayAlert } from '$lib/alertStore';
	import {
		currentConfig,
		currentSystemPrompt,
		currentUserTemplate,
		toolSelection,
		isSettingsChanged,
		updateDefaults
	} from '../stores';

	async function handleModelChange(e: { target: { text: any } }) {
		// Reactivity is triggered by assignment see last section of :https://learn.svelte.dev/tutorial/updating-arrays-and-objects
		$currentConfig.model = e.target.text;
		$currentConfig = $currentConfig;
	}

	async function handlePromptChange(e: { target: { name: any } }) {
		switch (e.target.name) {
			case 'save-system':
				$currentSystemPrompt = document.getElementsByName('system-prompt-text')[0].value;
				break;
			case 'save-user-template':
				for (let key in $currentUserTemplate) {
					$currentUserTemplate[key] = document.getElementsByName(
						'user-template-text-' + key
					)[0].value;
				}
				$currentUserTemplate = $currentUserTemplate;
				break;
		}
	}

	//TODO: different messages based on state - currently always shows success
	async function handleConfigAlert() {
		// The update config button makes a server call -> server and client do not share store states -> updateDefaults() has to be in the client side function
		updateDefaults($currentConfig, $currentSystemPrompt, $currentUserTemplate);

		const successMessage =
			$toolSelection.charAt(0).toUpperCase() +
			$toolSelection.slice(1) +
			' default configuration updated.';
		displayAlert(successMessage, ALERT_TYPES.INFO, 2000);
	}
</script>

<div class="bg-blue-100 rounded-xl p-8 mr-2">
	<div class="flex flex-col justify-around gap-5">
		<p class="text-2xl font-bold mx-1">Your Settings</p>
		<div class="dropdown">
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label tabindex="0" class="btn w-full m-1">Change Model: {$currentConfig.model}</label>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<ul
				tabindex="0"
				class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full text-lg"
			>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<!-- svelte-ignore a11y-missing-attribute -->
				<li><a on:click={handleModelChange}>gpt-4-0314</a></li>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<!-- svelte-ignore a11y-missing-attribute -->
				<li><a on:click={handleModelChange}>gpt-4-0613</a></li>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<!-- svelte-ignore a11y-missing-attribute -->
				<li><a on:click={handleModelChange}>gpt-4-1106-preview</a></li>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<!-- svelte-ignore a11y-missing-attribute -->
				<li><a on:click={handleModelChange}>testing-model</a></li>
			</ul>
		</div>
		<button class="btn" onclick="systemInputModal.showModal()">View System Prompt</button>
		<dialog id="systemInputModal" class="modal">
			<div class="modal-box w-11/12 max-w-6xl h-5/6 max-h-screen">
				<div class="pl-5 pb-5">
					<h3 class="font-bold text-2xl">System Prompt</h3>
					<!-- {$toolSelection.charAt(0).toUpperCase() + $toolSelection.slice(1)} -->
					<p>Press Save to update prompt</p>
					<p>Press escape to cancel</p>
				</div>
				<div class="flex flex-col gap-4 justify-center px-5 h-5/6">
					<textarea
						class="textarea textarea-bordered w-full h-full"
						placeholder="System Prompt"
						name="system-prompt-text">{$currentSystemPrompt}</textarea
					>
					<div class="modal-action">
						<form method="dialog">
							<button class="btn" name="save-system" on:click={handlePromptChange}>Save</button>
						</form>
					</div>
				</div>
			</div>
		</dialog>
		<button class="btn" onclick="userTemplateModal.showModal()">View User Template</button>
		<dialog id="userTemplateModal" class="modal">
			<div class="modal-box w-11/12 max-w-6xl h-5/6 max-h-screen">
				<div class="pl-5 pb-5">
					<h3 class="font-bold text-2xl">User Template</h3>
					<!-- {$toolSelection.charAt(0).toUpperCase() + $toolSelection.slice(1)} -->
					<p>Press Save to update template</p>
					<p>Press escape to cancel</p>
				</div>
				<div class="flex flex-col gap-4 justify-center px-5 h-5/6">
					{#each Object.entries($currentUserTemplate) as [key, templatePiece]}
						<textarea
							class="textarea textarea-bordered w-full h-full"
							placeholder="User Prompt"
							name={'user-template-text-' + key}>{templatePiece}</textarea
						>
					{/each}
					<div class="modal-action mt-0">
						<form method="dialog">
							<button class="btn" name="save-user-template" on:click={handlePromptChange}>
								Save
							</button>
						</form>
					</div>
				</div>
			</div>
		</dialog>
		<label
			>Temperature {$currentConfig.temperature}:
			<input
				type="range"
				min="0"
				max="1"
				step="0.1"
				bind:value={$currentConfig.temperature}
				class="range"
				name="temperature"
			/>
		</label>
		<label
			>Max Tokens {$currentConfig.maxTokens}:
			<input
				type="range"
				min="0"
				max="8192"
				bind:value={$currentConfig.maxTokens}
				class="range"
				name="maxTokens"
				disabled
			/>
		</label>
		<label
			>Top P {$currentConfig.topP}:
			<input
				type="range"
				min="0"
				max="1"
				step="0.1"
				bind:value={$currentConfig.topP}
				class="range"
				name="topP"
			/>
		</label>
		<label
			>Frequency Penalty {$currentConfig.frequencyPenalty}:
			<input
				type="range"
				min="0"
				max="1"
				step="0.1"
				bind:value={$currentConfig.frequencyPenalty}
				class="range"
				name="frequencyPenalty"
			/>
		</label>
		<label
			>Presence Penalty {$currentConfig.presencePenalty}:
			<input
				type="range"
				min="0"
				max="1"
				step="0.1"
				bind:value={$currentConfig.presencePenalty}
				class="range"
				name="presencePenalty"
			/>
		</label>
		<hr class="h-px my-4 bg-gray-200 border-0 dark:bg-neutral-500">
		<form method="POST" action="?/updateToolConfig" use:enhance>
			<input type="hidden" name="toolSelection" value={$toolSelection} />
			<input type="hidden" name="config" value={JSON.stringify($currentConfig)} />
			<input type="hidden" name="systemPrompt" value={$currentSystemPrompt} />
			<input type="hidden" name="userTemplate" value={JSON.stringify($currentUserTemplate)} />
			<div class='tooltip tooltip-bottom w-full text-xl' data-tip="Changes default settings for revisor">
				<button
				name="updateConfigDefaults"
				class={'btn w-full ' + ($isSettingsChanged ? 'bg-green-100  animate-bounce-small btn-outline btn-neutral ' : '')}
				on:click={handleConfigAlert}
			>
				Update {$toolSelection} Default Settings
			</button>
			</div>
		</form>
	</div>
</div>
