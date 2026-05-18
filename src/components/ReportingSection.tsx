import { AutomationBadge } from '@/components/workspace/AutomationBadge'

export function ReportingSection() {
  return (
    <section id="reporting" className="py-20 bg-[#f8fafc] border-y border-slate-200/80">
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <AutomationBadge />
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-navy mt-4 mb-4">
            Automatic reporting, still privacy-first
          </h2>
          <p className="text-secondary-navy/70 mb-6">
            After you sign in, the workspace shows ticket-level time, how work is distributed across categories, recent
            closed tickets, and sprint planning hints — in one place.
          </p>
          <ul className="space-y-3 text-sm text-secondary-navy/80">
            <li>· Per-worker, per-ticket time from granular activity linked to Jira keys.</li>
            <li>· Workflow hints from category mix (meetings, coding, debugging, idle).</li>
            <li>· Sprint capacity suggestions grounded in recent session fill-rate and commitments.</li>
          </ul>
        </div>
        <div className="dashboard-card border border-dashboard-border p-6 shadow-elevated">
          <p className="text-xs font-semibold uppercase tracking-wide text-dashboard-muted mb-2">Sample export</p>
          <pre className="text-xs bg-secondary-navy text-slate-100 rounded-xl p-4 overflow-x-auto leading-relaxed">
{`{
  "weekStart": "2026-05-11T00:00:00.000Z",
  "weekEnd": "2026-05-18T00:00:00.000Z",
  "rows": [
    { "task": "Billing microservice", "ms": 50400000 },
    { "task": "Design QA", "ms": 16200000 }
  ],
  "totalMs": 66600000
}`}
          </pre>
        </div>
      </div>
    </section>
  )
}
