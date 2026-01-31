import { imageHelper } from '../utils/imageHelper';

// MOCK DATA
const PRODUCTS = [
    {
        "id": 101,
        "name": "Pink Crystal Leaf Brooch with Pearl Detail",
        "slug": "pink-crystal-leaf-brooch",
        "price": 695.00,
        "compare_at_price": null,
        "category": "Brooch",
        "stock": 88,
        "sold_count": 12,
        "images": ["pink-brooch-1.jpg", "pink-brooch-2.jpg"],
        "reviews": { "rating": 4.5, "count": 1234 }
    },
    {
        "id": 102,
        "name": "Multicolour Feather Brooch Pin",
        "slug": "multicolour-feather-brooch-pin",
        "price": 695.00,
        "compare_at_price": 995.00,
        "category": "Brooch",
        "stock": 50,
        "sold_count": 150,
        "images": ["feather-brooch-1.jpg", "feather-brooch-2.jpg"],
        "reviews": { "rating": 4.8, "count": 89 }
    },
    {
        "id": 103,
        "name": "Gold and Green Dollar Wings Brooch",
        "slug": "gold-green-dollar-wings-brooch",
        "price": 695.00,
        "compare_at_price": null,
        "category": "Brooch",
        "stock": 10,
        "sold_count": 95,
        "images": ["wings-brooch-1.jpg"],
        "reviews": { "rating": 4.2, "count": 45 }
    },
    {
        "id": 104,
        "name": "Brown Braided Leather Casual Belt",
        "slug": "brown-braided-leather-casual-belt",
        "price": 1795.00,
        "compare_at_price": null,
        "category": "Belt",
        "stock": 100,
        "sold_count": 5,
        "images": ["brown-belt-1.jpg", "brown-belt-2.jpg"],
        "reviews": { "rating": 5.0, "count": 12 }
    },
    {
        "id": 105,
        "name": "Silver Tie Pin with Black Horizontal Stripe Design",
        "slug": "silver-tie-pin-black-stripe",
        "price": 495.00,
        "compare_at_price": null,
        "category": "Tie Pin",
        "stock": 200,
        "sold_count": 45,
        "images": ["tie-pin-1.jpg"],
        "reviews": { "rating": 4.6, "count": 230 }
    },
    {
        "id": 106,
        "name": "Black Adjustable Formal Suspenders",
        "slug": "black-formal-suspenders",
        "price": 895.00,
        "compare_at_price": 1295.00,
        "category": "Suspender",
        "stock": 40,
        "sold_count": 12,
        "images": ["suspender-1.jpg"],
        "reviews": { "rating": 4.7, "count": 34 }
    },
    {
        "id": 107,
        "name": "Navy Blue Polka Dot Suspenders",
        "slug": "navy-polka-dot-suspenders",
        "price": 895.00,
        "compare_at_price": null,
        "category": "Suspender",
        "stock": 55,
        "sold_count": 8,
        "images": ["suspender-2.jpg"],
        "reviews": { "rating": 4.5, "count": 20 }
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
            const related = PRODUCTS.filter(p => p.category === category && p.id !== currentId);
            // Return up to 4 related products
            resolve(related.slice(0, 4));
        }, 500);
    });
};
