'use client'

import { useEffect, useState } from 'react'
import { EventOps } from '@/lib/api-client'
import { PageHeader } from '@/components/dashboard/ui'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Bot, MessageCircle, Mail, Database, KeyRound, Cpu, CheckCircle2, Circle } from 'lucide-react'

function EnvField({ label, name, placeholder }) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center justify-between"><span>{label}</span><code className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">{name}</code></Label>
      <Input disabled placeholder={placeholder} className="bg-muted" />
    </div>
  )
}

function IntegrationCard({ icon: Icon, title, status, children }) {
  const connected = status === 'connected'
  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-muted text-muted-foreground"><Icon className="h-5 w-5" /></span><h3 className="font-display font-semibold">{title}</h3></div>
        <Badge variant="outline" className={connected ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'}>
          {connected ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <Circle className="mr-1 h-3 w-3" />} {connected ? 'Connected' : 'Placeholder'}
        </Badge>
      </div>
      <div className="grid gap-3">{children}</div>
    </div>
  )
}

export default function SettingsPage() {
  const [tools, setTools] = useState([])
  useEffect(() => { EventOps.mcpTools().then((r) => setTools(r.tools || [])).catch(() => {}) }, [])

  return (
    <div>
      <PageHeader title="Settings" subtitle="Profile, AI behaviour and integration placeholders. No real secrets stored." />

      <Tabs defaultValue="profile">
        <TabsList className="flex-wrap">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="ai">AI</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="mcp">MCP Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-5">
          <div className="max-w-xl rounded-2xl border bg-card p-6">
            <div className="mb-4 flex items-center gap-2"><User className="h-5 w-5 text-cyan-500" /><h3 className="font-display font-semibold">Profile</h3></div>
            <div className="grid gap-3">
              <div className="space-y-1.5"><Label>Display name</Label><Input defaultValue="Ravi Gupta" /></div>
              <div className="space-y-1.5"><Label>Email</Label><Input defaultValue="hello2ravigupta@gmail.com" /></div>
              <div className="space-y-1.5"><Label>Organisation</Label><Input defaultValue="Ravi Events Co." /></div>
              <Button className="mt-2 w-fit bg-cyan-500 hover:bg-cyan-600">Save profile</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="mt-5">
          <div className="max-w-xl space-y-4 rounded-2xl border bg-card p-6">
            <div className="flex items-center gap-2"><Bot className="h-5 w-5 text-cyan-500" /><h3 className="font-display font-semibold">AI behaviour</h3></div>
            {[
              { label: 'Require human approval before sending', desc: 'Human-in-the-loop. Strongly recommended.', on: true },
              { label: 'Auto-classify incoming enquiries', desc: 'Tag category, risk and confidence on arrival.', on: true },
              { label: 'Escalate High-risk to human instantly', desc: 'Refunds & complaints bypass auto-reply.', on: true },
              { label: 'Allow AI auto-send (not recommended)', desc: 'Disabled for safety in this demo.', on: false },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between gap-4 rounded-xl border p-3">
                <div><p className="text-sm font-medium text-foreground">{s.label}</p><p className="text-xs text-muted-foreground">{s.desc}</p></div>
                <Switch defaultChecked={s.on} />
              </div>
            ))}
            <div className="space-y-1.5"><Label>Confidence threshold for human review</Label><Input type="number" defaultValue={0.8} step={0.05} min={0} max={1} /></div>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="mt-5 grid gap-5 lg:grid-cols-2">
          <IntegrationCard icon={MessageCircle} title="WhatsApp Cloud API" status="placeholder">
            <EnvField label="Verify token" name="WHATSAPP_VERIFY_TOKEN" placeholder="Set in .env" />
            <EnvField label="Access token" name="WHATSAPP_ACCESS_TOKEN" placeholder="Set in .env" />
            <EnvField label="Phone number ID" name="WHATSAPP_PHONE_NUMBER_ID" placeholder="Set in .env" />
          </IntegrationCard>
          <IntegrationCard icon={Mail} title="Email (Resend)" status="placeholder">
            <EnvField label="Resend API key" name="RESEND_API_KEY" placeholder="Set in .env" />
          </IntegrationCard>
          <IntegrationCard icon={Database} title="Supabase" status="placeholder">
            <EnvField label="Project URL" name="NEXT_PUBLIC_SUPABASE_URL" placeholder="Set in .env" />
            <EnvField label="Anon key" name="NEXT_PUBLIC_SUPABASE_ANON_KEY" placeholder="Set in .env" />
            <EnvField label="Service role key" name="SUPABASE_SERVICE_ROLE_KEY" placeholder="Set in .env" />
          </IntegrationCard>
          <IntegrationCard icon={KeyRound} title="OpenAI" status="placeholder">
            <EnvField label="API key" name="OPENAI_API_KEY" placeholder="Set in .env" />
          </IntegrationCard>
        </TabsContent>

        <TabsContent value="mcp" className="mt-5">
          <div className="mb-4 flex items-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 p-4 text-sm text-violet-900">
            <Cpu className="h-5 w-5 shrink-0" /><p>This app is <strong>MCP-ready</strong>. These core actions are defined as strongly-typed tools that an AI agent (ChatGPT, Claude, enterprise assistants) could call. See <code>docs/mcp-roadmap.md</code>.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {tools.map((t) => (
              <div key={t.name} className="rounded-2xl border bg-card p-4">
                <code className="text-sm font-semibold text-cyan-700">{t.name}</code>
                <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
              </div>
            ))}
            {tools.length === 0 && <p className="text-sm text-muted-foreground">Loading tool manifest…</p>}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
