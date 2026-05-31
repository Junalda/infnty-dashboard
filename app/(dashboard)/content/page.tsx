import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Video, Download, Calendar, FileVideo, FileImage, FileText } from 'lucide-react'
import { formatDate, formatFileSize, getStatusColor } from '@/lib/utils'
import type { ContentProject, UploadedFile } from '@/types'

export const metadata = { title: 'Content Engine — INFNTY Studio' }

const STATUS_STEPS = ['planned', 'filmed', 'editing', 'review', 'delivered'] as const

export default async function ContentPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: projects } = await supabase
    .from('content_projects')
    .select('*, partner:profiles!content_projects_partner_id_fkey(full_name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: files } = await supabase
    .from('uploaded_files')
    .select('*')
    .eq('user_id', user.id)
    .eq('project_type', 'content')
    .order('created_at', { ascending: false })

  const typedProjects = (projects ?? []) as ContentProject[]
  const typedFiles = (files ?? []) as UploadedFile[]

  function getFileIcon(mimeType: string) {
    if (mimeType.startsWith('video/')) return FileVideo
    if (mimeType.startsWith('image/')) return FileImage
    return FileText
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Content Engine</h1>
        <p className="text-zinc-400 mt-1">Your content production projects and deliverables</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Projects</h2>
        {typedProjects.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center">
              <Video className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-400">No content projects yet.</p>
              <p className="text-sm text-zinc-500 mt-1">Your partner will set up your first project.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {typedProjects.map(project => {
              const stepIndex = STATUS_STEPS.indexOf(project.status as typeof STATUS_STEPS[number])
              return (
                <Card key={project.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-white font-bold text-lg">{project.title}</h3>
                        {project.partner && (
                          <p className="text-xs text-zinc-500 mt-0.5">Partner: {project.partner.full_name}</p>
                        )}
                      </div>
                      <Badge className={`shrink-0 ${getStatusColor(project.status)}`}>
                        {project.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-0 mb-2">
                      {STATUS_STEPS.map((step, i) => {
                        const isDone = i <= stepIndex
                        const isActive = i === stepIndex
                        return (
                          <div key={step} className="flex-1 flex items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isActive ? 'bg-amber-500 text-black' : isDone ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-600'}`}>
                              {isDone && !isActive ? '✓' : i + 1}
                            </div>
                            {i < STATUS_STEPS.length - 1 && (
                              <div className={`flex-1 h-0.5 mx-1 ${i < stepIndex ? 'bg-emerald-600' : 'bg-zinc-800'}`} />
                            )}
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex justify-between text-xs text-zinc-600 mb-4">
                      {STATUS_STEPS.map(s => <span key={s} className="capitalize">{s}</span>)}
                    </div>

                    {project.production_day && (
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Calendar className="h-4 w-4 text-amber-400" />
                        Production day: <span className="text-white">{formatDate(project.production_day)}</span>
                      </div>
                    )}
                    {project.notes && (
                      <p className="mt-3 text-sm text-zinc-400 bg-zinc-900 rounded-xl p-3">{project.notes}</p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Delivered Files</h2>
        {typedFiles.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-zinc-500 text-sm">No files delivered yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {typedFiles.map(file => {
              const Icon = getFileIcon(file.mime_type)
              return (
                <Card key={file.id} className="hover:border-amber-500/30 transition-colors">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{file.file_name}</p>
                      <p className="text-xs text-zinc-500">{formatFileSize(file.file_size)} · {formatDate(file.created_at)}</p>
                    </div>
                    <Button variant="ghost" size="icon" asChild>
                      <a href={file.file_url} download={file.file_name} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 text-amber-400" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
