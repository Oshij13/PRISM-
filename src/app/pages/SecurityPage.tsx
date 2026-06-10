import { Link } from 'react-router';
import {
  ArrowRight,
  Lock,
  Shield,
  Globe,
  Key,
  Users,
  BadgeCheck,
  Brain,
  Activity,
  Server,
  Eye,
  RefreshCw,
  FileText,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Zap,
  Database,
  Clock,
} from 'lucide-react';

import { SharedHeader, SharedFooter } from '../components/SharedPageLayout';

const securityPillars = [
  {
    icon: Lock,
    title: 'Data Encryption',
    subtitle: 'TLS 1.3 in transit · AES-256 at rest',
    color: 'bg-red-50 text-red-600 border-red-100',
    ringColor: 'hover:border-red-200',
  },
  {
    icon: Globe,
    title: 'Data Residency',
    subtitle: 'India-first · US, EU, SG available',
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    ringColor: 'hover:border-blue-200',
  },
  {
    icon: Key,
    title: 'Access Controls',
    subtitle: 'RBAC · SSO · SAML 2.0 · OAuth 2.0',
    color: 'bg-violet-50 text-violet-600 border-violet-100',
    ringColor: 'hover:border-violet-200',
  },
  {
    icon: BadgeCheck,
    title: 'Compliance',
    subtitle: 'GDPR · India PDPB · ISO 27001',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    ringColor: 'hover:border-emerald-200',
  },
  {
    icon: Brain,
    title: 'AI Model Security',
    subtitle: 'No training on customer data · Isolated inference',
    color: 'bg-amber-50 text-amber-600 border-amber-100',
    ringColor: 'hover:border-amber-200',
  },
  {
    icon: Activity,
    title: 'Uptime & Reliability',
    subtitle: '99.9% Enterprise SLA · Live status page',
    color: 'bg-sky-50 text-sky-600 border-sky-100',
    ringColor: 'hover:border-sky-200',
  },
];

