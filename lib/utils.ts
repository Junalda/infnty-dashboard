import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, addMinutes } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'EUR') {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatDate(date: string | Date) {
  return format(new Date(date), 'dd MMM yyyy')
}

export function formatDateTime(date: string | Date) {
  return format(new Date(date), 'dd MMM yyyy, HH:mm')
}

export function formatTime(date: string | Date) {
  return format(new Date(date), 'HH:mm')
}

export function formatRelative(date: string | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function addBufferTime(endTime: Date, bufferMinutes = 15): Date {
  return addMinutes(endTime, bufferMinutes)
}

export function calculateHours(startTime: Date, endTime: Date): number {
  const diffMs = endTime.getTime() - startTime.getTime()
  return diffMs / (1000 * 60 * 60)
}

export function getMonthYear(date = new Date()): string {
  return format(date, 'yyyy-MM')
}

export function getPillarLabel(pillar: string): string {
  const labels: Record<string, string> = {
    rehearsal: 'Rehearsal',
    content: 'Content Engine',
    soundlab: 'Sound Lab',
  }
  return labels[pillar] || pillar
}

export function getPillarColor(pillar: string): string {
  const colors: Record<string, string> = {
    rehearsal: 'text-rose-400',
    content: 'text-amber-400',
    soundlab: 'text-purple-400',
  }
  return colors[pillar] || 'text-zinc-400'
}

export function getPillarBg(pillar: string): string {
  const colors: Record<string, string> = {
    rehearsal: 'bg-rose-500/10 border-rose-500/20',
    content: 'bg-amber-500/10 border-amber-500/20',
    soundlab: 'bg-purple-500/10 border-purple-500/20',
  }
  return colors[pillar] || 'bg-zinc-500/10 border-zinc-500/20'
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'text-emerald-400 bg-emerald-500/10',
    confirmed: 'text-emerald-400 bg-emerald-500/10',
    completed: 'text-blue-400 bg-blue-500/10',
    pending: 'text-amber-400 bg-amber-500/10',
    trialing: 'text-purple-400 bg-purple-500/10',
    cancelled: 'text-red-400 bg-red-500/10',
    past_due: 'text-red-400 bg-red-500/10',
    failed: 'text-red-400 bg-red-500/10',
    paid: 'text-emerald-400 bg-emerald-500/10',
    planned: 'text-zinc-400 bg-zinc-500/10',
    filmed: 'text-blue-400 bg-blue-500/10',
    editing: 'text-purple-400 bg-purple-500/10',
    review: 'text-amber-400 bg-amber-500/10',
    delivered: 'text-emerald-400 bg-emerald-500/10',
    idea: 'text-zinc-400 bg-zinc-500/10',
    writing: 'text-blue-400 bg-blue-500/10',
    ai_production: 'text-purple-400 bg-purple-500/10',
    recording: 'text-rose-400 bg-rose-500/10',
    final_mix: 'text-amber-400 bg-amber-500/10',
    released: 'text-emerald-400 bg-emerald-500/10',
  }
  return colors[status] || 'text-zinc-400 bg-zinc-500/10'
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}
