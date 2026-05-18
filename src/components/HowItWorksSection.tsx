import { Clock, LineChart, ShieldCheck } from 'lucide-react'

const steps = [
  {
    title: 'Name the task',
    body: 'Break work into tasks you actually invoice or defend in standups—not vague buckets.',
    icon: Clock,
  },
  {
    title: 'Run an honest timer',
    body: 'One active session at a time. Stop when you context-switch; FlowSight rolls partial weeks correctly.',
    icon: LineChart,
  },
  {
    title: 'Ship the report',
    body: 'Weekly rollups, CSV/JSON exports, and a gentle nudge when a new week starts—automatic reporting without bossware.',
    icon: ShieldCheck,
  },
]

export function HowItWorksSection() {
  return (
    <section id="how" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-navy mb-4">How the workspace loop works</h2>
          <p className="text-secondary-navy/70">
            The parallel product keeps the FlowSight landing aesthetic while narrowing the job-to-be-done: time on
            tasks, closed with exports you control.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div key={s.title} className="dashboard-card border border-dashboard-border p-6">
              <div className="w-11 h-11 rounded-xl bg-primary-teal/10 text-primary-teal flex items-center justify-center mb-4">
                <s.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-dashboard-text mb-2">{s.title}</h3>
              <p className="text-sm text-dashboard-muted leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
