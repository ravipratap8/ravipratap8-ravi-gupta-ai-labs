'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Activity, ArrowRight, BadgeCheck, BookOpenCheck, Boxes, BriefcaseBusiness,
  CheckCircle2, ChevronRight, Circle, Code2, Database, ExternalLink, Factory,
  FlaskConical, Gauge, GitBranch, GraduationCap, Layers3, Network, PackageCheck,
  Plane, RefreshCw, Route, Search, ServerCog, ShieldCheck, ShoppingCart,
  Sparkles, Truck, Users, Warehouse, Wrench,
} from 'lucide-react'

const SECTIONS = [
  { id: 'foundations', title: '1. Supply Chain Foundations', short: 'Foundations', icon: Boxes },
  { id: 'careers', title: '2. Careers in NZ & Australia', short: 'Careers', icon: BriefcaseBusiness },
  { id: 'study', title: '3. Study & International Pathways', short: 'Study', icon: GraduationCap },
  { id: 'backgrounds', title: '4. Who Can Move Into Supply Chain?', short: 'Backgrounds', icon: Users },
  { id: 'systems', title: '5. Enterprise Systems Landscape', short: 'Systems', icon: ServerCog },
  { id: 'sap', title: '6. SAP Knowledge: The Core', short: 'SAP', icon: Layers3 },
  { id: 'flows', title: '7. End-to-End Business Flows', short: 'Flows', icon: Route },
  { id: 'strategy', title: '8. Enterprise Quality Strategy', short: 'QA Strategy', icon: ShieldCheck },
  { id: 'integration', title: '9. API & Integration Quality', short: 'Integration', icon: Network },
  { id: 'automation', title: '10. Automation That Scales', short: 'Automation', icon: Code2 },
  { id: 'release', title: '11. Release Evidence & Quality Signals', short: 'Release', icon: Gauge },
  { id: 'capstone', title: '12. Capstone & 12-Week Learning Plan', short: 'Capstone', icon: FlaskConical },
]

const CAREERS = [
  ['Supply Chain / Logistics Coordinator', 'Orders, inventory, suppliers, transport and operational coordination.', 'Excel, ERP basics, communication, process discipline'],
  ['Inventory / Replenishment Analyst', 'Stock availability, forecasting signals, exceptions and inventory health.', 'Excel/SQL, analytics, planning concepts, ERP'],
  ['Procurement / Purchasing', 'Supplier selection, purchase orders, commercial terms and supply continuity.', 'Procurement process, negotiation, ERP, data'],
  ['Warehouse / Distribution Operations', 'Receiving, storage, picking, packing, dispatch and productivity.', 'WMS, safety, process improvement, RF/mobile systems'],
  ['Transport / Logistics Planning', 'Carrier planning, route execution, freight visibility and delivery performance.', 'TMS, analytics, carrier processes, exception management'],
  ['Demand / Supply Planning', 'Forecasting, capacity, inventory balancing and planning decisions.', 'Planning concepts, statistics, Excel/BI, ERP'],
  ['Supply Chain Systems / Business Analyst', 'Translate operational needs into ERP/WMS/TMS process and system changes.', 'Process mapping, requirements, SAP/ERP, integration'],
  ['ERP / SAP Functional Consultant', 'Configure, support and improve enterprise business processes.', 'SAP process knowledge, configuration concepts, integration, documentation'],
  ['Quality Engineer / Test Analyst', 'Validate integrated business flows, APIs, interfaces, data and releases.', 'Risk testing, API, SQL, automation, ERP domain knowledge'],
  ['Supply Chain Manager / Operations Leader', 'Own performance, people, cost, service, suppliers and operational risk.', 'Leadership, commercial judgement, analytics, process improvement'],
]

