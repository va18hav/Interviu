import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import {
    X, Copy, Download, Share2, Check, Link,
    Twitter, Linkedin, MessageCircle, Send,
    ExternalLink, Instagram, Globe, Loader2
} from 'lucide-react';
import ShareCard from './ShareCard';
import LogoImg from '../assets/images/logo.png';

// Custom Social Icons with Brand Colors
const SocialIcon = ({ type, size = 18 }) => {
    switch (type) {
        case 'twitter': return <Twitter size={size} fill="#1DA1F2" color="#1DA1F2" />;
        case 'linkedin': return <Linkedin size={size} fill="#0077B5" color="#0077B5" />;
        case 'whatsapp': return <MessageCircle size={size} fill="#25D366" color="#25D366" />;
        case 'reddit': return <Share2 size={size} fill="#FF4500" color="#FF4500" />;
        case 'link': return <Link size={size} color="#6366f1" />;
        default: return <Globe size={size} />;
    }
};

const ROUND_NAMES = {
    coding: 'Coding Interview',
    debug: 'Debugging Interview',
    design: 'System Design Interview',
    behavioral: 'Behavioral Interview',
    technical: 'Technical Interview'
};

const buildCaption = ({ candidateName, metaData, verdict, shareUrl }) => {
    const roundType = metaData?.type?.toLowerCase();
    const roundLabel = ROUND_NAMES[roundType] || 'Technical Interview';
    const company = metaData?.company;
    const title = metaData?.title;

    if (company) {
        return `Just completed a ${roundLabel} of ${company} Loop at Interviu.pro 🎯\n\n📋 ${title}\n\n⚡ Verdict: ${verdict || '—'}\n\nFull report 👇\n${shareUrl}`;
    } else {
        return `Just completed a custom ${roundLabel} session at Interviu.pro 🎯\n\n📋 ${title}\n\n⚡ Verdict: ${verdict || '—'}\n\nFull report 👇\n${shareUrl}`;
    }
};

const ShareModal = ({ isOpen, onClose, reportData, metaData, candidateName, shareUrl }) => {
    const cardRef = useRef(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [capturedUrl, setCapturedUrl] = useState(null);
    const [copyStatus, setCopyStatus] = useState({ type: null, status: false });
    const [isUploading, setIsUploading] = useState(false);
    const [remoteUrl, setRemoteUrl] = useState(null);

    const caption = buildCaption({
        candidateName,
        metaData,
        verdict: reportData?.verdict?.signal,
        shareUrl,
    });

    const dataUrlToFile = (dataUrl, filename) => {
        const arr = dataUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    const uploadCard = async (dataUrl) => {
        if (!shareUrl) return;
        const shortId = shareUrl.split('/').pop();
        if (!shortId || shortId.length !== 32) return;

        setIsUploading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload-share-card`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ shortId, imageBase64: dataUrl })
            });
            const data = await response.json();
            if (data.success) setRemoteUrl(data.publicUrl);
        } catch (err) {
            console.error('[Share] Upload failed', err);
        } finally {
            setIsUploading(false);
        }
    };

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

            // Auto-upload for OG tags
            uploadCard(dataUrl);

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

    const openSocial = (platform) => {
        const encodedUrl = encodeURIComponent(shareUrl);
        const encodedText = encodeURIComponent(caption);
        const urls = {
            twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            whatsapp: `https://api.whatsapp.com/send?text=${encodedText}`,
            reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodeURIComponent(`My ${metaData?.company || 'Interview'} Report`)}`,
        };
        if (urls[platform]) window.open(urls[platform], '_blank', 'noopener,noreferrer');
    };

    const handleCopy = async (text, type) => {
        await navigator.clipboard.writeText(text);
        setCopyStatus({ type, status: true });
        setTimeout(() => setCopyStatus({ type: null, status: false }), 2000);
    };

    const handleNativeShare = async () => {
        const dataUrl = capturedUrl || await captureCard();
        if (!dataUrl) return;

        const file = dataUrlToFile(dataUrl, 'Interviu_Report.png');

        try {
            // Check if file sharing is supported
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: `My ${metaData?.company || 'Interview'} Report`,
                    text: caption,
                    files: [file],
                });
            } else {
                // Fallback to text share if files aren't supported
                await navigator.share({
                    title: `My ${metaData?.company || 'Interview'} Report`,
                    text: caption,
                    url: shareUrl,
                });
            }
        } catch (err) {
            if (err.name !== 'AbortError') console.error('[Share] Native share failed', err);
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
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs font-semibold text-slate-400 tracking-tight">Showcase your technical performance</p>
                                        {shareUrl && !shareUrl.includes('localhost') ? (
                                            <span className="flex items-center gap-1 text-[8px] font-black uppercase bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-full">
                                                <Globe size={8} /> Live Preview
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-[8px] font-black uppercase bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-full" title="Images appear when deployed to interviu.pro">
                                                <Globe size={8} /> Local Link
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Main Actions */}
                                <div className="space-y-3">
                                    {canNativeShare && (
                                        <button
                                            onClick={handleNativeShare}
                                            disabled={isCapturing}
                                            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
                                        >
                                            {isCapturing ? <Loader2 className="animate-spin" size={16} /> : <Share2 size={16} />}
                                            Share via Device
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
                                    <div className="grid grid-cols-4 gap-4">
                                        {[
                                            { id: 'twitter', label: 'X' },
                                            { id: 'linkedin', label: 'LinkedIn' },
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
