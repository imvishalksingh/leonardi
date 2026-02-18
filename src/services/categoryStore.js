import api from './api';

/**
 * Shared data store — a single API call to /api/category powers
 * both navigationService and productService.
 *
 * Uses a pending promise to deduplicate concurrent requests.
 */

let cachedData = null;
let pendingFetch = null;

/**
 * Convert any title/name to a URL-friendly slug.
 */
export const slugify = (text) => {
    return (text || '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
};

/**
 * Fetch from /api/category ONCE and cache the result.
 * All concurrent callers share the same in-flight promise.
 */
export const fetchCategoryData = async () => {
    if (cachedData) return cachedData;
    if (pendingFetch) return pendingFetch;

    pendingFetch = api.get('/api/category')
        .then(({ data }) => {
            const categories = Array.isArray(data)
                ? data
                : (data.data || data.categories || []);

            cachedData = categories;
            pendingFetch = null;
            return categories;
        })
        .catch((error) => {
            console.error('Failed to fetch /api/category:', error.message);
            pendingFetch = null;
            return null; // null signals "use fallback"
        });

    return pendingFetch;
};

/**
 * Clear cache (both services will re-fetch on next call)
 */
export const clearCache = () => {
    cachedData = null;
    pendingFetch = null;
};
