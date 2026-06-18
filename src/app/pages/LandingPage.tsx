import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import {
  Sparkles,
  Users,
  ChevronRight,
  Calendar,
  ArrowRight,
  TrendingUp,
  Newspaper,
  Zap,
  Play,
  Building,
  MapPin,
  DollarSign,
  Check,
  Clock,
  Shield,
  Briefcase
} from 'lucide-react';

const logoImg = new URL('../components/logo_transparent.png', import.meta.url).href;

// Interactive dashboard state template
interface MockBriefData {
  company: string;
  contactName: string;
  contactRole: string;
  industry: string;
  revenue: string;
  funding: string;
  valuation: string;
  insights: string[];
  talkingPoints: string[];
  news: { title: string; source: string; sentiment: 'positive' | 'neutral' };
  icebreaker: string;
}

const mockBriefs: Record<'tesla' | 'microsoft', MockBriefData> = {
  tesla: {
    company: 'Tesla, Inc.',
    contactName: 'Sarah Johnson',
    contactRole: 'VP of Global Enterprise Sales',
    industry: 'Automotive & Clean Energy',
    revenue: '$96.7B',
    funding: 'Public',
    valuation: '$560B',
    insights: [
      'Focusing on scaling enterprise fleet charging infrastructure globally.',
      'Active LinkedIn posts discussing standardizing charging protocols.',
      'Evaluating secondary grid storage options for new gigafactories.'
    ],
    talkingPoints: [
      'Offer customized edge billing API solutions to simplify commercial fleet management.',
      'Highlight compatibility with existing mega-charging hardware configurations.',
      'Reference success stories in high-load industrial power storage grid integrations.'
    ],
    news: {
      title: 'Tesla expands Gigafactory operations to accelerate energy storage production',
      source: 'Bloomberg',
      sentiment: 'positive'
    },
    icebreaker: '"Sarah, congratulations on your recent panel talk about the future of commercial grid load optimization — it really aligns with how we design our data loops."'
  },
  microsoft: {
    company: 'Microsoft Corporation',
    contactName: 'David Miller',
    contactRole: 'Director of Strategic Partnerships',
    industry: 'Enterprise Software & Cloud',
    revenue: '$245.1B',
    funding: 'Public',
    valuation: '$3.1T',
    insights: [
      'Keen on expanding AI agent capabilities within Azure ecosystems.',
      'Recent articles emphasize reducing cloud inference token costs.',
      'Aiming to streamline external ISV partner validation flows.'
    ],
    talkingPoints: [
      'Present our zero-copy local context caching framework for reduced API latency.',
      'Discuss deep integrations with Azure Active Directory and high-security VPC environments.',
      'Detail our turnkey partner API package that cuts partner verification by 80%.'
    ],
    news: {
      title: 'Microsoft announces major updates to Azure AI platform and security services',
      source: 'Wired',
      sentiment: 'positive'
    },
    icebreaker: '"David, saw your article on reducing inference latency on large models — our core architecture actually caches schema contexts exactly for this purpose."'
  }
};

