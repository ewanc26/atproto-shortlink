import { beforeEach, describe, expect, it, vi } from 'vitest';

const fetchLinkatBoard = vi.fn();
const createAgentForDID = vi.fn();
const createAgentWithFallback = vi.fn();

vi.mock('$env/static/private', () => ({ ATPROTO_DID: 'did:plc:test' }));
vi.mock('$lib/services/linkat/fetcher', () => ({ fetchLinkatBoard }));
vi.mock('$lib/services/agent', () => ({ createAgentForDID, createAgentWithFallback }));

const { GET } = await import('./+server');
const { clearCache } = await import('$lib/services/linkat');
const { encodeUrl } = await import('$lib/utils/encoding');

const CARD_URL = 'https://example.com/docs';
const SHORTCODE = encodeUrl(CARD_URL);

function callGet(shortcode: string) {
	return GET({ params: { shortcode } } as unknown as Parameters<typeof GET>[0]);
}

describe('GET /[shortcode]', () => {
	beforeEach(() => {
		clearCache();
		vi.spyOn(console, 'warn').mockImplementation(() => {});
		vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.spyOn(console, 'log').mockImplementation(() => {});
		fetchLinkatBoard.mockReset();
		createAgentForDID.mockReset();
		createAgentWithFallback.mockReset();
	});

	it('returns 503 with Retry-After when the Linkat board cannot be fetched', async () => {
		createAgentForDID.mockRejectedValue(new Error('PDS down'));
		createAgentWithFallback.mockRejectedValue(new Error('fallback down'));

		const response = await callGet(SHORTCODE);

		expect(response.status).toBe(503);
		expect(response.headers.get('Retry-After')).toBe('60');
		expect(response.headers.get('Cache-Control')).toBe('no-store');
	});

	it('does not cache an outage, so the next request retries the board', async () => {
		createAgentForDID.mockRejectedValue(new Error('PDS down'));
		createAgentWithFallback.mockRejectedValue(new Error('fallback down'));
		await callGet(SHORTCODE);

		fetchLinkatBoard.mockResolvedValue({ cards: [{ url: CARD_URL }] });
		createAgentForDID.mockResolvedValue({});

		await expect(callGet(SHORTCODE)).rejects.toMatchObject({ status: 301 });
		expect(fetchLinkatBoard).toHaveBeenCalledTimes(1);
	});

	it('returns 404 when the board loads but lacks the shortcode', async () => {
		createAgentForDID.mockResolvedValue({});
		fetchLinkatBoard.mockResolvedValue({ cards: [{ url: 'https://example.com/other' }] });

		const response = await callGet(SHORTCODE);

		expect(response.status).toBe(404);
	});

	it('redirects permanently when the shortcode is on the board', async () => {
		createAgentForDID.mockResolvedValue({});
		fetchLinkatBoard.mockResolvedValue({ cards: [{ url: CARD_URL }] });

		let thrown: unknown;
		try {
			await callGet(SHORTCODE);
		} catch (error) {
			thrown = error;
		}

		expect(thrown).toMatchObject({ status: 301, location: CARD_URL });
	});

	it('returns 404 without touching the network for a malformed shortcode', async () => {
		const response = await callGet('not a shortcode!');

		expect(response.status).toBe(404);
		expect(createAgentForDID).not.toHaveBeenCalled();
	});
});
