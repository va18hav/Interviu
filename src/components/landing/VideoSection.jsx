import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import explainer from '../../assets/videos/explainer.mp4';

const VideoSection = () => {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const toggleFullscreen = () => {
        if (containerRef.current) {
            if (!document.fullscreenElement) {
                containerRef.current.requestFullscreen();
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        }
    };

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20">
            <div
                ref={containerRef}
                className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-cyan-500/10 group bg-black"
            >
                {/* Glow Effect behind video */}
                {!isFullscreen && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                )}

                {/* Video Container */}
                <div className="relative bg-black/50 backdrop-blur-sm rounded-3xl overflow-hidden h-full">
                    <video
                        ref={videoRef}
                        autoPlay
                        loop
                        muted
                        playsInline
                        onClick={togglePlay}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        className="w-full h-full object-cover cursor-pointer"
                    >
                        <source src={explainer} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    {/* Controls Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-16 pb-6 px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {/* Progress Bar */}
                        <div className="relative w-full h-1 bg-white/20 rounded-full mb-4 cursor-pointer group/slider">
                            <input
                                type="range"
                                min="0"
                                max={duration || 100}
                                value={currentTime}
                                onChange={handleSeek}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            />
                            <div
                                className="absolute top-0 left-0 h-full bg-cyan-400 rounded-full transition-all duration-100"
                                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                            />
                            {/* Thumb (visual only) */}
                            <div
                                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg scale-0 group-hover/slider:scale-100 transition-transform pointer-events-none"
                                style={{ left: `${(currentTime / (duration || 1)) * 100}%` }}
                            />
                        </div>

                        {/* Buttons Row */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={togglePlay}
                                    className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                                >
                                    {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
                                </button>

                                <div className="flex items-center gap-2 group/volume">
                                    <button
                                        onClick={toggleMute}
                                        className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                                    >
                                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                    </button>
                                </div>

                                <span className="text-sm font-medium text-slate-300 tabular-nums">
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                </span>
                            </div>

                            <button
                                onClick={toggleFullscreen}
                                className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                            >
                                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Play Overlay (when paused) */}
                    {!isPlaying && (
                        <div
                            className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none"
                        >
                            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                <Play className="w-8 h-8 fill-white text-white ml-1" />
                            </div>
                        </div>
                    )}

                    {/* Border overlay (hide in fullscreen) */}
                    {!isFullscreen && (
                        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none" />
                    )}
                </div>
            </div>

            {/* Background ambient light */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
        </div>
    );
};

export default VideoSection;
