
// Mock data for CMS pages
const pages = [
    {
        id: 'about-us',
        title: 'About Us',
        content: `
            <p>Welcome to Leonardi, where elegance meets craftsmanship. Established in 2025, we have been dedicated to providing premium accessories for the modern gentleman.</p>
            <br/>
            <p>Our mission is to create timeless pieces that elevate your style, from handcrafted belts to exquisite brooches. Each item is designed with meticulous attention to detail and quality.</p>
        `,
        section: 'information'
    },
    {
        id: 'contact-us',
        title: 'Contact Us',
        content: `
            <p>We'd love to hear from you. Whether you have a question about our products, need assistance with an order, or just want to say hello, we're here to help.</p>
            <br/>
            <p><strong>Email:</strong> info@leonardi.in</p>
            <p><strong>Phone:</strong> +91 921 057 7000</p>
            <p><strong>Address:</strong> 38, Bungalow Road, Kamla Nagar - 110007</p>
        `,
        section: 'information'
    },
    {
        id: 'privacy-policy',
        title: 'Privacy Policy',
        content: `
            <p>At Leonardi, we respect your privacy and are committed to protecting your personal data. This privacy policy informs you about how we look after your personal data when you visit our website.</p>
            <br/>
            <p>We do not share your personal information with third parties except as necessary to fulfill your order or as required by law.</p>
        `,
        section: 'information'
    },
    {
        id: 'terms-conditions',
        title: 'Terms & Conditions',
        content: `
            <p>Welcome to Leonardi. These terms and conditions outline the rules and regulations for the use of Leonardi's Website.</p>
            <br/>
            <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use Leonardi if you do not agree to take all of the terms and conditions stated on this page.</p>
        `,
        section: 'information'
    },
    {
        id: 'faqs',
        title: 'FAQs',
        content: `
            <p><strong>Q: How long does shipping take?</strong><br/>A: Standard shipping takes 3-5 business days.</p>
            <br/>
            <p><strong>Q: Do you offer international shipping?</strong><br/>A: Currently, we only ship within India.</p>
            <br/>
            <p><strong>Q: What is your return policy?</strong><br/>A: We offer a 7-day easy return policy for all unused items.</p>
        `,
        section: 'customer_service'
    },
    {
        id: 'return-refund',
        title: 'Return & Refund',
        content: `
            <p>If you are not completely satisfied with your purchase, you may return it within 7 days of receipt for a full refund or exchange. The item must be unused and in its original packaging.</p>
            <br/>
            <p>Refunds will be processed within 5-7 business days after we receive the returned item.</p>
        `,
        section: 'customer_service'
    },
    {
        id: 'shipping-policy',
        title: 'Shipping Policy',
        content: `
            <p>We offer free shipping on all orders over ₹2000. For orders under ₹2000, a flat shipping fee of ₹100 applies.</p>
            <br/>
            <p>Orders are processed within 1-2 business days and shipped via our trusted courier partners.</p>
        `,
        section: 'customer_service'
    },
    {
        id: 'blog',
        title: 'Blog',
        content: `
            <p>Welcome to the Leonardi Blog! Here we share style tips, fashion trends, and behind-the-scenes stories from our workshop.</p>
            <br/>
            <p><em>Coming Soon: "5 Ways to Style a Tie Pin"</em></p>
        `,
        section: 'customer_service'
    }
];

export const getPageBySlug = async (slug) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const page = pages.find(p => p.id === slug);
            if (page) {
                resolve(page);
            } else {
                reject(new Error('Page not found'));
            }
        }, 300); // Simulate network latency
    });
};

export const getFooterLinks = async () => {
    // Simulate API call to get all pages for footer
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(pages);
        }, 300);
    });
};
