import { writable } from 'svelte/store';

export const ALERT_TYPES = {
    DANGER: 'alert-error',
    INFO: 'alert-info',
    SUCCESS: 'alert-success',
}
Object.freeze(ALERT_TYPES);

export const alertMessage = writable('');
export const alertType = writable(ALERT_TYPES.INFO);

export const displayAlert = (message, type = ALERT_TYPES.INFO, resetTime) => {
    alertMessage.set(message);
    alertType.set(type);

    if (resetTime) {
        setTimeout(() => {
            alertMessage.set('');
        }, resetTime)
    }
    
}
