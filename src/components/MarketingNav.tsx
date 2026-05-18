import Link from 'next/link'

export function MarketingNav() {
  return (
    <nav className="fixed top-0 left-0 w-full p-6 z-50 flex justify-between items-center bg-white/5 backdrop-blur-sm">
      <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tighter text-secondary-navy">
        <span>
          Flow<span className="text-primary-teal">Sight</span>
        </span>
        <span className="hidden sm:inline text-xs font-semibold uppercase tracking-widest text-secondary-navy/50">
          Tasks
        </span>
      </Link>
      <div className="flex gap-4 sm:gap-6 items-center text-sm font-medium text-secondary-navy/70">
        <a href="#how" className="hidden md:block hover:text-primary-cyan transition-colors">
          How it works
        </a>
        <a href="#reporting" className="hidden md:block hover:text-primary-cyan transition-colors">
          Reporting
        </a>
        <Link
          href="/workspace"
          className="hidden sm:inline px-4 py-2 rounded-lg border border-secondary-navy/30 hover:border-primary-teal hover:text-primary-teal transition-all"
        >
          Workspace
        </Link>
        <Link
          href="/login"
          className="px-4 py-2 rounded-lg border border-secondary-navy/30 hover:border-primary-teal hover:text-primary-teal transition-all"
        >
          Sign in
        </Link>
      </div>
    </nav>
  )
}
