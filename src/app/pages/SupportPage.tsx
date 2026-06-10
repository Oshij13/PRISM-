import { useState } from 'react';
import { Link } from 'react-router';
import {
  ArrowRight,
  LifeBuoy,
  Mail,
  MessageSquare,
  Phone,
  Clock,
  BookOpen,
  Video,
  FileText,
  Code,
  Search,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Zap,
  Users,
  Building,
  Star,
  AlertCircle,
  Send,
  ExternalLink,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

import { SharedHeader, SharedFooter } from '../components/SharedPageLayout';

const supportTiers = [
  {
    plan: 'Essential',
    icon: Users,
    color: 'border-slate-200',
    headerBg: 'bg-slate-50',
    iconBg: 'bg-slate-100 text-slate-600',
    responseTime: '24 hours',
    responseColor: 'text-slate-600',
    channels: ['Email only'],
    csm: false,
    onboarding: 'Self-serve docs',
    highlight: false,
  },
  {
    plan: 'Pro',
    icon: Sparkles,
    color: 'border-red-600 ring-1 ring-red-600/10',
    headerBg: 'bg-red-50',
    iconBg: 'bg-red-100 text-red-600',
    responseTime: '8 hours',
    responseColor: 'text-red-600',
    channels: ['Email', 'Live Chat'],
    csm: false,
    onboarding: 'Guided setup call',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    plan: 'Enterprise',
    icon: Building,
    color: 'border-slate-200',
    headerBg: 'bg-slate-900',
    iconBg: 'bg-white/10 text-white',
    responseTime: '1 hour',
    responseColor: 'text-emerald-400',
    channels: ['Email', 'Chat', 'Phone'],
    csm: true,
    onboarding: 'Custom onboarding program',
    highlight: false,
    dark: true,
  },
];

const helpCentreResources = [
  {
    icon: BookOpen,
    title: 'Setup Guides',
    desc: 'Step-by-step walkthroughs for connecting your calendar, CRM, and configuring your first meeting brief.',
    tag: '40+ articles',
    color: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  {
    icon: Zap,
    title: 'Integration Walkthroughs',
    desc: 'Detailed instructions for Salesforce, HubSpot, Google Calendar, Outlook, Zoom, and all supported integrations.',
    tag: '20+ guides',
    color: 'bg-violet-50 text-violet-600 border-violet-100',
  },
  {
    icon: Code,
    title: 'API Documentation',
    desc: 'Full REST API reference with code samples in Python, JavaScript, and cURL. Includes authentication, rate limits, and webhooks.',
    tag: 'Developer docs',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  {
    icon: Video,
    title: 'Video Tutorials',
    desc: 'Short, focused video walkthroughs covering every major feature — from brief generation to team analytics.',
    tag: '15+ videos',
    color: 'bg-red-50 text-red-600 border-red-100',
  },
  {
    icon: Search,
    title: 'Searchable Knowledge Base',
    desc: 'Every PRISM module covered in detail. Search by keyword, filter by plan tier, or browse by feature category.',
    tag: 'All modules',
    color: 'bg-amber-50 text-amber-600 border-amber-100',
  },
  {
    icon: FileText,
    title: 'Release Notes',
    desc: 'Up-to-date changelog for every product release. The Help Centre is updated with every new deployment.',
    tag: 'Always current',
    color: 'bg-sky-50 text-sky-600 border-sky-100',
  },
];

const reportingSteps = [
  {
    step: '01',
    icon: AlertCircle,
    title: 'Identify the issue',
    desc: 'Note the feature affected, what you expected to happen, and what actually occurred.',
  },
  {
    step: '02',
    icon: FileText,
    title: 'Gather details',
    desc: 'Have your account ID ready, along with any error messages, screenshots, or reproduction steps.',
  },
  {
    step: '03',
    icon: Send,
    title: 'Submit your report',
    desc: 'Use the in-product ❓ icon in the top nav bar, or email support@prism.ai directly.',
  },
  {
    step: '04',
    icon: CheckCircle,
    title: 'Receive acknowledgment',
    desc: 'All tickets receive a confirmation within your plan\'s SLA. We keep you updated through resolution.',
  },
];

const faqs = [
  {
    q: 'How do I submit a support ticket?',
    a: 'You can submit a ticket directly from inside the PRISM platform by clicking the ❓ icon in the top navigation bar. Alternatively, email support@prism.ai with your account ID, a description of the issue, and reproduction steps where applicable.',
  },
  {
    q: 'What counts toward my response time SLA?',
    a: 'Response time SLAs apply to business hours (9 AM – 6 PM IST, Monday to Friday) for Essential and Pro plans. Enterprise customers receive 24/7 coverage including weekends and public holidays.',
  },
  {
    q: 'How do I access the Help Centre?',
    a: 'The Help Centre is publicly available at help.prism.ai. No login required. Pro and Enterprise customers also have access to gated documentation covering advanced configurations and API references.',
  },
  {
    q: 'Can I escalate a critical issue?',
    a: 'Enterprise customers can escalate critical (P1) incidents directly to their Dedicated Customer Success Manager via phone or a private Slack channel. Pro customers can escalate via priority email with the subject line prefixed [URGENT].',
  },
  {
    q: 'What does the Guided Setup Call include for Pro?',
    a: 'The guided setup call is a 60-minute onboarding session with a PRISM implementation specialist covering CRM integration, calendar connection, user provisioning, and walkthrough of your first AI brief generation.',
  },
  {
    q: 'What does the Custom Onboarding Program include for Enterprise?',
    a: 'Enterprise onboarding is a fully customized multi-session program covering technical setup, SSO configuration, admin training, team rollout planning, and a dedicated success milestone review at 30, 60, and 90 days.',
  },
  {
    q: 'Is there a community forum or user group?',
    a: 'We are building a PRISM user community. Enterprise customers are invited to a private early-access community channel. Sign up at prism.ai/community to be notified when community access opens to all users.',
  },
];

export function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="bg-[#f8fafc] text-[#0f172a] min-h-screen font-sans">
      <SharedHeader />

      {/* Hero */}
      <section className="relative py-20 px-6 md:px-12 max-w-5xl mx-auto text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-red-50/70 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100/80 mb-6">
            <LifeBuoy className="w-3.5 h-3.5 text-red-600" />
            <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider">Support Centre</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.1] mb-6">
            We're here{' '}
            <span className="bg-gradient-to-r from-red-600 to-red-800 text-transparent bg-clip-text">
              when you need us.
            </span>
          </h1>
          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            From self-serve documentation to a dedicated Customer Success Manager, PRISM provides
            the level of support your team needs — at every stage of your journey.
          </p>

          {/* Search Bar (Visual) */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search the Help Centre — e.g. 'CRM setup', 'API key', 'billing'…"
              className="w-full pl-11 pr-32 py-3.5 text-sm border border-slate-200 rounded-2xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium shadow-sm"
            />
            <a
              href="https://help.prism.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
            >
              Search <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-3">
            Full Help Centre available at{' '}
            <a href="https://help.prism.ai" target="_blank" rel="noopener noreferrer"
              className="text-red-600 font-bold hover:underline">help.prism.ai</a>
          </p>
        </div>
      </section>

      {/* Quick Contact Cards */}
      <section className="pb-12 px-6 md:px-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: Mail,
              title: 'Email Support',
              desc: 'Available on all plans. Send your query and account ID for the fastest resolution.',
              action: 'support@prism.ai',
              href: 'mailto:support@prism.ai',
              color: 'bg-red-50 text-red-600 border-red-100',
              border: 'hover:border-red-200',
              plans: 'All plans',
            },
            {
              icon: MessageSquare,
              title: 'Live Chat',
              desc: 'Real-time chat support through the in-product messenger. Available during business hours.',
              action: 'Open Chat',
              href: '#',
              color: 'bg-violet-50 text-violet-600 border-violet-100',
              border: 'hover:border-violet-200',
              plans: 'Pro & Enterprise',
            },
            {
              icon: Phone,
              title: 'Phone Support',
              desc: '24/7 direct phone support with guaranteed 1-hour response for critical issues.',
              action: 'Enterprise only',
              href: '/contact',
              color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
              border: 'hover:border-emerald-200',
              plans: 'Enterprise only',
            },
          ].map((card, i) => (
            <div key={i} className={`bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 hover:shadow-md ${card.border}`}>
              <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-extrabold text-slate-900">{card.title}</h3>
                  <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase">{card.plans}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{card.desc}</p>
              </div>
              <a
                href={card.href}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition-colors group"
              >
                <span>{card.action}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Support Tiers */}
      <section className="py-16 px-6 md:px-12 bg-white border-y border-slate-200/80">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest block mb-3">Support Plans</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
              Tiered support for every team size.
            </h2>
            <p className="text-slate-500 text-sm font-medium max-w-xl mx-auto leading-relaxed">
              PRISM offers support tiers matched to the needs of organisations at different scales.
              All plans include our self-serve Help Centre.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportTiers.map((tier, i) => (
              <div
                key={i}
                className={`rounded-2xl border-2 overflow-hidden flex flex-col relative transition-all hover:shadow-xl ${tier.color} ${tier.highlight ? 'md:-translate-y-2' : ''}`}
              >
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[10px] font-black bg-red-600 text-white px-3 py-1 rounded-full uppercase tracking-wider">
                    {tier.badge}
                  </div>
                )}
                {/* Card Header */}
                <div className={`px-6 py-5 flex items-center gap-3 ${tier.dark ? 'bg-slate-900' : tier.headerBg}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tier.iconBg}`}>
                    <tier.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`text-base font-extrabold ${tier.dark ? 'text-white' : 'text-slate-900'}`}>{tier.plan}</h3>
                    <div className={`flex items-center gap-1 mt-0.5`}>
                      <Clock className={`w-3 h-3 ${tier.dark ? 'text-slate-400' : 'text-slate-400'}`} />
                      <span className={`text-xs font-bold ${tier.responseColor}`}>{tier.responseTime} response</span>
                    </div>
                  </div>
                </div>
                {/* Card Body */}
                <div className="p-6 flex flex-col gap-5 flex-1 bg-white">
                  {/* Channels */}
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2">Support Channels</span>
                    <div className="flex flex-wrap gap-2">
                      {tier.channels.map((ch) => (
                        <span key={ch} className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                          {ch === 'Email' || ch === 'Email only' ? <Mail className="w-3 h-3" /> : ch === 'Live Chat' ? <MessageSquare className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
                          {ch}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Features */}
                  <div className="space-y-3">
                    {[
                      { label: 'Dedicated CSM', value: tier.csm },
                      { label: 'Onboarding', value: tier.onboarding },
                      { label: 'Help Centre Access', value: 'Full access' },
                      { label: 'In-product issue reporting', value: true },
                    ].map((item, j) => (
                      <div key={j} className="flex items-start justify-between gap-3">
                        <span className="text-xs font-semibold text-slate-600">{item.label}</span>
                        <div className="shrink-0">
                          {typeof item.value === 'boolean' ? (
                            item.value
                              ? <CheckCircle className="w-4 h-4 text-green-500" />
                              : <span className="w-4 h-0.5 bg-slate-200 rounded-full block mt-1.5" />
                          ) : (
                            <span className="text-xs font-bold text-slate-800 text-right">{item.value}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* CTA */}
                  <Link
                    to={tier.plan === 'Enterprise' ? '/contact' : '/signup'}
                    className={`mt-auto w-full py-2.5 px-4 font-bold text-xs rounded-xl transition-all text-center ${
                      tier.highlight
                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20'
                        : tier.dark
                        ? 'bg-slate-900 hover:bg-slate-800 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    {tier.plan === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Centre */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
            <div>
              <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest block mb-3">Self-Serve Help Centre</span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">
                Everything you need, at <a href="https://help.prism.ai" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">help.prism.ai</a>
              </h2>
            </div>
            <a
              href="https://help.prism.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2 shrink-0"
            >
              <span>Visit Help Centre</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {helpCentreResources.map((res, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4 hover:border-slate-300 hover:shadow-md transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${res.color}`}>
                    <res.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-full uppercase tracking-wider">{res.tag}</span>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 mb-1.5">{res.title}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{res.desc}</p>
                </div>
                <div className="mt-auto flex items-center gap-1 text-[11px] font-bold text-slate-400 group-hover:text-red-600 transition-colors">
                  <span>Browse articles</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>

          {/* Help Centre Update Note */}
          <div className="mt-8 bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-green-500 shrink-0 animate-pulse" />
            <p className="text-sm text-slate-600 font-medium">
              <strong className="text-slate-800">Always up to date:</strong> The Help Centre is updated with every product release. Use the{' '}
              <strong className="text-slate-800">Release Notes</strong> section to see what's changed in each version.
            </p>
          </div>
        </div>
      </section>

      {/* Reporting an Issue */}
      <section className="py-20 px-6 md:px-12 bg-white border-y border-slate-200/80">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest block mb-3">Reporting an Issue</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
              How to get the fastest resolution.
            </h2>
            <p className="text-slate-500 text-sm font-medium max-w-xl mx-auto leading-relaxed">
              All support tickets receive an acknowledgment within the response time SLA for your plan.
              Here's how to report an issue effectively:
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-slate-200 z-0" />
            {reportingSteps.map((s, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-white border-2 border-slate-200 flex flex-col items-center justify-center mb-4 shadow-sm">
                  <span className="text-[9px] font-black text-red-500 font-mono">{s.step}</span>
                  <s.icon className="w-6 h-6 text-slate-700 mt-0.5" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 mb-1.5">{s.title}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Two reporting options side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">In-Product Reporting</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
                Click the <strong className="text-slate-700">❓ icon</strong> in the top navigation bar inside
                the PRISM platform. Fill in the quick issue form and submit — your account ID is
                automatically attached so we can look up your context immediately.
              </p>
              <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-700">
                <span>❓</span>
                <span>Available in the top nav bar</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
                  <Mail className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">Email Support</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
                Email <a href="mailto:support@prism.ai" className="text-red-600 font-bold hover:underline">support@prism.ai</a> with
                the following details for the fastest response:
              </p>
              <ul className="space-y-1.5">
                {['Your account ID', 'Brief description of the issue', 'Steps to reproduce (if applicable)', 'Screenshots or error messages'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest block mb-3">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Support questions, answered.</h2>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer gap-4"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="text-sm font-bold text-slate-900">{faq.q}</span>
                  </div>
                  {openFaq === i
                    ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 pt-1 border-t border-slate-100">
                    <p className="text-sm text-slate-600 font-medium leading-relaxed pl-7">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Status + SLA Strip */}
      <section className="py-14 px-6 md:px-12 bg-white border-t border-slate-200/80">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '1 hr', label: 'Enterprise response SLA' },
            { value: '8 hrs', label: 'Pro response SLA' },
            { value: '24 hrs', label: 'Essential response SLA' },
            { value: '99.9%', label: 'Enterprise uptime SLA' },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-3xl md:text-4xl font-black text-slate-900 mb-1">{s.value}</div>
              <div className="text-xs font-semibold text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-red-600 to-red-800 text-white rounded-3xl p-10 md:p-16 text-center relative overflow-hidden shadow-xl shadow-red-700/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent)] pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
                Still have questions?
              </h2>
              <p className="text-red-100/90 text-sm max-w-xl mx-auto leading-relaxed mb-8">
                Our team is always happy to help. Whether you're evaluating PRISM, troubleshooting
                an issue, or planning an enterprise rollout — reach out and we'll get back to you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact"
                  className="px-8 py-4 bg-white hover:bg-slate-50 text-red-700 font-extrabold text-sm rounded-xl transition-all hover:scale-105 shadow-md flex items-center justify-center gap-2">
                  <span>Contact Support</span>
                  <ArrowRight className="w-4 h-4 text-red-600" />
                </Link>
                <a
                  href="https://help.prism.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>Visit Help Centre</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SharedFooter />
    </div>
  );
}
