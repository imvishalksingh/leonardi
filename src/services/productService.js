import { imageHelper } from '../utils/imageHelper';


const PRODUCTS = [
    // NEW MOCK DATA FOR SIDEBAR CATEGORIES
    {
        "id": 201,
        "name": "Classic Silk Necktie",
        "slug": "classic-silk-necktie",
        "price": 895.00,
        "category": "Necktie",
        "stock": 100,
        "images": ["hero-slide-1.png", "hero-slide-2.png", "hero-slide-2.png", "hero-slide-3.png"],
        "description": "A classic silk necktie for every occasion.",
        "item_type": "Necktie",
        "reviews": { "rating": 4.5, "count": 28 },
        "material": "Woven Silk",
        "size": "Regular ( 7cm - 8.5cm )",
        "pattern": "Stripes"
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
        "reviews": { "rating": 4.2, "count": 15 },
        "material": "Woven Polyester",
        "size": "Skinny ( 6cm - 6.5cm )",
        "pattern": "Solids"
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
        "reviews": { "rating": 4.8, "count": 40 },
        "material": "Woven Micro",
        "size": "Broad ( 9cm Above )",
        "pattern": "Solids"
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
        "reviews": { "rating": 4.6, "count": 35 },
        "material": "Velvet",
        "size": "Regular",
        "pattern": "Solids"
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
        "reviews": { "rating": 4.7, "count": 22 },
        "material": "Satin",
        "size": "Regular",
        "pattern": "Solids"
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
        "reviews": { "rating": 4.5, "count": 18 },
        "material": "Printed Silk",
        "size": "Regular",
        "pattern": "Paisleys"
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
        "reviews": { "rating": 4.9, "count": 150 },
        "material": "Cotton",
        "size": "Regular",
        "pattern": "Solids"
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
        "reviews": { "rating": 4.8, "count": 42 },
        "material": "Metal",
        "size": "Regular",
        "pattern": "Abstract"
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
        "reviews": { "rating": 4.4, "count": 10 },
        "material": "Printed Silk",
        "size": "Long Length (68inch )",
        "pattern": "Paisleys"
    },
    // Adding more mock data to test filters
    {
        "id": 210,
        "name": "Knitted Cotton Tie",
        "slug": "knitted-cotton-tie",
        "price": 650.00,
        "category": "Necktie",
        "stock": 25,
        "images": ["hero-slide-1.png"],
        "description": "Casual knitted cotton tie.",
        "item_type": "Necktie",
        "reviews": { "rating": 4.3, "count": 12 },
        "material": "Knitted",
        "size": "Skinny ( 6cm - 6.5cm )",
        "pattern": "Solids"
    },
    {
        "id": 211,
        "name": "Polka Dot Silk Tie",
        "slug": "polka-dot-silk-tie",
        "price": 950.00,
        "category": "Necktie",
        "stock": 40,
        "images": ["hero-slide-2.png"],
        "description": "Classic polka dot pattern.",
        "item_type": "Necktie",
        "reviews": { "rating": 4.6, "count": 18 },
        "material": "Printed Silk",
        "size": "Regular ( 7cm - 8.5cm )",
        "pattern": "Polkas"
    },
    {
        "id": 212,
        "name": "Abstract Printed Micro Tie",
        "slug": "abstract-printed-micro-tie",
        "price": 750.00,
        "category": "Necktie",
        "stock": 35,
        "images": ["hero-slide-3.png"],
        "description": "Modern abstract design.",
        "item_type": "Necktie",
        "reviews": { "rating": 4.4, "count": 22 },
        "material": "Printed Micro",
        "size": "Broad ( 9cm Above )",
        "pattern": "Abstract"
    },
    {
        "id": 213,
        "name": "Checkered Wool Tie",
        "slug": "checkered-wool-tie",
        "price": 850.00,
        "category": "Necktie",
        "stock": 15,
        "images": ["hero-slide-4.png"],
        "description": "Warm wool tie for winter.",
        "item_type": "Necktie",
        "reviews": { "rating": 4.7, "count": 8 },
        "material": "Wool",
        "size": "Regular ( 7cm - 8.5cm )",
        "pattern": "Checks"
    },
    {
        "id": 214,
        "name": "Floral Novelty Tie",
        "slug": "floral-novelty-tie",
        "price": 895.00,
        "category": "Necktie",
        "stock": 55,
        "images": ["hero-slide-5.jpg"],
        "description": "Fun floral novelty tie.",
        "item_type": "Necktie",
        "reviews": { "rating": 4.5, "count": 30 },
        "material": "Woven Micro",
        "size": "Regular ( 7cm - 8.5cm )",
        "pattern": "Florals"
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
