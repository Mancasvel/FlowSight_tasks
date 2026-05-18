import type { Metadata } from 'next'
import Link from 'next/link'
import { TasksHero } from '@/components/landing/TasksHero'
import { TrustBar } from '@/components/landing/TrustBar'
import { UseCases } from '@/components/landing/UseCases'
import { FlowSection } from '@/components/landing/FlowSection'
import { TasksDownloadSection } from '@/components/landing/TasksDownloadSection'
import { ComparisonTable } from '@/components/landing/ComparisonTable'
import { Pricing } from '@/components/landing/Pricing'
import { FinalCTA } from '@/components/landing/FinalCTA'
import { absoluteUrl, siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Task time clarity and weekly rollups',
  description: siteConfig.description,
  alternates: { canonical: absoluteUrl('/') },
  openGraph: {
    url: absoluteUrl('/'),
    title: `${siteConfig.name} Tasks · Know where your hours go. Ship rollups you can defend.`,
    description: siteConfig.description,
  },
}

export default function Home() {
  return (
    <main className="min-h-screen font-sans selection:bg-cyan-100 selection:text-cyan-900">
      <nav className="fixed top-0 left-0 z-50 flex w-full items-center justify-between bg-white/5 p-6 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-secondary-navy">
          <span>
            Flow<span className="text-primary-teal">Sight</span>
          </span>
          <span className="hidden text-xs font-semibold uppercase tracking-widest text-secondary-navy/50 sm:inline">
            Tasks
          </span>
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium text-secondary-navy/70 sm:gap-6">
          <a href="#how-it-works" className="hidden transition-colors hover:text-primary-cyan md:block">
            How it works
          </a>
          <a href="#privacy" className="hidden transition-colors hover:text-primary-cyan md:block">
            Privacy
          </a>
          <a
            href="https://flowsight.site/blog"
            className="hidden transition-colors hover:text-primary-cyan md:block"
            target="_blank"
            rel="noopener noreferrer"
          >
            Blog
          </a>
          <Link
            href="/workspace"
            className="hidden rounded-lg border border-secondary-navy/30 px-4 py-2 transition-all hover:border-primary-teal hover:text-primary-teal sm:inline"
          >
            Workspace
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-secondary-navy/30 px-4 py-2 transition-all hover:border-primary-teal hover:text-primary-teal"
          >
            Login
          </Link>
        </div>
      </nav>

      <TasksHero />
      <TrustBar />
      <UseCases />
      <FlowSection />
      <TasksDownloadSection />
      <ComparisonTable />
      <Pricing />
      <FinalCTA />
    </main>
  )
}
