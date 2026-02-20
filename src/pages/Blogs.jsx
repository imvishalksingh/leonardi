import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { getBlogs } from '../services/cmsService';

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getBlogs().then(data => {
            setBlogs(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-16 min-h-[60vh] max-w-[1800px] lg:px-12">
            <SEO
                title="Our Blog - Fashion & Style"
                description="Read the latest articles on fashion trends, style tips, and Leonardi's latest collections."
            />
            <div className="text-center mb-16">
                <h1 className="text-3xl md:text-4xl font-serif font-bold uppercase tracking-widest mb-4">
                    Our Blog
                </h1>
                <div className="w-24 h-1 bg-[#C19A6B] mx-auto"></div>
            </div>

            <div className="flex flex-wrap gap-[28px] justify-center max-w-[1060px] mx-auto">
                {blogs.map(blog => (
                    <Link
                        to={`/blogs/${blog.slug}`}
                        key={blog.id}
                        className="bg-[#faf7f2] border border-[#ddd5c8] rounded-[4px] w-[320px] overflow-hidden flex flex-col shadow-[4px_4px_0_#ddd5c8] transition-all duration-250 hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[7px_7px_0_#ddd5c8] group relative"
                    >
                        <div className="relative w-full h-[200px] overflow-hidden">
                            {blog.image1 ? (
                                <img
                                    src={blog.image1}
                                    alt={blog.title}
                                    className="w-full h-full object-cover transition-transform duration-500 scale-100 group-hover:scale-[1.06] sepia-[10%] contrast-[1.05]"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                                    <span className="text-4xl font-serif">L</span>
                                </div>
                            )}
                            <span className="absolute top-[14px] left-[14px] bg-[#c84b31] text-white text-[10px] font-medium tracking-[0.15em] uppercase px-[10px] py-[5px] rounded-[2px]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                                {blog.heading || 'Article'}
                            </span>
                        </div>

                        <div className="p-[24px_24px_20px] flex flex-col flex-1">
                            <div className="flex items-center gap-[12px] mb-[12px]">
                                <span className="text-[11px] text-[#7c7165] tracking-[0.08em]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                                    {new Date(blog.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                                <span className="w-[3px] h-[3px] rounded-full bg-[#ddd5c8]"></span>
                                <span className="text-[11px] text-[#7c7165]" style={{ fontFamily: '"DM Sans", sans-serif' }}>5 min read</span>
                            </div>

                            <h2 className="text-[20px] font-bold leading-[1.3] text-[#0f0e0d] mb-[10px] tracking-[-0.01em]" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
                                {blog.title}
                            </h2>

                            <div
                                className="text-[13.5px] leading-[1.65] text-[#7c7165] font-light mb-[22px] flex-1 line-clamp-3"
                                style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 300 }}
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                            />

                            <div className="flex items-center justify-between pt-[18px] border-t border-[#ddd5c8]">
                                <div className="flex items-center gap-[9px]">
                                    <div className="w-[30px] h-[30px] rounded-full overflow-hidden border-2 border-[#ddd5c8] flex items-center justify-center bg-gray-200 text-[10px] text-gray-500">
                                        {(blog.author?.[0] || 'L')}
                                    </div>
                                    <span className="text-[12px] font-medium text-[#0f0e0d]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                                        {blog.author || 'Leonardi Team'}
                                    </span>
                                </div>
                                <button className="inline-flex items-center gap-[6px] bg-[#0f0e0d] text-[#f5f0e8] text-[11.5px] font-medium tracking-[0.06em] uppercase px-[16px] py-[9px] rounded-[2px] hover:bg-[#c84b31] hover:text-white transition-colors cursor-pointer group-hover/btn:bg-[#c84b31]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                                    Read
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform duration-200 group-hover:translate-x-[3px]">
                                        <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            {blogs.length === 0 && (
                <p className="text-center text-gray-500">No blogs found.</p>
            )}
        </div>
    );
};

export default Blogs;
