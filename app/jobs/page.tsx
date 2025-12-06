import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { Navigation } from '@/components/home/Navigation'
import { JobsPageContent } from '@/components/jobs/JobsPageContent'

interface Job {
    id: string
    job_name: string
    status: string
    progress_percentage: number
    current_step: string | null
    output_video_path: string | null
    created_at: string
    completed_at: string | null
}

async function getActiveJobs(userId: string): Promise<Job[]> {
    const supabase = await createClient()
    
    const { data, error } = await supabase
        .from('jobs')
        .select('id, job_name, status, progress_percentage, current_step, output_video_path, created_at, completed_at')
        .eq('user_id', userId)
        .not('status', 'in', '("COMPLETED","FAILED","CANCELLED")')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching active jobs:', error)
        return []
    }

    return data || []
}

async function getCompletedJobs(userId: string): Promise<Job[]> {
    const supabase = await createClient()
    
    const { data, error } = await supabase
        .from('jobs')
        .select('id, job_name, status, progress_percentage, current_step, output_video_path, created_at, completed_at')
        .eq('user_id', userId)
        .eq('status', 'COMPLETED')
        .not('output_video_path', 'is', null)
        .order('completed_at', { ascending: false })

    if (error) {
        console.error('Error fetching completed jobs:', error)
        return []
    }

    return data || []
}

export default async function JobsPage() {
    const user = await getUser()
    
    if (!user) {
        redirect('/login')
    }

    const [activeJobs, completedJobs] = await Promise.all([
        getActiveJobs(user.id),
        getCompletedJobs(user.id),
    ])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <Navigation />
            <JobsPageContent 
                activeJobs={activeJobs}
                completedJobs={completedJobs}
            />
        </div>
    )
}
