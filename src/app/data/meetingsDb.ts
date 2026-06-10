export interface Attendee {
  name: string;
  role: string;
  email: string;
  linkedin: string;
  phone: string;
  bio: string;
  insights: string;
}

export interface Financials {
  valuation: string;
  funding: string;
  revenue: string;
  burnRate: string;
  runway: string;
  details: string;
}

export interface SocialMedia {
  sentiment: 'positive' | 'neutral' | 'negative';
  summary: string;
  latestPost: string;
  engagement: string;
  followers: string;
}

export interface NewsArticle {
  title: string;
  source: string;
  date: string;
  summary: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface AgendaItem {
  step: string;
  title: string;
  desc: string;
}

export interface ObjectionItem {
  title: string;
  points: string[];
}

export interface IcebreakerItem {
  target: string;
  text: string;
}

export interface MeetingDetails {
  id: string;
  company: string;
  title: string;
  date: string;
  time: string;
  status: string;
  industry: string;
  headquarters: string;
  employeeSize: string;
  summary: string;
  keyTalkingPoints: string[];
  agenda: AgendaItem[];
  objections: ObjectionItem[];
  icebreakers: IcebreakerItem[];
  attendees: Attendee[];
  financials: Financials;
  socialMedia: SocialMedia;
  news: NewsArticle[];
  rawDocument?: any;
}

const meetingsData: Record<string, MeetingDetails> = {
  '1': {
    id: '1',
    company: 'TechCorp Solutions',
    title: 'Q2 Strategy Review',
    date: 'May 23, 2026',
    time: '10:00 AM - 11:00 AM',
    status: 'Upcoming',
    industry: 'Enterprise SaaS / Cloud Infrastructure',
    headquarters: 'San Francisco, CA',
    employeeSize: '850-1,000',
    summary: 'TechCorp Solutions is a rapidly growing enterprise software company specializing in cloud-based data integration and analytics platforms. Founded in 2018, they\'ve secured $50M in Series B funding and are experiencing 45% YoY growth. Their platform serves Fortune 500 companies in finance, healthcare, and retail sectors.',
    keyTalkingPoints: [
      'Emphasize our platform\'s ability to handle real-time data integration at scale - directly addresses their recent AWS partnership',
      'Highlight success stories with similar-sized companies in their industry (reference DataFlow case study)',
      'Discuss AI-powered analytics capabilities - aligns with Alex Rivera\'s recent LinkedIn interests',
      'Address data security and compliance - critical for their Fortune 500 customer base'
    ],
    agenda: [
      { step: '1', title: 'Opening & Relationship Building (5 min)', desc: 'Congratulate on Series B, mention AWS partnership' },
      { step: '2', title: 'Current Challenges Discussion (10 min)', desc: 'Understand their data integration pain points' },
      { step: '3', title: 'Solution Presentation (20 min)', desc: 'Demo platform capabilities, focus on scalability' },
      { step: '4', title: 'Q&A & Technical Deep Dive (15 min)', desc: 'Mike Chen likely to ask about architecture' },
      { step: '5', title: 'Next Steps & Timeline (10 min)', desc: 'Propose pilot program, discuss implementation' }
    ],
    objections: [
      { title: 'Security Concerns', points: ['Data transit encryption compliance', 'Integration with existing enterprise IAM/SSO protocols'] },
      { title: 'Timeline & Execution', points: ['Deployment window alignment', 'Integration support with internal data teams'] }
    ],
    icebreakers: [
      { target: 'Sarah Johnson (CEO)', text: '"I saw your recent post about data integration challenges - that really resonated with what we\'re hearing from other enterprise leaders."' },
      { target: 'Mike Chen (CTO)', text: '"Your background at AWS is impressive - I\'d love to hear your thoughts on how microservices architecture plays into your integration strategy."' },
      { target: 'Alex Rivera (VP Product)', text: '"Noticed your interest in AI-powered analytics - we\'ve just launched some exciting capabilities in that area that I think you\'ll find interesting."' }
    ],
    attendees: [
      {
        name: 'Sarah Johnson',
        role: 'Chief Executive Officer',
        email: 'sarah.j@techcorp.com',
        linkedin: 'linkedin.com/in/sarahjohnson',
        phone: '+1 (555) 123-4567',
        bio: '15+ years leading B2B SaaS companies. Previously VP of Sales at CloudScale Inc.',
        insights: 'Recently posted about challenges with data integration across multiple platforms.'
      },
      {
        name: 'Mike Chen',
        role: 'Chief Technology Officer',
        email: 'mike.c@techcorp.com',
        linkedin: 'linkedin.com/in/mikechen',
        phone: '+1 (555) 234-5678',
        bio: 'Former Principal Engineer at Amazon Web Services. Strong focus on scalable infrastructure.',
        insights: 'Active in tech forums discussing microservices architecture and API management.'
      }
    ],
    financials: {
      valuation: '$420M',
      funding: '$87M',
      revenue: '$71M (est.)',
      burnRate: '$4.2M/mo',
      runway: '20 months',
      details: 'Series B: $50M (Latest)'
    },
    socialMedia: {
      sentiment: 'positive',
      summary: 'Highly active on LinkedIn discussing enterprise Cloud trends. Active corporate branding showing a +24% increase in online mentions following the AWS alliance.',
      latestPost: '“Thrilled to announce our strategic alliance with AWS. This partnership allows us to scale cloud data ingestion workflows seamlessly for our mutual enterprise customers...”',
      engagement: 'High (+12% relative to industry benchmarks)',
      followers: '15,200 followers'
    },
    news: [
      {
        title: 'TechCorp Solutions Raises $50M Series B to Expand Enterprise Offerings',
        source: 'TechCrunch',
        date: '2 weeks ago',
        summary: 'TechCorp announces significant funding round led by Sequoia Capital to accelerate product development and expand into European markets.',
        sentiment: 'positive'
      },
      {
        title: 'TechCorp Partners with AWS to Deliver Enhanced Cloud Solutions',
        source: 'Business Wire',
        date: '1 month ago',
        summary: 'Strategic partnership announcement positions TechCorp as preferred integration solution for AWS enterprise customers.',
        sentiment: 'positive'
      }
    ]
  },
  '2': {
    id: '2',
    company: 'DataStream Inc',
    title: 'Product Demo',
    date: 'May 23, 2026',
    time: '2:00 PM - 3:00 PM',
    status: 'Upcoming',
    industry: 'Real-time Analytics & Big Data',
    headquarters: 'Seattle, WA',
    employeeSize: '300-400',
    summary: 'DataStream Inc provides high-throughput streaming analytics platforms for financial services and modern e-commerce companies. They process billions of events daily, enabling real-time fraud detection and operational monitoring.',
    keyTalkingPoints: [
      'Focus on latency reduction and zero-copy data streaming architecture.',
      'Showcase our automated schema registry support and integration with Kafka/Flink environments.',
      'Highlight compliance certifications (SOC2 Type II, HIPAA) which are essential for their banking prospects.'
    ],
    agenda: [
      { step: '1', title: 'Intro & Demonstration Prep (10 min)', desc: 'Quick check of streaming inputs and dashboard access' },
      { step: '2', title: 'Interactive Product Walkthrough (25 min)', desc: 'Demonstrate setup, ingestion setup, and anomaly alert rules' },
      { step: '3', title: 'Integration Q&A (15 min)', desc: 'Review pipeline configs and connectors' },
      { step: '4', title: 'Pricing & Next Steps (10 min)', desc: 'Discuss subscription options and pilot scope' }
    ],
    objections: [
      { title: 'Implementation Overhead', points: ['Requires custom connector engineering for legacy mainframe streams.', 'Developer training curve.'] }
    ],
    icebreakers: [
      { target: 'Jennifer Lee (VP Operations)', text: '"I saw you recently spoke at BigDataCon about real-time streaming issues - your point about database scaling was spot on."' }
    ],
    attendees: [
      {
        name: 'Jennifer Lee',
        role: 'VP of Engineering',
        email: 'jennifer.l@datastream.io',
        linkedin: 'linkedin.com/in/jenniferlee-eng',
        phone: '+1 (555) 456-7890',
        bio: 'Former Engineering Manager at Snowflake. Passionate about real-time streaming architectures.',
        insights: 'Spearheading modern data stack migration.'
      },
      {
        name: 'David Park',
        role: 'Director of Security',
        email: 'david.p@datastream.io',
        linkedin: 'linkedin.com/in/davidpark-sec',
        phone: '+1 (555) 567-8901',
        bio: '10+ years in application and network security. Ex-Okta Security Architect.',
        insights: 'Extremely thorough about third-party risk assessments and data privacy.'
      }
    ],
    financials: {
      valuation: '$150M',
      funding: '$25M',
      revenue: '$22M (est.)',
      burnRate: '$1.5M/mo',
      runway: '16 months',
      details: 'Series A: $18M (1 year ago)'
    },
    socialMedia: {
      sentiment: 'neutral',
      summary: 'Moderate social media footprint. Engineering team regularly blogs about Kafka, Rust integration, and memory footprint optimizations.',
      latestPost: '“Our engineering team just published a new article on optimizing Rust stream processing bottlenecks. Read how we cut garbage collection pauses by 80%...”',
      engagement: 'Average (+4% vs competitors)',
      followers: '8,400 followers'
    },
    news: [
      {
        title: 'DataStream Inc Selected as Top 50 Big Data Disruptor',
        source: 'Forbes',
        date: '3 months ago',
        summary: 'DataStream recognized for its innovative zero-copy stream processing model that cuts cloud compute infrastructure costs.',
        sentiment: 'positive'
      }
    ]
  },
  '3': {
    id: '3',
    company: 'CloudVentures',
    title: 'Partnership Discussion',
    date: 'May 24, 2026',
    time: '9:00 AM - 10:00 AM',
    status: 'Upcoming',
    industry: 'Cloud Infrastructure & Managed Kubernetes',
    headquarters: 'Austin, TX',
    employeeSize: '120-150',
    summary: 'CloudVentures helps mid-sized enterprises migrate and manage complex Kubernetes deployments across multi-cloud environments. They specialize in GitOps automation and security hardening.',
    keyTalkingPoints: [
      'Focus on GitOps workflow integrations with our monitoring dashboard.',
      'Present mutual referral program and co-selling opportunities for enterprise Kubernetes clusters.',
      'Showcase how our integration lowers onboarding times for new cluster tenants.'
    ],
    agenda: [
      { step: '1', title: 'Alignment & Strategy Review (15 min)', desc: 'Explore mutual customer profiles and expansion opportunities' },
      { step: '2', title: 'Product Integration Scenarios (20 min)', desc: 'Review API endpoints and dashboard UI embed capabilities' },
      { step: '3', title: 'Go-to-Market Strategy (15 min)', desc: 'Define joint webinar and developer newsletter promotion' },
      { step: '4', title: 'Action Plan (10 min)', desc: 'Set dates for technical proof-of-concept setup' }
    ],
    objections: [
      { title: 'Resource Constraints', points: ['Engineering team is currently dedicated to Q2 product launch.', 'Marketing sync delayed.'] }
    ],
    icebreakers: [
      { target: 'Emma Watson (Co-Founder)', text: '"I read your TechCrunch feature about bootstrap vs venture funding - your perspective as an engineering founder was great."' }
    ],
    attendees: [
      {
        name: 'Emma Watson',
        role: 'Co-Founder & CTO',
        email: 'emma@cloudventures.co',
        linkedin: 'linkedin.com/in/emmawatson-tech',
        phone: '+1 (555) 789-0123',
        bio: 'Kubernetes contributor and advocate. Created multiple open-source GitOps utilities.',
        insights: 'Expressed strong interest in simple UI dashboards for non-technical managers.'
      }
    ],
    financials: {
      valuation: '$85M',
      funding: '$30M',
      revenue: '$8.5M (est.)',
      burnRate: '$800K/mo',
      runway: '24 months',
      details: 'Series B: $30M (Latest)'
    },
    socialMedia: {
      sentiment: 'positive',
      summary: 'Highly active in open-source cloud communities. Strong presence on GitHub and Reddit (r/kubernetes) with regular tech contributions.',
      latestPost: '“Announcing our $30M Series B funding! We are excited to partner with Peak Ventures to accelerate GitOps automation features for multi-cloud enterprise deployments...”',
      engagement: 'Very High (+18% vs benchmarks)',
      followers: '19,500 followers'
    },
    news: [
      {
        title: 'CloudVentures Raises $30M Series B Led by Peak Ventures',
        source: 'TechCrunch',
        date: '1 hour ago',
        summary: 'CloudVentures plans to double engineering headcount and expand GitOps platforms to cover multi-region Azure and GCP setups.',
        sentiment: 'positive'
      }
    ]
  },
  '4': {
    id: '4',
    company: 'FinTech Global',
    title: 'Initial Discovery Call',
    date: 'May 24, 2026',
    time: '3:30 PM - 4:00 PM',
    status: 'Upcoming',
    industry: 'Financial Services & Payments API',
    headquarters: 'New York, NY',
    employeeSize: '1,500-2,000',
    summary: 'FinTech Global is a major payment processing API provider serving international e-commerce platforms. They support 130+ currencies and multi-rail payment corridors (ACH, SEPA, Cards, Crypto).',
    keyTalkingPoints: [
      'Understand their regional latency challenges in European and APAC payment gateways.',
      'Showcase our globally distributed database architecture and edge processing integrations.',
      'Address regional compliance requirements (GDPR, PSD3) and data residency.'
    ],
    agenda: [
      { step: '1', title: 'Introduction & Context (10 min)', desc: 'Verify team roles and high-level requirements' },
      { step: '2', title: 'Problem Discovery (15 min)', desc: 'Explore checkout latency and failover issues' },
      { step: '3', title: 'Capabilities Overview (5 min)', desc: 'Showcase edge middleware and database scaling' }
    ],
    objections: [
      { title: 'Integration Risk', points: ['Any downtime during payment migration could cost millions.', 'Fallback logic needs validation.'] }
    ],
    icebreakers: [
      { target: 'James Wilson (Lead Architect)', text: '"I saw you recently wrote a blog post on Stripe migration challenges - that was very relevant to our payment gateway work."' }
    ],
    attendees: [
      {
        name: 'James Wilson',
        role: 'Lead Architect',
        email: 'james.w@fintechglobal.com',
        linkedin: 'linkedin.com/in/jameswilson-arch',
        phone: '+1 (555) 901-2345',
        bio: 'Veteran payments architect. Formerly led core clearing engine rebuild at Visa.',
        insights: 'Extremely focused on high-availability, low-latency architectures.'
      }
    ],
    financials: {
      valuation: '$1.2B',
      funding: '$220M',
      revenue: '$140M (est.)',
      burnRate: '$8M/mo',
      runway: '28 months',
      details: 'Series C: $120M (9 months ago)'
    },
    socialMedia: {
      sentiment: 'positive',
      summary: 'Strong professional presence. Key executives publish thought leadership on banking-as-a-service, cross-border remittance, and digital wallet regulations.',
      latestPost: '“Excited to announce our expansion into European markets with new localized payment options for digital platforms. Enabling smoother checkout experiences for over 40 million shoppers...”',
      engagement: 'Good (+6% vs financial tech benchmark)',
      followers: '45,000 followers'
    },
    news: [
      {
        title: 'FinTech Global Secures Regulatory Licenses for EU Expansion',
        source: 'Bloomberg',
        date: '2 weeks ago',
        summary: 'FinTech Global secures e-money license from central bank, enabling direct clearing services across 27 EU member nations.',
        sentiment: 'positive'
      }
    ]
  }
};

export const getMeetingDetails = (id: string): MeetingDetails => {
  // If the ID exists in our mock database, return it
  if (meetingsData[id]) {
    return meetingsData[id];
  }

  // Otherwise, return a default dynamic template based on TechCorp structure to ensure the page never breaks
  return {
    ...meetingsData['1'],
    id,
    company: `Dynamic Corp ${id}`,
    title: 'Discovery & Intro Meeting'
  };
};

export function parseSignalItem(item: any): { signal: string; source: string; confidence: string; source_url: string } {
  if (typeof item === 'string') {
    try {
      const parsed = JSON.parse(item);
      if (parsed && typeof parsed === 'object') {
        return {
          signal: parsed.signal || parsed.claim || '',
          source: parsed.source || '',
          confidence: parsed.confidence || '',
          source_url: parsed.source_url || parsed.url || '',
        };
      }
    } catch (e) {
      return { signal: item, source: 'News Intelligence Feed', confidence: 'High', source_url: '' };
    }
  } else if (item && typeof item === 'object') {
    return {
      signal: item.signal || item.claim || '',
      source: item.source || '',
      confidence: item.confidence || '',
      source_url: item.source_url || item.url || '',
    };
  }
  return { signal: String(item), source: '', confidence: '', source_url: '' };
}

/**
 * Maps standard raw database row from public.meeting_briefs to React-compatible MeetingDetails interface
 */
export function mapDbBriefToMeetingDetails(row: any): MeetingDetails {
  // Map recent news
  let mappedNews: NewsArticle[] = [];
  let rawNews = row.recent_news_that_matters;
  if (typeof rawNews === 'string') {
    try { rawNews = JSON.parse(rawNews); } catch (e) {}
  }
  if (Array.isArray(rawNews)) {
    mappedNews = rawNews.map((item: any) => {
      if (typeof item === 'string') {
        return {
          title: item,
          source: 'n8n Intelligence Feed',
          date: 'Recently',
          summary: item,
          sentiment: 'neutral' as const
        };
      }
      return {
        title: item.title || item.headline || 'Intelligence Signal',
        source: item.source || 'News Intelligence Agent',
        date: item.date || item.published || 'Recently',
        summary: item.summary || item.description || JSON.stringify(item),
        sentiment: (item.sentiment === 'positive' || item.sentiment === 'negative' || item.sentiment === 'neutral')
          ? item.sentiment
          : 'neutral' as const
      };
    });
  }

  // Map talking points
  let keyTalkingPoints: string[] = [];
  let rawTalkingPoints = row.talking_points;
  if (typeof rawTalkingPoints === 'string') {
    try { rawTalkingPoints = JSON.parse(rawTalkingPoints); } catch (e) {}
  }
  
  if (Array.isArray(rawTalkingPoints)) {
    keyTalkingPoints = rawTalkingPoints;
  } else if (typeof rawTalkingPoints === 'string') {
    keyTalkingPoints = [rawTalkingPoints];
  } else if (Array.isArray(row.discovery_questions)) {
    keyTalkingPoints = row.discovery_questions;
  }

  // Map objections
  let mappedObjections: ObjectionItem[] = [];
  let rawObjections = row.risks_or_red_flags;
  if (typeof rawObjections === 'string') {
    try { rawObjections = JSON.parse(rawObjections); } catch (e) {}
  }
  
  if (Array.isArray(rawObjections)) {
    mappedObjections = [
      {
        title: 'Risks & Red Flags Detected',
        points: rawObjections
      }
    ];
  } else if (typeof rawObjections === 'string') {
    mappedObjections = [
      {
        title: 'Risks & Red Flags Detected',
        points: [rawObjections]
      }
    ];
  }

  // Map agenda
  let agendaItems: AgendaItem[] = [];
  if (row.recommended_meeting_strategy) {
    agendaItems.push({
      step: 'S',
      title: 'Recommended Strategy',
      desc: row.recommended_meeting_strategy
    });
  }
  if (row.rep_focus) {
    agendaItems.push({
      step: 'F',
      title: 'Representative Focus',
      desc: row.rep_focus
    });
  }
  
  let rawDiscovery = row.discovery_questions;
  if (typeof rawDiscovery === 'string') {
    try { rawDiscovery = JSON.parse(rawDiscovery); } catch (e) {}
  }
  
  if (Array.isArray(rawDiscovery)) {
    rawDiscovery.forEach((q: string, i: number) => {
      agendaItems.push({
        step: String(i + 1),
        title: `Discovery Question ${i + 1}`,
        desc: q
      });
    });
  }
  if (agendaItems.length === 0) {
    agendaItems = [
      { step: '1', title: 'Relationship Opener (5 min)', desc: `Establish rapport with ${row.person_name || 'contact'}` },
      { step: '2', title: 'Discovery & Pain Points (15 min)', desc: 'Uncover business hurdles and system priorities' },
      { step: '3', title: 'Strategic Pitch (20 min)', desc: 'Connect features to highlighted opportunities' },
      { step: '4', title: 'Next Steps & Actions (10 min)', desc: 'Confirm alignment and schedule sync' }
    ];
  }

  // Stakeholder intelligence parsing
  let mappedAttendees: Attendee[] = [];
  let stakeholderBio = row.rep_focus || `Lead contact at ${row.company}. Primary focus matches the strategic alignment objectives.`;
  let stakeholderInsights = Array.isArray(row.inferred_recommendations) 
        ? row.inferred_recommendations.join(', ')
        : typeof row.inferred_recommendations === 'string'
          ? row.inferred_recommendations
          : `Aligned on: ${row.meeting_goal || 'Discovery Call'}`;

  if (row.stakeholder_research && typeof row.stakeholder_research === 'object') {
    const sr = row.stakeholder_research;
    stakeholderBio = [
      sr.current_role_context,
      sr.stakeholder_summary
    ].filter(Boolean).join('\n\n') || stakeholderBio;
    
    stakeholderInsights = [
      sr.recommended_approach,
      ...(Array.isArray(sr.likely_priorities) ? sr.likely_priorities.map((p:string) => `• ${p}`) : []),
      ...(Array.isArray(sr.likely_business_concerns) ? sr.likely_business_concerns.map((p:string) => `• ${p}`) : [])
    ].filter(Boolean).join('\n\n') || stakeholderInsights;
  }

  if (row.person_name) {
    mappedAttendees.push({
      name: row.person_name,
      role: row.role_title || 'Lead Decision Maker',
      email: `${row.person_name.toLowerCase().replace(/\s+/g, '.')}@${(row.company || 'company').toLowerCase().replace(/\s+/g, '')}.com`,
      linkedin: `linkedin.com/in/${row.person_name.toLowerCase().replace(/\s+/g, '')}`,
      phone: 'Contact via corporate switchboard',
      bio: stakeholderBio,
      insights: stakeholderInsights
    });
  }
  if (row.full_brief && Array.isArray(row.full_brief.attendees)) {
    row.full_brief.attendees.forEach((att: any) => {
      if (att.name && att.name !== row.person_name) {
        mappedAttendees.push({
          name: att.name,
          role: att.role || 'Stakeholder',
          email: att.email || 'Contact via email',
          linkedin: att.linkedin || 'linkedin.com',
          phone: att.phone || '',
          bio: att.bio || 'Enterprise Stakeholder',
          insights: att.insights || 'Collaborative alignment partner.'
        });
      }
    });
  }

  if (mappedAttendees.length === 0) {
    mappedAttendees = [
      {
        name: 'Alex Johnson',
        role: 'VP Procurement & Innovation',
        email: 'alex.j@company.com',
        linkedin: 'linkedin.com',
        phone: '',
        bio: 'Key stakeholder managing vendor evaluation lifecycle.',
        insights: 'Strategic alignment lead.'
      }
    ];
  }

  // ── Parse full_brief (confirmed to be nested JSON from n8n) ──────────────
  let parsedFullBrief: any = null;
  if (row.full_brief) {
    try {
      parsedFullBrief = typeof row.full_brief === 'string' ? JSON.parse(row.full_brief) : row.full_brief;
    } catch (e) {}
  }

  // ── Financial Intelligence ────────────────────────────────────────────────
  // Confirmed columns from Supabase inspection:
  //   row.finance_intelligence  → NULL (not written by current n8n workflow)
  //   row.verified_signals      → Array[{signal, source, confidence, source_url}]  ← HAS DATA
  //   row.sales_triggers        → Array of strings mentioning financial context    ← HAS DATA
  //   row.why_this_meeting_matters → text with (Finance) annotations              ← HAS DATA
  //   parsedFullBrief.social_media_summary → text                                 ← HAS DATA

  let financials: Financials = { valuation: '', funding: '', revenue: '', burnRate: '', runway: '', details: '' };

  // Try dedicated finance column first (future n8n output)
  const dedicatedFin = row.finance_intelligence || row.financial_context || row.financials || row.financial_data;
  if (dedicatedFin && typeof dedicatedFin === 'object' && (dedicatedFin.revenue || dedicatedFin.valuation || dedicatedFin.funding || dedicatedFin.funding_history)) {
    financials = {
      valuation: dedicatedFin.valuation  || dedicatedFin.market_cap     || dedicatedFin.company_valuation || '',
      funding:   dedicatedFin.funding_history || dedicatedFin.funding   || dedicatedFin.total_funding   || dedicatedFin.funding_raised    || '',
      revenue:   dedicatedFin.revenue    || dedicatedFin.annual_revenue  || dedicatedFin.arr               || '',
      burnRate:  dedicatedFin.burn_rate  || dedicatedFin.burnRate       || '',
      runway:    dedicatedFin.runway     || dedicatedFin.months_runway   || '',
      details:   [
        ...(Array.isArray(dedicatedFin.key_metrics) ? dedicatedFin.key_metrics : []),
        ...(Array.isArray(dedicatedFin.investment_highlights) ? dedicatedFin.investment_highlights : []),
        ...(Array.isArray(dedicatedFin.financial_risks) ? dedicatedFin.financial_risks : [])
      ].filter(Boolean).join('\n\n') || dedicatedFin.details || dedicatedFin.funding_stage || dedicatedFin.last_round || '',
    };
  } else {
    // Extract from verified_signals[] which DOES have financial data
    const verifiedSignals: any[] = Array.isArray(row.verified_signals) ? row.verified_signals : [];
    const finSignals = verifiedSignals.filter((s: any) => {
      const text = (typeof s === 'string' ? s : (s.signal || '')).toLowerCase();
      return text.match(/revenue|billion|million|funding|valuation|cash|fcf|capex|arr|profit|market cap|fiscal/i);
    });

    // Also scan sales_triggers for financial context
    const triggers: string[] = Array.isArray(row.sales_triggers) ? row.sales_triggers.map((t: any) => typeof t === 'string' ? t : JSON.stringify(t)) : [];
    const finTrigger = triggers.find(t => /revenue|billion|funding|cash|fiscal|budget|fcf|market cap/i.test(t)) || '';

    if (finSignals.length > 0 || finTrigger) {
      const signalTexts = finSignals.map((s: any) => typeof s === 'string' ? s : (s.signal || '')).join(' | ');

      // Extract revenue mention
      const revMatch = signalTexts.match(/(?:revenue|fiscal revenue)[^$\d]*[\$]?([\d,.]+\s*[BMK]?)/i) 
        || finTrigger.match(/[\$]?([\d,.]+\s*[BMK]?\s*(?:B|billion|M|million)?)/i);
      
      financials = {
        valuation:  '',
        funding:    '',
        revenue:    revMatch ? revMatch[1].trim() : '',
        burnRate:   '',
        runway:     '',
        details:    finSignals.length > 0 
          ? finSignals.slice(0, 3).map((s: any) => typeof s === 'string' ? s : (s.signal || '')).join('\n')
          : finTrigger,
      };
    }

    // Also check why_this_meeting_matters for Finance annotations
    const whyText: string = typeof row.why_this_meeting_matters === 'string' ? row.why_this_meeting_matters : '';
    const financeNote = whyText.split('\n').find(line => /\(Finance\)/i.test(line));
    if (financeNote && !financials.details) {
      financials.details = financeNote.replace(/^[-•*]\s*/, '').trim();
    }
  }

  // ── Social Media Intelligence ─────────────────────────────────────────────
  // Confirmed columns:
  //   row.social_media_intelligence → NULL
  //   parsedFullBrief.social_media_summary → text string ← HAS DATA
  //   row.recent_news_that_matters  → Array of strings  ← HAS DATA
  //   row.market_and_media_signals  → NULL in current rows

  let socialMedia: SocialMedia = { sentiment: 'neutral', summary: '', latestPost: '', engagement: '', followers: '' };

  const dedicatedSocial = row.social_media_intelligence || row.social_media || row.social_intelligence || row.social_data;
  if (dedicatedSocial && typeof dedicatedSocial === 'object' && (dedicatedSocial.summary || dedicatedSocial.latestPost || dedicatedSocial.platform_presence)) {
    const s = dedicatedSocial.sentiment || 'neutral';
    
    const themes = Array.isArray(dedicatedSocial.content_themes) ? dedicatedSocial.content_themes.join(', ') : '';
    const engagementSignals = Array.isArray(dedicatedSocial.audience_engagement_signals) 
      ? dedicatedSocial.audience_engagement_signals.join('\n\n') 
      : '';
    const presence = dedicatedSocial.platform_presence 
      ? Object.entries(dedicatedSocial.platform_presence).map(([k,v]) => `${k}: ${v}`).join('\n')
      : '';

    socialMedia = {
      sentiment:  (['positive','negative','neutral'].includes(s) ? s : 'neutral') as SocialMedia['sentiment'],
      summary:    [themes, presence].filter(Boolean).join('\n\n') || dedicatedSocial.summary || dedicatedSocial.overview || '',
      latestPost: engagementSignals || dedicatedSocial.latestPost || dedicatedSocial.latest_post || dedicatedSocial.recent_post || '',
      engagement: dedicatedSocial.engagement || '',
      followers:  dedicatedSocial.followers  || dedicatedSocial.follower_count || '',
    };
  } else {
    // Use full_brief.social_media_summary which IS populated
    const socialSummary: string = parsedFullBrief?.social_media_summary
      || (typeof dedicatedSocial === 'string' ? dedicatedSocial : '')
      || row.market_and_media_signals
      || '';

    // Derive sentiment from keywords in text
    let derivedSentiment: SocialMedia['sentiment'] = 'neutral';
    if (socialSummary) {
      const lower = socialSummary.toLowerCase();
      if (/growth|momentum|positive|surge|launch|record|win|beat|strong/i.test(lower)) derivedSentiment = 'positive';
      else if (/decline|concern|loss|negative|struggle|risk|down|fall/i.test(lower)) derivedSentiment = 'negative';
    }

    // Use recent_news_that_matters as social/news signals
    const recentNews: string[] = Array.isArray(row.recent_news_that_matters) 
      ? row.recent_news_that_matters.map((n: any) => typeof n === 'string' ? n : JSON.stringify(n))
      : [];
    const latestNewsItem = recentNews[0] || '';

    socialMedia = {
      sentiment:  derivedSentiment,
      summary:    socialSummary || (recentNews.length > 0 ? 'Active news coverage and market signals available. See News & Signals panel below.' : ''),
      latestPost: latestNewsItem,
      engagement: '',
      followers:  '',
    };
  }

  // If we got a sentiment from the row directly, apply it
  if (row.social_sentiment) {
    const s = row.social_sentiment;
    socialMedia.sentiment = ['positive','negative','neutral'].includes(s) ? s : 'neutral';
  }

  return {
    id: row.id,
    company: row.company || 'Unknown Company',
    title: row.brief_title || `${row.meeting_type || 'Sales Alignment'} Call`,
    date: row.created_at ? new Date(row.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
    time: row.meeting_goal ? `Goal: ${row.meeting_goal}` : '10:00 AM - 11:00 AM',
    status: 'Ready',
    industry: row.company_research?.industry || row.meeting_type || 'Enterprise Client',
    headquarters: row.company_research?.headquarters || 'Retrieved via n8n Orchestrator',
    employeeSize: row.company_research?.employees || 'Automated Insight',
    summary: row.executive_summary || row.company_context || 'Company research generated by the PRISM Multi-Agent Orchestrator.',
    keyTalkingPoints,
    agenda: agendaItems,
    objections: mappedObjections,
    icebreakers: [],
    attendees: mappedAttendees,
    financials,
    socialMedia,
    news: mappedNews,
    rawDocument: {
      ...row,
      ...(row.full_brief 
        ? (typeof row.full_brief === 'string' ? JSON.parse(row.full_brief) : row.full_brief)
        : {})
    }
  };
}

export function getAllMockBriefs(): any[] {
  return [
    {
      id: 'mock-1',
      company: 'TechCorp Solutions',
      brief_title: 'Q2 Strategy Review',
      created_at: new Date().toISOString(),
      meeting_type: 'Strategy Review',
      meeting_goal: 'Q2 Planning & AWS Integration Partner sync',
      company_context: 'TechCorp Solutions is a cloud data integration and analytics provider experiencing rapid growth.',
      executive_summary: 'TechCorp Solutions is a rapidly growing enterprise software company specializing in cloud-based data integration and analytics platforms. Secured $50M Series B and are expanding into cloud integrations.',
      talking_points: ['Discuss cloud ingestion scales', 'Highlight AWS integrations', 'Propose real-time data migration templates'],
      risks_or_red_flags: ['Data transit encryption compliance', 'Timeline overlap with their AWS migration'],
      person_name: 'Sarah Johnson',
      role_title: 'Chief Executive Officer',
      priority: 'high',
      company_research: {
        industry: 'Enterprise SaaS / Cloud Infrastructure',
        headquarters: 'San Francisco, CA',
        employees: '850-1,000'
      },
      verified_signals: [
        JSON.stringify({
          signal: 'Secured $50M Series B funding led by Sequoia Capital to expand cloud integration services.',
          source: 'TechCrunch',
          confidence: 'High',
          source_url: 'https://techcrunch.com/2026/05/10/techcorp-50m-series-b'
        }),
        JSON.stringify({
          signal: 'Announced strategic alliance with AWS to support hybrid cloud multi-tenant architectures.',
          source: 'AWS Newsroom',
          confidence: 'High',
          source_url: 'https://aws.amazon.com/blogs/partners/techcorp-alliance'
        })
      ],
      full_brief: {
        sources: [
          { title: 'TechCorp Series B Investment Brief', url: 'https://techcrunch.com/2026/05/10/techcorp-50m-series-b' },
          { title: 'AWS Partnership Announcement Portal', url: 'https://aws.amazon.com/blogs/partners/techcorp-alliance' }
        ]
      },
      sources: []
    },
    {
      id: 'mock-2',
      company: 'DataStream Inc',
      brief_title: 'Product Demo',
      created_at: new Date().toISOString(),
      meeting_type: 'Product Demo',
      meeting_goal: 'High-throughput stream engine demo and security assessment',
      company_context: 'DataStream Inc provides high-throughput streaming analytics platforms for financial services.',
      executive_summary: 'DataStream Inc provides high-throughput streaming analytics platforms for financial services and modern e-commerce companies. Processing billions of events daily.',
      talking_points: ['Demonstrate Rust stream processing optimization', 'Review schema registry compliance'],
      risks_or_red_flags: ['Requires custom mainframe connectors', 'Okta SSO configuration constraints'],
      person_name: 'Jennifer Lee',
      role_title: 'VP of Engineering',
      priority: 'medium',
      company_research: {
        industry: 'Real-time Analytics & Big Data',
        headquarters: 'Seattle, WA',
        employees: '300-400'
      },
      verified_signals: [
        JSON.stringify({
          signal: 'Recognized as Top 50 Big Data Disruptor for zero-copy stream processing technology.',
          source: 'Forbes',
          confidence: 'High',
          source_url: 'https://forbes.com/lists/bigdata-disruptors-datastream'
        })
      ],
      full_brief: {
        sources: [
          { title: 'Forbes Disruptor Award Profiles', url: 'https://forbes.com/lists/bigdata-disruptors-datastream' },
          { title: 'DataStream Rust optimization engineering docs', url: 'https://datastream.io/blog/rust-optimization' }
        ]
      },
      sources: []
    },
    {
      id: 'mock-3',
      company: 'CloudVentures',
      brief_title: 'Partnership Discussion',
      created_at: new Date().toISOString(),
      meeting_type: 'Partnership Discussion',
      meeting_goal: 'GitOps workflow integration and referral program scope',
      company_context: 'CloudVentures helps mid-sized enterprises migrate and manage complex Kubernetes deployments.',
      executive_summary: 'CloudVentures helps mid-sized enterprises migrate and manage complex Kubernetes deployments across multi-cloud environments.',
      talking_points: ['Co-selling GitOps orchestration tools', 'API dashboard integration milestones'],
      risks_or_red_flags: ['Limited developer availability due to Q2 launch priority'],
      person_name: 'Emma Watson',
      role_title: 'Co-Founder & CTO',
      priority: 'low',
      company_research: {
        industry: 'Cloud Infrastructure & Managed Kubernetes',
        headquarters: 'Austin, TX',
        employees: '120-150'
      },
      verified_signals: [
        JSON.stringify({
          signal: 'Raised $30M Series B funding led by Peak Ventures for multi-cloud Kubernetes services.',
          source: 'TechCrunch',
          confidence: 'High',
          source_url: 'https://techcrunch.com/2026/06/01/cloudventures-secures-30m'
        })
      ],
      full_brief: {
        sources: [
          { title: 'TechCrunch Series B Press Release', url: 'https://techcrunch.com/2026/06/01/cloudventures-secures-30m' },
          { title: 'Kubernetes GitOps Multi-Cloud Integration Specs', url: 'https://github.com/cloudventures/gitops-specs' }
        ]
      },
      sources: []
    },
    {
      id: 'mock-4',
      company: 'FinTech Global',
      brief_title: 'Initial Discovery Call',
      created_at: new Date().toISOString(),
      meeting_type: 'Discovery Call',
      meeting_goal: 'Payment gateway integration and latency optimization sync',
      company_context: 'FinTech Global is a major payment processing API provider serving international platforms.',
      executive_summary: 'FinTech Global is a major payment processing API provider serving international e-commerce platforms. Over $140M in estimated annual revenue.',
      talking_points: ['Multi-currency processing pipelines', 'PSD3 and GDPR compliance guidelines'],
      risks_or_red_flags: ['High transaction volume requires robust failover structures'],
      person_name: 'James Wilson',
      role_title: 'Lead Architect',
      priority: 'high',
      company_research: {
        industry: 'Financial Services & Payments API',
        headquarters: 'New York, NY',
        employees: '1,500-2,000'
      },
      verified_signals: [
        JSON.stringify({
          signal: 'Secured electronic money institution license for major EU expansion.',
          source: 'Bloomberg',
          confidence: 'High',
          source_url: 'https://bloomberg.com/news/fintech-global-eu-license'
        })
      ],
      full_brief: {
        sources: [
          { title: 'Bloomberg EU Regulation Filing Tracker', url: 'https://bloomberg.com/news/fintech-global-eu-license' }
        ]
      },
      sources: []
    }
  ];
}
