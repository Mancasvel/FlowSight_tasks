import type { Metadata } from 'next'
import { MarketingNav } from '@/components/MarketingNav'
import { TaskTimeHero } from '@/components/TaskTimeHero'
import { HowItWorksSection } from '@/components/HowItWorksSection'
import { ReportingSection } from '@/components/ReportingSection'
import { absoluteUrl, siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Task time clarity and weekly rollups',
  description: siteConfig.description,
  alternates: { canonical: absoluteUrl('/') },
  openGraph: {
    url: absoluteUrl('/'),
    title: `${siteConfig.name} · ${siteConfig.productSlug}`,
    description: siteConfig.description,
  },
}

export default function Home() {
  return (
    <main className="min-h-screen font-sans selection:bg-cyan-100 selection:text-cyan-900">
      <MarketingNav />
      <TaskTimeHero />
      <HowItWorksSection />
      <ReportingSection />
    </main>
  )
}
