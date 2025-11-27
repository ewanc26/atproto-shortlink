/**
 * Component prop types for the AT Protocol Shortlink application
 */

import type { Snippet } from 'svelte';

/**
 * StatusCard component props
 */
export interface StatusCardProps {
	type: 'success' | 'error';
	children: Snippet;
}

/**
 * CodeBlock component props
 */
export interface CodeBlockProps {
	children: Snippet;
}

/**
 * Link component props
 */
export interface LinkProps {
	href: string;
	children: Snippet;
	external?: boolean;
}

/**
 * ShortLinkItem component props
 */
export interface ShortLinkItemProps {
	shortcode: string;
	title: string;
	emoji?: string;
}

/**
 * ApiEndpoint component props
 */
export interface ApiEndpointProps {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	description: string;
	href?: string;
}

/**
 * Section component props
 */
export interface SectionProps {
	title: string;
	children: Snippet;
}

/**
 * Spinner component props
 */
export interface SpinnerProps {
	size?: number;
	text?: string;
}

/**
 * ThemeToggle component has no props
 */
export interface ThemeToggleProps {}
