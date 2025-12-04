// Loading skeleton components for better perceived performance

import { Card } from './ui/Card'

export function VideoUploadSkeleton() {
    return (
        <div className="max-w-2xl mx-auto p-8">
            <Card variant="glass" padding="lg">
                <div className="animate-pulse">
                    <div className="flex justify-center mb-8">
                        <div className="w-16 h-16 bg-slate-700 rounded-3xl"></div>
                    </div>
                    <div className="h-8 bg-slate-700 rounded-lg w-3/4 mx-auto mb-4"></div>
                    <div className="h-4 bg-slate-700 rounded w-1/2 mx-auto mb-8"></div>
                    <div className="h-48 bg-slate-700 rounded-2xl mb-6"></div>
                    <div className="h-12 bg-slate-700 rounded-lg"></div>
                </div>
            </Card>
        </div>
    )
}

export function JobProgressSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
            <div className="max-w-6xl mx-auto p-8">
                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <Card variant="glass" padding="lg">
                            <div className="animate-pulse">
                                <div className="h-6 bg-slate-700 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                            </div>
                        </Card>
                        <Card variant="glass" padding="lg">
                            <div className="animate-pulse">
                                <div className="h-4 bg-slate-700 rounded w-full mb-4"></div>
                                <div className="h-3 bg-slate-700 rounded-full w-full"></div>
                            </div>
                        </Card>
                    </div>
                    <div>
                        <Card variant="glass" padding="lg">
                            <div className="animate-pulse">
                                <div className="w-full aspect-video bg-slate-700 rounded-xl"></div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function CardSkeleton() {
    return (
        <Card variant="glass" padding="lg">
            <div className="animate-pulse">
                <div className="h-6 bg-slate-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-700 rounded w-5/6"></div>
            </div>
        </Card>
    )
}
