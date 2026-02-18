import { fetchCategoryData, slugify, clearCache as clearStoreCache } from './categoryStore';

let cachedProducts = null;
let cachedCategories = null;

/**
 * Fallback mock products used when the API is unreachable.
 */
const FALLBACK_PRODUCTS = [
    {
        id: 201, name: 'Classic Silk Necktie', slug: 'classic-silk-necktie', price: 895.00, compare_at_price: 1200.00,
        category: 'Necktie', categorySlug: 'necktie', stock: 100, images: ['hero-slide-1.png', 'hero-slide-2.png'],
        description: 'A classic silk necktie for every occasion.', item_type: 'Necktie',
        material: 'Woven Silk', size: '', pattern: 'Stripes',
        color: { name: 'Navy Blue', code: '#1a237e' }, reviews: { rating: 4.5, count: 28 },
        best_seller: 'active', on_sale: 'active', new_arrival: 'inactive',
        occasion: 'Formal', material_care: 'Dry Clean Only', sku: 'NT-001',
        dimensions: { length: '150cm', breadth: '8cm', height: '' }, subcategory: 'Silk Necktie', subcategorySlug: 'silk-necktie',
    },
    {
        id: 202, name: 'Royal Paisley Tie', slug: 'royal-paisley-tie', price: 1045.00, compare_at_price: null,
        category: 'Necktie', categorySlug: 'necktie', stock: 50, images: ['hero-slide-2.png', 'hero-slide-3.png'],
        description: 'A sophisticated paisley pattern.', item_type: 'Necktie',
        material: 'Microfiber', size: '', pattern: 'Paisley',
        color: { name: 'Maroon', code: '#800000' }, reviews: { rating: 4.2, count: 15 },
        best_seller: 'active', on_sale: 'inactive', new_arrival: 'active',
        occasion: 'Wedding', material_care: 'Dry Clean Only', sku: 'NT-002',
        dimensions: { length: '150cm', breadth: '8cm', height: '' }, subcategory: 'Printed Necktie', subcategorySlug: 'printed-necktie',
    },
    {
        id: 203, name: 'Elegant Pocket Square', slug: 'elegant-pocket-square', price: 450.00, compare_at_price: 600.00,
        category: 'Pocket Square', categorySlug: 'pocket-square', stock: 200, images: ['hero-slide-3.png', 'hero-slide-1.png'],
        description: 'Complete your look with this elegant pocket square.', item_type: 'Pocket Square',
        material: 'Silk', size: '', pattern: 'Solid',
        color: { name: 'Burgundy', code: '#800020' }, reviews: { rating: 4.8, count: 42 },
        best_seller: 'active', on_sale: 'active', new_arrival: 'inactive',
        occasion: 'Formal', material_care: 'Hand Wash', sku: 'PS-001',
        dimensions: { length: '33cm', breadth: '33cm', height: '' }, subcategory: 'Silk Pocket Square', subcategorySlug: 'silk-pocket-square',
    },
    {
        id: 204, name: 'Designer Lapel Pin', slug: 'designer-lapel-pin', price: 350.00, compare_at_price: null,
        category: 'Brooch', categorySlug: 'brooch', stock: 150, images: ['hero-slide-1.png', 'hero-slide-3.png'],
        description: 'A stunning lapel pin.', item_type: 'Brooch',
        material: 'Metal Alloy', size: '', pattern: 'Geometric',
        color: { name: 'Gold', code: '#FFD700' }, reviews: { rating: 4.6, count: 33 },
        best_seller: 'inactive', on_sale: 'inactive', new_arrival: 'active',
        occasion: 'Party', material_care: 'Wipe with cloth', sku: 'BR-001',
        dimensions: { length: '5cm', breadth: '3cm', height: '' }, subcategory: 'Metal Brooch', subcategorySlug: 'metal-brooch',
    },
    {
        id: 205, name: 'Premium Leather Belt', slug: 'premium-leather-belt', price: 1250.00, compare_at_price: 1500.00,
        category: 'Belt', categorySlug: 'belt', stock: 75, images: ['hero-slide-2.png', 'hero-slide-1.png'],
        description: 'Premium leather belt.', item_type: 'Belt',
        material: 'Genuine Leather', size: '', pattern: 'Plain',
        color: { name: 'Black', code: '#000000' }, reviews: { rating: 4.7, count: 56 },
        best_seller: 'active', on_sale: 'active', new_arrival: 'inactive',
        occasion: 'Everyday', material_care: 'Leather conditioner', sku: 'BL-001',
        dimensions: { length: '120cm', breadth: '3.5cm', height: '' }, subcategory: 'Leather Belt', subcategorySlug: 'leather-belt',
    },
];

const FALLBACK_CATEGORIES = [
    { id: 1, title: 'Necktie', slug: 'necktie', image: 'hero-slide-1.png' },
    { id: 2, title: 'Pocket Square', slug: 'pocket-square', image: 'hero-slide-2.png' },
    { id: 3, title: 'Brooch', slug: 'brooch', image: 'hero-slide-3.png' },
    { id: 4, title: 'Belt', slug: 'belt', image: 'hero-slide-1.png' },
];

/**
 * Normalize a single API product into the shape the UI components expect.
 */
