// Performance utilities for lazy loading components

import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

// Lazy load heavy components
export const LazyVideoPreview = dynamic(
    () => import('@/components/VideoPreview').then(mod => ({ default: mod.VideoPreview })),
    {
        loading: () => (
            <div className= "w-full aspect-video bg-slate-800 rounded-xl flex items-center justify-center" >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"> </div>
                </div>
    ),
    ssr: false, // Disable SSR for video player
  }
)

export const LazyEditingPreferencesForm = dynamic(
    () => import('@/components/EditingPreferencesForm').then(mod => ({ default: mod.EditingPreferencesForm })),
    {
        loading: () => (
            <div className= "flex items-center justify-center p-12" >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"> </div>
                </div>
    ),
  }
)

// Preload component on hover
export function preloadComponent(componentImport: () => Promise<any>) {
    return () => {
        componentImport()
    }
}

// Image optimization helper
export function getOptimizedImageUrl(url: string, width?: number, quality?: number): string {
    if (!url) return ''

    const params = new URLSearchParams()
    if (width) params.set('w', width.toString())
    if (quality) params.set('q', quality.toString())

    return `${url}?${params.toString()}`
}

// Debounce helper for performance
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null
            func(...args)
        }

        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

// Throttle helper for scroll/resize events
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean = false

    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args)
            inThrottle = true
            setTimeout(() => (inThrottle = false), limit)
        }
    }
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
    elementRef: React.RefObject<Element>,
    callback: () => void,
    options?: IntersectionObserverInit
) {
    if (typeof window === 'undefined') return

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                callback()
                observer.disconnect()
            }
        })
    }, options)

    if (elementRef.current) {
        observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
}
