<script>
	import { toolSelection } from '../routes/stores';
	import { get } from 'svelte/store';
    import { alertType, alertMessage } from './alertStore';
	import { fade } from 'svelte/transition';

</script>

<div class="w-1/3 h-16 mt-4">
    {#if $alertMessage}
        <div class="alert {$alertType} max-w-2xl h-full flex items-center justify-center" out:fade>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="stroke-current shrink-0 w-6 h-6"
                >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
            <div>{$alertMessage}</div>
        </div>
    {/if}
</div>