const normalizeProduct = (apiProduct, categoryTitle = '', subcategoryTitle = '') => {
    const salePrice = parseFloat(apiProduct.sale_price) || 0;
    const regularPrice = parseFloat(apiProduct.regular_price) || 0;

    const images = [];
    if (apiProduct.thumbnail_image) images.push(apiProduct.thumbnail_image);
    if (Array.isArray(apiProduct.gallery_images)) {
        apiProduct.gallery_images.forEach(img => {
            if (img && !images.includes(img)) images.push(img);
        });
    }
    if (images.length === 0) images.push('');

    return {
        id: apiProduct.id,
        name: apiProduct.title || 'Untitled',
        slug: slugify(apiProduct.title || ''),
        price: salePrice,
        compare_at_price: regularPrice > salePrice ? regularPrice : null,
        category: categoryTitle,
        categorySlug: slugify(categoryTitle),
        stock: parseInt(apiProduct.qty, 10) || 0,
        images,
        description: apiProduct.description || '',
        item_type: apiProduct.item_type || categoryTitle,
        material: apiProduct.fabric?.fabric_name || '',
        material_care: apiProduct.material_care || 'Dry Clean Only',
        pattern: apiProduct.patterns || '',
        size: apiProduct.general_sizes || apiProduct.number_sizes || '',
        color: apiProduct.color ? {
            name: apiProduct.color.color_name || '',
            code: apiProduct.color.color_code || '',
        } : null,
        reviews: { rating: 4.5, count: 0 },
        best_seller: apiProduct.best_seller || 'inactive',
        on_sale: apiProduct.on_sale || 'inactive',
        new_arrival: apiProduct.new_arrival || 'inactive',
        occasion: apiProduct.occasion || '',
        dimensions: {
            length: apiProduct.item_length ? `${apiProduct.item_length} ${apiProduct.length_unit || ''}`.trim() : '',
            breadth: apiProduct.item_width ? `${apiProduct.item_width} ${apiProduct.width_unit || ''}`.trim() : '',
            height: apiProduct.item_height ? `${apiProduct.item_height} ${apiProduct.height_unit || ''}`.trim() : '',
        },
        sku: apiProduct.product_sku || '',
        subcategory: subcategoryTitle,
        subcategorySlug: slugify(subcategoryTitle),
    };
};

/**
 * Fetch all products via the shared categoryStore.
 * Only ONE normalization pass runs regardless of how many callers.
 */
let pendingProductFetch = null;

const fetchAllProducts = async () => {
    if (cachedProducts) return { products: cachedProducts, categories: cachedCategories };
    if (pendingProductFetch) return pendingProductFetch;

    pendingProductFetch = (async () => {
        const categories = await fetchCategoryData();

        if (!categories || categories.length === 0) {
            cachedProducts = FALLBACK_PRODUCTS;
            cachedCategories = FALLBACK_CATEGORIES;
            pendingProductFetch = null;
            return { products: FALLBACK_PRODUCTS, categories: FALLBACK_CATEGORIES };
        }

        const allProducts = [];

        categories.forEach(cat => {
            const categoryTitle = cat.title || cat.name || '';

            if (Array.isArray(cat.subcategories)) {
                cat.subcategories.forEach(sub => {
                    const subcategoryTitle = sub.title || sub.name || '';
                    if (Array.isArray(sub.products)) {
                        sub.products.forEach(p => {
                            allProducts.push(normalizeProduct(p, categoryTitle, subcategoryTitle));
                        });
                    }
                });
            }

            if (Array.isArray(cat.products)) {
                cat.products.forEach(p => {
                    allProducts.push(normalizeProduct(p, categoryTitle, ''));
                });
            }
        });

        cachedProducts = allProducts;
        cachedCategories = categories;
        pendingProductFetch = null;
        return { products: allProducts, categories };
    })();

    return pendingProductFetch;
};

export const getProducts = async () => {
    const { products } = await fetchAllProducts();
    return products;
};

export const getProductBySlug = async (slug) => {
    const { products } = await fetchAllProducts();
    return products.find(p => p.slug === slug) || null;
};

export const getProductsByCategory = async (categorySlug, subSlug = null) => {
    const { products } = await fetchAllProducts();

    if (subSlug) {
        const matched = products.filter(p => p.subcategorySlug === subSlug);
        console.log(`[productService] filter subcategory="${subSlug}" → ${matched.length} products`);
        if (matched.length === 0) {
            // Debug: show available subcategory slugs
            const availSlugs = [...new Set(products.map(p => p.subcategorySlug))].filter(Boolean);
            console.log('[productService] available subcategorySlugs:', availSlugs);
        }
        return matched;
    }

    const matched = products.filter(p => p.categorySlug === categorySlug);
    console.log(`[productService] filter category="${categorySlug}" → ${matched.length} products`);
    return matched;
};

export const getRelatedProducts = async (category, currentId) => {
    const { products } = await fetchAllProducts();
    return products
        .filter(p => p.category === category && p.id !== currentId)
        .slice(0, 4);
};

export const getProductsByFlag = async (flag) => {
    const { products } = await fetchAllProducts();
    return products.filter(p => p[flag] === 'active');
};

export const getCategories = async () => {
    const { categories } = await fetchAllProducts();
    return categories;
};

export const clearProductCache = () => {
    cachedProducts = null;
    cachedCategories = null;
    pendingProductFetch = null;
    clearStoreCache();
};
