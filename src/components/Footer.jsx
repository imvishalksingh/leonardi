import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFooterLinks } from '../services/cmsService';

const Footer = () => {
    const [pages, setPages] = useState([]);

    useEffect(() => {
        getFooterLinks().then(data => setPages(data));
    }, []);

    const informationLinks = pages.filter(p => p.section === 'information');
    const customerServiceLinks = pages.filter(p => p.section === 'customer_service');

    return (
        <footer className="bg-primary text-white pt-10 pb-6 border-t border-gray-800">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h4 className="text-lg font-bold mb-4 uppercase tracking-wider">Contact Us</h4>
                    <p className="mb-2 text-gray-400 text-sm">info@leonardi.in</p>
                    <p className="mb-2 text-gray-400 text-sm">+91 921 057 7000</p>
                    <p className="text-gray-400 text-sm">38, Bungalow Road,<br />Kamla Nagar - 110007</p>
                </div>

                <div>
                    <h4 className="text-lg font-bold mb-4 uppercase tracking-wider">Information</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        {informationLinks.map(page => (
                            <li key={page.id} className="hover:text-accent cursor-pointer">
                                <Link to={`/pages/${page.id}`}>{page.title}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-lg font-bold mb-4 uppercase tracking-wider">Customer Service</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        {customerServiceLinks.map(page => (
                            <li key={page.id} className="hover:text-accent cursor-pointer">
                                <Link to={`/pages/${page.id}`}>{page.title}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-lg font-bold mb-4 uppercase tracking-wider">Follow Us</h4>
                    <p className="text-sm text-gray-400 mb-4">Stay updated with our latest collections.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-10 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
                &copy; 2025 Leonardi. All Rights Reserved.
            </div>
        </footer>
    );
};

export default Footer;
