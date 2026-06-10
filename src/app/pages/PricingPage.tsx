import { useState } from 'react';
import { Link } from 'react-router';
import {
  ArrowRight,
  Check,
  X,
  Sparkles,
  ChevronRight,
  Shield,
  Clock,
  Zap,
  Users,
  Building,
  CreditCard,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  BadgeCheck,
  Phone,
  Mail,
  Star,
} from 'lucide-react';

import { SharedHeader, SharedFooter } from '../components/SharedPageLayout';

type BillingCycle = 'annual' | 'monthly';

const plans = [
  {
    id: 'essential',
    name: 'Essential',
    tagline: 'For small teams starting with AI-powered meeting intelligence.',
    annualPrice: 4000,
    monthlyPrice: Math.round(4000 * 1.15),
    minSeats: 5,
    color: 'border-slate-200',
    badgeColor: '',
    ctaClass: 'bg-slate-100 hover:bg-slate-200 text-slate-800',
    iconBg: 'bg-slate-100 text-slate-600',
    highlight: false,
    badge: null,
    sla: '99.5%',
    support: 'Email',
    crm: 'Salesforce',
    meetings: '25 / month',
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Advanced intelligence for high-performing sales teams.',
    annualPrice: 9500,
    monthlyPrice: Math.round(9500 * 1.15),
    minSeats: 10,
    color: 'border-red-600',
    badgeColor: 'bg-red-600 text-white',
    ctaClass: 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20',
    iconBg: 'bg-red-50 text-red-600',
    highlight: true,
    badge: 'Most Popular',
    sla: '99.5%',
    support: 'Priority Email',
    crm: 'Salesforce + HubSpot',
    meetings: '100 / month',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Custom deployment with dedicated support for large organizations.',
    annualPrice: 17000,
    monthlyPrice: Math.round(17000 * 1.15),
    minSeats: 25,
    color: 'border-slate-200',
    badgeColor: '',
    ctaClass: 'bg-slate-900 hover:bg-slate-800 text-white',
    iconBg: 'bg-slate-900 text-white',
    highlight: false,
    badge: null,
    sla: '99.9%',
    support: '24/7 Phone + Email',
    crm: 'All Major CRMs',
    meetings: 'Unlimited',
  },
];

const featureRows = [
  {
    category: 'Core Intelligence',
    features: [
      { label: 'PRISM Prep™ — AI Meeting Briefs', essential: true, pro: true, enterprise: true },
      { label: 'PRISM Pulse™ — Real-time Account Alerts', essential: false, pro: true, enterprise: true },
      { label: 'PRISM Sync™ — Automated CRM Logging', essential: false, pro: true, enterprise: true },
      { label: 'PRISM Lens™ — Deal & Team Analytics', essential: false, pro: false, enterprise: true },
      { label: 'PRISM Coach™ — AI-Assisted Coaching', essential: false, pro: false, enterprise: true },
    ],
  },
  {
    category: 'Usage & Limits',
    features: [
      { label: 'Meetings Analysed / month', essential: '25', pro: '100', enterprise: 'Unlimited' },
      { label: 'Minimum seat commitment', essential: '5 users', pro: '10 users', enterprise: '25 users' },
      { label: 'Brief generation speed', essential: '< 60 sec', pro: '< 60 sec', enterprise: '< 60 sec' },
    ],
  },
  {
    category: 'Integrations',
    features: [
      { label: 'CRM Integrations', essential: 'Salesforce', pro: 'SF + HubSpot', enterprise: 'All major CRMs' },
      { label: 'Calendar Integrations', essential: true, pro: true, enterprise: true },
      { label: 'API Access', essential: false, pro: false, enterprise: true },
      { label: 'SSO / SAML Authentication', essential: false, pro: false, enterprise: true },
      { label: 'Custom Webhook Support', essential: false, pro: false, enterprise: true },
    ],
  },
  {
    category: 'Security & Compliance',
    features: [
      { label: 'Data Encryption (at rest & in transit)', essential: true, pro: true, enterprise: true },
      { label: 'SOC 2 Type II Compliant', essential: true, pro: true, enterprise: true },
      { label: 'SLA Uptime Guarantee', essential: '99.5%', pro: '99.5%', enterprise: '99.9%' },
      { label: 'Audit Logs & Access Controls', essential: false, pro: true, enterprise: true },
      { label: 'Custom Data Retention Policy', essential: false, pro: false, enterprise: true },
    ],
  },
  {
    category: 'Support & Success',
    features: [
      { label: 'Support Channel', essential: 'Email', pro: 'Priority Email', enterprise: '24/7 Phone + Email' },
      { label: 'Dedicated Customer Success Manager', essential: false, pro: false, enterprise: true },
      { label: 'Onboarding & Training Sessions', essential: false, pro: true, enterprise: true },
      { label: 'Custom AI Knowledge Base', essential: false, pro: false, enterprise: true },
    ],
  },
];

