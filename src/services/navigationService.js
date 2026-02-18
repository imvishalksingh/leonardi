import { fetchCategoryData, slugify, clearCache as clearStoreCache } from './categoryStore';

let cachedNavTree = null;

/**
 * Fallback navigation data used when the API is unreachable.
 */
const FALLBACK_NAVIGATION_TREE = [
    {
        id: 'necktie', label: 'Necktie', path: '/collection/necktie', image: null,
        subs: [
            { id: 'zipper-necktie', label: 'Zipper Necktie', path: '/collection/necktie/zipper-necktie', image: '/assets/hero-slide-1.png' },
            { id: 'solid-necktie', label: 'Solid Necktie', path: '/collection/necktie/solid-necktie', image: '/assets/hero-slide-2.png' },
            { id: 'silk-necktie', label: 'Silk Necktie', path: '/collection/necktie/silk-necktie', image: '/assets/hero-slide-3.png' },
        ]
    },
    {
        id: 'pocket-square', label: 'Pocket Square', path: '/collection/pocket-square', image: null,
        subs: [
            { id: 'solid-pocket-square', label: 'Solid Pocket Square', path: '/collection/pocket-square/solid-pocket-square', image: '/assets/hero-slide-1.png' },
            { id: 'silk-pocket-square', label: 'Silk Pocket Square', path: '/collection/pocket-square/silk-pocket-square', image: '/assets/hero-slide-2.png' },
        ]
    },
    {
        id: 'brooch', label: 'Brooch', path: '/collection/brooch', image: null,
        subs: [
            { id: 'metal-brooch', label: 'Metal Brooch', path: '/collection/brooch/metal-brooch', image: '/assets/hero-slide-1.png' },
            { id: 'chain-brooch', label: 'Chain Brooch', path: '/collection/brooch/chain-brooch', image: '/assets/hero-slide-2.png' },
        ]
    },
    {
        id: 'belt', label: 'Belt', path: '/collection/belt', image: null,
        subs: []
    },
];

/**
 * Fetches the category tree and transforms it for the sidebar.
 * Uses the shared categoryStore — only ONE API call is ever made.
 */
export const getNavigationTree = async () => {
    if (cachedNavTree) return cachedNavTree;

    const categories = await fetchCategoryData();

    if (!categories || categories.length === 0) {
        cachedNavTree = FALLBACK_NAVIGATION_TREE;
        return cachedNavTree;
    }

    const navTree = categories.map(cat => {
        const catSlug = slugify(cat.title || cat.name || '');
        return {
            id: catSlug,
            label: cat.title || cat.name,
            path: `/collection/${catSlug}`,
            image: cat.image || null,
            subs: (cat.subcategories || []).map(sub => {
                const subSlug = slugify(sub.title || sub.name || '');
                return {
                    id: subSlug,
                    label: sub.title || sub.name,
                    path: `/collection/${catSlug}/${subSlug}`,
                    image: sub.image || null,
                };
            }),
        };
    });

    cachedNavTree = navTree;
    return navTree;
};

export const clearNavigationCache = () => {
    cachedNavTree = null;
    clearStoreCache();
};
