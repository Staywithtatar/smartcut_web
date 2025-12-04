'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ParallaxFloatingProps {
    children: React.ReactNode
    depth?: number // 1 = normal scroll, >1 = faster (closer), <1 = slower (farther)
    className?: string
    offset?: number // Initial offset
    enableMouse?: boolean // Enable mouse parallax effect
}

export function ParallaxFloating({
    children,
    depth = 0.5,
    className = "",
    offset = 0,
    enableMouse = false
}: ParallaxFloatingProps) {
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    })

    // Calculate movement based on depth
    // depth 0.2 = moves 20% of scroll distance (appears far away)
    // depth 1.0 = moves with scroll
    // depth 2.0 = moves 2x scroll distance (appears very close)
    const y = useTransform(scrollYProgress, [0, 1], [offset, offset - (300 * depth)])

    // Smooth out the movement
    const springY = useSpring(y, { stiffness: 100, damping: 30 })

    return (
        <motion.div
            ref={ref}
            style={{ y: springY }}
            className={cn("relative will-change-transform", className)}
        >
            {children}
        </motion.div>
    )
}
