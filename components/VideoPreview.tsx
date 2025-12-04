'use client'

import { useRef, useState, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Loader2 } from 'lucide-react'
import { Button } from './ui/Button'

export interface VideoPreviewProps {
    src: string
    poster?: string
    className?: string
    autoPlay?: boolean
    controls?: boolean
    onError?: (error: Error) => void
}

export function VideoPreview({
    src,
    poster,
    className = '',
    autoPlay = false,
    controls = true,
    onError,
}: VideoPreviewProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const handleLoadedMetadata = () => {
            setDuration(video.duration)
            setIsLoading(false)
        }

        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime)
        }

        const handlePlay = () => setIsPlaying(true)
        const handlePause = () => setIsPlaying(false)

        const handleError = () => {
            const err = new Error('Failed to load video')
            setError('ไม่สามารถโหลดวิดีโอได้')
            setIsLoading(false)
            onError?.(err)
        }

        video.addEventListener('loadedmetadata', handleLoadedMetadata)
        video.addEventListener('timeupdate', handleTimeUpdate)
        video.addEventListener('play', handlePlay)
        video.addEventListener('pause', handlePause)
        video.addEventListener('error', handleError)

        return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata)
            video.removeEventListener('timeupdate', handleTimeUpdate)
            video.removeEventListener('play', handlePlay)
            video.removeEventListener('pause', handlePause)
            video.removeEventListener('error', handleError)
        }
    }, [onError])

    const togglePlay = () => {
        const video = videoRef.current
        if (!video) return

        if (isPlaying) {
            video.pause()
        } else {
            video.play()
        }
    }

    const toggleMute = () => {
        const video = videoRef.current
        if (!video) return

        video.muted = !video.muted
        setIsMuted(!isMuted)
    }

    const toggleFullscreen = () => {
        const video = videoRef.current
        if (!video) return

        if (!isFullscreen) {
            if (video.requestFullscreen) {
                video.requestFullscreen()
            }
            setIsFullscreen(true)
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen()
            }
            setIsFullscreen(false)
        }
    }

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const video = videoRef.current
        if (!video) return

        const time = parseFloat(e.target.value)
        video.currentTime = time
        setCurrentTime(time)
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    if (error) {
        return (
            <div className={`relative bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center ${className}`}>
                <div className="text-center p-8">
                    <p className="text-red-400 mb-2">{error}</p>
                    <p className="text-sm text-slate-400">กรุณาลองใหม่อีกครั้ง</p>
                </div>
            </div>
        )
    }

    return (
        <div className={`relative bg-black rounded-2xl overflow-hidden group ${className}`}>
            {/* Video Element */}
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                autoPlay={autoPlay}
                className="w-full h-full object-contain"
                playsInline
            />

            {/* Loading Overlay */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
                </div>
            )}

            {/* Controls */}
            {controls && !isLoading && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* Progress Bar */}
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-1 bg-slate-600 rounded-full appearance-none cursor-pointer mb-3
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-3
              [&::-webkit-slider-thumb]:h-3
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-purple-500
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-moz-range-thumb]:w-3
              [&::-moz-range-thumb]:h-3
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-purple-500
              [&::-moz-range-thumb]:border-0
              [&::-moz-range-thumb]:cursor-pointer"
                    />

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={togglePlay}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                            </button>

                            <button
                                onClick={toggleMute}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                            </button>

                            <span className="text-sm text-white ml-2">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                        </div>

                        <button
                            onClick={toggleFullscreen}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                        </button>
                    </div>
                </div>
            )}

            {/* Play Button Overlay (when paused) */}
            {!isPlaying && !isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <button
                        onClick={togglePlay}
                        className="w-20 h-20 flex items-center justify-center rounded-full bg-purple-600/80 hover:bg-purple-500/80 transition-all hover:scale-110"
                    >
                        <Play size={32} className="ml-1" />
                    </button>
                </div>
            )}
        </div>
    )
}
