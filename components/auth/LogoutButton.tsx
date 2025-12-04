'use client'

import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { signOut } from '@/lib/auth/actions'
import { toast } from 'sonner'

export function LogoutButton() {
    const handleLogout = async () => {
        toast.success('ออกจากระบบสำเร็จ!', {
            description: 'แล้วพบกันใหม่'
        })
        // Wait a bit for toast to show before redirecting
        await new Promise(resolve => setTimeout(resolve, 500))
        await signOut()
    }

    return (
        <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:text-white hover:bg-white/5"
        >
            <LogOut className="w-4 h-4 mr-2" />
            ออกจากระบบ
        </Button>
    )
}
