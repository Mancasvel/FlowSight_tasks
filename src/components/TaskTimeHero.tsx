'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/Button'
import { FileBarChart, Timer } from 'lucide-react'
import Link from 'next/link'

export function TaskTimeHero() {
  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-hero-mesh opacity-40 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-teal mb-4">
            Task time · automatic reporting
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-secondary-navy leading-tight mb-6">
            Know your <span className="text-gradient">real</span> time per task.
          </h1>
          <p className="text-lg text-secondary-navy/70 mb-8 max-w-xl">
            Per-worker time on Jira-linked tickets, how effort spreads across activity types, what finished work looks
            like, and practical hints for the next sprint — in one focused workspace.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/workspace">
              <Button size="lg">Launch workspace</Button>
            </Link>
            <a href="#how">
              <Button variant="outline" size="lg" className="text-secondary-navy border-secondary-navy/30">
                See the loop
              </Button>
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="dashboard-card border border-dashboard-border p-8 dashboard-gradient"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-dashboard-muted">This week</p>
              <p className="text-3xl font-bold text-dashboard-text">18h 40m</p>
            </div>
            <div className="p-3 rounded-2xl bg-primary-teal/10 text-primary-teal">
              <Timer className="w-7 h-7" />
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Spec & design', pct: 0.42, color: 'bg-primary-teal' },
              { label: 'Implementation', pct: 0.33, color: 'bg-primary-cyan' },
              { label: 'Review & QA', pct: 0.25, color: 'bg-primary-blue' },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-dashboard-text font-medium">{row.label}</span>
                  <span className="text-dashboard-muted">{Math.round(row.pct * 100)}%</span>
                </div>
                <div className="h-2 rounded-full bg-dashboard-subtle overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${row.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${row.pct * 100}%` }}
                    transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center gap-3 text-sm text-dashboard-muted">
            <FileBarChart className="w-4 h-4" />
            <span>Weekly digest + CSV export (demo workspace stores locally in your browser).</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