const faqs = [
  {
    q: 'Is there a free trial?',
    a: 'Yes. All plans include a 14-day free trial with no credit card required. Your data is not used for model training during the trial period and is permanently deleted within 30 days if you choose not to subscribe.',
  },
  {
    q: 'What is the difference between annual and monthly billing?',
    a: 'Annual billing is our standard pricing. Monthly billing is available at a 15% premium over the annual rate, offering flexibility without a long-term commitment.',
  },
  {
    q: 'Can I change plans later?',
    a: 'Yes. You can upgrade your plan at any time. Downgrades take effect at the start of the next billing cycle. Prorated credits are applied when upgrading mid-cycle.',
  },
  {
    q: 'What counts as an "active user"?',
    a: 'An active user is any team member who logs in or uses the platform at least once in a given billing month. You only pay for users who are actively using PRISM.',
  },
  {
    q: 'Does PRISM sell or use my data for AI training?',
    a: 'No. PRISM does not sell personal information and does not use your data or your customers\' data to train external AI models. Your data stays yours.',
  },
  {
    q: 'Is there a minimum seat commitment?',
    a: 'Yes. Essential plans require a minimum of 5 seats, Pro requires 10 seats, and Enterprise requires 25 seats. Enterprise pricing is also fully negotiable for large deployments.',
  },
  {
    q: 'What CRMs are supported on Enterprise?',
    a: 'Enterprise supports all major CRMs including Salesforce, HubSpot, Pipedrive, Microsoft Dynamics, Zoho CRM, and more. Custom API integrations are also available.',
  },
  {
    q: 'How do I get started with Enterprise?',
    a: 'Contact our sales team at partnerships@prism.ai or use the "Contact Sales" button. We\'ll schedule a discovery call and customize a deployment plan for your organization.',
  },
];

function CellValue({ value }: { value: boolean | string }) {
  if (typeof value === 'boolean') {
    return value
      ? <Check className="w-4 h-4 text-green-500 mx-auto" />
      : <X className="w-4 h-4 text-slate-300 mx-auto" />;
  }
  return <span className="text-xs font-bold text-slate-700 text-center block">{value}</span>;
}

