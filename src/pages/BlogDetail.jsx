import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogBySlug } from '../services/cmsService';
import SEO from '../components/SEO';
import { ChevronLeft, Calendar, User, Clock } from 'lucide-react';

const BlogDetail = () => {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        getBlogBySlug(slug)
            .then(data => {
                setBlog(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Blog post not found');
                setLoading(false);
            });
    }, [slug]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (error) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <h1 className="text-4xl font-serif font-bold">404</h1>
            <p className="text-gray-500">{error}</p>
            <Link to="/blogs" className="text-accent hover:underline">Back to Blogs</Link>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-12 min-h-[60vh] max-w-4xl">
            <SEO
                title={blog.meta_title || blog.title}
                description={blog.meta_description || blog.short_description || `Read ${blog.title} on Leonardi Blog.`}
                image={blog.image1}
                type="article"
            />
            <Link to="/blogs" className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-8 transition-colors">
                <ChevronLeft size={16} className="mr-2" /> Back to Blogs
            </Link>

            <article>
                <header className="mb-10 text-center">
                    <div className="flex items-center justify-center space-x-4 text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                        <span className="flex items-center">
                            <Calendar size={14} className="mr-2" />
                            {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="flex items-center">
                            <Clock size={14} className="mr-2" />
                            5 min read
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-serif font-bold mb-6 leading-tight">
                        {blog.title}
                    </h1>
                    {blog.author && (
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <User size={16} className="text-gray-500" />
                            </div>
                            <span className="text-sm font-medium">{blog.author || 'Leonardi Team'}</span>
                        </div>
                    )}
                </header>

                {blog.image1 && (
                    <div className="mb-10 rounded-xl overflow-hidden shadow-sm">
                        <img src={blog.image1} alt={blog.title} className="w-full h-auto object-cover max-h-[600px]" />
                    </div>
                )}

                <div
                    className="prose prose-lg max-w-none text-gray-700 font-light leading-relaxed first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-[-4px]"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />
            </article>
        </div>
    );
};

export default BlogDetail;
