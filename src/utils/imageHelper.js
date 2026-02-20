const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const imageHelper = (imagePath) => {
    if (!imagePath) return '';

    // Already a full URL — return as-is, but check for "double URL" issue from backend
    // e.g. "https://domain.com/storage/https://google.com/..."
    if (imagePath.startsWith('http')) {
        const doubleUrlMatch = imagePath.match(/(https?:\/\/.*)(https?:\/\/.*)/);
        if (doubleUrlMatch && doubleUrlMatch[2]) {
            return doubleUrlMatch[2];
        }
        return imagePath;
    }

    // API storage paths (e.g. "products/thumbnails/abc.jpg" or "categories/xyz.png")
    // These come from the Laravel backend and live under /storage/
    if (
        imagePath.startsWith('products/') ||
        imagePath.startsWith('categories/') ||
        imagePath.startsWith('subcategories/') ||
        imagePath.startsWith('profiles/') ||
        imagePath.startsWith('users/') ||
        imagePath.startsWith('avatars/') ||
        imagePath.startsWith('profile_images/') ||
        imagePath.startsWith('storage/')
    ) {
        // If it starts with storage/, just append API_URL (ensure no double slash)
        if (imagePath.startsWith('storage/')) {
            return `${API_URL}/${imagePath}`.replace(/([^:]\/)\/+/g, "$1");
        }
        // Otherwise prepend /storage/
        return `${API_URL}/storage/${imagePath}`.replace(/([^:]\/)\/+/g, "$1");
    }

    // Local public assets (legacy mock images like "hero-slide-1.png")
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `/assets/${cleanPath}`;
};
