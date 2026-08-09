import { notFound } from 'next/navigation'
import QAToolWorkbench from '@/components/tools/qa-tool-workbench'
import { getTool, QA_TOOLS } from '@/lib/tools/catalog'

export function generateStaticParams() {
  return QA_TOOLS.map((tool) => ({ slug: tool.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const tool = getTool(slug)
  if (!tool) return {}
  return {
    title: `${tool.title} | Ravi Gupta QA Tools`,
    description: tool.description,
  }
}

export default async function ToolPage({ params }) {
  const { slug } = await params
  const tool = getTool(slug)
  if (!tool) notFound()
  const { prompt, icon, ...publicTool } = tool
  return <QAToolWorkbench tool={publicTool} />
}
