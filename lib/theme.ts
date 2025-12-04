// Design System - Theme Configuration
// Centralized theme tokens for consistent UI

export const theme = {
    colors: {
        // Primary gradient (Purple to Pink)
        primary: {
            50: '#FAF5FF',
            100: '#F3E8FF',
            200: '#E9D5FF',
            300: '#D8B4FE',
            400: '#C084FC',
            500: '#A855F7',
            600: '#9333EA',
            700: '#7E22CE',
            800: '#6B21A8',
            900: '#581C87',
            gradient: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
        },

        // Secondary (Blue)
        secondary: {
            50: '#EFF6FF',
            100: '#DBEAFE',
            200: '#BFDBFE',
            300: '#93C5FD',
            400: '#60A5FA',
            500: '#3B82F6',
            600: '#2563EB',
            700: '#1D4ED8',
            800: '#1E40AF',
            900: '#1E3A8A',
        },

        // Status colors
        success: {
            light: '#D1FAE5',
            DEFAULT: '#10B981',
            dark: '#047857',
        },
        warning: {
            light: '#FEF3C7',
            DEFAULT: '#F59E0B',
            dark: '#D97706',
        },
        error: {
            light: '#FEE2E2',
            DEFAULT: '#EF4444',
            dark: '#DC2626',
        },
        info: {
            light: '#DBEAFE',
            DEFAULT: '#3B82F6',
            dark: '#1D4ED8',
        },

        // Backgrounds (Dark theme)
        background: {
            primary: '#0F172A',    // slate-900
            secondary: '#1E293B',  // slate-800
            tertiary: '#334155',   // slate-700
            card: 'rgba(255, 255, 255, 0.05)',
            cardHover: 'rgba(255, 255, 255, 0.1)',
        },

        // Text
        text: {
            primary: '#FFFFFF',
            secondary: '#CBD5E1',  // slate-300
            tertiary: '#94A3B8',   // slate-400
            muted: '#64748B',      // slate-500
        },

        // Borders
        border: {
            light: 'rgba(255, 255, 255, 0.1)',
            DEFAULT: 'rgba(255, 255, 255, 0.2)',
            strong: 'rgba(255, 255, 255, 0.3)',
        },
    },

    typography: {
        fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
        },
        fontSize: {
            xs: '0.75rem',     // 12px
            sm: '0.875rem',    // 14px
            base: '1rem',      // 16px
            lg: '1.125rem',    // 18px
            xl: '1.25rem',     // 20px
            '2xl': '1.5rem',   // 24px
            '3xl': '1.875rem', // 30px
            '4xl': '2.25rem',  // 36px
            '5xl': '3rem',     // 48px
        },
        fontWeight: {
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
            extrabold: '800',
        },
        lineHeight: {
            tight: '1.25',
            normal: '1.5',
            relaxed: '1.75',
        },
    },

    spacing: {
        0: '0',
        1: '0.25rem',  // 4px
        2: '0.5rem',   // 8px
        3: '0.75rem',  // 12px
        4: '1rem',     // 16px
        5: '1.25rem',  // 20px
        6: '1.5rem',   // 24px
        8: '2rem',     // 32px
        10: '2.5rem',  // 40px
        12: '3rem',    // 48px
        16: '4rem',    // 64px
        20: '5rem',    // 80px
        24: '6rem',    // 96px
    },

    borderRadius: {
        none: '0',
        sm: '0.375rem',   // 6px
        DEFAULT: '0.5rem', // 8px
        md: '0.75rem',    // 12px
        lg: '1rem',       // 16px
        xl: '1.5rem',     // 24px
        '2xl': '2rem',    // 32px
        '3xl': '3rem',    // 48px
        full: '9999px',
    },

    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        glow: '0 0 20px rgba(139, 92, 246, 0.5)',
        glowPink: '0 0 20px rgba(236, 72, 153, 0.5)',
    },

    animation: {
        duration: {
            fast: '150ms',
            normal: '300ms',
            slow: '500ms',
        },
        easing: {
            default: 'cubic-bezier(0.4, 0, 0.2, 1)',
            in: 'cubic-bezier(0.4, 0, 1, 1)',
            out: 'cubic-bezier(0, 0, 0.2, 1)',
            inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
    },

    breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
    },
} as const

export type Theme = typeof theme
