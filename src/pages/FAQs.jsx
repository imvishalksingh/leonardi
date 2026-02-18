import React, { useEffect, useState } from 'react';
import { getFAQs } from '../services/cmsService';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQs = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openIndex, setOpenIndex] = useState(null);

    useEffect(() => {
        getFAQs().then(data => {
            setFaqs(data);
            setLoading(false);
        });
    }, []);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="mx-auto px-5 py-10 max-w-[860px]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-5xl font-bold text-[#111] mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                    FAQs
                </h1>
            </div>

            <div className="border-t border-[#ccc]">
                {faqs.map((faq, index) => (
                    <div key={faq.id} className={`border-b border-[#ccc] ${openIndex === index ? 'open' : ''}`}>
                        <button
                            className="w-full bg-none border-none p-[18px_36px_18px_0] text-left text-[15px] font-bold text-[#111] cursor-pointer flex justify-between items-center relative leading-[1.4] hover:text-[#000]"
                            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                            onClick={() => toggleAccordion(index)}
                        >
                            {faq.question}
                            <span
                                className={`text-[18px] font-normal text-[#333] flex-shrink-0 ml-4 transition-transform duration-250 not-italic leading-none ${openIndex === index ? 'rotate-180' : ''}`}
                            >
                                &#8964;
                            </span>
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-[400px]' : 'max-h-0'}`}
                        >
                            <div
                                className="text-[14.5px] text-[#333] leading-[1.7] p-[0_36px_18px_0]"
                                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                            >
                                <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {faqs.length === 0 && (
                <p className="text-center text-gray-500 mt-8" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>No FAQs found.</p>
            )}
        </div>
    );
};

export default FAQs;
