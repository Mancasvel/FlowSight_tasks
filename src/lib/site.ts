/** Marketing + app shell config (SEO, OG). Parallel product to FlowSight_landing: task time + reporting. */
export const siteConfig = {
  name: 'FlowSight',
  productSlug: 'Task time & reporting',
  legalName: 'FlowSight Inc.',
  url: 'https://flowsight.site',
  defaultOgImage: '/flowsight_sinfondo.png',
  description:
    'FlowSight for task time: know exactly where your hours go, close the loop with automatic weekly rollups, and export client-ready summaries—without surveillance theater.',
  keywords: [
    'FlowSight',
    'task time tracking',
    'automatic weekly report',
    'proof of work',
    'local-first productivity',
    'export time report CSV',
    'deep work by task',
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
