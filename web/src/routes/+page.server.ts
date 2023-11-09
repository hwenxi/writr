/** @type {import('./$types').PageServerLoad} */

export async function load({ locals }) {
	if (locals.user) {
		return {
			user: locals.user
		};
	}

	return {
		user: undefined
	};
}

export const actions = {
    updateToolConfig: async ({ locals, request }) => {
		const formData = await request.formData();
		const toolToUpdate = await locals.pb.collection('tools').getFirstListItem('name="' + formData.get('toolSelection') + '"');
		const newSettings = {
			config: formData.get('config'),
			system_prompt: formData.get('systemPrompt'),
			user_template: formData.get('userTemplate')
		};
		const record = await locals.pb.collection('tools').update(toolToUpdate.id, newSettings);
	}
};
