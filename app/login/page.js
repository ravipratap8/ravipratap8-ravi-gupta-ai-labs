'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { ArrowRight, Sparkles, ShieldCheck, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [mode, setMode] = useState('signin')
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function submit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        toast.success('Signed in successfully')
        router.push('/dashboard')
        router.refresh()
        return
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: email,
          },
        },
      })

      if (error) throw error

      toast.success('Account created', {
        description: 'Please check your email if confirmation is enabled.',
      })

      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      toast.error('Authentication failed', {
        description: error?.message || 'Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  const demo = async () => {
    toast.info('Demo login removed', {
      description: 'Please sign up to create your own workspace.',
    })
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-slate-950 px-5 py-12 text-white">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />

      <div className="relative w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-sky-600 font-display text-base font-bold text-slate-950">
            RG
          </span>
          <div>
            <p className="font-display font-bold">Ravi Gupta</p>
            <p className="text-xs text-cyan-400">AI EventOps Assistant</p>
          </div>
        </Link>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur">
          <h1 className="font-display text-2xl font-bold">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            {mode === 'signin'
              ? 'Sign in to your EventOps workspace'
              : 'Start managing events with AI'}
          </p>

          <Button
            onClick={demo}
            type="button"
            className="mt-6 w-full bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 hover:opacity-90"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Create your own workspace
          </Button>

          <div className="my-5 flex items-center gap-3 text-xs text-slate-500">
            <span className="h-px flex-1 bg-white/10" />
            or {mode === 'signin' ? 'sign in' : 'sign up'}
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-slate-300">Email</Label>
              <Input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="border-slate-700 bg-slate-900/60 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300">Password</Label>
              <Input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="border-slate-700 bg-slate-900/60 text-white"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              variant="outline"
              className="w-full border-slate-700 bg-white/5 text-white hover:bg-white/10"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {mode === 'signin' ? 'Sign in' : 'Sign up'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="font-medium text-cyan-400 hover:underline"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5" />
          Secured with Supabase Auth. Each user gets an isolated workspace.
        </p>
      </div>
    </main>
  )
}