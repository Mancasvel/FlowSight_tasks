import type { Task, WorkSession } from './types'

/** Monday 00:00:00.000 in local timezone */
export function startOfWeekMonday(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  const day = x.getDay() // 0 Sun .. 6 Sat
  const offset = day === 0 ? -6 : 1 - day
  x.setDate(x.getDate() + offset)
  return x
}

export function endOfWeekMondayStart(d: Date): Date {
  const start = startOfWeekMonday(d)
  const end = new Date(start)
  end.setDate(end.getDate() + 7)
  return end
}

export function formatDurationMs(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return '0m'
  const totalMinutes = Math.floor(ms / 60000)
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  if (h <= 0) return `${m}m`
  if (m <= 0) return `${h}h`
  return `${h}h ${m}m`
}

export type SessionSlice = {
  sessionId: string
  taskId: string
  ms: number
}

/** Overlap of [a0,a1) with [b0,b1) in ms */
export function overlapMs(a0: number, a1: number, b0: number, b1: number): number {
  const s = Math.max(a0, b0)
  const e = Math.min(a1, b1)
  return Math.max(0, e - s)
}

/**
 * For completed sessions, attribute time to calendar week [weekStart, weekEnd).
 * Running sessions (endedAt null) are ignored.
 */
export function sessionSlicesInRange(
  sessions: WorkSession[],
  weekStart: Date,
  weekEnd: Date
): SessionSlice[] {
  const w0 = weekStart.getTime()
  const w1 = weekEnd.getTime()
  const out: SessionSlice[] = []
  for (const s of sessions) {
    if (!s.endedAt) continue
    const t0 = new Date(s.startedAt).getTime()
    const t1 = new Date(s.endedAt).getTime()
    if (!Number.isFinite(t0) || !Number.isFinite(t1) || t1 <= t0) continue
    const ms = overlapMs(t0, t1, w0, w1)
    if (ms > 0) out.push({ sessionId: s.id, taskId: s.taskId, ms })
  }
  return out
}

export type TaskRollup = { taskId: string; name: string; ms: number }

export function buildRollupForRange(
  sessions: WorkSession[],
  tasks: Task[],
  weekStart: Date,
  weekEnd: Date
): { rows: TaskRollup[]; totalMs: number } {
  const slices = sessionSlicesInRange(sessions, weekStart, weekEnd)
  const byTask = new Map<string, number>()
  for (const sl of slices) {
    byTask.set(sl.taskId, (byTask.get(sl.taskId) ?? 0) + sl.ms)
  }
  const nameById = new Map(tasks.map((t) => [t.id, t.name] as const))
  const rows: TaskRollup[] = Array.from(byTask.entries())
    .map(([taskId, ms]) => ({ taskId, name: nameById.get(taskId) ?? 'Unknown task', ms }))
    .sort((a, b) => b.ms - a.ms)
  const totalMs = rows.reduce((acc, r) => acc + r.ms, 0)
  return { rows, totalMs }
}

export function buildWeeklyRollup(
  sessions: WorkSession[],
  tasks: Task[],
  referenceDate: Date
): { weekStart: string; weekEnd: string; rows: TaskRollup[]; totalMs: number } {
  const ws = startOfWeekMonday(referenceDate)
  const we = endOfWeekMondayStart(referenceDate)
  const { rows, totalMs } = buildRollupForRange(sessions, tasks, ws, we)
  return { weekStart: ws.toISOString(), weekEnd: we.toISOString(), rows, totalMs }
}

/**
 * Client "automatic reporting" nudge: true if weekly digest not acknowledged since week turned.
 */
export function shouldPromptWeeklyDigest(lastAckIso: string | null, now: Date): boolean {
  const ws = startOfWeekMonday(now)
  if (!lastAckIso) return true
  const last = new Date(lastAckIso).getTime()
  if (!Number.isFinite(last)) return true
  return last < ws.getTime()
}
