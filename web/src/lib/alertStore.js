import { writable } from 'svelte/store';

export const ALERT_TYPES = {
	DANGER: 'alert-error',
	INFO: 'alert-info',
	SUCCESS: 'alert-success'
};
Object.freeze(ALERT_TYPES);

export const alertMessage = writable('');
export const alertType = writable(ALERT_TYPES.INFO);

export const displayAlert = (message, type = ALERT_TYPES.INFO, resetTime) => {
	const rateLimitRegex = /Limit (\d+), Used (\d+), Requested (\d+). Please try again in (\d+)/;
	const matches = message.match(rateLimitRegex);

	if (matches) {
		const [, limit, used, requested, retryTime] = matches;
		alertMessage.set(
			`Rate limit reached on tokens per min. Please try again in ${retryTime}s.`
		);
	} else {
		alertMessage.set(message);
	}

	alertType.set(type);

	if (resetTime) {
		setTimeout(() => {
			alertMessage.set('');
		}, resetTime);
	}
};

export const clearAlert = () => {
	alertMessage.set('');
};
