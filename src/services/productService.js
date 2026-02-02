import { imageHelper } from '../utils/imageHelper';

// MOCK DATA
const PRODUCTS = [
    // NEW MOCK DATA FOR SIDEBAR CATEGORIES
    {
        "id": 201,
        "name": "Classic Silk Necktie",
        "slug": "classic-silk-necktie",
        "price": 895.00,
        "category": "Necktie",
        "stock": 100,
        "images": ["hero-slide-1.png", "hero-slide-2.png"],
        "description": "A classic silk necktie for every occasion.",
        "item_type": "Necktie",
        "reviews": { "rating": 4.5, "count": 28 }
    },
    {
        "id": 202,
        "name": "Modern Zipper Tie",
        "slug": "modern-zipper-tie",
        "price": 995.00,
        "category": "Zipper Tie",
        "stock": 50,
        "images": ["hero-slide-2.png", "hero-slide-3.png"],
        "description": "Convenient zipper tie with modern design.",
        "item_type": "Necktie",
        "reviews": { "rating": 4.2, "count": 15 }
    },
    {
        "id": 203,
        "name": "Solid Red Necktie",
        "slug": "solid-red-necktie",
        "price": 795.00,
        "category": "Solid Tie",
        "stock": 80,
        "images": ["hero-slide-3.png", "hero-slide-1.png"],
        "description": "Bold solid red necktie.",
        "item_type": "Necktie",
        "reviews": { "rating": 4.8, "count": 40 }
    },
    {
        "id": 204,
        "name": "Black Velvet Bowtie",
        "slug": "black-velvet-bowtie",
        "price": 595.00,
        "category": "Bowtie",
        "stock": 40,
        "images": ["hero-slide-5.jpg"],
        "description": "Elegant black velvet bowtie.",
        "item_type": "Bowtie",
        "reviews": { "rating": 4.6, "count": 35 }
    },
    {
        "id": 205,
        "name": "Solid Satin Bowtie",
        "slug": "solid-satin-bowtie",
        "price": 595.00,
        "category": "Solid Bowtie",
        "stock": 45,
        "images": ["perfect-fit.png"],
        "description": "Premium satin finish bowtie.",
        "item_type": "Bowtie",
        "reviews": { "rating": 4.7, "count": 22 }
    },
    {
        "id": 206,
        "name": "Paisley Silk Pocket Square",
        "slug": "paisley-silk-pocket-square",
        "price": 495.00,
        "category": "Pocket Square",
        "stock": 60,
        "images": ["hero-slide-4.png"],
        "description": "Intricate paisley pattern pocket square.",
        "item_type": "Pocket Square",
        "reviews": { "rating": 4.5, "count": 18 }
    },
    {
        "id": 207,
        "name": "Solid White Pocket Square",
        "slug": "solid-white-pocket-square",
        "price": 395.00,
        "category": "Solid Pocket Square",
        "stock": 100,
        "images": ["hero-slide-1.png"],
        "description": "Essential solid white pocket square.",
        "item_type": "Pocket Square",
        "reviews": { "rating": 4.9, "count": 150 }
    },
    {
        "id": 208,
        "name": "Gold Cufflink Set",
        "slug": "gold-cufflink-set",
        "price": 1295.00,
        "category": "Cufflink",
        "stock": 30,
        "images": ["CUFFLINK-04.jpg"],
        "description": "Luxurious gold cufflink set.",
        "item_type": "Cufflink",
        "reviews": { "rating": 4.8, "count": 42 }
    },
    {
        "id": 209,
        "name": "Silk Cravat",
        "slug": "silk-cravat-pattern",
        "price": 1495.00,
        "category": "Cravat",
        "stock": 20,
        "images": ["hero-slide-2.png", "hero-slide-3.png"],
        "description": "Traditional silk cravat.",
        "item_type": "Cravat",
        "reviews": { "rating": 4.4, "count": 10 }
    }
];

export const getProducts = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(PRODUCTS);
        }, 500);
    });
};

export const getProductBySlug = async (slug) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const product = PRODUCTS.find(p => p.slug === slug);
            if (product) resolve(product);
            else reject(new Error("Product not found"));
        }, 500);
    });
};

export const getProductsByCategory = async (categorySlug) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (!categorySlug || categorySlug === 'all') {
                resolve(PRODUCTS);
                return;
            }
            // Normalize slug: replace hyphens with spaces for matching (e.g., 'tie-pin' -> 'tie pin' matches 'Tie Pin')
            const normalizedSlug = categorySlug.replace(/-/g, ' ').toLowerCase();

            const filtered = PRODUCTS.filter(p => p.category.toLowerCase() === normalizedSlug);
            resolve(filtered);
        }, 500);
    });
};

export const getRelatedProducts = async (category, currentId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            let related = PRODUCTS.filter(p => p.category === category && p.id !== currentId);

            // Fallback if no related products found in category
            if (related.length === 0) {
                related = PRODUCTS.filter(p => p.id !== currentId);
            }

            // Ensure we have at least 4 items by repeating if necessary
            let result = [...related];
            while (result.length < 4 && result.length > 0) {
                // Clone the items to avoid reference issues
                const clones = result.slice(0, 4 - result.length).map((item, index) => ({
                    ...item,
                    id: `${item.id}-dup-${Date.now()}-${Math.floor(Math.random() * 10000)}-${index}` // Generate unique ID for duplicates with random component
                }));
                result = [...result, ...clones];
            }

            resolve(result.slice(0, 4));
        }, 500);
    });
};
