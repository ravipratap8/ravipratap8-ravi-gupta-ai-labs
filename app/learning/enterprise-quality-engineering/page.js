import Link from 'next/link'
import { EnterpriseQualityLearning } from '@/components/learning/EnterpriseQualityLearning'

export const metadata = {
  title: 'Enterprise Quality Engineering, Supply Chain & SAP | Free Learning | Ravi Gupta AI Labs',
  description: 'Free hands-on learning covering supply chain foundations, SAP, enterprise QA, integration, API testing, automation, release evidence and career pathways in Australia and New Zealand.',
}

export default function EnterpriseQualityEngineeringPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-5 pt-8">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link href="/" className="text-slate-400 hover:text-cyan-300">← ravigupta.dev</Link>
          <span className="text-slate-700">/</span>
          <Link href="/learning" className="text-cyan-400 hover:text-cyan-300">Learning Hub</Link>
        </div>
      </div>
      <EnterpriseQualityLearning />
    </main>
  )
}
