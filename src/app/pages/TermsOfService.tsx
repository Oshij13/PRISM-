import { useState } from 'react';
import { Link } from 'react-router';
import {
  ArrowRight,
  FileText,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Calendar,
  Cpu,
  Copyright,
  FolderOpen,
  CreditCard,
  WifiOff,
  AlertTriangle,
  Umbrella,
  XCircle,
  Lock,
  Scale,
  RefreshCw,
  Mail,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import { SharedHeader, SharedFooter } from '../components/SharedPageLayout';

const sections = [
  {
    number: '01',
    icon: FileText,
    title: 'Acceptance of Terms',
    color: 'bg-red-50 text-red-600 border-red-100',
    content: (
      <div className="space-y-3">
        <p className="text-sm text-slate-600 leading-relaxed font-medium">
          By accessing, browsing, or using the PRISM platform (the "Service"), you acknowledge that
          you have read, understood, and agree to be bound by these Terms of Service ("Terms").
        </p>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-800 font-semibold leading-relaxed">
            If you do not agree to these Terms, you must immediately discontinue your use of the
            platform. Your continued use of PRISM constitutes ongoing acceptance of these Terms.
          </p>
        </div>
      </div>
    ),
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'Description of Services',
    color: 'bg-violet-50 text-violet-600 border-violet-100',
    content: (
      <div className="space-y-3">
        <p className="text-sm text-slate-600 leading-relaxed font-medium">
          PRISM provides a suite of AI-powered tools designed to help sales professionals prepare for
          meetings more effectively. Our core services include:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { label: 'AI Meeting Intelligence', desc: 'Automated briefings generated before every meeting.' },
            { label: 'Stakeholder Research', desc: 'Executive profiles, bios, and LinkedIn activity analysis.' },
            { label: 'Company Analysis', desc: 'Financial signals, news monitoring, and market intelligence.' },
            { label: 'Presentation Generation', desc: 'AI-generated talking points and meeting summaries.' },
          ].map((item, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex gap-2.5">
              <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">{i + 1}</span>
              <div>
                <span className="text-xs font-extrabold text-slate-800 block">{item.label}</span>
                <span className="text-[11px] text-slate-500 font-medium">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    number: '03',
    icon: UserCheck,
    title: 'Eligibility',
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    content: (
      <div className="space-y-3">
        <p className="text-sm text-slate-600 leading-relaxed font-medium">
          To access and use PRISM, you must meet the following eligibility requirements:
        </p>
        <div className="space-y-2">
          {[
            'You must be at least 18 years of age.',
            'You must have the legal authority to enter into binding agreements on behalf of yourself or your organization.',
            'You must be authorized by your organization to use the platform if accessing under a corporate account.',
            'Your use must comply with all applicable local, national, and international laws and regulations.',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span className="text-sm text-slate-600 font-medium leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    number: '04',
    icon: ShieldCheck,
    title: 'User Responsibilities',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    content: (
      <div className="space-y-3">
        <p className="text-sm text-slate-600 leading-relaxed font-medium">As a user of PRISM, you are responsible for:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            'Maintaining the confidentiality and security of your account credentials.',
            'All activities that occur under your account, whether authorized or unauthorized.',
            'Using the platform in a lawful manner consistent with all applicable regulations.',
            'Ensuring the accuracy of information you provide to the platform.',
            'Not attempting to circumvent or interfere with the platform\'s security measures.',
            'Promptly notifying PRISM of any unauthorized use or security breach.',
          ].map((item, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
              <span className="text-[11px] text-slate-600 font-medium leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    number: '05',
    icon: Calendar,
    title: 'Calendar and Third-Party Integrations',
    color: 'bg-sky-50 text-sky-600 border-sky-100',
    content: (
      <div className="space-y-3">
        <p className="text-sm text-slate-600 leading-relaxed font-medium">
          By connecting third-party services (such as Google Calendar, Microsoft Outlook, Salesforce,
          or HubSpot) to PRISM, you explicitly authorize PRISM to:
        </p>
        <ul className="space-y-2">
          {[
            'Access calendar events, meeting schedules, and attendee information required to generate meeting briefs.',
            'Retrieve contact and account data from connected CRM systems to enrich stakeholder profiles.',
            'Use integration data solely for the purpose of providing and improving our services.',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0 mt-1.5" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-xs text-slate-500 font-medium bg-sky-50 border border-sky-100 rounded-xl p-3">
          Third-party service integrations are subject to those providers' own terms of service and privacy policies.
        </p>
      </div>
    ),
  },
  {
    number: '06',
    icon: Cpu,
    title: 'AI-Generated Content',
    color: 'bg-amber-50 text-amber-600 border-amber-100',
    content: (
      <div className="space-y-3">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 font-semibold leading-relaxed">
            All content generated by PRISM's AI systems — including meeting briefs, stakeholder
            insights, company summaries, and talking points — is provided for informational purposes
            only and should be independently validated before being relied upon for critical
            business decisions.
          </p>
        </div>
        <p className="text-sm text-slate-600 font-medium leading-relaxed">
          PRISM makes no warranties regarding the accuracy, completeness, or timeliness of
          AI-generated outputs. The dynamic nature of business data means information may not
          always be current or fully accurate.
        </p>
      </div>
    ),
  },
  {
    number: '07',
    icon: Copyright,
    title: 'Intellectual Property',
    color: 'bg-red-50 text-red-600 border-red-100',
    content: (
      <div className="space-y-3">
        <p className="text-sm text-slate-600 leading-relaxed font-medium">
          All intellectual property rights in and to the PRISM platform — including but not limited to:
        </p>
        <div className="flex flex-wrap gap-2">
          {['Software & Code', 'Brand Identity & Logos', 'User Interfaces & Design', 'AI Models & Algorithms', 'Documentation', 'Marketing Materials'].map((tag) => (
            <span key={tag} className="text-xs font-bold bg-red-50 text-red-700 border border-red-100 px-3 py-1.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <p className="text-sm text-slate-600 font-medium leading-relaxed">
          — are and shall remain the exclusive property of PRISM Technologies. Nothing in these Terms
          grants you any right, title, or license to PRISM's intellectual property beyond the limited
          right to use the platform as expressly permitted herein.
        </p>
      </div>
    ),
  },
  {
    number: '08',
    icon: FolderOpen,
    title: 'User Content Ownership',
    color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    content: (
      <div className="space-y-3">
        <p className="text-sm text-slate-600 leading-relaxed font-medium">
          You retain full ownership of all content, data, and materials you submit, upload, or create
          within the PRISM platform ("User Content").
        </p>
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
          <p className="text-sm text-indigo-800 font-semibold leading-relaxed">
            By using PRISM, you grant us a limited, non-exclusive, royalty-free license to use,
            process, and store your User Content solely to the extent necessary to provide and
            improve our services to you.
          </p>
        </div>
        <p className="text-sm text-slate-600 font-medium">
          This license does not permit PRISM to sell, commercialize, or publicly disclose your User Content.
        </p>
      </div>
    ),
  },
  {
    number: '09',
    icon: CreditCard,
    title: 'Subscription and Pricing',
    color: 'bg-teal-50 text-teal-600 border-teal-100',
    content: (
      <div className="space-y-3">
        <p className="text-sm text-slate-600 leading-relaxed font-medium">
          Access to certain features of PRISM requires a paid subscription. Subscription terms include:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { plan: 'Essential', price: '₹4,000', period: '/ user / month', note: 'For small teams starting with AI research' },
            { plan: 'Pro', price: '₹9,500', period: '/ user / month', note: 'Advanced intelligence for high-performing teams' },
            { plan: 'Enterprise', price: '₹17,000', period: '/ user / month', note: 'Custom deployment for large organizations' },
          ].map((item, i) => (
            <div key={i} className={`bg-slate-50 border rounded-xl p-4 text-center ${i === 1 ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200'}`}>
              <span className="text-xs font-extrabold text-slate-800 block">{item.plan}</span>
              <span className="text-lg font-black text-slate-900 block mt-1">{item.price}</span>
              <span className="text-[10px] text-slate-500 font-medium">{item.period}</span>
              <p className="text-[10px] text-slate-400 mt-2 font-medium leading-relaxed">{item.note}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Pricing is subject to change. Users will be notified of pricing changes in advance. All
          subscriptions are governed by the specific plan terms presented at the time of purchase.
        </p>
      </div>
    ),
  },
  {
    number: '10',
    icon: WifiOff,
    title: 'Service Availability',
    color: 'bg-slate-50 text-slate-600 border-slate-200',
    content: (
      <p className="text-sm text-slate-600 leading-relaxed font-medium">
        PRISM strives to maintain high availability and reliability of the platform. However, we do not
        guarantee uninterrupted, error-free, or continuously available service. Scheduled maintenance,
        technical issues, third-party service outages, or other factors beyond our control may result
        in temporary service interruptions. PRISM shall not be liable for any losses or damages
        resulting from service unavailability.
      </p>
    ),
  },
  {
    number: '11',
    icon: AlertTriangle,
    title: 'Limitation of Liability',
    color: 'bg-orange-50 text-orange-600 border-orange-100',
    content: (
      <div className="space-y-3">
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <p className="text-sm text-orange-800 font-semibold leading-relaxed">
            To the maximum extent permitted by applicable law, PRISM shall not be liable for any
            indirect, incidental, special, consequential, or punitive damages, including but not
            limited to loss of profits, loss of data, or business interruption.
          </p>
        </div>
        <p className="text-sm text-slate-600 font-medium leading-relaxed">
          In no event shall PRISM's total liability to you for all claims arising under these Terms
          exceed the amount paid by you to PRISM in the twelve (12) months preceding the claim.
        </p>
      </div>
    ),
  },
  {
    number: '12',
    icon: Umbrella,
    title: 'Indemnification',
    color: 'bg-pink-50 text-pink-600 border-pink-100',
    content: (
      <p className="text-sm text-slate-600 leading-relaxed font-medium">
        You agree to indemnify, defend, and hold harmless PRISM Technologies and its officers,
        directors, employees, agents, and licensors from and against any claims, liabilities,
        damages, losses, costs, or expenses (including reasonable legal fees) arising out of or
        related to your use or misuse of the platform, your violation of these Terms, or your
        infringement of any third-party rights.
      </p>
    ),
  },
  {
    number: '13',
    icon: XCircle,
    title: 'Termination',
    color: 'bg-red-50 text-red-600 border-red-100',
    content: (
      <div className="space-y-3">
        <p className="text-sm text-slate-600 leading-relaxed font-medium">
          PRISM reserves the right to suspend or permanently terminate your account and access to the
          platform at our sole discretion, with or without notice, for any of the following reasons:
        </p>
        <ul className="space-y-2">
          {[
            'Violation of any provision of these Terms of Service.',
            'Conduct that is harmful to other users, third parties, or PRISM\'s reputation.',
            'Failure to pay applicable subscription fees.',
            'Fraudulent, abusive, or unlawful activity conducted through the platform.',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
              <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-xs text-slate-500 font-medium">
          Upon termination, your right to use the platform ceases immediately. Provisions that by
          their nature should survive termination shall remain in effect.
        </p>
      </div>
    ),
  },
  {
    number: '14',
    icon: Lock,
    title: 'Confidentiality',
    color: 'bg-slate-800 text-slate-200 border-slate-700',
    content: (
      <div className="space-y-3">
        <p className="text-sm text-slate-600 leading-relaxed font-medium">
          Both PRISM and its users agree to protect confidential information shared in connection
          with the use of our services. Confidential information includes proprietary business data,
          trade secrets, technical information, and any other information designated as confidential.
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-3">
          <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-700 font-semibold">
            Neither party shall disclose the other's confidential information to third parties without
            prior written consent, except as required by law or as necessary to provide the services.
          </p>
        </div>
      </div>
    ),
  },
  {
    number: '15',
    icon: Scale,
    title: 'Governing Law',
    color: 'bg-cyan-50 text-cyan-600 border-cyan-100',
    content: (
      <p className="text-sm text-slate-600 leading-relaxed font-medium">
        These Terms of Service shall be governed by and construed in accordance with the applicable
        laws of the operating jurisdiction in which PRISM Technologies is registered and operates.
        Any disputes arising from or relating to these Terms shall be subject to the exclusive
        jurisdiction of the competent courts in that jurisdiction. You waive any objection to the
        exercise of jurisdiction over you by such courts.
      </p>
    ),
  },
  {
    number: '16',
    icon: RefreshCw,
    title: 'Changes to Terms',
    color: 'bg-teal-50 text-teal-600 border-teal-100',
    content: (
      <p className="text-sm text-slate-600 leading-relaxed font-medium">
        PRISM reserves the right to modify or update these Terms of Service at any time. We will
        provide notice of material changes via email or a prominent notice within the platform. Your
        continued use of PRISM following the effective date of any updates constitutes your
        acceptance of the revised Terms. If you do not agree to the updated Terms, you must
        discontinue using the platform.
      </p>
    ),
  },
  {
    number: '17',
    icon: Mail,
    title: 'Contact Information',
    color: 'bg-red-50 text-red-600 border-red-100',
    content: (
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="mailto:legal@prism.ai"
          className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-red-200 hover:shadow-sm transition-all group flex-1"
        >
          <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-slate-800 block">Legal Inquiries</span>
            <span className="text-xs font-bold text-red-600 group-hover:underline">legal@prism.ai</span>
          </div>
        </a>
        <a
          href="mailto:support@prism.ai"
          className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-red-200 hover:shadow-sm transition-all group flex-1"
        >
          <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-slate-800 block">General Support</span>
            <span className="text-xs font-bold text-red-600 group-hover:underline">support@prism.ai</span>
          </div>
        </a>
      </div>
    ),
  },
];

export function TermsOfService() {
  const [openSection, setOpenSection] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'full' | 'accordion'>('full');

  const toggle = (i: number) => setOpenSection(openSection === i ? null : i);

  return (
    <div className="bg-[#f8fafc] text-[#0f172a] min-h-screen font-sans">
      <SharedHeader />

      {/* Hero */}
      <section className="relative py-16 px-6 md:px-12 max-w-5xl mx-auto text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-red-50/60 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100/80 mb-6">
            <Scale className="w-3.5 h-3.5 text-red-600" />
            <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 max-w-3xl mx-auto leading-[1.1] mb-4">
            Terms of{' '}
            <span className="bg-gradient-to-r from-red-600 to-red-800 text-transparent bg-clip-text">
              Service
            </span>
          </h1>
          <p className="text-slate-500 text-sm font-medium max-w-xl mx-auto leading-relaxed mb-6">
            Please read these Terms carefully before using the PRISM platform. By using our services,
            you agree to be bound by these Terms.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-full">
              <Clock className="w-3 h-3" /> Last updated: June 2026
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-full">
              17 sections
            </span>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
              <button
                onClick={() => setViewMode('full')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${viewMode === 'full' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
              >
                Full View
              </button>
              <button
                onClick={() => setViewMode('accordion')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${viewMode === 'accordion' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
              >
                Quick View
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="pb-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">

          {/* Summary strip */}
          <div className="mb-8 bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-sm font-semibold text-slate-300">
                By using PRISM, you agree to these Terms. Key points: <strong className="text-white">you must be 18+</strong>, 
                {' '}<strong className="text-white">AI content is informational only</strong>, and 
                {' '}<strong className="text-white">we don't sell your data.</strong>
              </p>
            </div>
            <Link
              to="/privacy"
              className="text-xs font-bold text-red-400 hover:text-red-300 whitespace-nowrap flex items-center gap-1 transition-colors shrink-0"
            >
              View Privacy Policy <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {viewMode === 'full' ? (
            <div className="space-y-5">
              {sections.map((section, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 transition-all">
                  <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-4">
                    <span className="text-[10px] font-black text-slate-300 font-mono">{section.number}</span>
                    <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${section.color}`}>
                      <section.icon className="w-3.5 h-3.5" />
                    </div>
                    <h2 className="text-sm font-extrabold text-slate-900">{section.title}</h2>
                  </div>
                  <div className="px-6 py-5">{section.content}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {sections.map((section, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all">
                  <button
                    onClick={() => toggle(i)}
                    className="w-full px-6 py-4 flex items-center gap-4 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span className="text-[10px] font-black text-slate-300 font-mono w-6">{section.number}</span>
                    <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${section.color}`}>
                      <section.icon className="w-3 h-3" />
                    </div>
                    <span className="text-sm font-extrabold text-slate-900 flex-1">{section.title}</span>
                    {openSection === i
                      ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>
                  {openSection === i && (
                    <div className="px-6 pb-5 border-t border-slate-100 pt-4">
                      {section.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Bottom CTA */}
          <div className="mt-10 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.08),transparent)] pointer-events-none" />
            <div className="relative z-10">
              <h3 className="text-base font-extrabold mb-1">Questions about our Terms?</h3>
              <p className="text-sm text-red-100/80 font-medium">Our legal team is available to clarify any aspect of these Terms.</p>
            </div>
            <a
              href="mailto:legal@prism.ai"
              className="relative z-10 px-6 py-2.5 bg-white hover:bg-slate-50 text-red-700 font-bold text-sm rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <Scale className="w-4 h-4" />
              <span>Contact Legal Team</span>
            </a>
          </div>
        </div>
      </section>

      <SharedFooter />
    </div>
  );
}
