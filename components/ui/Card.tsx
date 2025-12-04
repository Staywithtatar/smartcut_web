import { HTMLAttributes, forwardRef } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'gradient' | 'bordered'
    padding?: 'none' | 'sm' | 'md' | 'lg'
    hover?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    (
        {
            children,
            variant = 'default',
            padding = 'md',
            hover = false,
            className = '',
            ...props
        },
        ref
    ) => {
        const baseStyles = `
      rounded-2xl transition-all duration-300
    `

        const variantStyles = {
            default: `
        bg-slate-800 border border-slate-700
        ${hover ? 'hover:bg-slate-700 hover:border-slate-600' : ''}
      `,
            glass: `
        bg-white/5 backdrop-blur-xl border border-white/10
        ${hover ? 'hover:bg-white/10 hover:border-white/20' : ''}
      `,
            gradient: `
        bg-gradient-to-br from-purple-900/20 to-pink-900/20
        border border-purple-500/20
        ${hover ? 'hover:from-purple-900/30 hover:to-pink-900/30 hover:border-purple-500/30' : ''}
      `,
            bordered: `
        bg-transparent border-2 border-white/20
        ${hover ? 'hover:border-purple-500 hover:bg-purple-500/5' : ''}
      `,
        }

        const paddingStyles = {
            none: '',
            sm: 'p-4',
            md: 'p-6',
            lg: 'p-8',
        }

        return (
            <div
                ref={ref}
                className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
                {...props}
            >
                {children}
            </div>
        )
    }
)

Card.displayName = 'Card'

// Card sub-components
export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ children, className = '', ...props }, ref) => (
        <div ref={ref} className={`mb-4 ${className}`} {...props}>
            {children}
        </div>
    )
)
CardHeader.displayName = 'CardHeader'

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
    ({ children, className = '', ...props }, ref) => (
        <h3 ref={ref} className={`text-xl font-bold text-white ${className}`} {...props}>
            {children}
        </h3>
    )
)
CardTitle.displayName = 'CardTitle'

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
    ({ children, className = '', ...props }, ref) => (
        <p ref={ref} className={`text-sm text-slate-400 mt-1 ${className}`} {...props}>
            {children}
        </p>
    )
)
CardDescription.displayName = 'CardDescription'

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ children, className = '', ...props }, ref) => (
        <div ref={ref} className={className} {...props}>
            {children}
        </div>
    )
)
CardContent.displayName = 'CardContent'

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ children, className = '', ...props }, ref) => (
        <div ref={ref} className={`mt-6 flex items-center gap-3 ${className}`} {...props}>
            {children}
        </div>
    )
)
CardFooter.displayName = 'CardFooter'
