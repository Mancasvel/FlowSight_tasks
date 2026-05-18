import { describe, expect, it } from 'vitest'
import {
  buildRollupForRange,
  buildWeeklyRollup,
  formatDurationMs,
  overlapMs,
  sessionSlicesInRange,
  shouldPromptWeeklyDigest,
  startOfWeekMonday,
} from './report'
import type { Task, WorkSession } from './types'

describe('formatDurationMs', () => {
  it('formats hours and minutes', () => {
    expect(formatDurationMs(3600000)).toBe('1h')
    expect(formatDurationMs(900000)).toBe('15m')
    expect(formatDurationMs(3900000)).toBe('1h 5m')
  })
})

describe('startOfWeekMonday', () => {
  it('returns Monday at local midnight for a Thursday', () => {
    const d = new Date(2026, 4, 14, 15, 30, 0) // Thu May 14 2026 local
    const m = startOfWeekMonday(d)
    expect(m.getDay()).toBe(1)
    expect(m.getHours()).toBe(0)
    expect(m.getMinutes()).toBe(0)
  })
})

describe('sessionSlicesInRange', () => {
  it('splits partial overlap', () => {
    const weekStart = new Date('2026-05-11T00:00:00.000Z')
    const weekEnd = new Date('2026-05-18T00:00:00.000Z')
    const sessions: WorkSession[] = [
      {
        id: '1',
        taskId: 'a',
        startedAt: '2026-05-10T12:00:00.000Z',
        endedAt: '2026-05-12T12:00:00.000Z',
      },
    ]
    const slices = sessionSlicesInRange(sessions, weekStart, weekEnd)
    expect(slices.length).toBe(1)
    expect(slices[0].ms).toBe(36 * 3600 * 1000)
  })

  it('ignores running sessions', () => {
    const weekStart = new Date('2026-05-11T00:00:00.000Z')
    const weekEnd = new Date('2026-05-18T00:00:00.000Z')
    const sessions: WorkSession[] = [
      {
        id: '1',
        taskId: 'a',
        startedAt: '2026-05-12T12:00:00.000Z',
        endedAt: null,
      },
    ]
    expect(sessionSlicesInRange(sessions, weekStart, weekEnd).length).toBe(0)
  })
})

describe('buildRollupForRange', () => {
  it('aggregates by task', () => {
    const tasks: Task[] = [
      { id: 'a', name: 'Design', createdAt: '' },
      { id: 'b', name: 'Code', createdAt: '' },
    ]
    const sessions: WorkSession[] = [
      {
        id: '1',
        taskId: 'a',
        startedAt: '2026-05-12T10:00:00.000Z',
        endedAt: '2026-05-12T11:00:00.000Z',
      },
      {
        id: '2',
        taskId: 'a',
        startedAt: '2026-05-12T12:00:00.000Z',
        endedAt: '2026-05-12T13:30:00.000Z',
      },
      {
        id: '3',
        taskId: 'b',
        startedAt: '2026-05-12T14:00:00.000Z',
        endedAt: '2026-05-12T15:00:00.000Z',
      },
    ]
    const weekStart = new Date('2026-05-11T00:00:00.000Z')
    const weekEnd = new Date('2026-05-18T00:00:00.000Z')
    const r = buildRollupForRange(sessions, tasks, weekStart, weekEnd)
    expect(r.rows.find((x) => x.taskId === 'a')?.ms).toBe(150 * 60 * 1000)
    expect(r.rows.find((x) => x.taskId === 'b')?.ms).toBe(60 * 60 * 1000)
    expect(r.totalMs).toBe(210 * 60 * 1000)
  })
})

describe('buildWeeklyRollup', () => {
  it('returns ISO week boundaries', () => {
    const r = buildWeeklyRollup([], [], new Date(Date.UTC(2026, 4, 13, 12, 0, 0)))
    expect(r.weekStart).toMatch(/T/)
    expect(r.weekEnd).toMatch(/T/)
    expect(r.rows.length).toBe(0)
    expect(r.totalMs).toBe(0)
  })
})

describe('overlapMs', () => {
  it('returns 0 when disjoint', () => {
    expect(overlapMs(0, 1, 2, 3)).toBe(0)
  })
})

describe('shouldPromptWeeklyDigest', () => {
  it('true when never ack', () => {
    expect(shouldPromptWeeklyDigest(null, new Date(2026, 4, 13, 12, 0, 0))).toBe(true)
  })

  it('false when ack after week start', () => {
    const now = new Date(2026, 4, 13, 12, 0, 0)
    const monday = startOfWeekMonday(now)
    const ack = new Date(monday.getTime() + 60_000).toISOString()
    expect(shouldPromptWeeklyDigest(ack, now)).toBe(false)
  })
})
