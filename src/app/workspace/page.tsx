import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { MarketingNav } from '@/components/MarketingNav'
import { TaskFocusDashboard } from '@/components/workspace/TaskFocusDashboard'
import { createClient } from '@/lib/supabase/server'
import { getActiveTeamId, getUserTeams } from '@/lib/getActiveTeamId'
import { loadTaskFocusBoard } from '@/lib/taskFocusData'
import { absoluteUrl, siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Workspace',
  description: 'Per-worker ticket time, workflow signals, and sprint estimates from your FlowSight team data.',
  alternates: { canonical: absoluteUrl('/workspace') },
  openGraph: {
    url: absoluteUrl('/workspace'),
    title: `Workspace | ${siteConfig.name}`,
    description: 'Per-worker ticket time, workflow signals, and sprint estimates for your team.',
  },
}

export default async function WorkspacePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const teamId = await getActiveTeamId(user.id)
  const teams = await getUserTeams(user.id)

  if (!teamId) {
    return (
      <main id="workspace-shell" className="min-h-screen selection:bg-cyan-100 selection:text-cyan-900">
        <MarketingNav />
        <div className="max-w-xl mx-auto px-6 pt-32 pb-20">
          <div className="dashboard-card border border-dashboard-border p-8 space-y-4">
            <h1 className="text-2xl font-bold text-dashboard-text">No active team</h1>
            <p className="text-dashboard-muted text-sm">
              You need an active team to open this workspace. Create one or accept an invite in FlowSight, then open
              this page again once you&apos;re signed in.
            </p>
            <Link
              href="https://flowsight.site/dashboard"
              className="inline-flex text-sm font-medium text-primary-teal hover:underline"
            >
              Go to FlowSight →
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const board = await loadTaskFocusBoard(teamId)

  return (
    <main id="workspace-shell" className="min-h-screen selection:bg-cyan-100 selection:text-cyan-900">
      <MarketingNav />
      <TaskFocusDashboard board={board} teams={teams} activeTeamId={teamId} />
    </main>
  )
}
