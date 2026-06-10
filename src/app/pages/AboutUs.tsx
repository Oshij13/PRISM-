import { Link } from 'react-router';
import {
  ArrowRight,
  Sparkles,
  Target,
  Users,
  Lightbulb,
  TrendingUp,
  Eye,
  BarChart3,
  Heart,
  ChevronRight,
} from 'lucide-react';

import { SharedHeader, SharedFooter } from '../components/SharedPageLayout';

const teamMembers = [
  {
    initials: 'TM',
    focus: 'Product Strategy',
    icon: Target,
    color: 'bg-red-50 text-red-600 border-red-100',
  },
  {
    initials: 'TM',
    focus: 'Artificial Intelligence',
    icon: Sparkles,
    color: 'bg-violet-50 text-violet-600 border-violet-100',
  },
  {
    initials: 'TM',
    focus: 'User Experience',
    icon: Eye,
    color: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  {
    initials: 'TM',
    focus: 'Research & Insights',
    icon: Lightbulb,
    color: 'bg-amber-50 text-amber-600 border-amber-100',
  },
  {
    initials: 'TM',
    focus: 'Business & Growth',
    icon: TrendingUp,
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
];

const values = [
  {
    icon: Heart,
    title: 'Human-First AI',
    description:
      'We believe AI should empower people—not replace them. Every feature we build is designed to give professionals more time for what matters.',
  },
  {
    icon: Target,
    title: 'Radical Simplicity',
    description:
      'Complex research, distilled into clear, actionable intelligence. We remove noise so sales professionals can focus on the signal.',
  },
  {
    icon: BarChart3,
    title: 'Outcome Driven',
    description:
      'Better preparation leads to better conversations and better outcomes. We measure our success by the impact we create for our users.',
  },
  {
    icon: Sparkles,
    title: 'Responsible Innovation',
    description:
      'We approach AI development with care, transparency, and a deep sense of responsibility toward the people who use our platform.',
  },
];

export function AboutUs() {
  return (
    <div className="bg-[#f8fafc] text-[#0f172a] min-h-screen font-sans">
      <SharedHeader />

      {/* Hero Section */}
      <section className="relative py-20 px-6 md:px-12 max-w-5xl mx-auto text-center overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-50/60 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100/80 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
            <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider">Our Story</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.1] mb-6">
            Built by Practitioners,{' '}
            <span className="bg-gradient-to-r from-red-600 to-red-800 text-transparent bg-clip-text">
              For Practitioners.
            </span>
          </h1>

          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            We're a team of five professionals from BITSOM who got tired of watching great salespeople waste
            hours on research that AI could do in seconds.
          </p>
        </div>
      </section>

      {/* The Story Section */}
      <section className="py-16 px-6 md:px-12 bg-white border-y border-slate-200/80">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            {/* Left: The Problem */}
            <div>
              <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest block mb-4">The Problem We Saw</span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 leading-tight">
                Every salesperson knows the feeling.
              </h2>
              <div className="space-y-4 text-sm text-slate-600 leading-relaxed font-medium">
                <p>
                  You have an important customer meeting tomorrow, and before the call you spend hours jumping
                  between company websites, news articles, LinkedIn profiles, earnings reports, and market
                  updates just to understand what's happening with the customer.
                </p>
                <p>
                  The information exists — but it's scattered across multiple sources, constantly changing, and
                  time-consuming to gather. As a result, sales professionals spend valuable time researching
                  instead of focusing on what matters most: building relationships and having meaningful
                  conversations.
                </p>
              </div>

              {/* Quote */}
              <div className="mt-8 border-l-4 border-red-600 pl-5 py-2">
                <p className="text-base font-bold text-slate-800 italic leading-relaxed">
                  "What if an AI agent could do all of that research automatically?"
                </p>
                <span className="text-xs text-slate-500 font-semibold mt-2 block">— The question that started it all</span>
              </div>
            </div>

            {/* Right: Our Response */}
            <div>
              <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest block mb-4">Our Response</span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 leading-tight">
                Built at BITSOM, for the real world.
              </h2>
              <div className="space-y-4 text-sm text-slate-600 leading-relaxed font-medium">
                <p>
                  We are a team of five professionals pursuing the <strong className="text-slate-800">Product
                  Management with Generative & Agentic AI</strong> program at BITS School of Management
                  (BITSOM).
                </p>
                <p>
                  Through our shared interest in artificial intelligence, product innovation, and business
                  problem-solving, we set out to explore how Agentic AI can address real-world challenges
                  faced by sales teams.
                </p>
                <p>
                  Today, we are building an AI-powered sales intelligence platform that automatically curates
                  and delivers timely, contextual company insights before customer meetings.
                </p>
              </div>

              {/* BITSOM Badge */}
              <div className="mt-8 inline-flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-black text-xs">B</div>
                <div>
                  <span className="text-xs font-extrabold text-slate-800 block">BITS School of Management</span>
                  <span className="text-[10px] text-slate-500 font-medium">PM with Generative & Agentic AI — 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest block mb-4">Our Mission</span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight max-w-3xl mx-auto">
            Less time researching. More time{' '}
            <span className="bg-gradient-to-r from-red-600 to-red-800 text-transparent bg-clip-text">
              connecting.
            </span>
          </h2>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            To help sales teams spend less time researching and more time building meaningful customer
            relationships. We believe that the future of work is not about replacing people with AI, but
            empowering people with the right information at the right time.
          </p>
        </div>
      </section>

      {/* What We're Building */}
      <section className="py-20 px-6 md:px-12 bg-white border-y border-slate-200/80">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest block mb-3">What We're Building</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Your intelligent research assistant</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Understand what\'s happening inside a company', desc: 'Aggregated intelligence from financial reports, corporate filings, and press releases.' },
              { title: 'Identify relevant conversation starters', desc: 'AI-surfaced icebreakers grounded in real stakeholder activity and recent news.' },
              { title: 'Discover potential opportunities and risks', desc: 'Market signals, hiring trends, and leadership changes decoded into actionable context.' },
              { title: 'Stay informed about market developments', desc: 'Live monitoring of industry news and competitor moves, delivered before every meeting.' },
              { title: 'Reduce manual research time', desc: 'From hours of tab-switching to a single, comprehensive briefing delivered automatically.' },
            ].map((item, i) => (
              <div
                key={i}
                className={`bg-slate-50 rounded-2xl border border-slate-200/80 p-6 flex gap-4 items-start hover:border-red-200 hover:shadow-md transition-all duration-300 ${i === 4 ? 'md:col-span-2' : ''}`}
              >
                <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Goal Banner */}
          <div className="mt-10 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-2xl p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent)] pointer-events-none" />
            <p className="text-xl md:text-2xl font-black tracking-tight relative z-10">
              Better preparation. Better conversations. Better outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest block mb-4">Why It Matters</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight">
              AI agents can change the game.
            </h2>
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed font-medium">
              <p>
                Sales professionals often spend hours every week preparing for customer interactions.
                Important information can be missed, insights can become outdated, and valuable time is
                lost navigating multiple tools and data sources.
              </p>
              <p>
                By automating research and surfacing the most relevant insights, we aim to help
                professionals focus on what humans do best — building trust, understanding customer needs,
                and creating meaningful business relationships.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {values.map((v, i) => (
              <div key={i} className="flex gap-4 bg-white border border-slate-200 rounded-xl p-5 hover:border-red-200 hover:shadow-sm transition-all">
                <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
                  <v.icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-0.5">{v.title}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{v.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6 md:px-12 bg-white border-t border-slate-200/80">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest block mb-3">Meet the Team</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Five builders, one shared mission.</h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto font-medium leading-relaxed">
              We're a multidisciplinary team of learners and builders from the BITSOM Product Management
              with Generative & Agentic AI program, bringing diverse perspectives together.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {teamMembers.map((member, i) => (
              <div
                key={i}
                className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 flex flex-col items-center text-center hover:border-red-200 hover:shadow-lg transition-all duration-300 group"
              >
                <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${member.color}`}>
                  <member.icon className="w-7 h-7" />
                </div>
                <div className="w-8 h-1 bg-red-600/20 rounded-full mb-3 group-hover:bg-red-600 transition-colors" />
                <span className="text-xs font-bold text-slate-900">{member.focus}</span>
                <span className="text-[10px] text-slate-400 font-medium mt-1">BITSOM · 2026</span>
              </div>
            ))}
          </div>

          {/* Program Badge */}
          <div className="mt-12 bg-slate-900 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-base font-extrabold mb-1">BITS School of Management</h3>
              <p className="text-sm text-slate-300 font-medium">Product Management with Generative & Agentic AI</p>
              <p className="text-xs text-slate-500 mt-1">Capstone Project · 2026</p>
            </div>
            <div className="flex gap-3">
              {['Product Strategy', 'AI', 'UX', 'Research', 'Growth'].map((tag) => (
                <span key={tag} className="text-[10px] font-bold bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-full text-slate-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Looking Ahead */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest block mb-4">Looking Ahead</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight">
            This is only the beginning.
          </h2>
          <p className="text-slate-600 text-base leading-relaxed max-w-2xl mx-auto mb-8 font-medium">
            We're excited about the potential of Agentic AI to transform how professionals access
            information, make decisions, and prepare for important moments. This project is our step
            toward that future — one where AI works alongside people to make them more informed, more
            productive, and more effective.
          </p>
          <p className="text-slate-500 text-sm font-semibold mb-10 italic">Thank you for being part of our journey.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md shadow-red-600/20 text-sm flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl border border-slate-200 text-sm flex items-center justify-center gap-2 transition-all hover:border-slate-300"
            >
              <span>Contact Us</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <SharedFooter />
    </div>
  );
}
