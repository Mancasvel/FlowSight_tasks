import { createClient } from '@/lib/supabase/server'
import type { SprintCommitment } from '@/lib/supabase/database.types'

export type TeamMemberLite = {
  user_id: string
  display_name: string
  avatar_url: string | null
}

export type TicketWorkerRow = {
  jira_ticket_id: string
  user_id: string
  worker_name: string
  total_seconds: number
  samples: number
  dominant_category: string
}

export type WorkflowUserRow = {
  user_id: string
  worker_name: string
  category_seconds: Record<string, number>
  hints: string[]
}

export type ClosedTicketLite = {
  jira_ticket_id: string
  user_id: string
  worker_name: string
  adjusted_seconds: number
  closed_at: string
}

export type SprintRow = SprintCommitment & {
  suggested_next_hours: number | null
  rationale: string | null
}

type MemberRow = {
  user_id: string
  profile: { display_name: string | null; avatar_url: string | null } | null
}

function displayName(m: MemberRow): string {
  return m.profile?.display_name?.trim() || 'Unknown'
}

function topKey(counts: Map<string, number>): string {
  let best = ''
  let max = 0
  for (const [k, v] of Array.from(counts.entries())) {
    if (v > max) {
      max = v
      best = k
    }
  }
  return best || 'General'
}

function workflowHints(categorySeconds: Record<string, number>, total: number): string[] {
  const hints: string[] = []
  if (total <= 0) return hints
  const pct = (cat: string) => ((categorySeconds[cat] ?? 0) / total) * 100
  if (pct('Meeting') > 25) hints.push('Meeting load is high: batch syncs or shorten standups to protect build time.')
  if (pct('Browsing') + pct('Idle') > 20) hints.push('Idle / browsing share is elevated: try focus blocks and fewer parallel streams.')
  if (pct('Debugging') > pct('Coding') && pct('Coding') > 0) {
    hints.push('Debugging exceeds coding: invest in tests, smaller tickets, or earlier design review before sprint commit.')
  }
  if (pct('Coding') < 30 && total > 3600) hints.push('Low deep coding ratio: check scope creep, interruptions, or unclear acceptance criteria.')
  if (hints.length === 0) hints.push('Workflow mix looks balanced; keep tracking ticket-level time to validate sprint estimates.')
  return hints
}

export async function fetchTeamMembers(teamId: string): Promise<TeamMemberLite[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('team_members')
    .select('user_id, profile:profiles!team_members_user_id_fkey(display_name, avatar_url)')
    .eq('team_id', teamId)

  if (error) throw new Error(`FlowSight Tasks [members]: ${error.message}`)
  const rows = (data ?? []) as unknown as MemberRow[]
  return rows.map((r) => ({
    user_id: r.user_id,
    display_name: displayName(r),
    avatar_url: r.profile?.avatar_url ?? null,
  }))
}

