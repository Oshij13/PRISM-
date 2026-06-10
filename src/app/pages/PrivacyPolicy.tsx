import { useState } from 'react';
import { Link } from 'react-router';
import {
  ArrowRight,
  Shield,
  Database,
  Eye,
  Sparkles,
  Share2,
  Clock,
  Lock,
  Globe,
  UserCheck,
  Puzzle,
  Baby,
  RefreshCw,
  Mail,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import { SharedHeader, SharedFooter } from '../components/SharedPageLayout';

const sections = [
  {
    number: '01',
    icon: Shield,
    title: 'Introduction',
    color: 'bg-red-50 text-red-600 border-red-100',
    content: (
      <p className="text-sm text-slate-600 leading-relaxed font-medium">
        PRISM is an AI-powered meeting intelligence platform that helps sales representatives prepare for
        meetings by automatically gathering, analyzing, and summarizing company, stakeholder, financial,
        news, and social media information. This Privacy Policy describes how we collect, use, and protect
        your personal information when you use our services.
      </p>
    ),
  },
  {
    number: '02',
    icon: Database,
    title: 'Information We Collect',
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    content: (
      <div className="space-y-3">
        <p className="text-sm text-slate-600 leading-relaxed font-medium">We collect the following categories of information:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { label: 'Account Information', desc: 'Name, email, and profile data you provide during registration.' },
            { label: 'Calendar Information', desc: 'Meeting schedules and attendee data from connected calendar providers.' },
            { label: 'User Content', desc: 'Notes, preferences, and input you create within the platform.' },
            { label: 'Usage Analytics', desc: 'Feature usage patterns and interaction data to improve the platform.' },
            { label: 'Device Information', desc: 'Browser type, IP address, and operating system metadata.' },
            { label: 'Public Business Data', desc: 'Publicly available company, stakeholder, and market information.' },
          ].map((item, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
              <span className="text-xs font-extrabold text-slate-800 block mb-0.5">{item.label}</span>
              <span className="text-[11px] text-slate-500 font-medium leading-relaxed">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    number: '03',
    icon: Eye,
    title: 'How We Use Information',
    color: 'bg-violet-50 text-violet-600 border-violet-100',
    content: (
      <div className="space-y-2">
        <p className="text-sm text-slate-600 leading-relaxed font-medium mb-3">Your information is used to:</p>
        {[
          'Generate comprehensive meeting briefs and stakeholder intelligence reports',
          'Provide AI-powered executive summaries and strategic recommendations',
          'Deliver contextual insights tailored to your upcoming meetings',
          'Improve platform performance, reliability, and feature quality',
          'Communicate service updates, security notices, and product changes',
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">{i + 1}</span>
            <span className="text-sm text-slate-600 font-medium leading-relaxed">{item}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    number: '04',
    icon: Sparkles,
    title: 'AI-Generated Content Disclaimer',
    color: 'bg-amber-50 text-amber-600 border-amber-100',
    content: (
      <div className="space-y-3">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 font-semibold leading-relaxed">
            AI-generated insights, summaries, and recommendations produced by PRISM may contain
            inaccuracies, omissions, or errors. All AI-generated content should be independently
            verified before making critical business decisions.
          </p>
        </div>
        <p className="text-sm text-slate-600 font-medium leading-relaxed">
          PRISM uses large language models and third-party AI services to generate content. While we
          strive for accuracy and relevance, the dynamic nature of business information means outputs
          may not always reflect the most current or complete picture.
        </p>
      </div>
    ),
  },
  {
    number: '05',
    icon: Share2,
    title: 'Data Sharing',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    content: (
      <div className="space-y-3">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="text-sm text-emerald-800 font-bold">
            ✓ PRISM does not sell your personal information to third parties.
          </p>
        </div>
        <p className="text-sm text-slate-600 font-medium leading-relaxed">
          We only share data in the following limited circumstances:
        </p>
        <ul className="space-y-2">
          {[
            'With trusted service providers who assist in platform operations under strict confidentiality agreements',
            'When required by applicable law, legal process, or governmental authority',
            'To protect the rights, property, or safety of PRISM, our users, or the public',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    number: '06',
    icon: Clock,
    title: 'Data Retention',
    color: 'bg-sky-50 text-sky-600 border-sky-100',
    content: (
      <p className="text-sm text-slate-600 leading-relaxed font-medium">
        PRISM retains your personal information only for as long as necessary to provide our services,
        comply with legal obligations, resolve disputes, and enforce our agreements. When your data is
        no longer required, it is securely deleted or anonymized in accordance with our data lifecycle
        policies. You may also request deletion of your account data at any time — see User Rights below.
      </p>
    ),
  },
  {
    number: '07',
    icon: Lock,
    title: 'Security Measures',
    color: 'bg-red-50 text-red-600 border-red-100',
    content: (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Encryption', desc: 'Data encrypted in transit and at rest using industry standards' },
          { label: 'Access Controls', desc: 'Role-based access with least-privilege principles' },
          { label: 'Monitoring', desc: 'Continuous security monitoring and anomaly detection' },
          { label: 'Audit Logging', desc: 'Detailed activity logs for security and compliance reviews' },
          { label: 'Secure Infrastructure', desc: 'Industry-standard cloud security configurations' },
          { label: 'Regular Reviews', desc: 'Periodic security assessments and vulnerability testing' },
        ].map((item, i) => (
          <div key={i} className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <Lock className="w-3.5 h-3.5 text-red-500 mb-1.5" />
            <span className="text-xs font-extrabold text-slate-800 block mb-0.5">{item.label}</span>
            <span className="text-[11px] text-slate-500 font-medium leading-relaxed">{item.desc}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    number: '08',
    icon: Globe,
    title: 'International Data Transfers',
    color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    content: (
      <p className="text-sm text-slate-600 leading-relaxed font-medium">
        PRISM operates globally and your information may be processed in multiple jurisdictions where
        our service providers operate. We ensure such transfers are conducted in compliance with
        applicable data protection laws and that appropriate safeguards are in place to protect your
        personal information regardless of where it is processed.
      </p>
    ),
  },
  {
    number: '09',
    icon: UserCheck,
    title: 'User Rights',
    color: 'bg-teal-50 text-teal-600 border-teal-100',
    content: (
      <div className="space-y-3">
        <p className="text-sm text-slate-600 font-medium leading-relaxed">Where applicable under local law, you have the right to:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { right: 'Access', desc: 'Request a copy of the personal data we hold about you' },
            { right: 'Correction', desc: 'Request correction of inaccurate or incomplete data' },
            { right: 'Deletion', desc: 'Request erasure of your personal data ("right to be forgotten")' },
            { right: 'Restriction', desc: 'Request restriction of processing your personal data' },
            { right: 'Export', desc: 'Receive your data in a portable, machine-readable format' },
            { right: 'Objection', desc: 'Object to certain types of data processing activities' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5 bg-slate-50 border border-slate-200/80 rounded-xl p-3">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-1.5" />
              <div>
                <span className="text-xs font-extrabold text-slate-800">{item.right}</span>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 font-medium">
          To exercise any of these rights, please contact us at{' '}
          <a href="mailto:privacy@prism.ai" className="text-red-600 font-bold hover:underline">privacy@prism.ai</a>.
        </p>
      </div>
    ),
  },
  {
    number: '10',
    icon: Puzzle,
    title: 'Third-Party Services',
    color: 'bg-orange-50 text-orange-600 border-orange-100',
    content: (
      <div className="space-y-3">
        <p className="text-sm text-slate-600 font-medium leading-relaxed">
          PRISM may integrate with the following categories of third-party services:
        </p>
        <div className="flex flex-wrap gap-2">
          {['Calendar Providers (Google, Outlook)', 'CRM Systems (Salesforce, HubSpot)', 'AI Service Providers', 'Cloud Infrastructure', 'Analytics Platforms'].map((tag) => (
            <span key={tag} className="text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          These integrations are governed by their own privacy policies. We encourage you to review
          the privacy practices of any third-party services you connect with PRISM.
        </p>
      </div>
    ),
  },
  {
    number: '11',
    icon: Baby,
    title: "Children's Privacy",
    color: 'bg-pink-50 text-pink-600 border-pink-100',
    content: (
      <p className="text-sm text-slate-600 leading-relaxed font-medium">
        PRISM is designed exclusively for business professionals and is intended for users aged{' '}
        <strong className="text-slate-800">18 years and above</strong>. We do not knowingly collect,
        use, or disclose personal information from individuals under the age of 18. If you believe a
        minor has provided us with personal information, please contact us immediately at{' '}
        <a href="mailto:privacy@prism.ai" className="text-red-600 font-bold hover:underline">privacy@prism.ai</a>{' '}
        so we can take appropriate action.
      </p>
    ),
  },
  {
    number: '12',
    icon: RefreshCw,
    title: 'Changes to this Policy',
    color: 'bg-cyan-50 text-cyan-600 border-cyan-100',
    content: (
      <p className="text-sm text-slate-600 leading-relaxed font-medium">
        PRISM may update this Privacy Policy periodically to reflect changes in our practices, services,
        or applicable law. When we make material changes, we will notify users via email or a prominent
        notice within the platform. We encourage you to review this policy regularly. Your continued use
        of the platform after changes take effect constitutes your acceptance of the revised policy.
      </p>
    ),
  },
  {
    number: '13',
    icon: Mail,
    title: 'Contact Information',
    color: 'bg-red-50 text-red-600 border-red-100',
    content: (
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="mailto:privacy@prism.ai"
          className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-red-200 hover:shadow-sm transition-all group flex-1"
        >
          <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-slate-800 block">Privacy Inquiries</span>
            <span className="text-xs font-bold text-red-600 group-hover:underline">privacy@prism.ai</span>
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

export function PrivacyPolicy() {
  const [openSection, setOpenSection] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'accordion' | 'full'>('full');

  const toggle = (i: number) => setOpenSection(openSection === i ? null : i);

  return (
    <div className="bg-[#f8fafc] text-[#0f172a] min-h-screen font-sans">
      <SharedHeader />

      {/* Hero */}
      <section className="relative py-16 px-6 md:px-12 max-w-5xl mx-auto text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-red-50/60 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100/80 mb-6">
            <Shield className="w-3.5 h-3.5 text-red-600" />
            <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 max-w-3xl mx-auto leading-[1.1] mb-4">
            Privacy{' '}
            <span className="bg-gradient-to-r from-red-600 to-red-800 text-transparent bg-clip-text">
              Policy
            </span>
          </h1>
          <p className="text-slate-500 text-sm font-medium max-w-xl mx-auto leading-relaxed mb-6">
            We take your privacy seriously. This policy explains how PRISM collects, uses, and protects
            your personal information.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-full">
              <Clock className="w-3 h-3" /> Last updated: June 2026
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-full">
              13 sections
            </span>
            {/* View toggle */}
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

      {/* Main Content */}
      <section className="pb-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">

          {viewMode === 'full' ? (
            /* Full expanded view */
            <div className="space-y-6">
              {sections.map((section, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 transition-all">
                  {/* Section header */}
                  <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-4">
                    <span className="text-[10px] font-black text-slate-300 font-mono">{section.number}</span>
                    <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${section.color}`}>
                      <section.icon className="w-3.5 h-3.5" />
                    </div>
                    <h2 className="text-sm font-extrabold text-slate-900">{section.title}</h2>
                  </div>
                  {/* Section content */}
                  <div className="px-6 py-5">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Accordion / Quick view */
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
          <div className="mt-10 bg-slate-900 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-base font-extrabold mb-1">Questions about your privacy?</h3>
              <p className="text-sm text-slate-400 font-medium">Our team is here to help with any privacy-related concerns.</p>
            </div>
            <a
              href="mailto:privacy@prism.ai"
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Privacy Team</span>
            </a>
          </div>
        </div>
      </section>

      <SharedFooter />
    </div>
  );
}
