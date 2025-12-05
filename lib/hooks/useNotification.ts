'use client'

import { useEffect, useState, useCallback } from 'react'

type NotificationPermission = 'default' | 'denied' | 'granted'

interface UseNotificationReturn {
    permission: NotificationPermission
    isSupported: boolean
    requestPermission: () => Promise<boolean>
    notify: (title: string, options?: NotificationOptions) => void
}

export function useNotification(): UseNotificationReturn {
    const [permission, setPermission] = useState<NotificationPermission>('default')
    const [isSupported, setIsSupported] = useState(false)

    useEffect(() => {
        // Check if browser supports notifications
        if (typeof window !== 'undefined' && 'Notification' in window) {
            setIsSupported(true)
            setPermission(Notification.permission)
        }
    }, [])

    const requestPermission = useCallback(async (): Promise<boolean> => {
        if (!isSupported) return false

        try {
            const result = await Notification.requestPermission()
            setPermission(result)
            return result === 'granted'
        } catch (error) {
            console.error('Error requesting notification permission:', error)
            return false
        }
    }, [isSupported])

    const notify = useCallback((title: string, options?: NotificationOptions) => {
        if (!isSupported || permission !== 'granted') {
            console.log('Notifications not available or not permitted')
            return
        }

        try {
            const notification = new Notification(title, {
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                ...options,
            })

            // Auto close after 5 seconds
            setTimeout(() => notification.close(), 5000)

            // Handle click - focus window
            notification.onclick = () => {
                window.focus()
                notification.close()
            }
        } catch (error) {
            console.error('Error showing notification:', error)
        }
    }, [isSupported, permission])

    return {
        permission,
        isSupported,
        requestPermission,
        notify,
    }
}
