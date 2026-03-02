import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import {
    X, Download, Share2, Check, Link
} from 'lucide-react';
import ShareCard from './ShareCard';
import LogoImg from '../assets/images/logo.png';

// Official brand logos via Wikimedia Commons
const SOCIAL_LOGOS = {
    twitter: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg',
    whatsapp: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
    reddit: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Reddit_logo.svg',
};

const SocialIcon = ({ type, size = 22 }) => {
    const src = SOCIAL_LOGOS[type];
    if (!src) return null;
    return (
        <img
            src={src}
            alt={type}
            width={size}
            height={size}
            style={{ objectFit: 'contain', display: 'block' }}
        />
    );
};

const ROUND_NAMES = {
    coding: 'Coding Interview',
    debug: 'Debugging Interview',
    design: 'System Design Interview',
    behavioral: 'Behavioral Interview',
    technical: 'Technical Interview'
};

const getRoundLabel = (type = '') => {
    const t = type.toLowerCase();
    if (t.includes('coding')) return ROUND_NAMES.coding;
    if (t.includes('debug')) return ROUND_NAMES.debug;
    if (t.includes('design')) return ROUND_NAMES.design;
    if (t.includes('behavioral')) return ROUND_NAMES.behavioral;
    return ROUND_NAMES.technical;
};

const buildCaption = ({ candidateName, metaData, verdict, shareUrl }) => {
    const roundLabel = getRoundLabel(metaData?.type);
    const company = metaData?.company;
    const title = metaData?.title;

    if (company) {
        switch (verdict?.toLowerCase().trim()) {
            case 'strong hire':
                return `Ran the ${company} ${roundLabel} on Interviu.pro — ${verdict} ✅\n\n📋 ${title}\n\nFull hiring committee debrief 👇\n${shareUrl}`;
            case 'hire':
                return `Ran the ${company} ${roundLabel} on Interviu.pro — cleared it with a ${verdict}\n\n📋 ${title}\n\nFull debrief 👇\n${shareUrl}`;
            case 'lean hire':
                return `Ran the ${company} ${roundLabel} on Interviu.pro — ${verdict}. Close, but not clean.\n\n📋 ${title}\n\nDebrief breaks down what's holding me back 👇\n${shareUrl}`;
            case 'lean no hire':
                return `Ran the ${company} ${roundLabel} on Interviu.pro — ${verdict}. Closer than I'd like to admit.\n\n📋 ${title}\n\nDebrief breaks down exactly where I'm falling short 👇\n${shareUrl}`;
            case 'no hire':
                return `Ran the ${company} ${roundLabel} on Interviu.pro — got a ${verdict} 💀\n\n📋 ${title}\n\nDebrief breaks down exactly where I lost it 👇\n${shareUrl}`;
            case 'strong no hire':
                return `Ran the ${company} ${roundLabel} on Interviu.pro — ${verdict} 💀\n\nDidn't just fail. The debrief was brutal.\n\nFull breakdown 👇\n${shareUrl}`;
            default:
                return `Ran the ${company} ${roundLabel} on Interviu.pro\n\n📋 ${title}\n\n⚡ Verdict: ${verdict || '—'}\n\nFull report 👇\n${shareUrl}`;
        }
    } else {
        switch (verdict?.toLowerCase().trim()) {
            case 'strong hire':
                return `Ran a custom ${roundLabel} on Interviu.pro — ${verdict} ✅\n\n📋 ${title}\n\nFull debrief 👇\n${shareUrl}`;
            case 'hire':
                return `Ran a custom ${roundLabel} on Interviu.pro — cleared it with a ${verdict}\n\n📋 ${title}\n\nFull debrief 👇\n${shareUrl}`;
            case 'lean hire':
                return `Ran a custom ${roundLabel} on Interviu.pro — ${verdict}. Close, but not clean.\n\n📋 ${title}\n\nDebrief breaks down what's holding me back 👇\n${shareUrl}`;
            case 'lean no hire':
                return `Ran a custom ${roundLabel} on Interviu.pro — ${verdict}. Closer than I'd like to admit.\n\n📋 ${title}\n\nDebrief breaks down exactly where I'm falling short 👇\n${shareUrl}`;
            case 'no hire':
                return `Ran a custom ${roundLabel} on Interviu.pro — got a ${verdict} 💀\n\n📋 ${title}\n\nDebrief breaks down exactly where I lost it 👇\n${shareUrl}`;
            case 'strong no hire':
                return `Ran a custom ${roundLabel} on Interviu.pro — ${verdict} 💀\n\nDidn't just fail. The debrief was brutal.\n\nFull breakdown 👇\n${shareUrl}`;
            default:
                return `Ran a custom ${roundLabel} on Interviu.pro\n\n📋 ${title}\n\n⚡ Verdict: ${verdict || '—'}\n\nFull report 👇\n${shareUrl}`;
        }
    }
};