export function SecurityPage() {
  return (
    <div className="bg-[#f8fafc] text-[#0f172a] min-h-screen font-sans">
      <SharedHeader />

      {/* Hero */}
      <section className="relative py-20 px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_20%,rgba(220,38,38,0.15),transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_80%,rgba(99,102,241,0.08),transparent_50%)] pointer-events-none" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }}
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
            <Shield className="w-3.5 h-3.5 text-red-400" />
            <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider">Enterprise Security</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
            Security is not a{' '}
            <span className="bg-gradient-to-r from-red-400 to-red-600 text-transparent bg-clip-text">
              feature.
            </span>
            <br />It's our foundation.
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            PRISM is built from the ground up with enterprise-grade security. Your data — and your
            customers' data — is treated with the highest standard of protection at every layer.
          </p>

          {/* Live Status Badge */}
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-xl mb-10">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
              <span className="text-xs font-bold text-green-400">All Systems Operational</span>
            </span>
            <span className="h-4 w-px bg-white/10" />
            <a href="https://status.prism.ai" target="_blank" rel="noopener noreferrer"
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1">
              status.prism.ai <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          {/* Pillar Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {securityPillars.map((p, i) => (
              <a key={i} href={`#section-${i}`}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left hover:bg-white/10 hover:border-white/20 transition-all group">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${p.color}`}>
                  <p.icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-extrabold text-white block mb-0.5">{p.title}</span>
                <span className="text-[10px] font-medium text-slate-500">{p.subtitle}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Section 1: Encryption */}
      <section id="section-0" className="py-20 px-6 md:px-12 scroll-mt-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 mb-5">
              <Lock className="w-3.5 h-3.5 text-red-600" />
              <span className="text-[10px] font-extrabold text-red-700 uppercase tracking-wider">Data Encryption</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-5 leading-tight">
              Military-grade encryption. Always on.
            </h2>
            <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6">
              All data transmitted to and from PRISM is encrypted using <strong className="text-slate-800">TLS 1.3</strong> — the
              most current and secure transport standard. Data at rest is encrypted using
              <strong className="text-slate-800"> AES-256</strong>, the industry benchmark for at-rest encryption.
            </p>
            <p className="text-slate-600 text-sm font-medium leading-relaxed">
              Encryption keys are managed through a dedicated key management service with <strong className="text-slate-800">automatic
              rotation on a 90-day cycle</strong>. No data is ever transmitted in plaintext — at any
              point in our infrastructure.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { icon: Lock, label: 'TLS 1.3 in Transit', desc: 'Latest transport security standard for all API and browser communication.', badge: 'In Transit' },
              { icon: Database, label: 'AES-256 at Rest', desc: 'Military-grade symmetric encryption for all stored customer data.', badge: 'At Rest' },
              { icon: Key, label: 'Automatic Key Rotation', desc: 'Dedicated KMS with automatic 90-day key rotation cycles.', badge: '90-day cycle' },
              { icon: Eye, label: 'Zero Plaintext', desc: 'No customer data is ever transmitted, stored, or logged in plaintext.', badge: 'Always Encrypted' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-white border border-slate-200 rounded-xl p-4 hover:border-red-200 hover:shadow-sm transition-all">
                <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-extrabold text-slate-900">{item.label}</span>
                    <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase">{item.badge}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Data Residency */}
      <section id="section-1" className="py-20 px-6 md:px-12 bg-white border-y border-slate-200/80 scroll-mt-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-5">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider">Data Residency & Sovereignty</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-tight">
              Your data stays where you tell it to.
            </h2>
            <p className="text-slate-600 text-sm font-medium leading-relaxed max-w-2xl mx-auto">
              PRISM stores customer data in <strong className="text-slate-800">India-based cloud infrastructure by default</strong>.
              Each regional tenancy is fully isolated — no data crosses regional boundaries without
              explicit customer authorisation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { region: '🇮🇳  India', note: 'Default', desc: 'Primary data residency. All customers start here unless otherwise configured.', highlight: true },
              { region: '🇺🇸  United States', note: 'Available', desc: 'Dedicated US tenancy for customers with US data residency requirements.', highlight: false },
              { region: '🇪🇺  European Union', note: 'Available', desc: 'GDPR-compliant EU tenancy for European enterprise customers.', highlight: false },
              { region: '🇸🇬  Singapore', note: 'Available', desc: 'APAC tenancy option for customers in Southeast Asia.', highlight: false },
            ].map((r, i) => (
              <div key={i} className={`rounded-2xl border p-5 flex flex-col gap-3 ${r.highlight ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'} hover:shadow-md transition-all`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-slate-900">{r.region}</span>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${r.highlight ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>{r.note}</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-slate-50 border border-slate-200 rounded-2xl p-5 flex gap-4 items-start">
            <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              <strong className="text-slate-800">Logical isolation guarantee:</strong> Each customer tenancy is logically isolated
              at the infrastructure level. Data from one customer account is never co-mingled with or
              accessible by another — by design, not just policy.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Access Controls */}
      <section id="section-2" className="py-20 px-6 md:px-12 scroll-mt-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-100 mb-5">
              <Key className="w-3.5 h-3.5 text-violet-600" />
              <span className="text-[10px] font-extrabold text-violet-700 uppercase tracking-wider">Access Controls</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-5 leading-tight">
              Least-privilege by default.
            </h2>
            <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6">
              PRISM enforces fine-grained access controls across every layer of the platform. From
              team-level permissions to individual deal and account visibility, every action is
              governed by explicit authorisation rules.
            </p>
            <div className="space-y-3">
              {[
                {
                  icon: Users,
                  title: 'Role-Based Access Control (RBAC)',
                  desc: 'Fine-grained permissions at the team, deal, and account level. Admins control who sees what — down to individual records.',
                },
                {
                  icon: Key,
                  title: 'SSO via SAML 2.0 & OAuth 2.0',
                  desc: 'Seamless enterprise SSO integration with your existing identity provider — Okta, Azure AD, Google Workspace, and more.',
                },
                {
                  icon: Clock,
                  title: 'Session Management',
                  desc: 'Automatic session timeout after inactivity. All login and logout events are captured in a tamper-evident audit log.',
                },
                {
                  icon: FileText,
                  title: 'Full Audit Trail',
                  desc: 'Every data access, export, and configuration change is logged with timestamps and user attribution for compliance review.',
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 bg-white border border-slate-200 rounded-xl p-4 hover:border-violet-200 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 shrink-0">
                    <item.icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 block mb-0.5">{item.title}</span>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual Access Model */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-3">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-4">Access Model</span>
            {[
              { role: 'Admin', perms: ['All data', 'User management', 'Billing & SSO config', 'Audit logs'], color: 'bg-red-500' },
              { role: 'Manager', perms: ['Team briefs', 'Deal analytics', 'Rep coaching data', 'Account alerts'], color: 'bg-violet-500' },
              { role: 'Rep', perms: ['Own meeting briefs', 'Assigned accounts', 'Personal coaching', 'CRM sync'], color: 'bg-blue-500' },
              { role: 'Viewer', perms: ['Read-only briefs', 'Shared reports only'], color: 'bg-slate-500' },
            ].map((r, i) => (
              <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className={`w-2 h-2 rounded-full ${r.color} shrink-0`} />
                  <span className="text-xs font-extrabold text-white">{r.role}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {r.perms.map((p) => (
                    <span key={p} className="text-[10px] font-bold bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Compliance */}
      <section id="section-3" className="py-20 px-6 md:px-12 bg-white border-y border-slate-200/80 scroll-mt-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-5">
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">Compliance</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
              Built for regulated industries.
            </h2>
            <p className="text-slate-600 text-sm font-medium max-w-xl mx-auto leading-relaxed">
              PRISM is designed from the ground up with compliance in mind — not bolted on as an afterthought.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                badge: 'GDPR',
                title: 'General Data Protection Regulation',
                desc: 'PRISM is designed with data minimisation and purpose limitation principles at its core. Customers can export or permanently delete their data at any time via the settings panel — no support ticket required.',
                items: ['Right to access', 'Right to erasure', 'Data portability', 'Consent management'],
                color: 'border-emerald-200 bg-emerald-50/30',
                badgeColor: 'bg-emerald-600 text-white',
              },
              {
                badge: 'India PDPB',
                title: 'Personal Data Protection Bill',
                desc: 'Compliant with applicable obligations for digital fiduciaries under India\'s Personal Data Protection Bill — including notice requirements, data localisation, and consent frameworks.',
                items: ['Data localisation', 'Digital fiduciary duties', 'Consent frameworks', 'Grievance redressal'],
                color: 'border-orange-200 bg-orange-50/20',
                badgeColor: 'bg-orange-600 text-white',
              },
              {
                badge: 'ISO 27001',
                title: 'Information Security Management',
                desc: 'PRISM\'s information security management practices are aligned to ISO 27001 controls — covering risk assessment, asset management, incident response, and business continuity.',
                items: ['Risk assessment', 'Asset management', 'Incident response', 'Business continuity'],
                color: 'border-blue-200 bg-blue-50/20',
                badgeColor: 'bg-blue-600 text-white',
              },
            ].map((cert, i) => (
              <div key={i} className={`rounded-2xl border p-6 flex flex-col gap-4 ${cert.color}`}>
                <div>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full inline-block mb-3 ${cert.badgeColor}`}>
                    {cert.badge}
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900 mb-2">{cert.title}</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{cert.desc}</p>
                </div>
                <ul className="space-y-1.5 mt-auto">
                  {cert.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex gap-4 items-start">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              <strong className="text-slate-800">Compliance is a continuous process.</strong> PRISM undergoes periodic third-party
              security assessments and penetration tests. Results are shared with Enterprise customers
              under NDA upon request. Contact <a href="mailto:security@prism.ai" className="text-red-600 font-bold hover:underline">security@prism.ai</a> for our latest security report.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: AI Model Security */}
      <section id="section-4" className="py-20 px-6 md:px-12 scroll-mt-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Visual */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-4">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">AI Security Architecture</span>
            {[
              { label: 'Customer Meeting Data', flow: 'Stays in your tenancy', icon: Database, color: 'text-blue-400' },
              { label: 'CRM Records', flow: 'Never leaves your environment', icon: Server, color: 'text-violet-400' },
              { label: 'Generated Briefs', flow: 'Customer-owned, audit-logged', icon: FileText, color: 'text-emerald-400' },
              { label: 'Model Inference', flow: 'Isolated compute environment', icon: Brain, color: 'text-amber-400' },
              { label: 'Shared AI Models', flow: 'Zero customer data used for training', icon: Shield, color: 'text-red-400' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-xl p-3.5">
                <item.icon className={`w-4 h-4 shrink-0 ${item.color}`} />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-extrabold text-white block">{item.label}</span>
                  <span className="text-[10px] font-medium text-slate-400">{item.flow}</span>
                </div>
                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
              </div>
            ))}
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 mb-5">
              <Brain className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider">AI & Model Security</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-5 leading-tight">
              Your data never trains our models.
            </h2>
            <div className="space-y-4 text-sm text-slate-600 font-medium leading-relaxed">
              <p>
                PRISM AI models <strong className="text-slate-800">do not train on customer data</strong>. Meeting
                transcripts, CRM records, and generated briefs remain the exclusive property of the customer.
              </p>
              <p>
                Model inference is performed in <strong className="text-slate-800">isolated compute environments</strong>
                — your data never mingles with another customer's requests at the inference layer.
              </p>
              <p>
                Outputs are logged for audit purposes but are <strong className="text-slate-800">not used to improve shared
                models without explicit opt-in</strong>. This is an active choice — not a default you need to opt out of.
              </p>
            </div>
            <div className="mt-6 bg-amber-50 border border-amber-100 rounded-xl p-4">
              <p className="text-sm text-amber-800 font-bold">
                ✓ No customer data is used for model training — ever — without explicit written consent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Uptime & Reliability */}
      <section id="section-5" className="py-20 px-6 md:px-12 bg-white border-t border-slate-200/80 scroll-mt-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 mb-5">
              <Activity className="w-3.5 h-3.5 text-sky-600" />
              <span className="text-[10px] font-extrabold text-sky-700 uppercase tracking-wider">Uptime & Reliability</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
              Always on when you need it most.
            </h2>
            <p className="text-slate-500 text-sm font-medium max-w-xl mx-auto leading-relaxed">
              PRISM is built on resilient, multi-zone cloud infrastructure with automated failover
              and continuous health monitoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { plan: 'Essential', sla: '99.5%', minutes: '~3.6 hrs', color: 'border-slate-200', badge: '' },
              { plan: 'Pro', sla: '99.5%', minutes: '~3.6 hrs', color: 'border-slate-200', badge: '' },
              { plan: 'Enterprise', sla: '99.9%', minutes: '~43 mins', color: 'border-red-600 ring-1 ring-red-600/20', badge: 'Best SLA' },
            ].map((p, i) => (
              <div key={i} className={`bg-white border rounded-2xl p-6 text-center relative ${p.color}`}>
                {p.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-black bg-red-600 text-white px-3 py-0.5 rounded-full uppercase tracking-wider">
                    {p.badge}
                  </span>
                )}
                <span className="text-xs font-extrabold text-slate-500 block mb-2">{p.plan} Plan</span>
                <div className="text-4xl font-black text-slate-900 mb-1">{p.sla}</div>
                <span className="text-[11px] font-semibold text-slate-500">SLA Uptime Guarantee</span>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400">Max downtime / year: {p.minutes}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { icon: Zap, title: 'Multi-Zone Redundancy', desc: 'All production services run across multiple availability zones. Single-zone failures trigger automatic failover with no customer impact.' },
              { icon: Activity, title: 'Continuous Health Monitoring', desc: 'Real-time monitoring with automated alerting. Our on-call team is notified within 60 seconds of any service degradation.' },
              { icon: RefreshCw, title: 'Zero-Downtime Deployments', desc: 'All software updates are deployed using blue-green or rolling deployment strategies — never during peak hours.' },
              { icon: FileText, title: 'Transparent Status Reporting', desc: 'System status, incident history, and maintenance windows are published publicly at status.prism.ai — always up to date.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 bg-slate-50 border border-slate-200 rounded-xl p-5 hover:border-sky-200 transition-all">
                <div className="w-9 h-9 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                  <item.icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vulnerability Disclosure */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-5xl mx-auto bg-slate-900 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Responsible Disclosure</span>
            </div>
            <h3 className="text-lg font-extrabold text-white mb-2">Found a security vulnerability?</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-md">
              We take all security reports seriously. If you've discovered a potential security issue
              in PRISM, please report it responsibly to our security team. We commit to acknowledging
              your report within 24 hours and keeping you updated through remediation.
            </p>
          </div>
          <div className="flex flex-col gap-3 shrink-0">
            <a
              href="mailto:security@prism.ai"
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-colors flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>security@prism.ai</span>
            </a>
            <span className="text-[10px] text-slate-500 font-medium text-center">PGP key available on request</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-red-600 to-red-800 text-white rounded-3xl p-10 md:p-14 text-center relative overflow-hidden shadow-xl shadow-red-700/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent)] pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
                Security you can rely on. Intelligence you can trust.
              </h2>
              <p className="text-red-100/90 text-sm max-w-xl mx-auto leading-relaxed mb-8">
                PRISM was built for enterprises that take data protection seriously. Start your
                14-day free trial or talk to our team about an enterprise deployment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup"
                  className="px-8 py-4 bg-white hover:bg-slate-50 text-red-700 font-extrabold text-sm rounded-xl transition-all hover:scale-105 shadow-md flex items-center justify-center gap-2">
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-4 h-4 text-red-600" />
                </Link>
                <Link to="/contact"
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2">
                  <span>Talk to Security Team</span>
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