export function LandingPage() {
  const [activeTab, setActiveTab] = useState<'tesla' | 'microsoft'>('tesla');
  const [typedText, setTypedText] = useState('');
  const [showDemoModal, setShowDemoModal] = useState(false);
  const data = mockBriefs[activeTab];

  // AI simulated writing effect for the hero bento card
  useEffect(() => {
    let index = 0;
    const targetText = "Preparing Sarah Johnson brief... Completed in 4.2s. Sentiment: Strongly Positive.";
    setTypedText('');
    const interval = setInterval(() => {
      if (index < targetText.length) {
        setTypedText((prev) => prev + targetText.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 45);
    return () => clearInterval(interval);
  }, [activeTab]);

  return (
    <div className="bg-[#f8fafc] text-[#0f172a] min-h-screen font-sans selection:bg-red-500/20 selection:text-red-700">
      
      {/* 1. Custom Minimal Sticky Landing Header */}
      <header className="sticky top-0 z-50 h-16 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-md flex items-center justify-between px-6 md:px-12 transition-all duration-300">
        <div className="flex items-center gap-1 select-none">
          <img src={logoImg} className="h-14 w-14 flex-shrink-0 object-contain" alt="PRISM Logo" />
          <div className="flex flex-col">
            <div className="flex items-baseline text-lg font-extrabold leading-none tracking-tight">
              <span>PRIS</span>
              <span className="text-red-600">M</span>
            </div>
            <span className="text-[9px] mt-1 text-slate-500 font-medium tracking-tight">
              PreMeeting Research Intelligence System Manager
            </span>
          </div>
        </div>

        {/* Center: Scroll Navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
          <a href="#features" className="hover:text-red-600 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-red-600 transition-colors">How It Works</a>
          <a href="#benefits" className="hover:text-red-600 transition-colors">Benefits</a>
          <a href="#pricing" className="hover:text-red-600 transition-colors">Pricing</a>
          <span className="h-4 w-[1px] bg-slate-200" />
          <Link to="/signin" className="hover:text-red-600 transition-colors">Sign In</Link>
        </nav>

        {/* Right CTA */}
        <div>
          <Link
            to="/signup"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-sm shadow-red-600/10 flex items-center gap-1.5"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center overflow-hidden">
        
        {/* Pulsing Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100/80 mb-6 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
          <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider">
            ✨ Introducing PRISM 1.0 — Walk into meetings fully prepared
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 max-w-4xl leading-[1.1] mb-6">
          Walk Into Every <br className="sm:hidden" />
          <span className="bg-gradient-to-r from-red-600 to-red-800 text-transparent bg-clip-text">Meeting Prepared.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-slate-600 text-base md:text-lg max-w-2xl leading-relaxed mb-8">
          PRISM automatically researches companies, stakeholders, news, and financial signals to generate AI-powered meeting briefs in minutes.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16 z-10">
          <Link
            to="/signup"
            className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md shadow-red-600/20 text-sm flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <span>Get Started Free</span>
            <Sparkles className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setShowDemoModal(true)}
            className="px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl border border-slate-200 shadow-xs text-sm flex items-center justify-center gap-2 transition-all cursor-pointer hover:border-slate-300"
          >
            <Play className="w-4 h-4 fill-slate-800 text-slate-800" />
            <span>Watch Demo</span>
          </button>
        </div>

        {/* 3. Hero Visual - Interactive Live Dashboard Mockup */}
        <div className="w-full max-w-5xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden text-left mb-12">
          
          {/* Header of Mockup */}
          <div className="bg-slate-50/80 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-300" />
                <span className="w-3 h-3 rounded-full bg-slate-300" />
                <span className="w-3 h-3 rounded-full bg-slate-300" />
              </div>
              <span className="h-4 w-[1px] bg-slate-300" />
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-red-600" />
                <span>Live Interactive Sandbox Brief Preview</span>
              </div>
            </div>

            {/* Selector tabs for interaction */}
            <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg border border-slate-300/40 w-fit">
              <button
                onClick={() => setActiveTab('tesla')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'tesla'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-850'
                }`}
              >
                Tesla (VP Sales)
              </button>
              <button
                onClick={() => setActiveTab('microsoft')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'microsoft'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-850'
                }`}
              >
                Microsoft (Strategic Partnerships)
              </button>
            </div>
          </div>

          {/* Body of Mockup */}
          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white">
            
            {/* Left Column: Agenda & Attendee Card */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Meeting Card */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600 font-extrabold text-sm border border-red-200">
                    {data.company.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">{data.company}</h3>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">{data.industry}</p>
                  </div>
                </div>

                <div className="space-y-3 border-t border-slate-200/60 pt-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Tomorrow, 11:00 AM</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs font-semibold text-slate-700">
                    <Users className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <span className="font-bold text-slate-900">{data.contactName}</span>
                      <span className="text-slate-500 block text-[10px] font-medium">{data.contactRole}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Metrics */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 flex flex-col gap-4">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Company Intelligence</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white p-2 rounded-lg border border-slate-200/60 text-center">
                    <span className="text-[10px] font-medium text-slate-400 block">Valuation</span>
                    <span className="text-xs font-extrabold text-slate-800">{data.valuation}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200/60 text-center">
                    <span className="text-[10px] font-medium text-slate-400 block">Revenue</span>
                    <span className="text-xs font-extrabold text-slate-800">{data.revenue}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200/60 text-center">
                    <span className="text-[10px] font-medium text-slate-400 block">Funding</span>
                    <span className="text-xs font-extrabold text-green-600">{data.funding}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column: Dynamic AI Brief Content */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Main AI Brief Panel */}
              <div className="bg-[#fafafa] rounded-xl p-6 border border-slate-200 flex-1 relative overflow-hidden">
                
                {/* Simulated AI indicator */}
                <div className="flex items-center gap-2 mb-4 bg-red-50 text-red-700 w-fit px-2.5 py-1 rounded-md border border-red-100 text-[10px] font-bold">
                  <Sparkles className="w-3 h-3 text-red-600 animate-spin" />
                  <span className="font-mono text-[9px] tracking-tight">{typedText || "Analyzing database signals..."}</span>
                </div>

                <div className="space-y-5">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Stakeholder Insights & Bio</h4>
                    <p className="text-xs font-medium text-slate-700 bg-white border border-slate-200/60 p-3 rounded-lg leading-relaxed italic">
                      {data.icebreaker}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Key Meeting Objectives</h4>
                    <ul className="space-y-2">
                      {data.insights.map((insight, idx) => (
                        <li key={idx} className="flex gap-2 text-xs font-semibold text-slate-700">
                          <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Strategic Talking Points</h4>
                    <ul className="space-y-2">
                      {data.talkingPoints.map((point, idx) => (
                        <li key={idx} className="flex gap-2 text-xs font-semibold text-slate-700">
                          <span className="w-4 h-4 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-slate-200/60 pt-3">
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Recent News Signal</h4>
                    <div className="bg-white p-3 rounded-lg border border-slate-200/60 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">{data.news.source}</span>
                        <p className="text-xs font-bold text-slate-800 leading-tight mt-0.5 truncate">{data.news.title}</p>
                      </div>
                      <span className="text-[9px] font-extrabold uppercase bg-green-50 text-green-600 border border-green-100 rounded-full px-2 py-0.5 shrink-0 self-center">
                        {data.news.sentiment}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section id="features" className="py-24 px-6 md:px-12 bg-white border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-16">
            <h2 className="text-xs font-extrabold text-red-600 uppercase tracking-widest mb-3">Enterprise Grade Intelligence</h2>
            <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Everything you need to close the deal</p>
            <p className="text-slate-500 text-xs md:text-sm mt-3 max-w-lg mx-auto">
              Our automated models cross-reference institutional records, dynamic news signals, social feeds, and corporate statements in seconds.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200/70 p-6 flex flex-col justify-between hover:border-red-600 hover:shadow-lg transition-all duration-300 group">
              <div>
                <div className="w-10 h-10 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center text-red-600 mb-5 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">1. AI Meeting Briefs</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Get a complete, summarized PDF or digital outline loaded with intelligence coordinates automatically compiled 15 minutes before your meeting starts.
                </p>
              </div>
              <div className="mt-6 border-t border-slate-200/40 pt-4 flex items-center gap-1 text-[11px] font-bold text-slate-400 group-hover:text-red-600 transition-colors">
                <span>See live preview</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200/70 p-6 flex flex-col justify-between hover:border-red-600 hover:shadow-lg transition-all duration-300 group">
              <div>
                <div className="w-10 h-10 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center text-red-600 mb-5 group-hover:scale-110 transition-transform">
                  <Building className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">2. Company Intelligence</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Instantly analyze corporate structure, technology stack mapping, recent infrastructure decisions, and core employee growth velocities to spot alignment targets.
                </p>
              </div>
              <div className="mt-6 border-t border-slate-200/40 pt-4 flex items-center gap-1 text-[11px] font-bold text-slate-400 group-hover:text-red-600 transition-colors">
                <span>Track technology metrics</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200/70 p-6 flex flex-col justify-between hover:border-red-600 hover:shadow-lg transition-all duration-300 group">
              <div>
                <div className="w-10 h-10 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center text-red-600 mb-5 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">3. Stakeholder Research</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Understand executive bios, past achievements, shared mutual connections, active LinkedIn focus points, and specific psychological talking triggers in one tab.
                </p>
              </div>
              <div className="mt-6 border-t border-slate-200/40 pt-4 flex items-center gap-1 text-[11px] font-bold text-slate-400 group-hover:text-red-600 transition-colors">
                <span>View executive coordinates</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200/70 p-6 flex flex-col justify-between hover:border-red-600 hover:shadow-lg transition-all duration-300 group">
              <div>
                <div className="w-10 h-10 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center text-red-600 mb-5 group-hover:scale-110 transition-transform">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">4. Financial Insights</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Keep tabs on cash runway, active funding histories, estimated revenues, valuation metrics, and critical burn coordinates to propose the optimal package.
                </p>
              </div>
              <div className="mt-6 border-t border-slate-200/40 pt-4 flex items-center gap-1 text-[11px] font-bold text-slate-400 group-hover:text-red-600 transition-colors">
                <span>Analyze financial pipelines</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200/70 p-6 flex flex-col justify-between hover:border-red-600 hover:shadow-lg transition-all duration-300 group">
              <div>
                <div className="w-10 h-10 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center text-red-600 mb-5 group-hover:scale-110 transition-transform">
                  <Newspaper className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">5. News Monitoring</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Receive live, summarized breakdowns of press releases, corporate acquisitions, local news releases, and executive movements with built-in positive/negative indices.
                </p>
              </div>
              <div className="mt-6 border-t border-slate-200/40 pt-4 flex items-center gap-1 text-[11px] font-bold text-slate-400 group-hover:text-red-600 transition-colors">
                <span>Filter active feed</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200/70 p-6 flex flex-col justify-between hover:border-red-600 hover:shadow-lg transition-all duration-300 group">
              <div>
                <div className="w-10 h-10 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center text-red-600 mb-5 group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">6. Strategic Talking Points</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Armed with customizable conversation topics that target direct pain points. Seamlessly overcome technical objections and pitch with precision.
                </p>
              </div>
              <div className="mt-6 border-t border-slate-200/40 pt-4 flex items-center gap-1 text-[11px] font-bold text-slate-400 group-hover:text-red-600 transition-colors">
                <span>Review talking points</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 md:px-12 bg-slate-50/50">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-20">
            <h2 className="text-xs font-extrabold text-red-600 uppercase tracking-widest mb-3">Simple Integration</h2>
            <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">How PRISM Empowers Your Calendar</p>
          </div>

          <div className="relative">
            {/* Timeline connection line */}
            <div className="absolute left-[39px] md:left-1/2 top-4 bottom-4 w-0.5 bg-slate-200 -translate-x-1/2" />

            <div className="space-y-12">
              
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row gap-8 items-start relative group">
                <div className="flex md:w-1/2 md:justify-end items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-50 border-2 border-red-500 text-red-600 flex items-center justify-center font-black text-sm shrink-0 md:order-2 z-10">1</div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs md:text-right flex-1 ml-14 md:ml-0">
                    <span className="text-[10px] font-extrabold text-red-600 uppercase block tracking-wider mb-1">Step 1</span>
                    <h3 className="text-sm font-extrabold text-slate-900 mb-1">Connect your meetings</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">Integrate Outlook, Google Calendar, or Salesforce CRM with one click securely.</p>
                  </div>
                </div>
                <div className="hidden md:block w-1/2" />
              </div>

              {/* Step 2 */}
              <div className="flex flex-col md:flex-row gap-8 items-start relative group">
                <div className="hidden md:block w-1/2" />
                <div className="flex md:w-1/2 items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-50 border-2 border-red-500 text-red-600 flex items-center justify-center font-black text-sm shrink-0 z-10">2</div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex-1 ml-14 md:ml-0">
                    <span className="text-[10px] font-extrabold text-red-600 uppercase block tracking-wider mb-1">Step 2</span>
                    <h3 className="text-sm font-extrabold text-slate-900 mb-1">AI researches companies and contacts</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">Our agent engine queries live search matrices, social metrics, and press reports.</p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col md:flex-row gap-8 items-start relative group">
                <div className="flex md:w-1/2 md:justify-end items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-50 border-2 border-red-500 text-red-600 flex items-center justify-center font-black text-sm shrink-0 md:order-2 z-10">3</div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs md:text-right flex-1 ml-14 md:ml-0">
                    <span className="text-[10px] font-extrabold text-red-600 uppercase block tracking-wider mb-1">Step 3</span>
                    <h3 className="text-sm font-extrabold text-slate-900 mb-1">Receive a complete meeting brief</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">A visually stunning intelligence sheet will be ready on your web panel or email inbox.</p>
                  </div>
                </div>
                <div className="hidden md:block w-1/2" />
              </div>

              {/* Step 4 */}
              <div className="flex flex-col md:flex-row gap-8 items-start relative group">
                <div className="hidden md:block w-1/2" />
                <div className="flex md:w-1/2 items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-50 border-2 border-red-500 text-red-600 flex items-center justify-center font-black text-sm shrink-0 z-10">4</div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex-1 ml-14 md:ml-0">
                    <span className="text-[10px] font-extrabold text-red-600 uppercase block tracking-wider mb-1">Step 4</span>
                    <h3 className="text-sm font-extrabold text-slate-900 mb-1">Walk into meetings fully prepared</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">Pitch directly to specific organizational pain points and establish perfect alignment.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 6. Benefits Section */}
      <section id="benefits" className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-16">
            <h2 className="text-xs font-extrabold text-red-600 uppercase tracking-widest mb-3">Direct ROI Outcomes</h2>
            <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Never Prep Manually Again</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 mb-1">Save hours of manual research</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Stop parsing complex corporate websites, financial releases, and profiles across tabs. PRISM does it all in 15 seconds.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
                <Newspaper className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 mb-1">Never miss important company updates</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Receive real-time alerts if a prospect prospect raises capital, lands a big client, or transitions their board members overnight.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 mb-1">Improve meeting quality</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Greet buyers with tailored icebreakers, precise business challenges, and specific architectural proposals that showcase depth.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 mb-1">Increase sales effectiveness</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Convert cold intro syncs into hot pipeline proposals by matching their strategy coordinates without asking simple questions.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6.5. Pricing Section */}
      <section id="pricing" className="py-24 px-6 md:px-12 bg-slate-50/50 border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-16">
            <h2 className="text-xs font-extrabold text-red-600 uppercase tracking-widest mb-3">Simple Pricing</h2>
            <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Plans for every team size</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Essential */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col hover:border-red-200 hover:shadow-lg transition-all relative">
              <h3 className="text-lg font-black text-slate-900 mb-2">Essential</h3>
              <p className="text-xs text-slate-500 font-medium mb-6">Perfect for small teams starting with AI research.</p>
              <div className="mb-6">
                <span className="text-3xl font-black text-slate-900">₹4,000</span>
                <span className="text-xs text-slate-500 font-medium"> / user / month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-2 text-sm text-slate-700 font-medium"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> 50 AI Meeting Briefs / month</li>
                <li className="flex items-start gap-2 text-sm text-slate-700 font-medium"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Standard Company Intelligence</li>
                <li className="flex items-start gap-2 text-sm text-slate-700 font-medium"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Basic News Monitoring</li>
              </ul>
              <Link to="/signup" className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-xl transition-colors text-center">
                Get Started
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-2xl border-2 border-red-600 p-8 flex flex-col shadow-xl relative scale-100 md:scale-105 z-10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                Most Popular
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Pro</h3>
              <p className="text-xs text-slate-500 font-medium mb-6">Advanced intelligence for high-performing sales teams.</p>
              <div className="mb-6">
                <span className="text-3xl font-black text-slate-900">₹9,500</span>
                <span className="text-xs text-slate-500 font-medium"> / user / month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-2 text-sm text-slate-700 font-medium"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Unlimited AI Meeting Briefs</li>
                <li className="flex items-start gap-2 text-sm text-slate-700 font-medium"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Deep Stakeholder Research</li>
                <li className="flex items-start gap-2 text-sm text-slate-700 font-medium"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Financial Insights & Alerts</li>
                <li className="flex items-start gap-2 text-sm text-slate-700 font-medium"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> CRM Integration (Salesforce, Hubspot)</li>
              </ul>
              <Link to="/signup" className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-colors text-center shadow-md shadow-red-600/20">
                Start Free Trial
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col hover:border-red-200 hover:shadow-lg transition-all relative">
              <h3 className="text-lg font-black text-slate-900 mb-2">Enterprise</h3>
              <p className="text-xs text-slate-500 font-medium mb-6">Custom deployment for large organizations.</p>
              <div className="mb-6">
                <span className="text-3xl font-black text-slate-900">₹17,000</span>
                <span className="text-xs text-slate-500 font-medium"> / user / month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-2 text-sm text-slate-700 font-medium"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Everything in Pro</li>
                <li className="flex items-start gap-2 text-sm text-slate-700 font-medium"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Custom AI Knowledge Base</li>
                <li className="flex items-start gap-2 text-sm text-slate-700 font-medium"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Dedicated Success Manager</li>
                <li className="flex items-start gap-2 text-sm text-slate-700 font-medium"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Enterprise-grade Security & SSO</li>
              </ul>
              <Link to="/signup" className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-xl transition-colors text-center">
                Contact Sales
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Call To Action Banner */}
      <section className="py-20 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-red-600 to-red-800 text-white rounded-3xl p-10 md:p-16 text-center relative overflow-hidden shadow-xl shadow-red-700/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent)] pointer-events-none" />
          <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Start Preparing Smarter</h2>
          <p className="text-red-100/90 text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-8">
            Walk into your very next customer sync with complete background knowledge. Connect your calendar and let PRISM work in seconds.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-red-700 font-extrabold text-sm rounded-xl transition-all hover:scale-105 active:scale-100 shadow-md shadow-red-950/20"
          >
            <span>Get Started for Free</span>
            <ArrowRight className="w-4 h-4 text-red-600" />
          </Link>
        </div>
      </section>

      {/* 8. Full Footer */}
      <footer className="border-t border-slate-200/70 bg-white pt-14 pb-8 px-6 md:px-12 text-xs font-semibold text-slate-400">
        <div className="max-w-6xl mx-auto">

          {/* Top row: Logo + columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">

            {/* Brand */}
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1 mb-3">
                <img src={logoImg} className="h-10 w-10 object-contain grayscale opacity-60" alt="PRISM Logo" />
                <div className="text-left leading-none">
                  <span className="font-extrabold text-slate-500 text-sm">PRISM</span>
                  <p className="text-[8px] text-slate-400 mt-0.5">PreMeeting Research Intelligence System Manager</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed max-w-[180px]">
                AI-powered meeting intelligence for modern sales teams.
              </p>
            </div>

            {/* Product */}
            <div>
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-4">Product</span>
              <ul className="space-y-3">
                <li><Link to="/features" className="hover:text-red-600 transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-red-600 transition-colors">Pricing</Link></li>
                <li><Link to="/security" className="hover:text-red-600 transition-colors">Security</Link></li>
                <li><Link to="/support" className="hover:text-red-600 transition-colors">Support</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-4">Company</span>
              <ul className="space-y-3">
                <li><Link to="/about" className="hover:text-red-600 transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-red-600 transition-colors">Contact Us</Link></li>
                <li>
                  <a href="https://status.prism.ai" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                    System Status
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-4">Legal</span>
              <ul className="space-y-3">
                <li><Link to="/privacy" className="hover:text-red-600 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-red-600 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom row: copyright + CTA */}
          <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[10px] font-medium text-slate-400">© 2026 PRISM Technologies. All rights reserved. Built at BITS School of Management.</span>
            <Link
              to="/signup"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[11px] font-bold transition-all hover:-translate-y-0.5 shadow-sm shadow-red-600/10 flex items-center gap-1.5 whitespace-nowrap"
            >
              <Sparkles className="w-3 h-3" />
              <span>Get Started Free</span>
            </Link>
          </div>

        </div>
      </footer>

      {/* Watch Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
            >
              ×
            </button>
            <div className="mb-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-red-600" />
                <span>PRISM Walkthrough Demonstration</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">See how automated briefs parse live B2B target indices instantly.</p>
            </div>
            
            {/* Embedded mockup of a media video */}
            <div className="aspect-video bg-slate-950 rounded-xl flex flex-col items-center justify-center relative border border-slate-800 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-red-950/20 to-transparent pointer-events-none" />
              <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/30 scale-100 hover:scale-105 active:scale-95 transition-all cursor-pointer">
                <Play className="w-6 h-6 fill-white text-white translate-x-0.5" />
              </div>
              <p className="text-xs text-slate-400 font-mono mt-4">PRISM_Product_Tour_V1_2026.mp4 (02:45)</p>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowDemoModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-200/60 transition-colors cursor-pointer"
              >
                Close Window
              </button>
              <Link
                to="/signup"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>Get Started Now</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
