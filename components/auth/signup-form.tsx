'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUpAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'

const signupSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine(data => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
})

type SignupFormData = z.infer<typeof signupSchema>

export function SignupForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmationRequired, setConfirmationRequired] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupFormData) => {
    setError(null)
    const result = await signUpAction({
      email: data.email,
      password: data.password,
      full_name: data.full_name,
    })

    if (result.error) {
      setError(result.error)
    } else if (result.emailConfirmationRequired) {
      setConfirmationRequired(true)
    } else {
      router.push('/dashboard')
    }
  }

  if (confirmationRequired) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
          <span className="text-3xl">✓</span>
        </div>
        <h3 className="text-xl font-bold text-white">Account created</h3>
        <p className="text-zinc-400 text-sm">
          Please check your email to confirm your account, then sign in.
        </p>
        <Button variant="secondary" onClick={() => router.push('/login')} className="w-full">
          Go to Sign In
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          placeholder="Your full name"
          {...register('full_name')}
        />
        {errors.full_name && <p className="text-xs text-rose-400">{errors.full_name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register('email')}
        />
        {errors.email && <p className="text-xs text-rose-400">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            className="pr-10"
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-rose-400">{errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm_password">Confirm Password</Label>
        <Input
          id="confirm_password"
          type="password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          {...register('confirm_password')}
        />
        {errors.confirm_password && <p className="text-xs text-rose-400">{errors.confirm_password.message}</p>}
      </div>

      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </Button>

      <p className="text-center text-sm text-zinc-400">
        Already have an account?{' '}
        <Link href="/login" className="text-rose-400 hover:text-rose-300 font-medium">
          Sign in
        </Link>
      </p>
    </form>
  )
}
