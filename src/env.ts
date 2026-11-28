import { defineEnvVars } from '@sveltejs/kit/env';

// Build-time environment variables, imported from `$app/env/private`.
export const variables = defineEnvVars({
	ATPROTO_DID: { static: true }
});
