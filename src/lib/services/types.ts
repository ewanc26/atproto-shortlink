export interface LinkCard {
	/** Card label. Optional — Linkat boards may omit it. */
	text?: string;
	url: string;
	emoji?: string;
}

export interface LinkData {
	cards: LinkCard[];
}

export interface ShortLink {
	shortcode: string;
	url: string;
	title: string;
	emoji?: string;
}
