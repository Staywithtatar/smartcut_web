'use client'

import { useEffect, useRef, useState } from 'react'
import { Icons } from '@/lib/icons'

interface VideoThumbnailProps {
    src: string
    className?: string
}

export function VideoThumbnail({ src, className = '' }: VideoThumbnailProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const handleLoadedData = () => {
            setIsLoaded(true)
            // Seek to 1 second to show a better thumbnail
            video.currentTime = 1
        }

        const handleError = () => {
            setHasError(true)
        }

        video.addEventListener('loadeddata', handleLoadedData)
        video.addEventListener('error', handleError)

        return () => {
            video.removeEventListener('loadeddata', handleLoadedData)
            video.removeEventListener('error', handleError)
        }
    }, [])

    if (hasError) {
        return (
            <div className={`w-full h-full flex items-center justify-center bg-slate-800 ${className}`}>
                <Icons.Video className="w-12 h-12 text-slate-600" />
            </div>
        )
    }

    return (
        <div className={`relative w-full h-full bg-slate-800 ${className}`}>
            <video
                ref={videoRef}
                src={src}
                className="w-full h-full object-cover"
                muted
                playsInline
                preload="metadata"
            />
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Icons.Spinner className="w-8 h-8 text-purple-500 animate-spin" />
                </div>
            )}
            {/* Play icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Icons.Play className="w-8 h-8 text-white ml-1" />
                </div>
            </div>
        </div>
    )
}


