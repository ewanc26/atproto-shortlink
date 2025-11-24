/**
 * Generic in-memory cache with TTL (Time To Live) support
 */
export class Cache<T> {
	private data = new Map<string, { value: T; expires: number }>();

	/**
	 * Set a value in the cache with optional TTL
	 * @param key - Cache key
	 * @param value - Value to cache
	 * @param ttlMs - Time to live in milliseconds (default: 5 minutes)
	 */
	set(key: string, value: T, ttlMs: number = 300000): void {
		this.data.set(key, {
			value,
			expires: Date.now() + ttlMs
		});
	}

	/**
	 * Get a value from the cache
	 * @param key - Cache key
	 * @returns The cached value or null if expired/not found
	 */
	get(key: string): T | null {
		const entry = this.data.get(key);
		if (!entry) return null;

		if (Date.now() > entry.expires) {
			this.data.delete(key);
			return null;
		}

		return entry.value;
	}

	/**
	 * Check if a key exists in the cache and is not expired
	 * @param key - Cache key
	 * @returns True if the key exists and is valid
	 */
	has(key: string): boolean {
		const entry = this.data.get(key);
		if (!entry) return false;

		if (Date.now() > entry.expires) {
			this.data.delete(key);
			return false;
		}

		return true;
	}

	/**
	 * Delete a specific key from the cache
	 * @param key - Cache key
	 * @returns True if the key existed
	 */
	delete(key: string): boolean {
		return this.data.delete(key);
	}

	/**
	 * Clear all cached data
	 */
	clear(): void {
		this.data.clear();
	}

	/**
	 * Get the number of items in the cache (including expired)
	 */
	size(): number {
		return this.data.size;
	}

	/**
	 * Remove all expired entries from the cache
	 * @returns Number of entries removed
	 */
	prune(): number {
		const now = Date.now();
		let removed = 0;

		for (const [key, entry] of this.data.entries()) {
			if (now > entry.expires) {
				this.data.delete(key);
				removed++;
			}
		}

		return removed;
	}
}
