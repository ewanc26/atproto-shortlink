import type { RequestHandler } from './$types';
import { getShortLinks } from '$lib/services/linkat';
import { json } from '@sveltejs/kit';
import type { ShortLink } from '$lib/services/types';

export const GET: RequestHandler = async () => {
	try {
		const links = await getShortLinks();

		return json({
			success: true,
			count: links.length,
			links: links.map((link: ShortLink) => ({
				shortcode: link.shortcode,
				url: link.url,
				title: link.title,
				emoji: link.emoji,
				shortUrl: `/${link.shortcode}`
			}))
		});
	} catch (error) {
		console.error('[API] Error fetching links:', error);
		return json(
			{
				success: false,
				error: 'Failed to fetch links'
			},
			{ status: 500 }
		);
	}
};
