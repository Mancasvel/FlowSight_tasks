'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { FLOWSIGHT_ACTIVE_TEAM_COOKIE } from '@/lib/teamCookie'
import type { TaskFocusBoard } from '@/lib/taskFocusData'
import { Button } from '@/components/Button'
import { BarChart3, GitBranch, LogOut, Timer, Users } from 'lucide-react'

function fmtHours(sec: number) {
  if (!Number.isFinite(sec) || sec <= 0) return '0h'
  const h = sec / 3600
  return `${h < 10 ? h.toFixed(1) : Math.round(h)}h`
}

type Props = {
  board: TaskFocusBoard
  teams: { id: string; name: string }[]
  activeTeamId: string
}

export function TaskFocusDashboard({ board, teams, activeTeamId }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<'tickets' | 'workflow' | 'velocity' | 'sprints'>('tickets')

  const ticketSummary = useMemo(() => {
    const byTicket = new Map<string, number>()
    for (const r of board.ticketWorkerRows) {
      byTicket.set(r.jira_ticket_id, (byTicket.get(r.jira_ticket_id) ?? 0) + r.total_seconds)
    }
    return Array.from(byTicket.entries())
      .map(([id, sec]) => ({ id, sec }))
      .sort((a, b) => b.sec - a.sec)
      .slice(0, 12)
  }, [board.ticketWorkerRows])

  const setTeamCookie = (teamId: string) => {
    document.cookie = `${FLOWSIGHT_ACTIVE_TEAM_COOKIE}=${teamId};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`
    router.refresh()
  }

  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const tabs = [
    { id: 'tickets' as const, label: 'Time per ticket', icon: Timer },
    { id: 'workflow' as const, label: 'Workflow', icon: Users },
    { id: 'velocity' as const, label: 'Closed tickets', icon: BarChart3 },
    { id: 'sprints' as const, label: 'Sprints & estimates', icon: GitBranch },
  ]

  return (
    <div className="min-h-screen dashboard-gradient pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <Link href="/" className="text-sm text-dashboard-muted hover:text-primary-teal">
              ← Marketing
            </Link>
            <h1 className="text-3xl font-bold text-dashboard-text mt-1">Task & sprint focus</h1>
            <p className="text-dashboard-muted text-sm mt-1 max-w-2xl">
              Ticket-level activity, per-worker category mix, recent delivery history, and sprint planning hints — updated
              from your team&apos;s live data.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {teams.length > 1 ? (
              <select
                className="rounded-xl border border-dashboard-border bg-white px-3 py-2 text-sm text-dashboard-text"
                value={activeTeamId}
                onChange={(e) => setTeamCookie(e.target.value)}
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            ) : null}
            <Button variant="outline" size="sm" className="text-secondary-navy border-secondary-navy/25" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-dashboard-border pb-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                tab === t.id
                  ? 'bg-primary-teal text-white shadow-card'
                  : 'bg-white text-dashboard-muted border border-dashboard-border hover:border-primary-teal/40'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'tickets' ? (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="dashboard-card border border-dashboard-border p-6">
              <h2 className="text-lg font-semibold text-dashboard-text mb-2">Top tickets (last {board.windowDays}d)</h2>
              <p className="text-sm text-dashboard-muted mb-4">
                Built from tracked work that includes a Jira ticket key, summed over the last {board.windowDays} days.
              </p>
              <ul className="space-y-2">
                {ticketSummary.length === 0 ? (
                  <li className="text-sm text-dashboard-muted">No ticket-linked activity in this window.</li>
                ) : (
                  ticketSummary.map((t) => (
                    <li key={t.id} className="flex justify-between text-sm border-b border-dashboard-border/80 py-2">
                      <span className="font-mono text-dashboard-text">{t.id}</span>
                      <span className="text-dashboard-muted">{fmtHours(t.sec)}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div className="dashboard-card border border-dashboard-border p-6">
              <h2 className="text-lg font-semibold text-dashboard-text mb-2">Time per worker × ticket</h2>
              <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-dashboard-muted border-b border-dashboard-border">
                      <th className="py-2 pr-3">Ticket</th>
                      <th className="py-2 pr-3">Worker</th>
                      <th className="py-2 pr-3">Time</th>
                      <th className="py-2">Top category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {board.ticketWorkerRows.slice(0, 40).map((r) => (
                      <tr key={`${r.jira_ticket_id}-${r.user_id}`} className="border-b border-dashboard-border/70">
                        <td className="py-2 pr-3 font-mono text-dashboard-text">{r.jira_ticket_id}</td>
                        <td className="py-2 pr-3">{r.worker_name}</td>
                        <td className="py-2 pr-3">{fmtHours(r.total_seconds)}</td>
                        <td className="py-2 text-dashboard-muted">{r.dominant_category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}

        {tab === 'workflow' ? (
          <div className="space-y-6">
            {board.workflowRows.map((w) => (
              <div key={w.user_id} className="dashboard-card border border-dashboard-border p-6">
                <h3 className="text-md font-semibold text-dashboard-text mb-2">{w.worker_name}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase text-dashboard-muted mb-2">Category mix</p>
                    <div className="space-y-2">
                      {Object.entries(w.category_seconds)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 8)
                        .map(([cat, sec]) => {
                          const total = Object.values(w.category_seconds).reduce((a, b) => a + b, 0) || 1
                          const pct = Math.round((sec / total) * 100)
                          return (
                            <div key={cat}>
                              <div className="flex justify-between text-xs mb-1">
                                <span>{cat}</span>
                                <span className="text-dashboard-muted">
                                  {pct}% · {fmtHours(sec)}
                                </span>
                              </div>
                              <div className="h-1.5 rounded-full bg-dashboard-subtle overflow-hidden">
                                <div className="h-full bg-primary-teal rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-dashboard-muted mb-2">How to improve</p>
                    <ul className="list-disc pl-4 space-y-2 text-sm text-dashboard-text">
                      {w.hints.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {tab === 'velocity' ? (
          <div className="dashboard-card border border-dashboard-border p-6">
            <h2 className="text-lg font-semibold text-dashboard-text mb-2">Recent closed tickets (snapshots)</h2>
            <p className="text-sm text-dashboard-muted mb-4">
              When a ticket closes, we store an adjusted time estimate to help calibrate how long similar work tends to
              take.
            </p>
            <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-dashboard-muted border-b border-dashboard-border">
                    <th className="py-2 pr-3">Ticket</th>
                    <th className="py-2 pr-3">Worker</th>
                    <th className="py-2 pr-3">Adjusted</th>
                    <th className="py-2">Closed</th>
                  </tr>
                </thead>
                <tbody>
                  {board.closedTickets.slice(0, 60).map((r) => (
                    <tr key={`${r.jira_ticket_id}-${r.user_id}-${r.closed_at}`} className="border-b border-dashboard-border/70">
                      <td className="py-2 pr-3 font-mono">{r.jira_ticket_id}</td>
                      <td className="py-2 pr-3">{r.worker_name}</td>
                      <td className="py-2 pr-3">{fmtHours(r.adjusted_seconds)}</td>
                      <td className="py-2 text-dashboard-muted">{new Date(r.closed_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {board.closedTickets.length === 0 ? (
                <p className="text-sm text-dashboard-muted mt-4">No snapshots in this window yet.</p>
              ) : null}
            </div>
          </div>
        ) : null}

        {tab === 'sprints' ? (
          <div className="dashboard-card border border-dashboard-border p-6 space-y-4">
            <h2 className="text-lg font-semibold text-dashboard-text">Sprint commitments & next capacity</h2>
            <p className="text-sm text-dashboard-muted">
              Suggested hours combine what the team committed with how much time was actually logged in the most recent
              sprint — a simple planning aid, not a guarantee.
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-dashboard-muted border-b border-dashboard-border">
                    <th className="py-2 pr-3">Sprint</th>
                    <th className="py-2 pr-3">Committed</th>
                    <th className="py-2 pr-3">Suggested next</th>
                    <th className="py-2">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {board.sprintRows.map((s) => (
                    <tr key={s.id} className="border-b border-dashboard-border/70 align-top">
                      <td className="py-2 pr-3 font-medium text-dashboard-text">{s.sprint_label}</td>
                      <td className="py-2 pr-3">{s.committed_hours}h</td>
                      <td className="py-2 pr-3">{s.suggested_next_hours != null ? `${s.suggested_next_hours}h` : '—'}</td>
                      <td className="py-2 text-dashboard-muted max-w-md">{s.rationale}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {board.sprintRows.length === 0 ? (
                <p className="text-sm text-dashboard-muted mt-4">No sprint commitments stored for this team yet.</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
