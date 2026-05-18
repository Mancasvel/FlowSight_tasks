/** Marketing + app shell config (SEO, OG). FlowSight Tasks: task time + rollups + workspace reporting. */
export const siteConfig = {
  name: 'FlowSight',
  productSlug: 'Tasks',
  legalName: 'FlowSight Inc.',
  url: 'https://flowsight.site',
  defaultOgImage: '/flowsight_sinfondo.png',
  description:
    'FlowSight Tasks: map hours to tickets and sprints, get automatic weekly rollups, and export stakeholder-ready summaries—local-first, no surveillance theater.',
  keywords: [
    'FlowSight',
    'FlowSight Tasks',
    'task time tracking',
    'sprint rollup',
    'weekly delivery report',
    'proof of work',
    'local-first productivity',
    'export time report CSV',
    'freelancer time summary',
  ],
  twitterHandle: '@flowsight',
  locale: 'en_US',
  privacyEmail: 'privacy@flowsight.com',
}

export function absoluteUrl(path: string): string {
  const envBase = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SITE_URL : undefined
  const base = (envBase || siteConfig.url).replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}