export async function loadTaskFocusBoard(teamId: string, windowDays = 30) {
  const supabase = await createClient()
  const since = new Date()
  since.setDate(since.getDate() - windowDays)
  const sinceIso = since.toISOString()

  const [members, activityRes, snapshotsRes, sprintsRes, sessionsRes] = await Promise.all([
    fetchTeamMembers(teamId),
    supabase
      .from('activity_reports')
      .select('user_id, jira_ticket_id, duration_seconds, category, description, captured_at')
      .eq('team_id', teamId)
      .gte('captured_at', sinceIso),
    supabase
      .from('ticket_snapshots')
      .select('user_id, jira_ticket_id, adjusted_seconds, total_seconds, closed_at')
      .eq('team_id', teamId)
      .gte('closed_at', sinceIso)
      .order('closed_at', { ascending: false })
      .limit(800),
    supabase
      .from('sprint_commitments')
      .select('*')
      .eq('team_id', teamId)
      .order('starts_at', { ascending: false })
      .limit(8),
    supabase
      .from('work_sessions')
      .select('session_date, duration_seconds')
      .eq('team_id', teamId)
      .gte('session_date', since.toISOString().slice(0, 10)),
  ])

  if (activityRes.error) {
    const missing = activityRes.error.code === '42P01' || activityRes.error.message.includes('schema cache')
    if (!missing) throw new Error(`FlowSight Tasks [activity_reports]: ${activityRes.error.message}`)
  }
  const activities = activityRes.data ?? []

  let snapshots = snapshotsRes.data ?? []
  if (snapshotsRes.error) {
    const missing = snapshotsRes.error.code === '42P01' || snapshotsRes.error.message.includes('schema cache')
    if (!missing) throw new Error(`FlowSight Tasks [ticket_snapshots]: ${snapshotsRes.error.message}`)
    snapshots = []
  }

  let sprints: SprintCommitment[] = sprintsRes.data ?? []
  if (sprintsRes.error) {
    const missing = sprintsRes.error.code === '42P01' || sprintsRes.error.message.includes('schema cache')
    if (!missing) throw new Error(`FlowSight Tasks [sprint_commitments]: ${sprintsRes.error.message}`)
    sprints = []
  }

  const sessions = sessionsRes.error ? [] : sessionsRes.data ?? []

  const nameByUser = new Map(members.map((m) => [m.user_id, m.display_name] as const))

  // --- Per ticket × worker (activity_reports with Jira key) ---
  const ticketAgg = new Map<string, { seconds: number; samples: number; cat: Map<string, number> }>()
  for (const a of activities) {
    if (!a.jira_ticket_id) continue
    const key = `${a.jira_ticket_id}::${a.user_id}`
    const cur = ticketAgg.get(key) ?? { seconds: 0, samples: 0, cat: new Map<string, number>() }
    cur.seconds += a.duration_seconds ?? 0
    cur.samples += 1
    const c = a.category ?? 'General'
    cur.cat.set(c, (cur.cat.get(c) ?? 0) + (a.duration_seconds ?? 0))
    ticketAgg.set(key, cur)
  }

  const ticketWorkerRows: TicketWorkerRow[] = Array.from(ticketAgg.entries())
    .map(([key, v]) => {
      const [jira_ticket_id, user_id] = key.split('::') as [string, string]
      return {
        jira_ticket_id,
        user_id,
        worker_name: nameByUser.get(user_id) ?? user_id,
        total_seconds: v.seconds,
        samples: v.samples,
        dominant_category: topKey(v.cat),
      }
    })
    .sort((a, b) => b.total_seconds - a.total_seconds)

  // --- Workflow mix per worker ---
  const perUserCat = new Map<string, Map<string, number>>()
  for (const a of activities) {
    if (!perUserCat.has(a.user_id)) perUserCat.set(a.user_id, new Map())
    const m = perUserCat.get(a.user_id)!
    const c = a.category ?? 'General'
    m.set(c, (m.get(c) ?? 0) + (a.duration_seconds ?? 0))
  }

  const workflowRows: WorkflowUserRow[] = members.map((m) => {
    const catMap = perUserCat.get(m.user_id) ?? new Map()
    const category_seconds: Record<string, number> = {}
    let total = 0
      for (const [k, v] of Array.from(catMap.entries())) {
      category_seconds[k] = v
      total += v
    }
    return {
      user_id: m.user_id,
      worker_name: m.display_name,
      category_seconds,
      hints: workflowHints(category_seconds, total),
    }
  })

  // --- Recent closed tickets (velocity signal) ---
  const closedTickets: ClosedTicketLite[] = snapshots.map((s) => ({
    jira_ticket_id: s.jira_ticket_id,
    user_id: s.user_id,
    worker_name: nameByUser.get(s.user_id) ?? s.user_id,
    adjusted_seconds: s.adjusted_seconds,
    closed_at: s.closed_at,
  }))

  // --- Sprint suggestions: efficiency from work_sessions overlapping last two sprints ---
  const sprintRowsChrono = [...sprints].reverse()
  let efficiency: number | null = null
  if (sprintRowsChrono.length >= 1 && sessions.length > 0) {
    const last = sprintRowsChrono[sprintRowsChrono.length - 1]
    const spanSessions = sessions.filter(
      (s) => s.session_date >= last.starts_at.slice(0, 10) && s.session_date <= last.ends_at.slice(0, 10)
    )
    const actualHours = spanSessions.reduce((acc, s) => acc + (s.duration_seconds ?? 0), 0) / 3600
    if (last.committed_hours > 0) efficiency = Math.min(1.4, Math.max(0.5, actualHours / last.committed_hours))
  }

  const sprintRows: SprintRow[] = sprints.map((s) => {
    let suggested: number | null = null
    let rationale: string | null = null
    if (efficiency != null && s.committed_hours > 0) {
      suggested = Math.round(s.committed_hours * efficiency * 10) / 10
      rationale = `Uses recent team fill-rate (~${Math.round((efficiency ?? 0) * 100)}% of committed hours logged as session time). Tune after more sprint data.`
    } else if (s.committed_hours > 0) {
      suggested = Math.round(s.committed_hours * 0.85 * 10) / 10
      rationale = 'Not enough overlapping session history; defaulting to 85% of committed hours as a conservative planning buffer.'
    }
    return { ...s, suggested_next_hours: suggested, rationale }
  })

  return {
    members,
    ticketWorkerRows,
    workflowRows,
    closedTickets,
    sprintRows,
    windowDays,
    sinceIso,
  }
}

export type TaskFocusBoard = Awaited<ReturnType<typeof loadTaskFocusBoard>>
