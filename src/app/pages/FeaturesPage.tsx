import { Link } from 'react-router';
import {
  ArrowRight,
  Sparkles,
  Bell,
  Database,
  BarChart3,
  GraduationCap,
  Check,
  ChevronRight,
  Zap,
  Globe,
  Shield,
  Calendar,
  Users,
  Newspaper,
  Building,
  TrendingUp,
  Brain,
  Clock,
  RefreshCw,
  Lock,
  FileText,
  Target,
  Layers,
} from 'lucide-react';

import { SharedHeader, SharedFooter } from '../components/SharedPageLayout';

const coreModules = [
  {
    badge: 'PRISM Prep™',
    tag: 'Pre-Meeting Intelligence',
    icon: Sparkles,
    color: 'from-red-500 to-red-700',
    bgLight: 'bg-red-50',
    borderLight: 'border-red-100',
    textLight: 'text-red-600',
    ringColor: 'ring-red-500/20',
    headline: 'Walk into every meeting fully briefed — automatically.',
    description:
      'Generates a structured intelligence brief for every upcoming meeting, automatically pulling stakeholder profiles, company news, LinkedIn activity, deal history from your CRM, and previous interaction notes. Available in your inbox or CRM sidebar 30 minutes before the meeting begins.',
    capabilities: [
      'Stakeholder bios and LinkedIn activity summaries',
      'Company news, funding signals, and market updates',
      'CRM deal history and previous interaction context',
      'AI-generated icebreakers and talking points',
      'Financial health indicators and valuation metrics',
      'Competitive positioning and industry benchmarks',
    ],
    deliveryNote: 'Delivered to inbox & CRM sidebar 30 minutes before every meeting.',
  },
  {
    badge: 'PRISM Pulse™',
    tag: 'Real-Time Account Alerts',
    icon: Bell,
    color: 'from-violet-500 to-violet-700',
    bgLight: 'bg-violet-50',
    borderLight: 'border-violet-100',
    textLight: 'text-violet-600',
    ringColor: 'ring-violet-500/20',
    headline: 'Never miss the perfect moment to reach out.',
    description:
      'Monitors your key accounts 24/7 for material changes: leadership transitions, funding announcements, regulatory filings, earnings calls, and competitive activity. Sends a concise alert so you can reach out at exactly the right moment.',
    capabilities: [
      'Executive leadership changes and board transitions',
      'Funding rounds, acquisitions, and M&A signals',
      'Earnings calls and regulatory filing alerts',
      'Competitive product launches and market moves',
      'Hiring trend surges indicating strategic shifts',
      'Social media sentiment monitoring and executive posts',
    ],
    deliveryNote: '24/7 monitoring across thousands of public data sources.',
  },
  {
    badge: 'PRISM Sync™',
    tag: 'Automated CRM Logging',
    icon: Database,
    color: 'from-emerald-500 to-emerald-700',
    bgLight: 'bg-emerald-50',
    borderLight: 'border-emerald-100',
    textLight: 'text-emerald-600',
    ringColor: 'ring-emerald-500/20',
    headline: 'Eliminate manual data entry. Forever.',
    description:
      'Listens to meeting recordings and transcripts, extracts action items, decisions, and next steps, then writes structured notes directly into your CRM — eliminating manual data entry and ensuring your pipeline data stays accurate.',
    capabilities: [
      'Automatic action item extraction and owner assignment',
      'Decision and commitment tracking across meetings',
      'Next steps logged directly into Salesforce or HubSpot',
      'Follow-up reminders generated from conversation context',
      'Deal stage updates based on conversation signals',
      'Multi-participant attribution in meeting notes',
    ],
    deliveryNote: 'Native integrations with Salesforce, HubSpot, Pipedrive, and more.',
  },
  {
    badge: 'PRISM Lens™',
    tag: 'Deal & Team Analytics',
    icon: BarChart3,
    color: 'from-amber-500 to-amber-700',
    bgLight: 'bg-amber-50',
    borderLight: 'border-amber-100',
    textLight: 'text-amber-600',
    ringColor: 'ring-amber-500/20',
    headline: 'Spot risks and opportunities before they surface.',
    description:
      'Surfaces patterns across your deal portfolio: which accounts are drifting, which reps are most prepared, and where deals are most likely to stall. Gives sales managers a single view of team readiness and pipeline health.',
    capabilities: [
      'Deal drift detection with early warning signals',
      'Pipeline health scoring across the full funnel',
      'Rep-level meeting preparation scoring',
      'Account engagement heatmaps and activity timelines',
      'Win/loss pattern analysis by segment and industry',
      'Forecast accuracy improvement through AI scoring',
    ],
    deliveryNote: 'A single-pane view for sales managers across the entire team.',
  },
  {
    badge: 'PRISM Coach™',
    tag: 'AI-Assisted Coaching',
    icon: GraduationCap,
    color: 'from-sky-500 to-sky-700',
    bgLight: 'bg-sky-50',
    borderLight: 'border-sky-100',
    textLight: 'text-sky-600',
    ringColor: 'ring-sky-500/20',
    headline: 'Turn every meeting into a learning opportunity.',
    description:
      'Analyses meeting transcripts to identify talk-time ratios, key objections raised, questions asked, and outcomes. Provides per-rep coaching suggestions and highlights best practices from top performers within your team.',
    capabilities: [
      'Talk-time ratio analysis and monologue detection',
      'Objection pattern tracking across accounts',
      'Question quality scoring and discovery effectiveness',
      'Top performer playbook extraction and sharing',
      'Personalized per-rep coaching nudges and tips',
      'Meeting outcome correlation with preparation scores',
    ],
    deliveryNote: 'Scales coaching across the entire team without adding headcount.',
  },
];

