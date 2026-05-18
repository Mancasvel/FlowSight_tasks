'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

function LoginInner() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()
  const next = searchParams.get('next') ?? '/workspace'

  useEffect(() => {
    const authError = searchParams.get('error')
    if (authError === 'auth_failed') setError('Authentication failed. Please try again.')
  }, [searchParams])

  const google = async () => {
    setLoading(true)
    setError('')
    const { error: e } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })
    if (e) {
      setError(e.message)
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="w-full max-w-md relative z-10"
    >
      <div className="dashboard-card p-8 backdrop-blur-xl bg-white/90 border border-dashboard-border">
        <div className="space-y-6">
          {error ? (
            <div className="p-3 bg-accent-red/15 border border-accent-red/30 rounded-lg text-accent-red text-sm">{error}</div>
          ) : null}
          <div className="text-center">
            <h2 className="text-lg font-semibold text-dashboard-text mb-1">FlowSight Tasks</h2>
            <p className="text-sm text-dashboard-muted">Sign in to continue.</p>
          </div>
          <button
            type="button"
            onClick={google}
            disabled={loading}
            className="w-full py-3 px-4 bg-white border border-dashboard-border rounded-lg text-dashboard-text font-medium hover:bg-dashboard-subtle disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Redirecting…
              </>
            ) : (
              <>Continue with Google</>
            )}
          </button>
          <p className="text-center text-xs text-dashboard-muted">
            Sign in with Jira?{' '}
            <Link href="https://flowsight.site/login" className="text-primary-teal hover:underline">
              Continue at flowsight.site
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  )
}

function LoginFallback() {
  return (
    <div className="dashboard-card p-8 flex justify-center">
      <Loader2 className="animate-spin text-primary-teal w-8 h-8" />
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen dashboard-gradient flex items-center justify-center p-6">
      <Suspense fallback={<LoginFallback />}>
        <LoginInner />
      </Suspense>
    </div>
  )
}
