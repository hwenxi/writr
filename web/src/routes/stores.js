import { PUBLIC_DEFAULT_TOOL } from '$env/static/public';
import { writable, derived } from 'svelte/store';

export const toolSelection = writable(PUBLIC_DEFAULT_TOOL);
export const currentConfig = writable();
export const defaultConfig = writable();
export const currentSystemPrompt = writable();
export const defaultSystemPrompt = writable();
export const currentUserTemplate = writable();
export const defaultUserTemplate = writable();

import _ from 'lodash';

export const isSettingsChanged = derived(
	[
		currentConfig,
		defaultConfig,
		currentSystemPrompt,
		defaultSystemPrompt,
		currentUserTemplate,
		defaultUserTemplate
	],
	(
		[
			$currentConfig,
			$defaultConfig,
			$currentSystemPrompt,
			$defaultSystemPrompt,
			$currentUserTemplate,
			$defaultUserTemplate
		],
		set
	) => {
		set(
			!_.isEqual($currentConfig, $defaultConfig) ||
				!_.isEqual($currentSystemPrompt, $defaultSystemPrompt) ||
				!_.isEqual($currentUserTemplate, $defaultUserTemplate)
		);
	}
);

/**
 * Update the default and current configurations, prompts, and templates.
 * @param {Object} newConfig - The new configuration object.
 * @param {string} newSystemPrompt - The new system prompt string.
 * @param {Object} newUserTemplate - The new user template object.
 */
export function updateDefaults(newConfig, newSystemPrompt, newUserTemplate) {
	currentConfig.set(structuredClone(newConfig));
	defaultConfig.set(structuredClone(newConfig));
	currentSystemPrompt.set(structuredClone(newSystemPrompt));
	defaultSystemPrompt.set(structuredClone(newSystemPrompt));
	currentUserTemplate.set(structuredClone(newUserTemplate));
	defaultUserTemplate.set(structuredClone(newUserTemplate));
}
