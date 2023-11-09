import { writable, get, derived } from 'svelte/store';

export const toolSelection = writable('revisor');
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

export const updateDefaults = (newConfig, newSystemPrompt, newUserTemplate) => {
	currentConfig.set(structuredClone(newConfig));
	defaultConfig.set(structuredClone(newConfig));
	currentSystemPrompt.set(structuredClone(newSystemPrompt));
	defaultSystemPrompt.set(structuredClone(newSystemPrompt));
	currentUserTemplate.set(structuredClone(newUserTemplate));
	defaultUserTemplate.set(structuredClone(newUserTemplate));
};
