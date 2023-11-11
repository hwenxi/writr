import { POCKETBASE_ADMIN_PW, POCKETBASE_ADMIN_USER } from '$env/static/private';

import PocketBase from 'pocketbase';
import { serializeNonPOJOs } from '$lib/utils';

export const handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase('http://localhost:8090');
	// This should auth with OIDC2 instead of whuang
	const authData = await event.locals.pb.collection('users').authWithPassword(POCKETBASE_ADMIN_USER, POCKETBASE_ADMIN_PW);
	//event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	if (event.locals.pb.authStore.isValid) {
		event.locals.user = serializeNonPOJOs(event.locals.pb.authStore.model);
	} else {
		event.locals.user = undefined;
	}

	const response = await resolve(event);

	response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie({ secure: false }));

	return response;
};
