export interface LinkCard {
	text: string;
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
