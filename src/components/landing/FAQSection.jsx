import React, { useState } from 'react';
import { Plus, Minus, ChevronDown } from 'lucide-react';

const FAQItem = ({ question, answer, isOpen, toggle }) => {
    return (
        <div className="border-b border-slate-200 last:border-0">
            <button
                onClick={toggle}
                className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
            >
                <span className={`text-lg font-medium transition-colors duration-300 ${isOpen ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>
                    {question}
                </span>
                <span className={`ml-6 flex-shrink-0 transition-all duration-300 ${isOpen ? 'rotate-180 text-slate-900' : 'text-slate-400 group-hover:text-slate-900'}`}>
                    <ChevronDown className="w-5 h-5" />
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}
            >
                <p className="text-slate-600 leading-relaxed pr-12">
                    {answer}
                </p>
            </div>
        </div>
    );
};

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(-1);

    const toggleIndex = (index) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    const faqs = [
        {
            question: "How does the AI interviewer work?",
            answer: "Our AI simulates a real voice-based interview by analyzing your speech in real-time. It asks context-aware follow-up questions based on your answers, just like a human interviewer would, and adapts the difficulty dynamically."
        },
        {
            question: "Is the feedback generated in real-time?",
            answer: "Yes. Immediately after your session ends, you receive a comprehensive report containing your score, transcript analysis, strengths, weaknesses, and improved model answers for every question you faced."
        },
        {
            question: "Can I practice for specific companies?",
            answer: "Absolutely. We offer curated interview loops modeled after top tech companies like Google, Amazon, Meta, and Microsoft. You can also customize the role, focus area (e.g., System Design, DSA), and experience level."
        },
        {
            question: "Is my audio recorded?",
            answer: "We process your audio in real-time to generate the transcript and feedback. We prioritize your privacy and do not store raw audio files permanently after the session is processed."
        },
        {
            question: "Do I need to install any software?",
            answer: "No. Intervyu runs entirely in your browser. You just need a stable internet connection and a microphone to start practicing immediately."
        }
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-slate-200/50 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-2xl mx-auto px-6 relative z-10">
                <div className="text-center mb-5">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                        FAQ's
                    </h2>
                </div>

                <div className="space-y-2">
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openIndex === index}
                            toggle={() => toggleIndex(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
