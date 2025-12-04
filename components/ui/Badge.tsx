import { HTMLAttributes, forwardRef } from 'react'
import { type LucideIcon } from 'lucide-react'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple'
    size?: 'sm' | 'md' | 'lg'
    icon?: LucideIcon
    dot?: boolean
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
    (
        {
            children,
            variant = 'default',
            size = 'md',
            icon: Icon,
            dot = false,
            className = '',
            ...props
        },
        ref
    ) => {
        const baseStyles = `
      inline-flex items-center gap-1.5
      font-medium rounded-full
      transition-all duration-200
    `

        const variantStyles = {
            default: 'bg-slate-700 text-slate-200',
            success: 'bg-green-500/20 text-green-400 border border-green-500/30',
            warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
            error: 'bg-red-500/20 text-red-400 border border-red-500/30',
            info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
            purple: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
        }

        const sizeStyles = {
            sm: 'px-2 py-0.5 text-xs',
            md: 'px-2.5 py-1 text-sm',
            lg: 'px-3 py-1.5 text-base',
        }

        const iconSize = {
            sm: 12,
            md: 14,
            lg: 16,
        }

        const dotColors = {
            default: 'bg-slate-400',
            success: 'bg-green-400',
            warning: 'bg-amber-400',
            error: 'bg-red-400',
            info: 'bg-blue-400',
            purple: 'bg-purple-400',
        }

        return (
            <span
                ref={ref}
                className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
                {...props}
            >
                {dot && (
                    <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
                )}
                {Icon && <Icon size={iconSize[size]} />}
                {children}
            </span>
        )
    }
)

Badge.displayName = 'Badge'