export function PricingPage() {
  const [billing, setBilling] = useState<BillingCycle>('annual');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const getPrice = (plan: typeof plans[0]) =>
    billing === 'annual' ? plan.annualPrice : plan.monthlyPrice;

  return (
    <div className="bg-[#f8fafc] text-[#0f172a] min-h-screen font-sans">
      <SharedHeader />

      {/* Hero */}
      <section className="relative py-20 px-6 md:px-12 max-w-5xl mx-auto text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-red-50/70 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100/80 mb-6">
            <CreditCard className="w-3.5 h-3.5 text-red-600" />
            <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider">Simple, Transparent Pricing</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 max-w-3xl mx-auto leading-[1.1] mb-4">
            Plans for every{' '}
            <span className="bg-gradient-to-r from-red-600 to-red-800 text-transparent bg-clip-text">
              team size.
            </span>
          </h1>
          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            No hidden fees. No surprise overage charges. All plans include a 14-day free trial
            with no credit card required.
          </p>

          {/* Trial Trust Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              { icon: BadgeCheck, text: '14-day free trial' },
              { icon: Shield, text: 'No credit card required' },
              { icon: Zap, text: 'Cancel anytime' },
              { icon: Clock, text: 'Data deleted in 30 days if you don\'t subscribe' },
            ].map((b, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full">
                <b.icon className="w-3.5 h-3.5 text-green-500" />
                {b.text}
              </span>
            ))}
          </div>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 bg-slate-100 border border-slate-200 p-1 rounded-xl">
            <button
              onClick={() => setBilling('annual')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${billing === 'annual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Annual
            </button>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setBilling('monthly')}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${billing === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Monthly
              </button>
              {billing === 'monthly' && (
                <span className="text-[9px] font-black bg-orange-100 text-orange-600 border border-orange-200 px-2 py-0.5 rounded-full">+15%</span>
              )}
            </div>
            {billing === 'annual' && (
              <span className="text-[9px] font-black bg-green-100 text-green-600 border border-green-200 px-2 py-0.5 rounded-full mr-1">SAVE 15%</span>
            )}
          </div>
        </div>
      </section>

      {/* Plan Cards */}
      <section className="pb-12 px-6 md:px-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl border-2 p-8 flex flex-col relative transition-all duration-300 hover:shadow-xl ${plan.color} ${plan.highlight ? 'shadow-xl shadow-red-600/10 md:-translate-y-2' : ''}`}
            >
              {plan.badge && (
                <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${plan.badgeColor}`}>
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${plan.iconBg}`}>
                  {plan.id === 'essential' && <Users className="w-5 h-5" />}
                  {plan.id === 'pro' && <Sparkles className="w-5 h-5" />}
                  {plan.id === 'enterprise' && <Building className="w-5 h-5" />}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1">{plan.name}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{plan.tagline}</p>
              </div>

              <div className="mb-6 pb-6 border-b border-slate-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">₹{getPrice(plan).toLocaleString('en-IN')}</span>
                  <span className="text-xs text-slate-500 font-medium">/ user / mo</span>
                </div>
                {billing === 'annual' && (
                  <p className="text-[10px] text-slate-400 font-medium mt-1">Billed annually · Min. {plan.minSeats} seats</p>
                )}
                {billing === 'monthly' && (
                  <p className="text-[10px] text-slate-400 font-medium mt-1">Billed monthly · Min. {plan.minSeats} seats</p>
                )}
              </div>

              {/* Key Feature Highlights */}
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  { text: `${plan.meetings} meetings analysed`, included: true },
                  { text: 'PRISM Prep™ AI Meeting Briefs', included: true },
                  { text: 'PRISM Pulse™ Account Alerts', included: plan.id !== 'essential' },
                  { text: 'PRISM Sync™ CRM Auto-logging', included: plan.id !== 'essential' },
                  { text: 'PRISM Lens™ Deal Analytics', included: plan.id === 'enterprise' },
                  { text: 'PRISM Coach™ AI Coaching', included: plan.id === 'enterprise' },
                  { text: `CRM: ${plan.crm}`, included: true },
                  { text: `SLA: ${plan.sla} uptime`, included: true },
                  { text: `Support: ${plan.support}`, included: true },
                  { text: 'Dedicated Customer Success Manager', included: plan.id === 'enterprise' },
                  { text: 'SSO / SAML Authentication', included: plan.id === 'enterprise' },
                ].map((item, i) => (
                  <li key={i} className={`flex items-start gap-2.5 text-xs font-semibold ${item.included ? 'text-slate-700' : 'text-slate-300'}`}>
                    {item.included
                      ? <Check className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                      : <X className="w-3.5 h-3.5 text-slate-200 shrink-0 mt-0.5" />}
                    {item.text}
                  </li>
                ))}
              </ul>

              {plan.id === 'enterprise' ? (
                <Link
                  to="/contact"
                  className={`w-full py-3 px-4 font-bold text-sm rounded-xl transition-all text-center ${plan.ctaClass}`}
                >
                  Contact Sales
                </Link>
              ) : (
                <Link
                  to="/signup"
                  className={`w-full py-3 px-4 font-bold text-sm rounded-xl transition-all text-center ${plan.ctaClass}`}
                >
                  Start Free Trial
                </Link>
              )}
              <p className="text-[10px] text-center text-slate-400 font-medium mt-3">
                14-day free trial · No credit card
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Trial Highlight Banner */}
      <section className="px-6 md:px-12 pb-12">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold mb-1">Free Trial — Zero Risk</h3>
              <p className="text-sm text-slate-300 font-medium leading-relaxed max-w-xl">
                All plans include a <strong className="text-white">14-day free trial</strong> with no credit card required. 
                Your data is <strong className="text-white">never used for model training</strong> and is permanently 
                deleted within 30 days if you choose not to subscribe.
              </p>
            </div>
          </div>
          <Link
            to="/signup"
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Full Feature Comparison Table */}
      <section className="py-16 px-6 md:px-12 bg-white border-y border-slate-200/80">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest block mb-3">Full Comparison</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Everything, side by side.</h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-200 sticky top-16 z-10">
              <div className="px-5 py-4">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Feature</span>
              </div>
              {plans.map((plan) => (
                <div key={plan.id} className={`px-5 py-4 text-center ${plan.highlight ? 'bg-red-50/60' : ''}`}>
                  <span className={`text-xs font-extrabold ${plan.highlight ? 'text-red-600' : 'text-slate-700'}`}>{plan.name}</span>
                  <div className="text-[10px] font-bold text-slate-400 mt-0.5">
                    ₹{plan.annualPrice.toLocaleString('en-IN')}/mo
                  </div>
                </div>
              ))}
            </div>

            {featureRows.map((group, gi) => (
              <div key={gi}>
                {/* Category separator */}
                <div className="grid grid-cols-4 bg-slate-50/80 border-y border-slate-100">
                  <div className="px-5 py-2.5 col-span-4">
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">{group.category}</span>
                  </div>
                </div>
                {group.features.map((row, ri) => (
                  <div
                    key={ri}
                    className={`grid grid-cols-4 items-center ${ri < group.features.length - 1 ? 'border-b border-slate-100' : ''} hover:bg-slate-50/40 transition-colors`}
                  >
                    <div className="px-5 py-3.5">
                      <span className="text-xs font-semibold text-slate-700">{row.label}</span>
                    </div>
                    {(['essential', 'pro', 'enterprise'] as const).map((planKey) => (
                      <div key={planKey} className={`px-5 py-3.5 flex justify-center ${planKey === 'pro' ? 'bg-red-50/30' : ''}`}>
                        <CellValue value={row[planKey]} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stat Trust Strip */}
      <section className="py-14 px-6 md:px-12">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '14 days', label: 'Free trial, no card needed' },
            { value: '99.9%', label: 'Enterprise SLA uptime' },
            { value: '0', label: 'Data sold to third parties' },
            { value: '< 60s', label: 'Meeting brief generation' },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-3xl md:text-4xl font-black text-slate-900 mb-1">{s.value}</div>
              <div className="text-xs font-semibold text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 md:px-12 bg-white border-t border-slate-200/80">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest block mb-3">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Frequently asked questions.</h2>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden transition-all">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white transition-colors cursor-pointer gap-4"
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
                  <div className="px-6 pb-5 pt-1 border-t border-slate-200">
                    <p className="text-sm text-slate-600 font-medium leading-relaxed pl-7">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Contact Strip */}
      <section className="py-16 px-6 md:px-12 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest block mb-3">Enterprise & Custom</span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3 leading-tight">
              Need a tailored deployment?
            </h2>
            <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6">
              Our Enterprise plan is fully customizable. We work with your IT, security, and
              procurement teams to deploy PRISM in a way that meets your requirements — including
              private cloud, custom data residency, negotiated SLAs, and volume pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/contact"
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-colors flex items-center gap-2 justify-center"
              >
                <span>Contact Sales</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="mailto:partnerships@prism.ai"
                className="px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-xl border border-slate-200 transition-colors flex items-center gap-2 justify-center"
              >
                <Mail className="w-4 h-4" />
                <span>Email Our Team</span>
              </a>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { icon: Building, title: 'Custom Seat Volumes', desc: 'Negotiate volume discounts for 100+ seat deployments.' },
              { icon: Shield, title: 'Private Cloud Option', desc: 'Deploy PRISM in your own cloud environment for data sovereignty.' },
              { icon: Phone, title: 'Dedicated Success Team', desc: 'Your own CSM, solutions architect, and priority support line.' },
              { icon: Star, title: 'Custom SLA', desc: '99.9%+ uptime with enterprise-grade incident response commitments.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-4">
                <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
                  <item.icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-slate-900 block">{item.title}</span>
                  <span className="text-[11px] text-slate-500 font-medium">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-red-600 to-red-800 text-white rounded-3xl p-10 md:p-16 text-center relative overflow-hidden shadow-xl shadow-red-700/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent)] pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">Start preparing smarter today.</h2>
              <p className="text-red-100/90 text-sm max-w-xl mx-auto leading-relaxed mb-8">
                Join sales teams using PRISM to walk into every meeting informed and confident.
                Start your 14-day free trial — no credit card, no risk.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/signup"
                  className="px-8 py-4 bg-white hover:bg-slate-50 text-red-700 font-extrabold text-sm rounded-xl transition-all hover:scale-105 shadow-md flex items-center justify-center gap-2"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4 text-red-600" />
                </Link>
                <Link
                  to="/contact"
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>Talk to Sales</span>
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
