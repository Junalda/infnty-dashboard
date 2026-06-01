import Link from 'next/link'
import { ShieldOff } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = { title: 'No Access — INFNTY Studio Admin' }

export default function NoAccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6">
        <ShieldOff className="h-8 w-8 text-red-400" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
      <p className="text-zinc-400 mb-8 max-w-sm">
        Your admin role does not have permission to view this page. Contact a Super Admin if you think this is a mistake.
      </p>
      <Button asChild variant="outline">
        <Link href="/admin">Go to your dashboard</Link>
      </Button>
    </div>
  )
}
