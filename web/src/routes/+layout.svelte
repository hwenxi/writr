<script lang="ts">
	/** @type {import('./$types').LayoutData} */
	import '../app.css';
	import { currentConfig, toolSelection, updateDefaults } from './stores';
	import ConfigPanel from './config-panel/config-panel.svelte';
	import Alert from '$lib/Alert.svelte';
	export let data;

	// Initialize the settings of the default tool on load
	updateDefaults(
		data.toolsCollection.find((tool: { name: string }) => tool.name == $toolSelection).config,
		data.toolsCollection.find((tool: { name: string }) => tool.name == $toolSelection).system_prompt,
		data.toolsCollection.find((tool: { name: string }) => tool.name == $toolSelection).user_template
	);

	// Set the settings of the new tool on change
	async function handleToolChange(e: { target: { text: string } }): Promise<void> {
		$toolSelection = e.target.text.toLowerCase();
		updateDefaults(
			data.toolsCollection.find((tool: { name: string }) => tool.name == $toolSelection).config,
			data.toolsCollection.find((tool: { name: string }) => tool.name == $toolSelection).system_prompt,
			data.toolsCollection.find((tool: { name: string }) => tool.name == $toolSelection).user_template
		);
	}

	let hideConfigPanel = true;
	let visible = false;
	async function toggleConfigPanel(): Promise<void> {
		visible = true;
		hideConfigPanel = !hideConfigPanel;
		if (hideConfigPanel) {
			setTimeout(function () {
				visible = false;
			}, 200);
		}
	}
</script>

<div class="min-h-screen">
	<nav class="navbar bg-neutral border-b h-20">
		<div class="navbar-start pl-5 text-white ">
			<div class="dropdown dropdown-hover">
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label tabindex="0" class="btn m-1 font-bold text-lg"
					>Select Tool: {$toolSelection}</label
				>
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<ul
					tabindex="0"
					class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full text-black text-lg"
				>
					{#each data.toolsCollection as tool (tool.id)}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<!-- svelte-ignore a11y-missing-attribute -->
						<li>
							<a on:click={handleToolChange}>
								{tool.name.charAt(0).toUpperCase() + tool.name.slice(1)}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
		<div class="navbar-center flex-none">
			<a href="/" class="btn btn-ghost normal-case font-bold text-4xl text-white">Writr</a>
		</div>
		<div class="navbar-end pr-5">
			<button class="btn font-bold text-lg" on:click={toggleConfigPanel}>
				{hideConfigPanel ? 'Show' : 'Hide'} Configuration
			</button>
		</div>
	</nav>
	<div class="flex flex-col relative min-h-screen">
		<div class="absolute top-0 right-0 text-xl my-2 mx-4">{$currentConfig.model}</div>
		<Alert />
		<slot />
		<div
			class="absolute top-0 right-0 w-1/4"
			style="transition: transform 0.2s ease-in-out;"
			class:transform={hideConfigPanel}
			class:translate-x-[100%]={hideConfigPanel}
			class:z-20={hideConfigPanel}
		>
			{#if visible}
				<ConfigPanel />
			{/if}
		</div>
	</div>
</div>
