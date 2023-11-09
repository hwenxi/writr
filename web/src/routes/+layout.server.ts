/** @type {import('./$types').LayoutServerLoad} */
import { error } from '@sveltejs/kit';

export async function load({ locals }) {
	let tools_collection;
	try {
		tools_collection = await locals.pb.collection('tools').getFullList();
	} catch (err) {
		console.log('Error: ', err);
		throw error(500, 'Something went wrong');
	}

	return {
		user: locals.user,
		toolsCollection: tools_collection
	};
}