const integrations = [
  { name: 'Salesforce', type: 'CRM' },
  { name: 'HubSpot', type: 'CRM' },
  { name: 'Google Calendar', type: 'Calendar' },
  { name: 'Microsoft Outlook', type: 'Calendar' },
  { name: 'Google Meet', type: 'Meetings' },
  { name: 'Microsoft Teams', type: 'Meetings' },
  { name: 'Zoom', type: 'Meetings' },
  { name: 'LinkedIn', type: 'Social' },
  { name: 'Slack', type: 'Notifications' },
  { name: 'Pipedrive', type: 'CRM' },
];

const platformCapabilities = [
  { icon: Globe, title: 'Multi-source Intelligence', desc: 'Aggregates data from 50+ public and proprietary sources in real time.' },
  { icon: Shield, title: 'Enterprise-Grade Security', desc: 'SOC 2 compliant infrastructure with end-to-end encryption at rest and in transit.' },
  { icon: Zap, title: 'Sub-60s Brief Generation', desc: 'From calendar trigger to complete briefing in under 60 seconds — always on time.' },
  { icon: Brain, title: 'Contextual AI Memory', desc: 'Builds an evolving knowledge graph of each account, contact, and deal over time.' },
  { icon: RefreshCw, title: 'Always-Fresh Data', desc: 'Continuous background refresh ensures your intelligence is never stale.' },
  { icon: Lock, title: 'Zero Data Selling', desc: 'Your data and your customers\' data are never sold or shared with third parties.' },
  { icon: FileText, title: 'PDF & Web Export', desc: 'Export any brief as a polished PDF or share a secure web link with a teammate.' },
  { icon: Layers, title: 'API Access', desc: 'Full REST API for custom integrations and enterprise workflow automation.' },
];

const comparisonRows = [
  { feature: 'Pre-meeting AI Briefs', manual: false, prism: true },
  { feature: 'Real-time Account Monitoring', manual: false, prism: true },
  { feature: 'Automated CRM Logging', manual: false, prism: true },
  { feature: 'Meeting Coaching Insights', manual: false, prism: true },
  { feature: 'Stakeholder Sentiment Analysis', manual: false, prism: true },
  { feature: 'Multi-source Data Aggregation', manual: false, prism: true },
  { feature: 'Average Research Time', manual: '3–4 hours/week', prism: '< 5 minutes' },
  { feature: 'CRM Data Accuracy', manual: '60–70%', prism: '95%+' },
];

