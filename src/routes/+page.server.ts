import type { PageServerLoad } from './$types';
import { ATPROTO_DID } from '$env/static/private';
import { getShortLinks } from '$lib/services/linkat';
import type { ShortLink } from '$lib/services/types';

export const load: PageServerLoad = async () => {
	// Check if DID is configured
	if (!ATPROTO_DID || ATPROTO_DID === '') {
		console.error('[Homepage] ATPROTO_DID not configured');
		return {
			did: 'NOT_CONFIGURED',
			linkCount: 0,
			links: [],
			error: 'ATPROTO_DID environment variable is not configured. Please add it to your .env file.'
		};
	}

	try {
		const links = await getShortLinks();

		return {
			did: ATPROTO_DID,
			linkCount: links.length,
			links: links.map((link: ShortLink) => ({
				shortcode: link.shortcode,
				title: link.title,
				emoji: link.emoji
			}))
		};
	} catch (error) {
		console.error('[Homepage] Error loading links:', error);
		return {
			did: ATPROTO_DID,
			linkCount: 0,
			links: [],
			error: 'Failed to load links from AT Protocol. Please check your DID and network connection.'
		};
	}
};
