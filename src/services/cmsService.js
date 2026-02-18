import api from './api';

// Helper to assign sections to pages for the footer
const getSectionForPage = (slug) => {
    const sectionMapping = {
        'about-us': 'information',
        'contact-us': 'information',
        'privacy-policy': 'information',
        'terms-conditions': 'information',
        'return-refund': 'customer_service',
        'shipping-policy': 'customer_service',
        'faqs': 'customer_service',
        'blog': 'customer_service'
    };
    return sectionMapping[slug] || 'information';
};

let pagesCache = null;

const fetchPages = async () => {
    if (pagesCache) return pagesCache;
    try {
        const response = await api.get('/api/page');
        if (response.data.status && Array.isArray(response.data.data)) {
            pagesCache = response.data.data.map(page => ({
                id: page.slug, // Use slug as ID for compatibility with existing code
                title: page.page_title,
                heading: page.page_heading,
                content: page.content,
                section: getSectionForPage(page.slug)
            }));
            return pagesCache;
        }
        return [];
    } catch (error) {
        console.error("Failed to fetch pages:", error);
        return [];
    }
};

export const getPageBySlug = async (slug) => {
    const pages = await fetchPages();
    const page = pages.find(p => p.id === slug);
    if (page) {
        return page;
    }
    throw new Error('Page not found');
};

export const getBlogs = async () => {
    try {
        const response = await api.get('/api/blogs');
        if (response.data.status === "success" && Array.isArray(response.data.data)) {
            return response.data.data;
        }
        return [];
    } catch (error) {
        console.error("Failed to fetch blogs:", error);
        return [];
    }
};

export const getBlogBySlug = async (slug) => {
    // If API supports /blogs/:slug, use that. Otherwise fetch all and find.
    // Assuming fetch all for now based on current API knowledge.
    const blogs = await getBlogs();
    const blog = blogs.find(b => b.slug === slug);
    if (blog) return blog;
    throw new Error('Blog not found');
};

export const getFAQs = async () => {
    try {
        const response = await api.get('/api/faqs');
        if (response.data.status === "success" && Array.isArray(response.data.data)) {
            return response.data.data;
        }
        return [];
    } catch (error) {
        console.error("Failed to fetch FAQs:", error);
        return [];
    }
};

export const getFooterLinks = async () => {
    // Return static links structure for compatibility if needed, 
    // but Footer.jsx will likely be updated to use static links directly.
    // Keeping this for now or modifying it to return the static list the user wants.
    return [
        { id: 'about-us', title: 'About Us', section: 'information', type: 'page' },
        { id: 'contact-us', title: 'Contact Us', section: 'information', type: 'page' },
        { id: 'privacy-policy', title: 'Privacy Policy', section: 'information', type: 'page' },
        { id: 'terms-conditions', title: 'Terms & Conditions', section: 'information', type: 'page' },
        { id: 'faqs', title: 'FAQs', section: 'customer_service', type: 'custom', link: '/faqs' },
        { id: 'return-refund', title: 'Return & Refund', section: 'customer_service', type: 'page' },
        { id: 'shipping-policy', title: 'Shipping Policy', section: 'customer_service', type: 'page' },
        { id: 'blogs', title: 'Blog', section: 'customer_service', type: 'custom', link: '/blogs' }
    ];
};
