/** @type {import('next').NextConfig} */
const nextConfig = {
    // Performance optimizations
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },

    // Image optimization
    images: {
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',  // Google profile pics
            },
            {
                protocol: 'https',
                hostname: '*.googleusercontent.com',  // Google CDN
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',  // GitHub avatars
            },
            {
                protocol: 'https',
                hostname: '*.supabase.co',  // Supabase storage
            },
        ],
    },

    // Turbopack configuration (Next.js 16+)
    turbopack: {
        // Empty config to silence warning - Turbopack handles optimization automatically
    },

    // Experimental features
    experimental: {
        optimizeCss: true,
        optimizePackageImports: ['lucide-react', '@headlessui/react'],
    },
}

module.exports = nextConfig