const ShareModal = ({ isOpen, onClose, reportData, metaData, candidateName, shareUrl }) => {
    const cardRef = useRef(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [capturedUrl, setCapturedUrl] = useState(null);
    const [copyStatus, setCopyStatus] = useState({ type: null, status: false });

    const caption = buildCaption({
        candidateName,
        metaData,
        verdict: reportData?.verdict?.signal,
        shareUrl,
    });

    const captureCard = async () => {
        if (!cardRef.current || isCapturing) return;
        setIsCapturing(true);
        try {
            const dataUrl = await toPng(cardRef.current, {
                cacheBust: true,
                pixelRatio: 2,
                backgroundColor: '#ffffff',
            });
            setCapturedUrl(dataUrl);
            setIsCapturing(false);
            return dataUrl;
        } catch (err) {
            console.error('[Share] Capture failed', err);
            setIsCapturing(false);
        }
    };

    const handleDownload = async () => {
        const dataUrl = capturedUrl || await captureCard();
        if (!dataUrl) return;
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `Interviu_Report_${(candidateName || 'Report').replace(/\s+/g, '_')}.png`;
        a.click();
    };

    const openSocial = async (platform) => {
        const encodedUrl = encodeURIComponent(shareUrl);
        // Build a plain-text version of the caption (emojis work fine in WhatsApp, just need proper encoding)
        const encodedCaption = encodeURIComponent(caption);
        const company = metaData?.company || 'Interview';
        const roundType = metaData?.type?.toLowerCase();
        const ROUND_NAMES_MODAL = {
            coding: 'Coding Interview', debug: 'Debugging Interview',
            design: 'System Design Interview', behavioral: 'Behavioral Interview',
        };
        const roundLabel = ROUND_NAMES_MODAL[roundType] || 'Technical Interview';

        if (platform === 'whatsapp') {
            // WhatsApp: wa.me works well on mobile, web.whatsapp.com for desktop fallback
            // Caption with full text and emojis encoded
            const isMobile = /iPhone|Android/i.test(navigator.userAgent);
            const base = isMobile ? 'https://wa.me/' : 'https://web.whatsapp.com/send';
            const url = isMobile
                ? `${base}?text=${encodedCaption}`
                : `${base}?text=${encodedCaption}`;
            window.open(url, '_blank', 'noopener,noreferrer');

        } else if (platform === 'twitter') {
            // Twitter: supports text well including emojis
            window.open(`https://twitter.com/intent/tweet?text=${encodedCaption}`, '_blank', 'noopener,noreferrer');

        } else if (platform === 'linkedin') {
            // LinkedIn's share API only supports URL - it cannot accept pre-filled body text.
            // The link preview (OG tags) provides the context on LinkedIn.
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank', 'noopener,noreferrer');

        } else if (platform === 'reddit') {
            // Reddit: for rich text posts, use the new post flow with type=self and text prefilled
            const title = encodeURIComponent(`My ${company} ${roundLabel} — Verdict: ${reportData?.verdict?.signal || '—'} | Interviu.pro`);
            const body = encodeURIComponent(`${caption}\n\n---\n*Powered by [Interviu.pro](${shareUrl})*`);
            window.open(
                `https://www.reddit.com/submit?type=self&title=${title}&text=${body}`,
                '_blank', 'noopener,noreferrer'
            );
        }
    };

    const handleCopy = async (text, type) => {
        await navigator.clipboard.writeText(text);
        setCopyStatus({ type, status: true });
        setTimeout(() => setCopyStatus({ type: null, status: false }), 2000);
    };

    const handleNativeShare = async () => {
        try {
            // First try to share with the card image attached as a file
            const dataUrl = capturedUrl || await captureCard();
            if (dataUrl && navigator.canShare) {
                // Convert dataUrl to File blob
                const res = await fetch(dataUrl);
                const blob = await res.blob();
                const file = new File([blob], `Interviu_Report_${(candidateName || 'Report').replace(/\s+/g, '_')}.png`, { type: 'image/png' });
                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: `My ${metaData?.company || 'Interview'} Report on Interviu.pro`,
                        text: caption,
                        files: [file],
                    });
                    return;
                }
            }
            // Fallback: share text + link without image
            await navigator.share({
                title: `My ${metaData?.company || 'Interview'} Report`,
                text: caption,
                url: shareUrl,
            });
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('[Share] Native share failed', err);
            }
        }
    };

    const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row"
                    >
                        {/* Left Side: Preview Card & Caption */}
                        <div className="md:w-[58%] bg-slate-50/50 p-6 md:p-12 flex flex-col items-center justify-start border-b md:border-b-0 md:border-r border-slate-100">
                            <div className="relative group w-full flex justify-center mb-8 md:mb-10">
                                {/* Off-screen Capture Target */}
                                <div style={{ position: 'fixed', top: '-9999px', left: '-9999px', pointerEvents: 'none' }}>
                                    <ShareCard ref={cardRef} reportData={reportData} metaData={metaData} candidateName={candidateName} />
                                </div>

                                {/* Visible Scaled Preview (800x450 scaled) */}
                                <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-indigo-100/50 border border-slate-200 w-[280px] h-[157px] sm:w-[400px] sm:h-[225px]">
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '800px',
                                        height: '450px',
                                        transformOrigin: 'top left'
                                    }}
                                        className="scale-[0.35] sm:scale-[0.5]"
                                    >
                                        <ShareCard reportData={reportData} metaData={metaData} candidateName={candidateName} />
                                    </div>

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button onClick={handleDownload} className="bg-white/90 backdrop-blur px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 shadow-xl scale-90 group-hover:scale-100 transition-all">
                                            <Download size={14} /> Download PNG
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Desktop image attach hint */}
                            <p className="text-[10px] font-semibold text-slate-400 text-center mb-6 md:mb-8 max-w-[400px]">
                                💡 Save the card image above and attach it manually when posting on social platforms
                            </p>

                            {/* Caption Text Below Card */}
                            <div className="w-full max-w-[400px]">
                                <p className="text-[12px] md:text-[13px] font-medium text-slate-600 leading-relaxed italic border-l-2 border-indigo-500/30 pl-4 md:pl-5 py-1 whitespace-pre-wrap">
                                    {caption}
                                </p>
                            </div>
                        </div>

                        {/* Right Side: Actions & Socials */}
                        <div className="md:w-[42%] p-8 md:p-12 flex flex-col justify-between bg-white">
                            <div className="space-y-8 md:space-y-10">
                                <div className="flex items-center justify-end">
                                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-1">
                                    <h2 className="text-xl font-black text-slate-900 leading-none">Share Report</h2>
                                    <p className="text-xs font-semibold text-slate-400 tracking-tight">Showcase your technical performance</p>
                                </div>

                                {/* Main Actions */}
                                <div className="space-y-3">
                                    {canNativeShare && (
                                        <button
                                            onClick={handleNativeShare}
                                            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                                        >
                                            <Share2 size={16} /> Share via Device
                                        </button>
                                    )}
                                    <button
                                        onClick={handleDownload}
                                        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200"
                                    >
                                        <Download size={16} /> Save Card Image
                                    </button>
                                    <button
                                        onClick={() => handleCopy(shareUrl, 'link')}
                                        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border-2 border-slate-100 bg-white text-slate-600 text-xs font-black uppercase tracking-widest hover:border-slate-200 transition-all"
                                    >
                                        {copyStatus.type === 'link' ? <Check size={16} className="text-emerald-500" /> : <Link size={16} />}
                                        {copyStatus.type === 'link' ? 'Link Copied' : 'Copy Public Link'}
                                    </button>
                                </div>

                                {/* Social Grid */}
                                <div className="pt-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-4">Post directly to</p>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { id: 'twitter', label: 'X' },
                                            { id: 'whatsapp', label: 'WhatsApp' },
                                            { id: 'reddit', label: 'Reddit' }
                                        ].map(platform => (
                                            <button
                                                key={platform.id}
                                                onClick={() => openSocial(platform.id)}
                                                className="flex flex-col items-center gap-2 group"
                                            >
                                                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg group-hover:bg-white transition-all duration-300">
                                                    <SocialIcon type={platform.id} />
                                                </div>
                                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{platform.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-100 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-slate-300">
                                <span>Interviu Pro © 2026</span>
                                {/* <div className="flex items-center gap-1 text-slate-400">
                                    <Globe size={10} /> <span>Global Release</span>
                                </div> */}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ShareModal;