const SAP_AREAS = [
  { title: 'S/4HANA / ERP Core', text: 'The transactional backbone. Learn organisational structures, master data, document flow and how finance, sales, procurement and inventory connect.', topics: ['Business Partner', 'Material Master', 'Plants & Storage Locations', 'Purchase Orders', 'Sales Orders', 'Goods Movements', 'Document Flow'] },
  { title: 'MM · Materials Management', text: 'Procurement and material processes: requisition, purchase order, goods receipt, invoice relationship, stock and supplier-facing flows.', topics: ['PR → PO', 'Goods Receipt', 'Inventory', 'Purchasing', 'Valuation concepts'] },
  { title: 'SD · Sales & Distribution', text: 'Customer order-to-cash flow: sales order, availability, delivery, goods issue and billing relationships.', topics: ['Sales Order', 'ATP concepts', 'Outbound Delivery', 'PGI', 'Billing'] },
  { title: 'EWM · Extended Warehouse Management', text: 'Warehouse execution: inbound, putaway, stock, waves, warehouse tasks/orders, picking, packing, staging and exception handling.', topics: ['Inbound', 'Putaway', 'Warehouse Tasks', 'Waves', 'Picking', 'Handling Units', 'Packing', 'Staging'] },
  { title: 'TM · Transportation Management', text: 'Transportation planning and execution: freight units/orders, carrier planning, tendering concepts, execution milestones and freight cost context.', topics: ['Freight Units', 'Planning', 'Freight Orders', 'Carrier', 'Execution', 'Settlement concepts'] },
  { title: 'Integration Layer', text: 'Modern SAP landscapes rarely operate alone. Learn how APIs, IDocs/events, middleware and partner systems move business state between platforms.', topics: ['REST/OData', 'IDoc concepts', 'Events', 'Middleware', 'Retries', 'Monitoring'] },
]

const FLOW_CARDS = [
  { icon: ShoppingCart, title: 'Procure to Pay', flow: ['Need', 'Requisition', 'Purchase Order', 'Goods Receipt', 'Invoice', 'Payment'], test: 'Validate quantities, status transitions, inventory effects, duplicate handling, accounting hand-offs and supplier exceptions.' },
  { icon: PackageCheck, title: 'Order to Cash', flow: ['Customer Order', 'Availability', 'Delivery', 'Pick/Pack', 'Goods Issue', 'Billing'], test: 'Validate pricing inputs, availability, delivery state, stock reduction, billing eligibility and cancellations.' },
  { icon: Warehouse, title: 'Warehouse Execution', flow: ['Inbound', 'Receive', 'Putaway', 'Replenish', 'Pick', 'Pack', 'Stage'], test: 'Validate stock ownership/location, task creation, RF behaviour, handling units, exceptions and physical-vs-system state.' },
  { icon: Truck, title: 'Transport Execution', flow: ['Demand', 'Plan', 'Carrier', 'Load', 'Dispatch', 'Track', 'Deliver'], test: 'Validate transport planning, reference data, integration messages, milestone status and failed/late execution paths.' },
]

const QA_LAYERS = [
  ['Business risk', 'What failure costs the business: service, money, inventory, compliance, customer trust or operational continuity.'],
  ['Process coverage', 'Trace critical end-to-end flows instead of testing isolated screens only.'],
  ['Functional behaviour', 'Validate rules, calculations, roles, status transitions, exceptions and reversals.'],
  ['Integration', 'Validate messages, APIs, mappings, sequencing, retries, idempotency and downstream state.'],
  ['Data', 'Reconcile inventory, orders, master data, financial/operational totals and transformed data.'],
  ['Automation', 'Automate stable, repeatable, high-value checks at the right layer. Do not automate UI just because you can.'],
  ['Non-functional', 'Performance, resilience, security, accessibility and operational recoverability where relevant.'],
  ['Release evidence', 'Combine testing, defects, change risk, environment, operational readiness and known residual risk.'],
]

const EXERCISES = [
  'Draw an order-to-cash process and mark every point where data changes system ownership.',
  'Create a risk matrix for an inventory adjustment capability: likelihood, impact, detectability and test approach.',
  'Design ten API tests for an order creation endpoint including duplicates, authorization and invalid master data.',
  'Write a reconciliation query or pseudo-query comparing expected vs actual stock after a warehouse movement.',
  'Choose five scenarios to automate and explain why each belongs at API, integration or UI level.',
  'Design failure tests for a message that is delivered twice, arrives late or is never acknowledged.',
  'Create a release dashboard containing no more than eight quality signals that a delivery leader could actually use.',
  'Build a SAP learning glossary with 30 terms and map each term to a real business concept rather than memorising transactions.',
  'Create a test data strategy for products, suppliers, customers, locations and stock states.',
  'Produce a one-page end-to-end test strategy for a fictional company implementing ERP + WMS + TMS.',
]

