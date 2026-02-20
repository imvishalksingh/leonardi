import { fetchCategoryData, slugify, clearCache as clearStoreCache } from './categoryStore';

let cachedProducts = null;
let cachedCategories = null;

/**
 * Fallback mock products used when the API is unreachable.
 */
// Fallback constants removed as per requirement
const FALLBACK_PRODUCTS = [];
const FALLBACK_CATEGORIES = [];

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
        meta_title: apiProduct.meta_title || '',
        meta_keyword: apiProduct.meta_keyword || '',
        meta_description: apiProduct.meta_description || '',
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
            cachedProducts = [];
            cachedCategories = [];
            pendingProductFetch = null;
            return { products: [], categories: [] };
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
