const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const imageHelper = (imagePath) => {
    if (!imagePath) return '';

    // Already a full URL — return as-is
    if (imagePath.startsWith('http')) {
        return imagePath;
    }

    // API storage paths (e.g. "products/thumbnails/abc.jpg" or "categories/xyz.png")
    // These come from the Laravel backend and live under /storage/
    if (
        imagePath.startsWith('products/') ||
        imagePath.startsWith('categories/') ||
        imagePath.startsWith('subcategories/')
    ) {
        return `${API_URL}/storage/${imagePath}`;
    }

    // Local public assets (legacy mock images like "hero-slide-1.png")
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `/assets/${cleanPath}`;
};
