import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FolderOpen, Download, FileAudio, FileVideo, FileImage, FileText } from 'lucide-react'
import { formatDate, formatFileSize } from '@/lib/utils'
import type { UploadedFile } from '@/types'

export const metadata = { title: 'Files — INFNTY Studio' }

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('audio/')) return FileAudio
  if (mimeType.startsWith('video/')) return FileVideo
  if (mimeType.startsWith('image/')) return FileImage
  return FileText
}

export default async function FilesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: files } = await supabase
    .from('uploaded_files')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const typedFiles = (files ?? []) as UploadedFile[]
  const contentFiles = typedFiles.filter(f => f.project_type === 'content')
  const soundlabFiles = typedFiles.filter(f => f.project_type === 'soundlab')

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Files</h1>
        <p className="text-zinc-400 mt-1">{typedFiles.length} files delivered to your account</p>
      </div>

      {typedFiles.length === 0 ? (
        <Card>
          <CardContent className="p-16 text-center">
            <FolderOpen className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400 font-medium">No files yet</p>
            <p className="text-sm text-zinc-500 mt-1">Your partner will upload content and music files here.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {contentFiles.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Content Engine Files
                <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs ml-1">{contentFiles.length}</Badge>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {contentFiles.map(file => {
                  const Icon = getFileIcon(file.mime_type)
                  return (
                    <Card key={file.id} className="hover:border-amber-500/30 transition-colors group">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5 text-amber-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{file.file_name}</p>
                          <p className="text-xs text-zinc-500">{formatFileSize(file.file_size)} · {formatDate(file.created_at)}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity" asChild>
                          <a href={file.file_url} download={file.file_name} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 text-amber-400" />
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {soundlabFiles.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                Sound Lab Files
                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs ml-1">{soundlabFiles.length}</Badge>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {soundlabFiles.map(file => {
                  const Icon = getFileIcon(file.mime_type)
                  return (
                    <Card key={file.id} className="hover:border-purple-500/30 transition-colors group">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5 text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{file.file_name}</p>
                          <p className="text-xs text-zinc-500">{formatFileSize(file.file_size)} · {formatDate(file.created_at)}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity" asChild>
                          <a href={file.file_url} download={file.file_name} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 text-purple-400" />
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
