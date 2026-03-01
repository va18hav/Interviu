import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
    {
        q: 'Is this just AI asking scripted questions?',
        a: 'No. The AI reads your answer and decides what to ask next based on what you said. If you mention Redis, it asks about Redis. If you miss a failure mode, it probes it. There is no fixed question list.'
    },
    {
        q: 'How is this different from other interview prep platforms?',
        a: 'Other platforms have question banks and scored practice sessions. Interviu runs you through a full onsite loop and tells you Hire or No Hire — with every signal explained. Different category.'
    },
    {
        q: 'How do I know the problems are actually calibrated to my target company?',
        a: "Each programme is built from real hiring bar data for that company and level. We don't use the same loop for Amazon and Netflix — the bars are different, so the sessions are different."
    },
    {
        q: "I'm L4 targeting L6 — is this too advanced?",
        a: 'The Dossier will show you exactly how far you are from bar. That gap analysis is the most useful thing you can get. Start with a Senior loop. The feedback will tell you exactly what to work on.'
    },
    {
        q: 'What if I get stuck mid-session?',
        a: "The AI waits. Getting stuck is data. The Dossier will record how you handled ambiguity — which is itself a hiring signal."
    },
];

const FAQItem = ({ q, a, isOpen, onClick }) => (
    <div
        className="border-b border-slate-100 last:border-b-0 cursor-pointer"
        onClick={onClick}
    >
        <div className="flex items-center justify-between py-6 gap-4">
            <h3 className="text-base font-black text-slate-900 tracking-tight leading-snug">{q}</h3>
            <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="shrink-0"
            >
                <ChevronDown className="w-5 h-5 text-slate-400" />
            </motion.div>
        </div>
        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                >
                    <p className="text-slate-600 font-medium leading-relaxed pb-6 pr-8 text-sm">{a}</p>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

    return (
        <section className="py-32 bg-white relative overflow-hidden">
            <div className="max-w-3xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tighter leading-tight">
                        The questions engineers ask{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500">
                            before they sign up.
                        </span>
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="bg-slate-50 rounded-3xl px-8"
                >
                    {faqs.map((faq, i) => (
                        <FAQItem
                            key={i}
                            q={faq.q}
                            a={faq.a}
                            isOpen={openIndex === i}
                            onClick={() => toggle(i)}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default FAQ;
