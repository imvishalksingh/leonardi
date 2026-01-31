export const imageHelper = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `/assets/${cleanPath}`;
};