export function FeaturesPage() {
  return (
    <div className="bg-[#f8fafc] text-[#0f172a] min-h-screen font-sans">
      <SharedHeader />

      {/* Hero */}
      <section className="relative py-20 px-6 md:px-12 max-w-5xl mx-auto text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-red-50/70 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100/80 mb-6 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
            <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider">Platform Capabilities</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.1] mb-6">
            Five Modules.{' '}
            <span className="bg-gradient-to-r from-red-600 to-red-800 text-transparent bg-clip-text">
              One Platform.
            </span>
            <br />Full Meeting Lifecycle.
          </h1>
          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            PRISM is structured around five intelligent modules that work together across the full
            meeting lifecycle — from preparation through to post-meeting follow-up.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md shadow-red-600/20 text-sm flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <span>Start Free Trial</span>
              <Sparkles className="w-4 h-4" />
            </Link>
            <Link
              to="/pricing"
              className="px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl border border-slate-200 text-sm flex items-center justify-center gap-2 transition-all hover:border-slate-300"
            >
              <span>View Pricing</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Module Navigation Pills */}
      <div className="px-6 md:px-12 pb-4">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-2 justify-center">
          {coreModules.map((m, i) => (
            <a
              key={i}
              href={`#module-${i}`}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition-all hover:scale-105 ${m.bgLight} ${m.borderLight} ${m.textLight}`}
            >
              {m.badge}
            </a>
          ))}
        </div>
      </div>

      {/* Core Modules */}
      <section className="py-10 px-6 md:px-12">
        <div className="max-w-5xl mx-auto space-y-10">
          {coreModules.map((module, i) => (
            <div
              key={i}
              id={`module-${i}`}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-slate-300 hover:shadow-xl transition-all duration-300 scroll-mt-20"
            >
              {/* Module Header Bar */}
              <div className={`bg-gradient-to-r ${module.color} px-8 py-6 text-white`}>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center">
                      <module.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-lg font-black tracking-tight">{module.badge}</span>
                        <span className="text-[10px] font-bold bg-white/20 border border-white/25 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {module.tag}
                        </span>
                      </div>
                      <p className="text-sm text-white/80 font-semibold">{module.headline}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-white/15 border border-white/20 px-3 py-1.5 rounded-full">
                    {module.deliveryNote}
                  </span>
                </div>
              </div>

              {/* Module Body */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Description */}
                <div>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium mb-6">
                    {module.description}
                  </p>
                  <Link
                    to="/signup"
                    className={`inline-flex items-center gap-1.5 text-xs font-bold ${module.textLight} hover:opacity-80 transition-opacity group`}
                  >
                    <span>Get early access</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

                {/* Capabilities */}
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-3">
                    What it does
                  </span>
                  <ul className="space-y-2">
                    {module.capabilities.map((cap, j) => (
                      <li key={j} className="flex items-start gap-2.5">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${module.textLight}`} />
                        <span className="text-xs text-slate-700 font-semibold leading-relaxed">{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Platform-Wide Capabilities */}
      <section className="py-20 px-6 md:px-12 bg-white border-y border-slate-200/80">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest block mb-3">Under The Hood</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
              Built for enterprise. Ready on day one.
            </h2>
            <p className="text-slate-500 text-sm font-medium max-w-xl mx-auto leading-relaxed">
              Every module is powered by a shared intelligence layer that aggregates, verifies, and
              continuously refreshes data across your entire account portfolio.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {platformCapabilities.map((cap, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 hover:border-red-200 hover:shadow-md transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 mb-4 group-hover:scale-110 transition-transform">
                  <cap.icon className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-xs font-extrabold text-slate-900 mb-1.5">{cap.title}</h3>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Strip */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest block mb-3">Integrations</span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">Works with your existing stack.</h2>
            <p className="text-slate-500 text-sm font-medium mt-2">
              One-click connections. No engineers required.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {integrations.map((int, i) => (
              <div key={i} className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl hover:border-red-200 hover:shadow-sm transition-all">
                <span className="text-xs font-extrabold text-slate-800">{int.name}</span>
                <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full uppercase">{int.type}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl">
              <span className="text-xs font-extrabold text-red-600">+ More via API</span>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-6 md:px-12 bg-white border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest block mb-3">Why PRISM</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">PRISM vs. manual research</h2>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200 px-6 py-3">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Capability</span>
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider text-center">Manual</span>
              <span className="text-xs font-extrabold text-red-600 uppercase tracking-wider text-center">PRISM</span>
            </div>
            {comparisonRows.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-3 px-6 py-4 items-center ${i < comparisonRows.length - 1 ? 'border-b border-slate-100' : ''} hover:bg-slate-50/50 transition-colors`}
              >
                <span className="text-sm font-semibold text-slate-700">{row.feature}</span>
                <div className="flex justify-center">
                  {typeof row.manual === 'boolean' ? (
                    row.manual
                      ? <Check className="w-4 h-4 text-green-500" />
                      : <span className="w-4 h-0.5 bg-slate-300 rounded-full" />
                  ) : (
                    <span className="text-xs font-bold text-slate-500">{row.manual}</span>
                  )}
                </div>
                <div className="flex justify-center">
                  {typeof row.prism === 'boolean' ? (
                    row.prism
                      ? <Check className="w-4 h-4 text-red-600" />
                      : <span className="w-4 h-0.5 bg-slate-300 rounded-full" />
                  ) : (
                    <span className="text-xs font-black text-red-600">{row.prism}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works — The Intelligence Layer */}
      <section className="py-20 px-6 md:px-12 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-extrabold text-red-400 uppercase tracking-widest block mb-3">The Intelligence Layer</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
              How PRISM generates intelligence
            </h2>
            <p className="text-slate-400 text-sm font-medium max-w-xl mx-auto leading-relaxed">
              Behind every brief is a multi-agent AI pipeline that works around the clock,
              so you never have to.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { icon: Calendar, step: '01', title: 'Calendar Trigger', desc: 'A new meeting is detected via your connected calendar or CRM.' },
              { icon: Globe, step: '02', title: 'Data Aggregation', desc: 'AI agents query 50+ live sources: news, filings, social, CRM, LinkedIn.' },
              { icon: Brain, step: '03', title: 'Intelligence Synthesis', desc: 'LLMs distill raw data into structured, prioritized, contextual insights.' },
              { icon: Target, step: '04', title: 'Brief Delivery', desc: 'A polished brief lands in your inbox, CRM, or Slack — 30 minutes before go-time.' },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 h-full hover:border-red-500/40 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-black text-red-400 font-mono">{step.step}</span>
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                      <step.icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-sm font-extrabold text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">{step.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:flex absolute top-1/2 -right-2 -translate-y-1/2 z-10 w-4 h-4 items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-14 px-6 md:px-12 bg-white border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '< 60s', label: 'Brief generation time' },
            { value: '50+', label: 'Live data sources' },
            { value: '95%+', label: 'CRM data accuracy' },
            { value: '3–4 hrs', label: 'Saved per rep per week' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-3xl md:text-4xl font-black text-slate-900 mb-1">{stat.value}</div>
              <div className="text-xs font-semibold text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-red-600 to-red-800 text-white rounded-3xl p-10 md:p-16 text-center relative overflow-hidden shadow-xl shadow-red-700/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent)] pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
                Ready to see PRISM in action?
              </h2>
              <p className="text-red-100/90 text-sm max-w-xl mx-auto leading-relaxed mb-8">
                Join sales teams already using PRISM to walk into every meeting prepared, informed,
                and confident. Start your free trial — no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/signup"
                  className="px-8 py-4 bg-white hover:bg-slate-50 text-red-700 font-extrabold text-sm rounded-xl transition-all hover:scale-105 shadow-md shadow-red-950/20 flex items-center justify-center gap-2"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4 text-red-600" />
                </Link>
                <Link
                  to="/contact"
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>Request a Demo</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SharedFooter />
    </div>
  );
}
