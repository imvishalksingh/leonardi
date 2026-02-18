import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPageBySlug } from '../services/cmsService';

const CMSPage = () => {
    const { slug } = useParams();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        getPageBySlug(slug)
            .then(data => {
                setPage(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Page not found');
                setLoading(false);
            });
    }, [slug]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (error) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <h1 className="text-4xl font-serif font-bold">Page Coming Soon...</h1>
            <p className="text-gray-500">Not available yet <br /> We are working on it!</p>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-12 min-h-[60vh]">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-serif font-bold mb-8 uppercase tracking-wider text-center border-b pb-6">
                    {page.heading || page.title}
                </h1>
                <div
                    className="prose prose-sm max-w-none text-gray-600 leading-relaxed font-light"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                />
            </div>
        </div>
    );
};

export default CMSPage;
