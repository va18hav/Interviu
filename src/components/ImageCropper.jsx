import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, X, Check, RotateCcw } from 'lucide-react';

const ImageCropper = ({ image, onCropComplete, onCancel }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropChange = (crop) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom) => {
        setZoom(zoom);
    };

    const onCropCompleteInternal = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = url;
        });

    const getCroppedImg = async (imageSrc, pixelCrop) => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return null;
        }

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    console.error('Canvas is empty');
                    return;
                }
                blob.name = 'cropped_avatar.png';
                resolve(blob);
            }, 'image/png');
        });
    };

    const handleConfirm = async () => {
        try {
            const croppedImageBlob = await getCroppedImg(image, croppedAreaPixels);
            onCropComplete(croppedImageBlob);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-white tracking-tight">Adjust Portrait</h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Scale and position your profile picture</p>
                    </div>
                    <button onClick={onCancel} className="w-10 h-10 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Cropper Container */}
                <div className="relative h-[450px] w-full bg-slate-950 cropper-container">
                    <style>{`
                        .cropper-container .react-easy-crop_Container {
                            background: #020617;
                            background-image: radial-gradient(#1e293b 1px, transparent 1px);
                            background-size: 20px 20px;
                        }
                    `}</style>
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        cropShape="round"
                        showGrid={false}
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteInternal}
                        onZoomChange={onZoomChange}
                        minZoom={0.5}
                        restrictPosition={false}
                    />
                </div>

                {/* Controls */}
                <div className="px-8 py-8 space-y-8 bg-slate-900 border-t border-slate-800">
                    <div className="flex items-center gap-6">
                        <ZoomOut className="w-4 h-4 text-slate-500" />
                        <div className="flex-1 relative flex items-center">
                            <input
                                type="range"
                                value={zoom}
                                min={0.5}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-500"
                            />
                        </div>
                        <ZoomIn className="w-4 h-4 text-slate-500" />
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-4 rounded-2xl border border-slate-800 text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 hover:text-white transition-all"
                        >
                            Discard
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-[2] py-4 rounded-2xl bg-indigo-600 text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all"
                        >
                            <Check className="w-4 h-4" />
                            Apply Changes
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ImageCropper;
