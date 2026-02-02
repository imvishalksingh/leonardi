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
        "reviews": { "rating": 4.5, "count": 1234 },
        "description": "This elegant Pink Crystal Leaf Brooch features delicate pearl detailing that adds a touch of sophistication to any outfit. The intricate leaf design is adorned with shimmering crystals, capturing the light beautifully. Perfect for weddings, formal events, or simply elevating your everyday attire. The secure pin ensures it stays in place all day long.",
        "item_type": "Brooch",
        "pattern": "Floral",
        "material_care": "Wipe Clean Only",
        "items_count": 1,
        "specifications": {
            "Size": "One Size",
            "Dimensions": "5 cm x 3 cm",
            "Fabric": "Alloy/Crystal",
            "Material Care": "Wipe Clean Only",
            "Stock": "In Stock"
        }
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
        "reviews": { "rating": 4.8, "count": 89 },
        "description": "Add a vibrant splash of color to your ensemble with our Multicolour Feather Brooch Pin. This statement piece mimics the beauty of exotic plumage, making it an eye-catching accessory for lapels, scarves, or hats. Crafted with high-quality materials to ensure durability and style.",
        "item_type": "Brooch",
        "pattern": "Abstract",
        "material_care": "Dry Clean Only",
        "items_count": 1,
        "specifications": {
            "Size": "Standard",
            "Dimensions": "8 cm x 4 cm",
            "Fabric": "Feather/Metal",
            "Material Care": "Dry Clean Only",
            "Stock": "In Stock"
        }
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
        "images": ["wings-brooch-1.jpg", "wings-brooch-1.jpg"], // Added duplicate as placeholder if needed, or better distinct one if available. Let's use same for now if no other asset, but that defeats the purpose. I'll use a generic placeholder or reuse another image for demo.
        "images": ["wings-brooch-1.jpg", "pink-brooch-1.jpg"], // Using another image for demo contrast
        "reviews": { "rating": 4.2, "count": 45 },
        "description": "Showcase your ambition and style with the Gold and Green Dollar Wings Brooch. This unique accessory features a winged dollar sign design, perfect for business professionals or anyone who wants to make a bold statement. The gold tone finish adds a luxurious feel.",
        "item_type": "Brooch",
        "pattern": "Symbolic",
        "material_care": "Wipe Clean Only",
        "items_count": 1,
        "specifications": {
            "Size": "Medium",
            "Dimensions": "4 cm x 6 cm",
            "Fabric": "Gold Plated Alloy",
            "Material Care": "Wipe Clean Only",
            "Stock": "Low Stock"
        }
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
        "images": ["brown-belt-1.jpg", "tie-pin-1.jpg"], // Temporary swap to PROVE hover works (using distinct image)
        "reviews": { "rating": 5.0, "count": 12 },
        "description": "The Brown Braided Leather Casual Belt is a versatile addition to any wardrobe. Made from genuine leather, the braided design allows for a custom fit without the need for pre-punched holes. Its classic brown hue pairs perfectly with jeans, chinos, or casual trousers.",
        "item_type": "Belt",
        "pattern": "Braided",
        "material_care": "Leather Conditioner",
        "items_count": 1,
        "specifications": {
            "Size": "Adjustable",
            "Dimensions": "110 cm x 3.5 cm",
            "Fabric": "Genuine Leather",
            "Material Care": "Use Leather Cleaners",
            "Stock": "In Stock"
        }
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
        "images": ["tie-pin-1.jpg", "tie-pin-1.jpg"], // Placeholder duplicate
        "reviews": { "rating": 4.6, "count": 230 },
        "description": "Keep your tie perfectly in place with this sleek Silver Tie Pin featuring a modern Black Horizontal Stripe Design. Minimalist yet striking, it adds a finishing touch to your formal attire. The sturdy clasp ensures your tie stays neat throughout the day.",
        "item_type": "Tie Pin",
        "pattern": "Striped",
        "material_care": "Wipe Clean",
        "items_count": 1,
        "specifications": {
            "Size": "Standard",
            "Dimensions": "6 cm x 0.5 cm",
            "Fabric": "Stainless Steel",
            "Material Care": "Wipe Clean",
            "Stock": "In Stock"
        }
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
        "images": ["suspender-1.jpg", "suspender-2.jpg"],
        "reviews": { "rating": 4.7, "count": 34 },
        "description": "Achieve a timeless look with our Black Adjustable Formal Suspenders. Designed for comfort and style, these suspenders feature sturdy clips and fully adjustable straps to ensure a perfect fit. An essential accessory for tuxedos and formal suits.",
        "item_type": "Suspender",
        "pattern": "Solid",
        "material_care": "Dry Clean Only",
        "items_count": 1,
        "specifications": {
            "Size": "Adjustable",
            "Dimensions": "Width 2.5 cm",
            "Fabric": "Elastic/Polyester",
            "Material Care": "Dry Clean Only",
            "Stock": "In Stock"
        }
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
        "reviews": { "rating": 4.5, "count": 20 },
        "description": "Add a playful yet dapper touch to your outfit with these Navy Blue Polka Dot Suspenders. The classic polka dot pattern contrasts beautifully with the navy background, making them suitable for weddings, parties, or everyday office wear.",
        "item_type": "Suspender",
        "pattern": "Polka Dot",
        "material_care": "Dry Clean Only",
        "items_count": 1,
        "specifications": {
            "Size": "Adjustable",
            "Dimensions": "Width 2.5 cm",
            "Fabric": "Elastic/Polyester",
            "Material Care": "Dry Clean Only",
            "Stock": "In Stock"
        }
    },
    {
        "id": 108,
        "name": "Brown Leather Belt",
        "slug": "brown-leather-belt",
        "price": 496.00,
        "compare_at_price": null,
        "category": "Belt",
        "stock": 55,
        "sold_count": 8,
        "images": ["brown-belt-1.jpg"],
        "reviews": { "rating": 4.5, "count": 20 },
        "description": "A classic essential, this Brown Leather Belt combines durability with simple elegance. The robust buckle and high-quality leather ensure it stands the test of time, becoming a staple in your daily wardrobe.",
        "item_type": "Belt",
        "pattern": "Solid",
        "material_care": "Leather Conditioner",
        "items_count": 1,
        "specifications": {
            "Size": "Standard",
            "Dimensions": "115 cm x 3.5 cm",
            "Fabric": "Leather",
            "Material Care": "Use Leather Cleaners",
            "Stock": "In Stock"
        }
    },
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
        "images": ["hero-slide-2.png"],
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
                    id: `${item.id}-dup-${Date.now()}-${index}` // Generate unique ID for duplicates
                }));
                result = [...result, ...clones];
            }

            resolve(result.slice(0, 4));
        }, 500);
    });
};