function SectionTitle({ number, eyebrow, title, children }) {
  return <div className="mb-8 max-w-4xl"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">{number} · {eyebrow}</p><h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">{title}</h2>{children && <p className="mt-4 text-base leading-relaxed text-slate-300 md:text-lg">{children}</p>}</div>
}

function Tick({ children }) { return <li className="flex gap-2 text-sm leading-relaxed text-slate-300"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />{children}</li> }

export function EnterpriseQualityLearning() {
  const [done, setDone] = useState([])
  const [careerQuery, setCareerQuery] = useState('')

  useEffect(() => {
    try { setDone(JSON.parse(localStorage.getItem('rg-enterprise-quality-progress') || '[]')) } catch {}
  }, [])

  const toggle = (id) => {
    setDone((current) => {
      const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
      localStorage.setItem('rg-enterprise-quality-progress', JSON.stringify(next))
      return next
    })
  }

  const filteredCareers = useMemo(() => CAREERS.filter((row) => row.join(' ').toLowerCase().includes(careerQuery.toLowerCase())), [careerQuery])
  const progress = Math.round((done.length / SECTIONS.length) * 100)

  return <>
    <section className="border-b border-white/5 bg-grid">
      <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
        <div className="max-w-5xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-200"><Sparkles className="h-4 w-4" /> Free flagship learning module</div>
          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight md:text-7xl">Enterprise Quality Engineering, Supply Chain & SAP</h1>
          <p className="mt-6 max-w-4xl text-lg leading-relaxed text-slate-300 md:text-xl">Learn the business process first, understand how enterprise platforms connect it, then test the complete system with risk-based strategy, API and integration validation, automation, data evidence and release signals.</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[['12', 'guided sections'], ['SAP', 'process-first learning'], ['10', 'hands-on exercises'], ['Free', 'no sign-in required']].map(([v,l]) => <div key={l} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><p className="font-display text-2xl font-bold">{v}</p><p className="mt-1 text-xs text-slate-400">{l}</p></div>)}
        </div>
      </div>
    </section>

    <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[280px_1fr]">
      <aside className="lg:sticky lg:top-5 lg:h-fit">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between"><p className="text-sm font-semibold">Your progress</p><span className="text-sm text-cyan-300">{progress}%</span></div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-cyan-400 transition-all" style={{ width: `${progress}%` }} /></div>
          <nav className="mt-5 space-y-1">
            {SECTIONS.map((s) => <a key={s.id} href={`#${s.id}`} className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs text-slate-400 hover:bg-white/5 hover:text-white">{done.includes(s.id) ? <CheckCircle2 className="h-4 w-4 text-cyan-400" /> : <Circle className="h-4 w-4" />}<span>{s.short}</span></a>)}
          </nav>
        </div>
      </aside>

      <div className="min-w-0 space-y-10">
        <section id="foundations" className="scroll-mt-6 rounded-3xl border border-white/10 bg-white/[0.025] p-6 md:p-9">
          <SectionTitle number="01" eyebrow="Business before software" title="Supply chain is the movement of value, not just trucks and warehouses.">Supply chain connects demand, sourcing, suppliers, inventory, production or fulfilment, warehousing, transport and customers. The technology only makes sense when you understand the decisions and hand-offs underneath it.</SectionTitle>
          <div className="grid gap-4 md:grid-cols-3">
            {[['Plan', 'What will customers need, when, where and in what quantity?'], ['Source', 'What should be purchased, from whom, under what constraints and lead time?'], ['Execute', 'How will goods be received, stored, moved, picked, packed, transported and delivered?'], ['Control', 'What inventory exists, where is it, who owns it and can the system be trusted?'], ['Optimise', 'How do cost, service, capacity, waste and working capital improve together?'], ['Recover', 'What happens when suppliers fail, stock is wrong, transport is late or systems disagree?']].map(([a,b]) => <div key={a} className="rounded-2xl border border-white/10 bg-slate-950/50 p-5"><p className="font-semibold text-cyan-300">{a}</p><p className="mt-2 text-sm leading-relaxed text-slate-400">{b}</p></div>)}
          </div>
          <div className="mt-6 rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-5"><p className="font-semibold">Why this matters to a tester or engineer</p><p className="mt-2 text-sm leading-relaxed text-slate-300">If you only validate screens, you can miss the real failure. A warehouse action may update inventory, create an event, trigger transport planning, affect customer availability and eventually influence finance. Enterprise quality is about validating that chain of consequences.</p></div>
          <Complete id="foundations" done={done} toggle={toggle} />
        </section>

        <section id="careers" className="scroll-mt-6 rounded-3xl border border-white/10 bg-white/[0.025] p-6 md:p-9">
          <SectionTitle number="02" eyebrow="Career landscape" title="Supply chain careers span operations, analytics, systems and leadership.">Australia and New Zealand both have significant logistics, retail, manufacturing, food, transport, infrastructure and distribution sectors. The field is broader than warehouse operations and includes analytical, commercial, technology and management roles.</SectionTitle>
          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5 text-sm leading-relaxed text-slate-300"><strong className="text-amber-200">Career reality:</strong> no course guarantees employment. Employers typically value a combination of domain understanding, digital capability, communication, analytical thinking and evidence that you can improve or control a real process.</div>
          <div className="mt-6 relative"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" /><input value={careerQuery} onChange={(e)=>setCareerQuery(e.target.value)} placeholder="Search careers, e.g. SAP, warehouse, analytics" className="w-full rounded-xl border border-white/10 bg-slate-950 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-cyan-400/40" /></div>
          <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="text-xs uppercase tracking-wide text-slate-500"><tr><th className="pb-3 pr-5">Role family</th><th className="pb-3 pr-5">What it works on</th><th className="pb-3">Useful capability</th></tr></thead><tbody>{filteredCareers.map(([a,b,c])=><tr key={a} className="border-t border-white/5 align-top"><td className="py-4 pr-5 font-semibold text-white">{a}</td><td className="py-4 pr-5 text-slate-400">{b}</td><td className="py-4 text-slate-300">{c}</td></tr>)}</tbody></table></div>
          <p className="mt-5 text-sm text-slate-400">Australia's Jobs and Skills Australia describes supply/distribution management as managing the supply, storage and distribution of goods, while purchasing and logistics roles include orders, stock, production schedules and distribution coordination. Use official labour-market sources for current role data.</p>
          <ExternalSources items={[['Jobs and Skills Australia · Supply & Distribution Managers','https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/133611-supply-and-distribution-managers'],['Jobs and Skills Australia · Purchasing & Supply Logistics Clerks','https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/5911-purchasing-and-supply-logistics-clerks']]} />
          <Complete id="careers" done={done} toggle={toggle} />
        </section>

        <section id="study" className="scroll-mt-6 rounded-3xl border border-white/10 bg-white/[0.025] p-6 md:p-9">
          <SectionTitle number="03" eyebrow="Study planning" title="Study supply chain for the skill, not for a visa promise.">Supply chain and logistics are available at certificate, diploma, graduate, bachelor and postgraduate levels depending on country and provider. They can be sensible study choices when they genuinely fit your prior education, experience and career direction.</SectionTitle>
          <div className="rounded-2xl border border-red-400/25 bg-red-400/5 p-5"><p className="font-semibold text-red-200">Important immigration disclaimer</p><p className="mt-2 text-sm leading-relaxed text-slate-300">This learning module does not provide immigration advice. A supply-chain course does not automatically create a student visa, post-study work right, skilled visa or residence pathway. Immigration rules, eligible qualifications, occupation lists, work rights, funds, genuine-student requirements and post-study options change. Check the relevant government website and, where you need personal advice, use a licensed immigration adviser or registered migration agent.</p></div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <CountryCard icon={Plane} title="New Zealand" points={['For study longer than 3 months, Immigration New Zealand says you generally need an offer of place from a New Zealand education provider before applying for a student visa.', 'Post-study work eligibility depends on the qualification and applicable rules. Do not assume every supply-chain programme qualifies.', 'Official Study with New Zealand listings show examples ranging from graduate diplomas to bachelor and masters-level supply-chain/logistics study.']} />
            <CountryCard icon={Plane} title="Australia" points={['The primary student route is the Student visa (subclass 500).', 'Australia applies a Genuine Student requirement: studying must be the primary reason for the visa application.', 'Course selection should be based on genuine academic and career progression, not a claim that one subject guarantees migration.']} />
          </div>
          <ExternalSources items={[['Immigration New Zealand · Study visas','https://www.immigration.govt.nz/study/study-visas/'],['Immigration New Zealand · Post Study Work Visa qualifications','https://www.immigration.govt.nz/study/after-you-finish-your-study/qualifications-needed-for-a-post-study-work-visa/'],['Study with New Zealand · Supply-chain course search/examples','https://www.studywithnewzealand.govt.nz/'],['Australian Home Affairs · Student visa subclass 500','https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500'],['Australian Home Affairs · Genuine Student requirement','https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500/genuine-student-requirement']]} />
          <Complete id="study" done={done} toggle={toggle} />
        </section>

        <section id="backgrounds" className="scroll-mt-6 rounded-3xl border border-white/10 bg-white/[0.025] p-6 md:p-9">
          <SectionTitle number="04" eyebrow="Transferable backgrounds" title="You do not need a science or STEM background to understand supply chain.">Some roles are quantitative or deeply technical, but the field also rewards business judgement, communication, planning, commercial awareness and process thinking.</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[['Business / Commerce','Procurement, planning, operations, vendor management, commercial analysis'],['IT / Software / Testing','ERP, WMS/TMS, integration, automation, data, quality engineering'],['Engineering','Operations optimisation, manufacturing, reliability, systems thinking'],['Mathematics / Analytics','Forecasting, optimisation, inventory, network and demand analysis'],['Hospitality / Retail / Operations','Real-world service, inventory, staffing, replenishment and customer flow'],['Career changers','Start with process fundamentals, Excel/data skills, ERP concepts and one domain specialisation']].map(([a,b])=><div key={a} className="rounded-2xl border border-white/10 p-5"><p className="font-semibold">{a}</p><p className="mt-2 text-sm leading-relaxed text-slate-400">{b}</p></div>)}
          </div>
          <div className="mt-6"><p className="font-semibold">A practical training stack</p><ul className="mt-3 grid gap-2 md:grid-cols-2"><Tick>Supply-chain process vocabulary and end-to-end flows</Tick><Tick>Excel, basic statistics and data interpretation</Tick><Tick>SQL and reconciliation for analytical/technology roles</Tick><Tick>ERP concepts and SAP process knowledge</Tick><Tick>WMS/TMS concepts for execution roles</Tick><Tick>API/integration literacy for digital supply chains</Tick><Tick>Communication, requirements and process mapping</Tick><Tick>Continuous improvement and root-cause thinking</Tick></ul></div>
          <Complete id="backgrounds" done={done} toggle={toggle} />
        </section>

        <section id="systems" className="scroll-mt-6 rounded-3xl border border-white/10 bg-white/[0.025] p-6 md:p-9">
          <SectionTitle number="05" eyebrow="Architecture" title="Think in connected systems, not one application.">A mature supply chain may combine ERP, warehouse, transport, planning, ecommerce, supplier, carrier, finance, analytics and automation platforms. Quality problems frequently live at the boundaries.</SectionTitle>
          <div className="overflow-x-auto pb-2"><div className="flex min-w-[850px] items-center gap-3">{[['Customer / Channel',ShoppingCart],['ERP / SAP',Layers3],['Warehouse / WMS',Warehouse],['Transport / TMS',Truck],['Carrier / Partner',Network],['Finance / Analytics',Database]].map(([label,Icon],i)=><div key={label} className="flex items-center gap-3"><div className="w-32 rounded-2xl border border-white/10 bg-slate-950 p-4 text-center"><Icon className="mx-auto h-5 w-5 text-cyan-300"/><p className="mt-2 text-xs font-semibold">{label}</p></div>{i<5 && <ChevronRight className="h-5 w-5 text-slate-600"/>}</div>)}</div></div>
          <div className="mt-7 grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-white/10 p-5"><p className="font-semibold">Master data crosses everything</p><p className="mt-2 text-sm leading-relaxed text-slate-400">Products/materials, customers, suppliers, locations, units of measure, calendars and transportation attributes can cause failures far away from where they are maintained.</p></div><div className="rounded-2xl border border-white/10 p-5"><p className="font-semibold">State is distributed</p><p className="mt-2 text-sm leading-relaxed text-slate-400">An order may be valid in one platform while a downstream warehouse or transport system has not processed it yet. Test timing, reconciliation and recovery.</p></div></div>
          <Complete id="systems" done={done} toggle={toggle} />
        </section>

        <section id="sap" className="scroll-mt-6 rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.025] p-6 md:p-9">
          <SectionTitle number="06" eyebrow="Most important technical-domain section" title="Learn SAP as a business process platform, not a list of transaction codes.">Transaction codes change, interfaces evolve and organisations configure SAP differently. Durable knowledge comes from understanding business objects, organisational structures, master data, document flow, integration and the operational consequence of each state change.</SectionTitle>
          <div className="grid gap-5 md:grid-cols-2">{SAP_AREAS.map((a)=><div key={a.title} className="rounded-2xl border border-white/10 bg-slate-950/60 p-5"><p className="font-display text-lg font-bold text-white">{a.title}</p><p className="mt-2 text-sm leading-relaxed text-slate-400">{a.text}</p><div className="mt-4 flex flex-wrap gap-2">{a.topics.map(t=><span key={t} className="rounded-full border border-cyan-400/15 bg-cyan-400/5 px-2.5 py-1 text-xs text-cyan-200">{t}</span>)}</div></div>)}</div>
          <div className="mt-7 rounded-2xl border border-violet-400/20 bg-violet-400/5 p-6"><p className="font-semibold text-violet-200">How to learn SAP without access to a production company system</p><ol className="mt-3 space-y-2 text-sm leading-relaxed text-slate-300"><li><strong>1.</strong> Pick one process, such as procure-to-pay or order-to-cash.</li><li><strong>2.</strong> Learn the business documents and statuses in order.</li><li><strong>3.</strong> Learn the master data each step depends on.</li><li><strong>4.</strong> Map what data enters and exits SAP.</li><li><strong>5.</strong> Add exceptions: cancellation, shortage, duplicate, partial quantity, blocked master data, failed interface.</li><li><strong>6.</strong> Only then learn screens, apps, configuration concepts or transactions relevant to your role.</li></ol></div>
          <div className="mt-7 grid gap-5 md:grid-cols-3">{[['Functional path','Process → SAP objects → configuration concepts → testing → support'],['Technical path','ABAP/extensions → APIs/events → integration → monitoring → automation'],['Quality path','Process risk → data → interfaces → SAP states → E2E testing → release evidence']].map(([a,b])=><div key={a} className="rounded-2xl border border-white/10 p-5"><p className="font-semibold">{a}</p><p className="mt-2 text-sm text-slate-400">{b}</p></div>)}</div>
          <Complete id="sap" done={done} toggle={toggle} />
        </section>

        <section id="flows" className="scroll-mt-6 rounded-3xl border border-white/10 bg-white/[0.025] p-6 md:p-9">
          <SectionTitle number="07" eyebrow="Process walkthroughs" title="Test the document flow and the business consequence.">For each flow, learn the normal path first. Then add partial quantities, duplicate actions, cancellation, incorrect master data, authorization, integration delay and recovery.</SectionTitle>
          <div className="space-y-5">{FLOW_CARDS.map(({icon:Icon,title,flow,test})=><div key={title} className="rounded-2xl border border-white/10 p-5"><div className="flex items-center gap-3"><Icon className="h-5 w-5 text-cyan-300"/><p className="font-display text-lg font-bold">{title}</p></div><div className="mt-4 flex flex-wrap items-center gap-2">{flow.map((f,i)=><div key={f} className="flex items-center gap-2"><span className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-slate-300">{f}</span>{i<flow.length-1 && <ChevronRight className="h-3.5 w-3.5 text-slate-600"/>}</div>)}</div><p className="mt-4 text-sm leading-relaxed text-slate-400"><strong className="text-white">Quality lens:</strong> {test}</p></div>)}</div>
          <Complete id="flows" done={done} toggle={toggle} />
        </section>

        <section id="strategy" className="scroll-mt-6 rounded-3xl border border-white/10 bg-white/[0.025] p-6 md:p-9">
          <SectionTitle number="08" eyebrow="Quality leadership" title="Enterprise quality strategy starts with risk and ends with decision evidence.">The objective is not to produce the largest test pack. It is to make important failure modes visible early enough that delivery teams can make informed decisions.</SectionTitle>
          <div className="space-y-3">{QA_LAYERS.map(([a,b],i)=><div key={a} className="grid gap-2 rounded-2xl border border-white/10 p-4 md:grid-cols-[42px_180px_1fr] md:items-center"><span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-400/10 text-sm font-bold text-cyan-300">{i+1}</span><p className="font-semibold">{a}</p><p className="text-sm leading-relaxed text-slate-400">{b}</p></div>)}</div>
          <Complete id="strategy" done={done} toggle={toggle} />
        </section>

        <section id="integration" className="scroll-mt-6 rounded-3xl border border-white/10 bg-white/[0.025] p-6 md:p-9">
          <SectionTitle number="09" eyebrow="Interfaces" title="An enterprise API test is a business-state test with a transport layer.">Status codes matter, but integrated supply-chain systems need contract, mapping, state, idempotency, sequencing, retry and reconciliation checks.</SectionTitle>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{[['Contract','Schema, required fields, enums, precision, dates, units and backwards compatibility'],['Business rules','Valid combinations, ownership, availability, quantity, status and authorization'],['Idempotency','What happens if the same order/event is submitted twice?'],['Sequencing','What if delivery arrives before order, or update arrives before create?'],['Resilience','Timeouts, retries, partial acceptance, dead-letter/reprocessing and downstream outages'],['Reconciliation','Can you prove source and target agree after processing completes?']].map(([a,b])=><div key={a} className="rounded-2xl border border-white/10 p-5"><Network className="h-5 w-5 text-cyan-300"/><p className="mt-3 font-semibold">{a}</p><p className="mt-2 text-sm leading-relaxed text-slate-400">{b}</p></div>)}</div>
          <Complete id="integration" done={done} toggle={toggle} />
        </section>

        <section id="automation" className="scroll-mt-6 rounded-3xl border border-white/10 bg-white/[0.025] p-6 md:p-9">
          <SectionTitle number="10" eyebrow="Engineering leverage" title="Automate where the signal is stable, repeatable and valuable.">Enterprise automation should shorten feedback and protect critical behaviours. It should not reproduce every manual test through a brittle UI.</SectionTitle>
          <div className="grid gap-4 md:grid-cols-3">{[['API / service','Best for business rules, contracts, data combinations and fast regression.'],['Integration / component','Best for system boundaries, events, mappings, retries and state propagation.'],['UI / RF / browser','Best for critical user journeys, interaction behaviour and selected end-to-end confidence.']].map(([a,b])=><div key={a} className="rounded-2xl border border-white/10 p-5"><Code2 className="h-5 w-5 text-cyan-300"/><p className="mt-3 font-semibold">{a}</p><p className="mt-2 text-sm leading-relaxed text-slate-400">{b}</p></div>)}</div>
          <div className="mt-6 rounded-2xl border border-white/10 p-5"><p className="font-semibold">Automation selection test</p><ul className="mt-3 grid gap-2 md:grid-cols-2"><Tick>High business risk or frequent regression</Tick><Tick>Deterministic expected result</Tick><Tick>Repeatable test data or controlled setup</Tick><Tick>Useful failure diagnosis</Tick><Tick>Runs often enough to repay maintenance</Tick><Tick>Correct test layer chosen</Tick></ul></div>
          <Complete id="automation" done={done} toggle={toggle} />
        </section>

        <section id="release" className="scroll-mt-6 rounded-3xl border border-white/10 bg-white/[0.025] p-6 md:p-9">
          <SectionTitle number="11" eyebrow="Decision support" title="A green test run is a signal, not a release strategy.">A useful quality view combines change scope, critical-process coverage, defects, automation reliability, integration evidence, data checks, environment limitations, operational readiness and residual risk.</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[['Change risk','How much and what kind of system/process changed?'],['Critical coverage','Which high-risk business flows were exercised?'],['Defect picture','What remains open, deferred or accepted?'],['Automation health','Did reliable regression checks pass?'],['Integration evidence','Were interfaces and downstream states validated?'],['Data evidence','Were important reconciliations completed?'],['Operational readiness','Monitoring, rollback, support and recovery ready?'],['Residual risk','What is still uncertain and who accepted it?']].map(([a,b])=><div key={a} className="rounded-2xl border border-white/10 p-5"><Activity className="h-5 w-5 text-cyan-300"/><p className="mt-3 font-semibold">{a}</p><p className="mt-2 text-xs leading-relaxed text-slate-400">{b}</p></div>)}</div>
          <Complete id="release" done={done} toggle={toggle} />
        </section>

        <section id="capstone" className="scroll-mt-6 rounded-3xl border border-violet-400/20 bg-violet-400/[0.03] p-6 md:p-9">
          <SectionTitle number="12" eyebrow="Turn learning into evidence" title="Build one fictional enterprise implementation from process to release.">Use a fictional retailer, manufacturer or distributor. Do not use confidential data, screenshots, architecture, test cases or operational information from a current or former employer.</SectionTitle>
          <div className="grid gap-6 lg:grid-cols-[1fr_.9fr]">
            <div><p className="font-semibold">Capstone exercises</p><ol className="mt-4 space-y-3">{EXERCISES.map((e,i)=><li key={e} className="flex gap-3 text-sm leading-relaxed text-slate-300"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-violet-400/10 text-xs font-bold text-violet-200">{i+1}</span>{e}</li>)}</ol></div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6"><p className="font-semibold">12-week progression</p><div className="mt-4 space-y-3">{[['Weeks 1–2','Supply-chain fundamentals + process mapping'],['Weeks 3–4','SAP/ERP objects + master data + document flow'],['Weeks 5–6','Warehouse, transport and integration concepts'],['Weeks 7–8','Risk-based test design + API + SQL/data'],['Weeks 9–10','Automation architecture + resilience testing'],['Weeks 11–12','Release evidence + capstone presentation']].map(([a,b])=><div key={a} className="border-l border-violet-400/30 pl-4"><p className="text-sm font-semibold text-violet-200">{a}</p><p className="mt-1 text-xs leading-relaxed text-slate-400">{b}</p></div>)}</div><p className="mt-6 text-xs leading-relaxed text-slate-500">The point is not to claim SAP expertise after twelve weeks. The point is to build a defensible foundation and a portfolio of process, testing and systems evidence that shows how you think.</p></div>
          </div>
          <Complete id="capstone" done={done} toggle={toggle} />
        </section>

        <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-7 text-center"><BadgeCheck className="mx-auto h-8 w-8 text-cyan-300"/><h2 className="mt-3 font-display text-2xl font-bold">Keep building from here.</h2><p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">Continue with API testing, Playwright, AI engineering and the rest of the free learning hub. The strongest profile is not “I completed a course.” It is “I can explain the process, identify the risk, test the system and show the evidence.”</p><Link href="/learning" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950">Back to Learning Hub <ArrowRight className="h-4 w-4"/></Link></div>
      </div>
    </div>
  </>
}

function Complete({ id, done, toggle }) {
  const completed = done.includes(id)
  return <div className="mt-7 border-t border-white/5 pt-5"><button onClick={() => toggle(id)} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${completed ? 'bg-cyan-400 text-slate-950' : 'border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]'}`}>{completed ? <CheckCircle2 className="h-4 w-4"/> : <Circle className="h-4 w-4"/>}{completed ? 'Section completed' : 'Mark section complete'}</button></div>
}

function CountryCard({ icon: Icon, title, points }) {
  return <div className="rounded-2xl border border-white/10 p-5"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300"><Icon className="h-5 w-5"/></span><p className="font-display text-lg font-bold">{title}</p></div><ul className="mt-4 space-y-3">{points.map(p=><Tick key={p}>{p}</Tick>)}</ul></div>
}

function ExternalSources({ items }) {
  return <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/50 p-5"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Official / government sources to verify current information</p><div className="mt-3 flex flex-col gap-2">{items.map(([label,href])=><a key={href} href={href} target="_blank" rel="noreferrer" className="inline-flex items-start gap-2 text-sm text-cyan-400 hover:text-cyan-300"><ExternalLink className="mt-0.5 h-4 w-4 shrink-0"/><span>{label}</span></a>)}</div></div>
}
