import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Music2, Download, FileAudio, FileText, Mic } from 'lucide-react'
import { formatDate, formatFileSize, getStatusColor } from '@/lib/utils'
import type { SoundLabProject, UploadedFile } from '@/types'

export const metadata = { title: 'Sound Lab — INFNTY Studio' }

const STATUS_STEPS = ['idea', 'writing', 'ai_production', 'recording', 'final_mix', 'released'] as const
const STATUS_LABELS: Record<string, string> = {
  idea: 'Idea', writing: 'Writing', ai_production: 'AI Prod',
  recording: 'Recording', final_mix: 'Mix', released: 'Released',
}

export default async function SoundLabPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: projects } = await supabase
    .from('soundlab_projects')
    .select('*, partner:profiles!soundlab_projects_partner_id_fkey(full_name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: files } = await supabase
    .from('uploaded_files')
    .select('*')
    .eq('user_id', user.id)
    .eq('project_type', 'soundlab')
    .order('created_at', { ascending: false })

  const typedProjects = (projects ?? []) as SoundLabProject[]
  const typedFiles = (files ?? []) as UploadedFile[]

  function getFileIcon(mimeType: string) {
    if (mimeType.startsWith('audio/')) return FileAudio
    return FileText
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Sound Lab</h1>
        <p className="text-zinc-400 mt-1">Your music projects and audio deliverables</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Projects</h2>
        {typedProjects.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center">
              <Music2 className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-400">No music projects yet.</p>
              <p className="text-sm text-zinc-500 mt-1">Your producer will create your first project.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {typedProjects.map(project => {
              const stepIndex = STATUS_STEPS.indexOf(project.status as typeof STATUS_STEPS[number])
              return (
                <Card key={project.id} className="overflow-hidden border-purple-500/10 hover:border-purple-500/20 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <Mic className="h-4 w-4 text-purple-400" />
                          </div>
                          <h3 className="text-white font-bold text-lg">{project.title}</h3>
                        </div>
                        {project.genre && <p className="text-xs text-purple-400 mt-1 ml-10">{project.genre}</p>}
                        {project.partner && <p className="text-xs text-zinc-500 mt-0.5 ml-10">Producer: {project.partner.full_name}</p>}
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
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isActive ? 'bg-purple-500 text-white' : isDone ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-600'}`}>
                              {isDone && !isActive ? '✓' : i + 1}
                            </div>
                            {i < STATUS_STEPS.length - 1 && (
                              <div className={`flex-1 h-0.5 mx-1 ${i < stepIndex ? 'bg-emerald-600' : 'bg-zinc-800'}`} />
                            )}
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex justify-between text-xs text-zinc-600">
                      {STATUS_STEPS.map(s => <span key={s}>{STATUS_LABELS[s]}</span>)}
                    </div>

                    {project.notes && (
                      <p className="mt-4 text-sm text-zinc-400 bg-zinc-900 rounded-xl p-3">{project.notes}</p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Audio Files</h2>
        {typedFiles.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-zinc-500 text-sm">No audio files delivered yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {typedFiles.map(file => {
              const Icon = getFileIcon(file.mime_type)
              return (
                <Card key={file.id} className="hover:border-purple-500/30 transition-colors">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{file.file_name}</p>
                      <p className="text-xs text-zinc-500">{formatFileSize(file.file_size)} · {formatDate(file.created_at)}</p>
                    </div>
                    <Button variant="ghost" size="icon" asChild>
                      <a href={file.file_url} download={file.file_name} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 text-purple-400" />
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
