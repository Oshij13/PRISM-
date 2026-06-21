import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import {
  Calendar,
  Clock,
  Users,
  Building2,
  DollarSign,
  Newspaper,
  Sparkles,
  Linkedin,
  Mail,
  Target,
  AlertTriangle,
  ArrowLeft,
  Activity,
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
  Globe,
  BarChart3,
  Briefcase,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  Pencil,
  X,
} from 'lucide-react';
import { getMeetingDetails, mapDbBriefToMeetingDetails, parseSignalItem } from '../data/meetingsDb';
import { supabaseService } from '../../lib/supabaseService';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

// ─── Small helpers ────────────────────────────────────────────────────────────

function SentimentBadge({ sentiment }: { sentiment: string }) {
  const map: Record<string, { label: string; cls: string; icon: any }> = {
    positive: { label: 'Positive', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400', icon: TrendingUp },
    negative: { label: 'Negative', cls: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400', icon: TrendingDown },
    neutral: { label: 'Neutral', cls: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400', icon: Minus },
  };
  const s = map[sentiment] || map.neutral;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${s.cls}`}>
      <Icon className="w-2.5 h-2.5" /> {s.label}
    </span>
  );
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-muted/60 rounded-md ${className}`} />;
}

function SectionHeader({ label }: { label: string }) {
  return (
    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
      <span className="flex-1 h-px bg-border" />
      {label}
      <span className="flex-1 h-px bg-border" />
    </p>
  );
}

// ─── Right Panel Components ───────────────────────────────────────────────────

function renderFormattedFinancialAnalysis(text: string) {
  if (!text) return null;

  const signalsMatch = text.match(/Verified signals:\s*(.*?)(?:\.\s*Implications:|\.$)/i);
  const implicationsMatch = text.match(/Implications:\s*(.*)/i);

  if (!signalsMatch && !implicationsMatch) {
    return <p className="text-xs text-foreground/85 leading-relaxed font-medium">{text}</p>;
  }

  const signals = signalsMatch 
    ? signalsMatch[1].split(';').map(s => s.trim()).filter(Boolean)
    : [];

  const implications = implicationsMatch
    ? implicationsMatch[1].split(';').map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="space-y-3">
      {signals.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-800 dark:text-emerald-400 block opacity-85">Verified Key Signals</span>
          <div className="flex flex-wrap gap-1.5">
            {signals.map((sig, idx) => (
              <span key={idx} className="text-[10px] font-semibold bg-emerald-100/40 dark:bg-emerald-900/30 text-emerald-850 dark:text-emerald-350 px-2 py-0.5 rounded border border-emerald-500/10">
                {sig}
              </span>
            ))}
          </div>
        </div>
      )}

      {implications.length > 0 && (
        <div className="space-y-2 border-t border-emerald-500/15 pt-3 mt-3">
          <span className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-800 dark:text-emerald-400 block opacity-85">Sales Implications</span>
          <ul className="space-y-2">
            {implications.map((imp, idx) => {
              // Highlight text before colon/dash
              const parts = imp.split(/:\s*|—\s*/);
              if (parts.length > 1) {
                return (
                  <li key={idx} className="text-xs text-foreground/80 leading-relaxed flex gap-2">
                    <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>
                    <span>
                      <strong className="text-emerald-950 dark:text-emerald-400 font-black">{parts[0]}:</strong> {parts.slice(1).join(': ')}
                    </span>
                  </li>
                );
              }
              return (
                <li key={idx} className="text-xs text-foreground/80 leading-relaxed flex gap-2">
                  <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>
                  <span>{imp}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function FinancePanel({ financials, rawDocument }: { financials: any; rawDocument?: any }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const rd = rawDocument || {};
  const compResearch = rd.company_research || {};

  const isPublic = compResearch.funding_status?.toLowerCase() === 'public' || financials?.valuation === 'Public';
  const ticker = compResearch.ticker || rd.ticker;
  const marketCap = compResearch.market_cap || financials?.valuation;
  const fundingStatus = compResearch.funding_status;

  const valuation = !isPublic ? (financials?.valuation || marketCap) : null;
  const funding = financials?.funding;
  const burnRate = financials?.burnRate;
  const runway = financials?.runway;

  const hasStats = isPublic 
    ? !!(ticker || fundingStatus || marketCap)
    : !!(valuation || funding || burnRate || runway);

  // Extract financial signals
  const verifiedSignals: any[] = Array.isArray(rd.verified_signals) ? rd.verified_signals : [];
  const financialSignals = verifiedSignals.filter((s: any) => {
    const text = (typeof s === 'string' ? s : (s.signal || '')).toLowerCase();
    return text.match(/revenue|billion|million|funding|valuation|cash|fcf|capex|arr|profit|market cap|fiscal|leverage|ebitda|r&d/i);
  });

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden transition-all">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 border-b border-border/60 flex items-center justify-between hover:bg-muted/30 transition-colors group"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="text-sm font-bold text-foreground">Financial Intelligence</span>
        </div>
        <ChevronRight className={`w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
      </button>
      
      {isExpanded && (
        <div className="p-5 space-y-4">
          {/* Key Metric Grid */}
          {hasStats && (
            <div className="grid grid-cols-2 gap-3 bg-muted/20 p-3 rounded-lg border border-border/40">
              {isPublic ? (
                <>
                  {ticker && (
                    <div>
                      <span className="text-[10px] text-muted-foreground block uppercase font-semibold">Ticker</span>
                      <span className="text-xs font-bold text-foreground bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase">{ticker}</span>
                    </div>
                  )}
                  {fundingStatus && (
                    <div>
                      <span className="text-[10px] text-muted-foreground block uppercase font-semibold">Status</span>
                      <span className="text-xs font-bold text-foreground">{fundingStatus}</span>
                    </div>
                  )}
                  {marketCap && (
                    <div className="col-span-2 border-t border-border/40 pt-1.5 mt-1">
                      <span className="text-[10px] text-muted-foreground block uppercase font-semibold">Market Capitalization</span>
                      <span className="text-xs font-bold text-foreground">{marketCap}</span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {valuation && (
                    <div>
                      <span className="text-[10px] text-muted-foreground block uppercase font-semibold">Valuation</span>
                      <span className="text-xs font-bold text-foreground">{valuation}</span>
                    </div>
                  )}
                  {funding && (
                    <div>
                      <span className="text-[10px] text-muted-foreground block uppercase font-semibold">Funding</span>
                      <span className="text-xs font-bold text-foreground">{funding}</span>
                    </div>
                  )}
                  {burnRate && (
                    <div className="border-t border-border/40 pt-1.5 mt-1">
                      <span className="text-[10px] text-muted-foreground block uppercase font-semibold">Burn Rate</span>
                      <span className="text-xs font-bold text-red-500">{burnRate}</span>
                    </div>
                  )}
                  {runway && (
                    <div className="border-t border-border/40 pt-1.5 mt-1">
                      <span className="text-[10px] text-muted-foreground block uppercase font-semibold">Runway</span>
                      <span className="text-xs font-bold text-foreground">{runway}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Financial Analysis context */}
          {rd.financial_context && (
            <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/80 dark:border-emerald-900/30 rounded-lg p-3.5">
              <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-2">Financial Analysis</p>
              {renderFormattedFinancialAnalysis(rd.financial_context)}
            </div>
          )}

          {/* Financial verified signals */}
          {financialSignals.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Financial Signals</p>
              <div className="space-y-2">
                {financialSignals.map((s: any, idx: number) => {
                  const signalText = typeof s === 'string' ? s : (s.signal || '');
                  const source = typeof s === 'string' ? 'n8n research' : (s.source || '');
                  const confidence = typeof s === 'string' ? '' : (s.confidence || '');

                  return (
                    <div key={idx} className="bg-muted/10 border border-border/50 p-2.5 rounded-lg text-xs">
                      <div className="flex gap-2 items-start">
                        <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-foreground leading-relaxed font-medium">{signalText.replace(/^[•*-]\s*/, '')}</p>
                          <div className="flex items-center gap-2 mt-1 text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">
                            <span>Source: {source}</span>
                            {confidence && (
                              <>
                                <span>·</span>
                                <span className={`px-1 rounded ${
                                  confidence.toLowerCase() === 'high' 
                                    ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' 
                                    : 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                                }`}>
                                  {confidence} Conf
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SocialMediaPanel({ socialMedia, rawDocument }: { socialMedia: any; rawDocument?: any }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const rd = rawDocument || {};
  const rdSocial = rd.social_media || rd.social_intelligence || rd.social_data || rd.linkedin_data || rd.social_media_intelligence || null;

  let resolved = socialMedia;
  const hasDedicated = rdSocial && typeof rdSocial === 'object';
  const platformPresence = hasDedicated ? rdSocial.platform_presence : null;
  const contentThemes = hasDedicated ? rdSocial.content_themes : null;
  const engagementSignals = hasDedicated ? rdSocial.audience_engagement_signals : null;

  const summary = rd.market_and_media_signals || resolved?.summary;
  const latestPost = resolved?.latestPost;

  // Extract media/social signals from verified_signals
  const verifiedSignals: any[] = Array.isArray(rd.verified_signals) ? rd.verified_signals : [];
  const mediaSignals = verifiedSignals.filter((s: any) => {
    const text = (typeof s === 'string' ? s : (s.signal || '')).toLowerCase();
    const isFinance = text.match(/revenue|billion|million|funding|valuation|cash|fcf|capex|arr|profit|market cap|fiscal|leverage|ebitda/i);
    return !isFinance && text.match(/social|linkedin|twitter|post|tweet|mention|sentiment|media|news|press|coverage|announcement|blog|report|publication/i);
  });

  const hasData = summary || platformPresence || contentThemes || engagementSignals || latestPost || mediaSignals.length > 0 || resolved?.followers || resolved?.engagement;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden transition-all">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 border-b border-border/60 flex items-center justify-between hover:bg-muted/30 transition-colors group"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-900/20 flex items-center justify-center">
            <Globe className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </div>
          <span className="text-sm font-bold text-foreground">Social & Media Intelligence</span>
        </div>
        <div className="flex items-center gap-3">
          {resolved?.sentiment && <SentimentBadge sentiment={resolved.sentiment} />}
          <ChevronRight className={`w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
        </div>
      </button>

      {isExpanded && (
        <div className="p-5 space-y-4">
          {!hasData ? (
            <div className="space-y-2.5">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-3 w-1/4" />
                  <Skeleton className="h-3.5 w-full" />
                </div>
              ))}
              <p className="text-[10px] text-muted-foreground text-center pt-1">Not available in brief — update n8n workflow to output social media</p>
            </div>
          ) : (
            <>
              {summary && (
                <div className="space-y-1 bg-sky-50/50 dark:bg-sky-950/10 border border-sky-100/80 dark:border-sky-900/30 rounded-lg p-3.5">
                  <p className="text-[10px] font-bold text-sky-850 dark:text-sky-450 uppercase tracking-wider mb-1">Market & Media Summary</p>
                  <p className="text-xs text-foreground/80 leading-relaxed font-medium">{summary}</p>
                </div>
              )}

              {/* Platform Presence */}
              {platformPresence && typeof platformPresence === 'object' && Object.keys(platformPresence).length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Platform Presence</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(platformPresence).map(([platform, handle]: [string, any]) => (
                      <div key={platform} className="bg-muted/30 border border-border/50 rounded-lg p-2.5 flex flex-col justify-center">
                        <span className="text-[10px] text-muted-foreground capitalize font-semibold">{platform}</span>
                        <span className="text-xs font-bold text-foreground truncate">{handle}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Content Themes */}
              {contentThemes && Array.isArray(contentThemes) && contentThemes.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Key Content Themes</p>
                  <div className="flex flex-wrap gap-1.5">
                    {contentThemes.map((theme: string, i: number) => (
                      <span key={i} className="text-[10px] font-semibold bg-muted px-2 py-0.5 rounded text-foreground border border-border/40">
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Media & Engagement Signals */}
              {((engagementSignals && Array.isArray(engagementSignals) && engagementSignals.length > 0) || latestPost || mediaSignals.length > 0) && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Media & Engagement Signals</p>
                  <div className="space-y-2">
                    {engagementSignals && Array.isArray(engagementSignals) && engagementSignals.map((signal: string, i: number) => (
                      <div key={i} className="bg-muted/10 border border-border/50 p-2.5 rounded-lg text-xs leading-relaxed font-medium text-foreground">
                        {signal}
                      </div>
                    ))}
                    {!engagementSignals && latestPost && (
                      <div className="bg-muted/10 border border-border/50 p-2.5 rounded-lg text-xs leading-relaxed font-medium text-foreground">
                        {latestPost}
                      </div>
                    )}
                    {mediaSignals.map((s: any, idx: number) => {
                      const signalText = typeof s === 'string' ? s : (s.signal || '');
                      const source = typeof s === 'string' ? 'n8n research' : (s.source || '');
                      const confidence = typeof s === 'string' ? '' : (s.confidence || '');

                      return (
                        <div key={`ms-${idx}`} className="bg-muted/10 border border-border/50 p-2.5 rounded-lg text-xs">
                          <div className="flex gap-2 items-start">
                            <span className="text-sky-500 mt-0.5 flex-shrink-0">✓</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-foreground leading-relaxed font-medium">{signalText.replace(/^[•*-]\s*/, '')}</p>
                              <div className="flex items-center gap-2 mt-1 text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">
                                <span>Source: {source}</span>
                                {confidence && (
                                  <>
                                    <span>·</span>
                                    <span className="bg-sky-100 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 px-1 rounded">
                                      {confidence} Conf
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 flex-wrap pt-1">
                {resolved?.followers && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="w-3.5 h-3.5" />
                    <span className="font-semibold text-foreground">{resolved.followers}</span>
                  </div>
                )}
                {resolved?.engagement && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span className="font-semibold text-foreground">{resolved.engagement}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function StakeholdersPanel({ attendees }: { attendees: any[] }) {
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden transition-all">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 border-b border-border/60 flex items-center justify-between hover:bg-muted/30 transition-colors group"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
            <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="text-sm font-bold text-foreground">Stakeholder Intelligence</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {attendees.length} contact{attendees.length !== 1 ? 's' : ''}
          </span>
          <ChevronRight className={`w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 space-y-3">
        {attendees.length === 0 ? (
          <div className="space-y-2.5 p-1">
            {[1, 2].map(i => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <Skeleton className="w-9 h-9 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-2.5 w-20" />
                </div>
              </div>
            ))}
            <p className="text-[10px] text-muted-foreground text-center pt-1">Research Agent populating...</p>
          </div>
        ) : (
          attendees.map((a, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/20 hover:bg-muted/50 transition-all">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-red-700 flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-sm">
                {a.name?.charAt(0) || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground leading-tight truncate">{a.name}</p>
                    <p className="text-[11px] text-muted-foreground">{a.role}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {a.linkedin && a.linkedin !== 'linkedin.com' && (
                      <a href={`https://${a.linkedin}`} target="_blank" rel="noopener noreferrer"
                        className="p-1 rounded text-muted-foreground hover:text-sky-500 transition-colors">
                        <Linkedin className="w-3 h-3" />
                      </a>
                    )}
                    {a.email && a.email.includes('@') && (
                      <a href={`mailto:${a.email}`}
                        className="p-1 rounded text-muted-foreground hover:text-primary transition-colors">
                        <Mail className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
                {a.bio && (
                  <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">{a.bio}</p>
                )}
                {a.insights && (
                  <div className="mt-2 flex items-start gap-1.5">
                    <Sparkles className="w-2.5 h-2.5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-primary font-medium leading-relaxed">{a.insights}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        </div>
      )}
    </div>
  );
}

function NewsPanel({ news }: { news: any[] }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const sentimentDots: Record<string, string> = {
    positive: 'bg-emerald-400',
    negative: 'bg-red-400',
    neutral: 'bg-zinc-400',
  };
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden transition-all">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 border-b border-border/60 flex items-center justify-between hover:bg-muted/30 transition-colors group"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
            <Newspaper className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <span className="text-sm font-bold text-foreground">News & Signals</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {news.length} items
          </span>
          <ChevronRight className={`w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 space-y-2">
        {news.length === 0 ? (
          <div className="space-y-2.5 p-1">
            {[1, 2].map(i => (
              <div key={i} className="animate-pulse space-y-1.5 pb-3 border-b border-border/40 last:border-0">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-2.5 w-2/3" />
              </div>
            ))}
            <p className="text-[10px] text-muted-foreground text-center pt-1">Research Agent populating...</p>
          </div>
        ) : (
          news.map((item, i) => (
            <div key={i} className="flex gap-3 py-2.5 border-b border-border/40 last:border-0 group">
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${sentimentDots[item.sentiment] || sentimentDots.neutral}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">{item.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-muted-foreground">{item.source}</span>
                  <span className="text-[10px] text-muted-foreground">·</span>
                  <span className="text-[10px] text-muted-foreground">{item.date}</span>
                </div>
              </div>
            </div>
          ))
        )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function MeetingIntelligence() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [triggeringN8n, setTriggeringN8n] = useState(false);
  const [n8nStatus, setN8nStatus] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const autoTriggeredRef = useRef<Record<string, boolean>>({});
  const [allMeetings, setAllMeetings] = useState<any[]>([]);
  const [showSelector, setShowSelector] = useState(false);

  const [isDownloading, setIsDownloading] = useState(false);

  // Edit Meeting form states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCompany, setEditCompany] = useState('');
  const [editContactName, setEditContactName] = useState('');
  const [editContactRole, setEditContactRole] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('10:00 AM');
  const [editPriority, setEditPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [editMeetingType, setEditMeetingType] = useState('');
  const [editMeetingGoal, setEditMeetingGoal] = useState('');
  const [isEditingSubmitting, setIsEditingSubmitting] = useState(false);
  const [editModalError, setEditModalError] = useState('');

  const handleEditClick = () => {
    if (!meeting) return;
    setEditCompany(meeting.company || '');
    setEditContactName(meeting.contactName || meeting.attendees?.[0]?.name || '');
    setEditContactRole(meeting.contactRole || meeting.attendees?.[0]?.role || '');
    setEditDate(meeting.date || '');
    setEditTime(meeting.time || '10:00 AM');
    setEditPriority(meeting.priority || 'medium');
    setEditMeetingType(meeting.meetingType || meeting.title || '');
    setEditMeetingGoal(meeting.meetingGoal || meeting.meetingType || meeting.title || '');
    setEditModalError('');
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditModalError('');
    if (!editCompany.trim() || !editContactName.trim() || !editContactRole.trim() || !editMeetingType.trim() || !editMeetingGoal.trim()) {
      setEditModalError('Please fill in all required fields.');
      return;
    }

    if (!meeting || !meeting.id) return;

    setIsEditingSubmitting(true);
    try {
      const res = await supabaseService.updateMeeting(meeting.id, {
        company: editCompany.trim(),
        contactName: editContactName.trim(),
        contactRole: editContactRole.trim(),
        date: editDate.trim() || 'Tomorrow',
        time: editTime,
        priority: editPriority,
        meetingType: editMeetingType.trim(),
        meetingGoal: editMeetingGoal.trim()
      });

      setIsEditingSubmitting(false);
      if (res.success) {
        setIsEditModalOpen(false);
        // Refresh meeting state locally so UI updates instantly
        setMeeting((prev: any) => {
          const updated = {
            ...prev,
            company: editCompany.trim(),
            contactName: editContactName.trim(),
            contactRole: editContactRole.trim(),
            date: editDate.trim() || 'Tomorrow',
            time: editTime,
            priority: editPriority,
            meetingType: editMeetingType.trim(),
            meetingGoal: editMeetingGoal.trim()
          };
          if (updated.attendees && updated.attendees.length > 0) {
            updated.attendees[0] = {
              ...updated.attendees[0],
              name: editContactName.trim(),
              role: editContactRole.trim()
            };
          }
          if (updated.rawDocument) {
            updated.rawDocument = {
              ...updated.rawDocument,
              company: editCompany.trim(),
              person_name: editContactName.trim(),
              role_title: editContactRole.trim(),
              meeting_type: editMeetingType.trim(),
              meeting_goal: editMeetingGoal.trim(),
              priority: editPriority
            };
          }
          return updated;
        });
      } else {
        setEditModalError(res.error || 'Failed to update meeting.');
      }
    } catch (err: any) {
      setIsEditingSubmitting(false);
      setEditModalError(err.message || 'An error occurred.');
    }
  };

  const handleDownloadPdf = async () => {
    const element = document.getElementById('dossier-pdf-content');
    if (!element) return;
    try {
      setIsDownloading(true);
      const dataUrl = await toPng(element, {
        quality: 1.0,
        pixelRatio: 3.5,
        backgroundColor: '#ffffff',
        filter: (node) => {
          if (node.classList && (node.classList.contains('print:hidden') || node.classList.contains('print-exclude'))) {
            return false;
          }
          return true;
        }
      });
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [element.offsetWidth, element.offsetHeight],
      });
      pdf.addImage(dataUrl, 'PNG', 0, 0, element.offsetWidth, element.offsetHeight);
      pdf.save(`${meeting?.company || 'Meeting'}_Intelligence_Dossier.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const runN8nResearch = async (m: any) => {
    if (!m) return;

    let companyName = '';
    let personName = '';
    let personTitle = '';
    let meetingType = '';
    let meetingGoal = '';
    let priority = 'medium';

    if (typeof m === 'string') {
      companyName = m;
      if (meeting && meeting.company === m) {
        companyName = meeting.company;
        personName = meeting.contactName || meeting.attendees?.[0]?.name || '';
        personTitle = meeting.contactRole || meeting.attendees?.[0]?.role || '';
        meetingType = meeting.meetingType || meeting.title || '';
        meetingGoal = meeting.meetingGoal || meeting.meetingType || meeting.title || '';
        priority = meeting.priority || 'medium';
      }
    } else {
      companyName = m.company;
      personName = m.contactName || m.attendees?.[0]?.name || '';
      personTitle = m.contactRole || m.attendees?.[0]?.role || '';
      meetingType = m.meetingType || m.title || '';
      meetingGoal = m.meetingGoal || m.meetingType || m.title || '';
      priority = m.priority || 'medium';
    }

    try {
      setTriggeringN8n(true);
      setN8nStatus('Triggering Research Agent via n8n orchestrator...');

      const res = await supabaseService.triggerN8nOrchestrator(
        companyName, personName, personTitle, meetingType, meetingGoal, priority
      );
      if (res.success) {
        setN8nStatus('Research Agent triggered! Compiling intelligence brief in parallel...');

        let checkedCount = 0;
        const interval = setInterval(async () => {
          checkedCount++;
          const mTime = m.created_at || (Number(m.id) > 1000000000000 ? Number(m.id) : 0);
          let dbBrief = await supabaseService.getMeetingBriefByCompany(companyName.trim(), personName.trim(), mTime);

          if (!dbBrief) {
            try {
              const personFilter = personName.trim() ? `&person_name=ilike.*${encodeURIComponent(personName.trim())}*` : '';
              const parsedMTime = typeof mTime === 'number' ? mTime : new Date(mTime).getTime();
              const timeFilter = !isNaN(parsedMTime) && parsedMTime > 0 ? `&created_at=gte.${encodeURIComponent(new Date(parsedMTime - 5 * 60 * 1000).toISOString())}` : '';
              const url = `https://dgopgdfvsbaucsjejimk.supabase.co/rest/v1/meeting_briefs?select=*&company=ilike.*${encodeURIComponent(companyName.trim())}*${personFilter}${timeFilter}`;
              const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnb3BnZGZ2c2JhdWNzamVqaW1rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTc3MTg4NiwiZXhwIjoyMDk1MzQ3ODg2fQ.P7_Y-rYwi3ITA7p8FsD3a1Kd14z8qg83lUbTb3tn-dc';
              const fallbackRes = await fetch(url, { headers: { 'apikey': key, 'Authorization': `Bearer ${key}` } });
              if (fallbackRes.ok) {
                const data = await fallbackRes.json();
                if (data && data.length > 0) dbBrief = data[0];
              }
            } catch (e) {}
          }

          if (dbBrief) {
            clearInterval(interval);
            try {
              const mapped = mapDbBriefToMeetingDetails(dbBrief);
              setMeeting((prev: any) => ({ ...prev, ...mapped, status: 'Research Completed' }));
              setTriggeringN8n(false);
              setN8nStatus(null);
            } catch (mappingError: any) {
              console.error('Error mapping DB brief:', mappingError);
              setTriggeringN8n(false);
              setN8nStatus('Error displaying generated data. Check console.');
            }
          } else if (checkedCount >= 100) { // 100 checks * 3s = 5 minutes
            clearInterval(interval);
            setTriggeringN8n(false);
            setN8nStatus('Research Agent triggered, but database sync took too long. Refresh or click retry.');
          }
        }, 3000);
      } else {
        setN8nStatus('Error triggering Research Agent: ' + (res.error || 'Network error. Make sure self-hosted n8n is running.'));
        setTriggeringN8n(false);
      }
    } catch (e: any) {
      setN8nStatus('Failed to connect to Research Agent.');
      setTriggeringN8n(false);
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const targetId = id;

        // No meeting ID in URL → show a meeting picker instead of guessing
        if (!targetId) {
          const userMeetings = await supabaseService.getMeetings();
          
          const today = new Date();
          const yyyy = today.getFullYear();
          const mm = String(today.getMonth() + 1).padStart(2, '0');
          const dd = String(today.getDate()).padStart(2, '0');
          const todayStr = `${yyyy}-${mm}-${dd}`;
          
          const upcomingMeetings = userMeetings.filter((m: any) => {
            if (!m.date) return true;
            const dateStr = m.date.trim().toLowerCase();
            if (dateStr === 'today' || dateStr === 'tomorrow' || dateStr === 'day after tomorrow') return true;
            try {
              if (/^\d{4}-\d{2}-\d{2}$/.test(m.date.trim())) {
                return m.date.trim() >= todayStr;
              }
              const parsed = new Date(m.date);
              if (!isNaN(parsed.getTime())) {
                const pY = parsed.getFullYear();
                const pM = String(parsed.getMonth() + 1).padStart(2, '0');
                const pD = String(parsed.getDate()).padStart(2, '0');
                const parsedStr = `${pY}-${pM}-${pD}`;
                return parsedStr >= todayStr;
              }
            } catch (e) {}
            return true;
          });

          upcomingMeetings.sort((a: any, b: any) => {
            if (!a.date || !b.date) return 0;
            return a.date.localeCompare(b.date);
          });

          setAllMeetings(upcomingMeetings);
          setShowSelector(true);
          setLoading(false);
          return;
        }

        setShowSelector(false);

        let matchedMeeting: any = null;
        if (targetId) {
          const userMeetings = await supabaseService.getMeetings();
          matchedMeeting = userMeetings.find((m: any) => m.id === targetId);
        }

        if (matchedMeeting) {
          const matchedPersonName = matchedMeeting.contactName || '';
          const mTime = matchedMeeting.created_at || (Number(matchedMeeting.id) > 1000000000000 ? Number(matchedMeeting.id) : 0);
          let dbBriefByCompany = await supabaseService.getMeetingBriefByCompany(matchedMeeting.company.trim(), matchedPersonName.trim(), mTime);

          if (!dbBriefByCompany) {
            try {
              const personFilter = matchedPersonName.trim() ? `&person_name=ilike.*${encodeURIComponent(matchedPersonName.trim())}*` : '';
              const parsedMTime = typeof mTime === 'number' ? mTime : new Date(mTime).getTime();
              const timeFilter = !isNaN(parsedMTime) && parsedMTime > 0 ? `&created_at=gte.${encodeURIComponent(new Date(parsedMTime - 5 * 60 * 1000).toISOString())}` : '';
              const url = `https://dgopgdfvsbaucsjejimk.supabase.co/rest/v1/meeting_briefs?select=*&company=ilike.*${encodeURIComponent(matchedMeeting.company.trim())}*${personFilter}${timeFilter}`;
              const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnb3BnZGZ2c2JhdWNzamVqaW1rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTc3MTg4NiwiZXhwIjoyMDk1MzQ3ODg2fQ.P7_Y-rYwi3ITA7p8FsD3a1Kd14z8qg83lUbTb3tn-dc';
              const fallbackRes = await fetch(url, { headers: { 'apikey': key, 'Authorization': `Bearer ${key}` } });
              if (fallbackRes.ok) {
                const data = await fallbackRes.json();
                if (data && data.length > 0) dbBriefByCompany = data[0];
              }
            } catch (e) {
              console.error('Direct fetch fallback failed:', e);
            }
          }

          if (dbBriefByCompany) {
            const mapped = mapDbBriefToMeetingDetails(dbBriefByCompany);
            setMeeting({ ...mapped, id: matchedMeeting.id, date: matchedMeeting.date, time: matchedMeeting.time });
            setLoading(false);
            return;
          } else {
            setMeeting({
              id: matchedMeeting.id,
              company: matchedMeeting.company,
              title: matchedMeeting.meetingType || `${matchedMeeting.contactRole} Alignment Call`,
              date: matchedMeeting.date,
              time: matchedMeeting.time,
              status: 'Awaiting Research',
              industry: 'Research Agent Pending',
              headquarters: 'n8n Orchestrator Active',
              employeeSize: 'Processing...',
              summary: `We are automatically generating the research brief for ${matchedMeeting.company} using our n8n multi-agent Research Agent. Please wait a moment.`,
              keyTalkingPoints: [
                'n8n Research Agent is running Company Research, NEWS, and Stakeholder brief agents.',
                'Real-time news alerts and social sentiment signals are being fetched.',
                'This section will automatically update with generated research.',
              ],
              agenda: [
                { step: '1', title: 'Start Research Agent', desc: 'Trigger workflow for "' + matchedMeeting.company + '"' },
                { step: '2', title: 'Agent Research', desc: 'Company Research, Stakeholder, and NEWS Intelligence agents run in parallel.' },
                { step: '3', title: 'Data Insertion', desc: 'n8n workflow inserts brief row to "meeting_briefs" table.' },
              ],
              objections: [],
              icebreakers: [],
              attendees: [{
                name: matchedMeeting.contactName,
                role: matchedMeeting.contactRole,
                email: 'Contact Lead',
                linkedin: 'linkedin.com',
                phone: '',
                bio: 'Primary prospect registered during system onboarding.',
                insights: 'Waiting for n8n Stakeholder Brief Agent sync...',
              }],
              financials: { valuation: '', funding: '', revenue: '', burnRate: '', runway: '', details: '' },
              socialMedia: { sentiment: 'neutral', summary: '', latestPost: '', engagement: '', followers: '' },
              news: [],
            });
            setLoading(false);

            if (targetId && !autoTriggeredRef.current[targetId]) {
              autoTriggeredRef.current[targetId] = true;
              runN8nResearch(matchedMeeting);
            }
            return;
          }
        }

        if (targetId && targetId.length > 8) {
          const dbBrief = await supabaseService.getMeetingBriefById(targetId);
          if (dbBrief) {
            const mapped = mapDbBriefToMeetingDetails(dbBrief);
            setMeeting(mapped);
            setLoading(false);
            return;
          }
        }

        setError('Dossier brief not found for the specified meeting ID.');
      } catch (err: any) {
        console.error('Error loading meeting details:', err);
        setError('Failed to retrieve intelligence briefs.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  // Timer effect for n8n orchestrator
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (triggeringN8n) {
      setElapsedTime(0);
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [triggeringN8n]);

  // ─── Meeting selector (when /meetings is visited without an ID) ─────────────
  if (showSelector) {
    const priorityColors: Record<string, string> = {
      high: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50',
      medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50',
      low: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/50',
    };
    return (
      <div className="p-8 max-w-[900px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">Meeting Intelligence</h1>
          <p className="text-muted-foreground text-sm">Select a meeting below to open its AI-generated research brief.</p>
        </div>

        {allMeetings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4 bg-card border border-border rounded-2xl">
            <Calendar className="w-12 h-12 text-muted-foreground/30" />
            <div>
              <p className="font-bold text-foreground mb-1">No meetings scheduled</p>
              <p className="text-sm text-muted-foreground">Go to the Dashboard to add your first meeting.</p>
            </div>
            <Link to="/dashboard" className="mt-2 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {allMeetings.map((m: any) => (
              <button
                key={m.id}
                onClick={() => navigate(`/meeting/${m.id}`)}
                className="w-full text-left bg-card border border-border rounded-xl p-5 hover:border-primary/40 hover:shadow-md hover:bg-muted/20 transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-red-700 flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow-sm shadow-primary/20">
                    {(m.company || '?').charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-foreground text-base group-hover:text-primary transition-colors">{m.company}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${priorityColors[m.priority || 'medium']}`}>
                        {m.priority || 'medium'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium truncate">{m.meetingType || `${m.contactRole} Alignment Call`}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{m.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{m.time}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{m.contactName}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── Loading skeleton ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-6 max-w-[1600px] mx-auto animate-pulse">
        <div className="h-4 w-28 bg-border rounded-md mb-6" />
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-7 space-y-5">
            <div className="bg-card rounded-xl p-6 border border-border space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-muted rounded-xl flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-6 w-48 bg-muted rounded-md" />
                  <div className="h-3 w-32 bg-muted rounded-md" />
                </div>
              </div>
              {[1,2,3,4].map(i => <div key={i} className="h-20 bg-muted/60 rounded-lg" />)}
            </div>
          </div>
          <div className="xl:col-span-5 space-y-4">
            {[1,2,3,4].map(i => <div key={i} className="bg-card rounded-xl border border-border h-40" />)}
          </div>
        </div>
      </div>
    );
  }

  // ─── Error state ────────────────────────────────────────────────────────────
  if (error || !meeting) {
    return (
      <div className="p-8 max-w-[1600px] mx-auto text-center py-20">
        <AlertTriangle className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-xl font-bold text-foreground">Failed to Load Intelligence Brief</h2>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">{error || 'Meeting not found.'}</p>
        <Link to="/dashboard" className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const isAwaiting = meeting.status === 'Awaiting Research';

  // ─── Main render ────────────────────────────────────────────────────────────
  return (
    <div className="p-6 xl:p-8 max-w-[1600px] mx-auto">
      {/* Back Button */}
      <div className="mb-5 print:hidden">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <div id="dossier-pdf-content" className="bg-background p-4 rounded-xl border border-transparent">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-7 pb-6 border-b border-border/40">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-red-700 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0 mt-1">
              <span className="text-white font-black text-3xl">{meeting.company.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0 pb-0.5">
              <h1 className="text-3xl font-black text-foreground tracking-tight leading-none mb-2.5">{meeting.company}</h1>
              <div className="space-y-2">
                <div className="flex items-start gap-1.5 text-xs font-semibold text-primary/80 leading-relaxed">
                  <Building2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span>{meeting.industry}</span>
                </div>
                {(meeting.date || meeting.time) && (
                  <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground">
                    {meeting.date && <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{meeting.date}</span>}
                    {meeting.time && <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{meeting.time}</span>}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center gap-3 flex-shrink-0 md:mt-2 print:hidden">
          <div className="flex items-center gap-1.5">
            <span className={`px-3 py-1.5 border rounded-lg text-xs font-bold uppercase tracking-widest ${
              isAwaiting
                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50'
                : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/50'
            }`}>
              {meeting.status}
            </span>

          {!isAwaiting && (
            <button
              onClick={() => runN8nResearch(meeting)}
              disabled={triggeringN8n}
              title="Refresh Research Brief"
              className="p-1.5 rounded-lg border border-transparent text-muted-foreground hover:border-border hover:bg-secondary hover:text-primary transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${triggeringN8n ? 'animate-spin' : ''}`} />
            </button>
          )}
          </div>

          <button
            onClick={handleEditClick}
            title="Edit Meeting Details"
            className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border border-border text-muted-foreground hover:bg-secondary hover:text-foreground transition-all cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit Details</span>
          </button>

          {!isAwaiting && (
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              title="Download as PDF"
              className="print:hidden flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border border-border text-muted-foreground hover:bg-secondary hover:text-foreground transition-all disabled:opacity-50"
            >
              {isDownloading ? <Activity className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              {isDownloading ? 'Exporting...' : 'Export PDF'}
            </button>
          )}

          {isAwaiting && (
            <button
              onClick={() => runN8nResearch(meeting)}
              disabled={triggeringN8n}
              className="flex items-center gap-2 px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-extrabold hover:bg-primary/95 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {triggeringN8n
                ? <><Activity className="w-3.5 h-3.5 animate-spin" /> Running ({elapsedTime}s)...</>
                : <><Sparkles className="w-3.5 h-3.5" /> Retry Research Agent</>}
            </button>
          )}
        </div>
      </div>

      {/* Research Agent status bar */}
      {n8nStatus && (
        <div className="mb-6 bg-primary/5 border border-primary/20 rounded-xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-primary animate-spin flex-shrink-0" />
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-primary">{n8nStatus}</span>
              {triggeringN8n && (
                <span className="text-xs text-muted-foreground font-medium">
                  💡 Note: Multi-agent research and brief compilation can take up to 5 minutes to complete.
                </span>
              )}
            </div>
          </div>
          {triggeringN8n && (
            <span className="text-xs font-mono font-bold text-primary/80 bg-primary/10 px-3 py-1 rounded-md border border-primary/20">
              Elapsed: {elapsedTime}s
            </span>
          )}
        </div>
      )}

      {/* ─── Two-column layout ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* ═══════════════════ LEFT — Document Brief ═══════════════════════ */}
        <div className="xl:col-span-7">
          <div id="dossier-content" className="bg-card border border-border/60 shadow-sm rounded-xl p-7 sm:p-9">
            {isAwaiting ? (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                <Activity className="w-10 h-10 text-primary animate-pulse" />
                <h2 className="text-xl font-bold text-foreground">Generating Research Brief...</h2>
                <p className="text-muted-foreground max-w-sm text-sm">{meeting.summary}</p>
              </div>
            ) : (
              <div>
                {/* Brief Title */}
                <div className="border-b-2 border-primary/20 pb-6 mb-8 text-center">
                  <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-2 tracking-tight">
                    {meeting.rawDocument?.brief_title || `Intelligence Brief: ${meeting.company}`}
                  </h2>
                  <div className="flex justify-center items-center flex-wrap gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-3">
                    <span>Goal: {meeting.rawDocument?.meeting_goal || meeting.title}</span>
                    <span>•</span>
                    <span>Type: {meeting.rawDocument?.meeting_type || 'Discovery'}</span>
                    <span>•</span>
                    <span className={meeting.rawDocument?.priority?.toLowerCase() === 'high' ? 'text-red-600 dark:text-red-400' : ''}>
                      Priority: {meeting.rawDocument?.priority || 'Medium'}
                    </span>
                  </div>
                </div>

                {/* I. Executive Summary */}
                <div className="mb-8">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-border/40 pb-2 mb-4">I. Executive Summary</h3>
                  {meeting.rawDocument?.executive_summary || meeting.summary ? (
                    <p className="text-sm text-foreground/90 leading-relaxed font-medium">
                      {meeting.rawDocument?.executive_summary || meeting.summary}
                    </p>
                  ) : (
                    <div className="space-y-2 animate-pulse">
                      <Skeleton className="h-3.5 w-full" />
                      <Skeleton className="h-3.5 w-5/6" />
                      <Skeleton className="h-3.5 w-4/6" />
                    </div>
                  )}
                </div>

                {/* II. Why This Meeting Matters */}
                <div className="mb-8 bg-primary/5 p-5 rounded-xl border border-primary/10">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-4">II. Why This Meeting Matters</h3>
                  {meeting.rawDocument?.why_this_meeting_matters ? (
                    <p className="text-sm text-foreground/90 leading-relaxed font-medium m-0">
                      {meeting.rawDocument.why_this_meeting_matters}
                    </p>
                  ) : (
                    <div className="space-y-2 animate-pulse">
                      <Skeleton className="h-3.5 w-full bg-primary/10" />
                      <Skeleton className="h-3.5 w-5/6 bg-primary/10" />
                    </div>
                  )}
                </div>

                {/* III. Company Context */}
                <div className="mb-8">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-border/40 pb-2 mb-4">III. Company Context</h3>
                  {meeting.rawDocument?.company_context ? (
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {meeting.rawDocument.company_context}
                    </p>
                  ) : (
                    <div className="space-y-2 animate-pulse">
                      <Skeleton className="h-3.5 w-full" />
                      <Skeleton className="h-3.5 w-5/6" />
                      <Skeleton className="h-3.5 w-4/6" />
                    </div>
                  )}
                </div>

                {/* IV. Recent News That Matters */}
                <div className="mb-8">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-border/40 pb-2 mb-4">IV. Recent News That Matters</h3>
                  {meeting.rawDocument?.recent_news_that_matters ? (
                    <ul className="list-disc pl-5 space-y-2.5 marker:text-primary">
                      {Array.isArray(meeting.rawDocument.recent_news_that_matters)
                        ? meeting.rawDocument.recent_news_that_matters.map((pt: any, i: number) => (
                          <li key={i} className="text-sm text-foreground/90">{typeof pt === 'string' ? pt : JSON.stringify(pt)}</li>
                        ))
                        : <li className="text-sm text-foreground/90">{String(meeting.rawDocument.recent_news_that_matters)}</li>}
                    </ul>
                  ) : <div className="space-y-2 animate-pulse"><Skeleton className="h-3.5 w-full" /><Skeleton className="h-3.5 w-5/6" /></div>}
                </div>

                {/* V. Sales Triggers */}
                <div className="mb-8">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-border/40 pb-2 mb-4">V. Sales Triggers</h3>
                  {meeting.rawDocument?.sales_triggers ? (
                    <ul className="list-disc pl-5 space-y-2.5 marker:text-primary">
                      {Array.isArray(meeting.rawDocument.sales_triggers)
                        ? meeting.rawDocument.sales_triggers.map((pt: any, i: number) => (
                          <li key={i} className="text-sm text-foreground/90">{typeof pt === 'string' ? pt : JSON.stringify(pt)}</li>
                        ))
                        : <li className="text-sm text-foreground/90">{String(meeting.rawDocument.sales_triggers)}</li>}
                    </ul>
                  ) : <div className="space-y-2 animate-pulse"><Skeleton className="h-3.5 w-full" /><Skeleton className="h-3.5 w-5/6" /></div>}
                </div>

                {/* VI. Possible Pain Points */}
                <div className="mb-8">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-border/40 pb-2 mb-4">VI. Possible Pain Points</h3>
                  {meeting.rawDocument?.possible_pain_points ? (
                    <ul className="list-disc pl-5 space-y-2.5 marker:text-primary">
                      {Array.isArray(meeting.rawDocument.possible_pain_points)
                        ? meeting.rawDocument.possible_pain_points.map((pt: any, i: number) => (
                          <li key={i} className="text-sm text-foreground/90">{typeof pt === 'string' ? pt : JSON.stringify(pt)}</li>
                        ))
                        : <li className="text-sm text-foreground/90">{String(meeting.rawDocument.possible_pain_points)}</li>}
                    </ul>
                  ) : <div className="space-y-2 animate-pulse"><Skeleton className="h-3.5 w-full" /><Skeleton className="h-3.5 w-5/6" /></div>}
                </div>

                {/* VII. Recommended Strategy */}
                <div className="mb-8">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-border/40 pb-2 mb-4">VII. Recommended Meeting Strategy</h3>
                  {meeting.rawDocument?.recommended_meeting_strategy ? (
                    <p className="text-sm text-foreground/90 leading-relaxed font-medium">
                      {meeting.rawDocument.recommended_meeting_strategy}
                    </p>
                  ) : <div className="space-y-2 animate-pulse"><Skeleton className="h-3.5 w-full" /><Skeleton className="h-3.5 w-5/6" /></div>}
                </div>

                {/* VIII. Talking Points */}
                <div className="mb-8">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-border/40 pb-2 mb-4">VIII. Talking Points</h3>
                  {meeting.rawDocument?.talking_points || (meeting.keyTalkingPoints && meeting.keyTalkingPoints.length > 0) ? (
                    <ul className="list-disc pl-5 space-y-2.5 marker:text-primary">
                      {meeting.rawDocument?.talking_points ? (
                        Array.isArray(meeting.rawDocument.talking_points)
                          ? meeting.rawDocument.talking_points.map((pt: any, i: number) => (
                            <li key={i} className="text-sm text-foreground/90">{typeof pt === 'string' ? pt : JSON.stringify(pt)}</li>
                          ))
                          : <li className="text-sm text-foreground/90">{String(meeting.rawDocument.talking_points)}</li>
                      ) : (
                        meeting.keyTalkingPoints.map((pt: string, i: number) => (
                          <li key={i} className="text-sm text-foreground/90">{pt}</li>
                        ))
                      )}
                    </ul>
                  ) : <div className="space-y-2 animate-pulse"><Skeleton className="h-3.5 w-full" /><Skeleton className="h-3.5 w-5/6" /></div>}
                </div>

                {/* IX. Discovery Questions */}
                <div className="mb-8">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-border/40 pb-2 mb-4">IX. Discovery Questions</h3>
                  {meeting.rawDocument?.discovery_questions ? (
                    <ol className="list-decimal pl-5 space-y-2.5 marker:text-primary font-medium italic">
                      {Array.isArray(meeting.rawDocument.discovery_questions)
                        ? meeting.rawDocument.discovery_questions.map((pt: any, i: number) => (
                          <li key={i} className="text-sm text-foreground/90">{typeof pt === 'string' ? pt : JSON.stringify(pt)}</li>
                        ))
                        : <li className="text-sm text-foreground/90">{String(meeting.rawDocument.discovery_questions)}</li>}
                    </ol>
                  ) : <div className="space-y-2 animate-pulse"><Skeleton className="h-3.5 w-full" /><Skeleton className="h-3.5 w-5/6" /></div>}
                </div>

                {/* X. Risks & Red Flags */}
                <div className="mb-8">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-border/40 pb-2 mb-4">X. Risks & Red Flags</h3>
                  {meeting.rawDocument?.risks_or_red_flags || (meeting.objections && meeting.objections.length > 0) ? (
                    <ul className="list-disc pl-5 space-y-2.5 marker:text-red-500 font-medium">
                      {meeting.rawDocument?.risks_or_red_flags ? (
                        Array.isArray(meeting.rawDocument.risks_or_red_flags)
                          ? meeting.rawDocument.risks_or_red_flags.map((pt: any, i: number) => (
                            <li key={i} className="text-sm text-foreground/90">{typeof pt === 'string' ? pt : JSON.stringify(pt)}</li>
                          ))
                          : <li className="text-sm text-foreground/90">{String(meeting.rawDocument.risks_or_red_flags)}</li>
                      ) : (
                        meeting.objections.map((obj: any, i: number) => (
                          <li key={i} className="text-sm text-foreground/90">{obj.title}</li>
                        ))
                      )}
                    </ul>
                  ) : <div className="space-y-2 animate-pulse"><Skeleton className="h-3.5 w-full" /><Skeleton className="h-3.5 w-5/6" /></div>}
                </div>

                {/* XI. Inferred Recommendations */}
                <div className="mb-8">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-border/40 pb-2 mb-4">XI. Inferred Recommendations</h3>
                  {meeting.rawDocument?.inferred_recommendations ? (
                    <ul className="list-disc pl-5 space-y-2.5 marker:text-purple-500">
                      {Array.isArray(meeting.rawDocument.inferred_recommendations)
                        ? meeting.rawDocument.inferred_recommendations.map((pt: any, i: number) => (
                          <li key={i} className="text-sm text-foreground/90">{typeof pt === 'string' ? pt : JSON.stringify(pt)}</li>
                        ))
                        : <li className="text-sm text-foreground/90">{String(meeting.rawDocument.inferred_recommendations)}</li>}
                    </ul>
                  ) : <div className="space-y-2 animate-pulse"><Skeleton className="h-3.5 w-full" /><Skeleton className="h-3.5 w-5/6" /></div>}
                </div>

                {/* XII. Rep Focus */}
                <div className="bg-muted/30 p-5 rounded-xl border border-border/50">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">XII. Rep Focus</h3>
                  {meeting.rawDocument?.rep_focus ? (
                    <p className="text-sm font-bold text-foreground/90 italic">{meeting.rawDocument.rep_focus}</p>
                  ) : <div className="space-y-2 animate-pulse"><Skeleton className="h-3.5 w-full" /><Skeleton className="h-3.5 w-5/6" /></div>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ═══════════════════ RIGHT — Intelligence Panel ══════════════════ */}
        <div className="xl:col-span-5 space-y-5">

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              {
                label: 'Meeting Focus',
                value: meeting.meetingType || meeting.rawDocument?.meeting_type || 'Discovery Call',
                icon: Calendar,
              },
              {
                label: 'Primary Contact',
                value: meeting.attendees?.[0]?.name || meeting.rawDocument?.person_name || 'Stakeholder',
                icon: Users,
              },
              {
                label: 'Contact Role',
                value: meeting.attendees?.[0]?.role || meeting.rawDocument?.role_title || 'Decision Maker',
                icon: Briefcase,
              },
              {
                label: 'Est. Revenue',
                value: meeting.financials?.revenue || '—',
                icon: DollarSign,
              },
              {
                label: 'Red Flags',
                value: meeting.objections?.[0]?.points?.length 
                  ? `${meeting.objections[0].points.length} Detected` 
                  : meeting.rawDocument?.news_intelligence?.risk_signals?.length
                    ? `${meeting.rawDocument.news_intelligence.risk_signals.length} Detected`
                    : 'No Objections',
                icon: AlertTriangle,
              },
              {
                label: 'Talking Points',
                value: meeting.keyTalkingPoints?.length 
                  ? `${meeting.keyTalkingPoints.length} Compiled` 
                  : 'None',
                icon: Sparkles,
              },
            ].map(({ label, value, icon: Icon }) => (
              <div 
                key={label} 
                className="bg-card border border-border rounded-xl p-3 text-center hover:border-primary/20 hover:bg-muted/10 transition-all duration-200"
                title={value}
              >
                <Icon className="w-4 h-4 text-primary mx-auto mb-1.5" />
                <p className="text-xs font-bold text-foreground truncate">{value}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Finance Panel */}
          <FinancePanel financials={meeting.financials} rawDocument={meeting.rawDocument} />

          {/* Social Media Panel */}
          <SocialMediaPanel socialMedia={meeting.socialMedia} rawDocument={meeting.rawDocument} />

          {/* Stakeholders Panel */}
          <StakeholdersPanel attendees={meeting.attendees || []} />

          {/* News Panel */}
          <NewsPanel news={meeting.news || []} />
      </div>
    </div>

    {/* Edit Meeting Modal */}
    {isEditModalOpen && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-opacity print:hidden">
        <div className="bg-card text-foreground rounded-2xl border border-border p-6 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={() => setIsEditModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <h3 className="text-base font-bold mb-1">Edit Meeting Details</h3>
          <p className="text-xs text-muted-foreground mb-4">Modify coordinates for this meeting brief</p>

          {editModalError && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-650 font-semibold">
              {editModalError}
            </div>
          )}

          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label htmlFor="editCompany" className="text-[10px] font-extrabold text-muted-foreground uppercase block mb-1">Company *</label>
                <input
                  id="editCompany"
                  type="text"
                  required
                  placeholder="e.g. Nykaa"
                  value={editCompany}
                  onChange={(e) => setEditCompany(e.target.value)}
                  className="w-full px-3 py-2 bg-secondary/35 border border-border rounded-lg text-xs font-semibold text-foreground focus:bg-card focus:border-primary outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="editContactName" className="text-[10px] font-extrabold text-muted-foreground uppercase block mb-1">Contact Name *</label>
                <input
                  id="editContactName"
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={editContactName}
                  onChange={(e) => setEditContactName(e.target.value)}
                  className="w-full px-3 py-2 bg-secondary/35 border border-border rounded-lg text-xs font-semibold text-foreground focus:bg-card focus:border-primary outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="editContactRole" className="text-[10px] font-extrabold text-muted-foreground uppercase block mb-1">Contact Role *</label>
                <input
                  id="editContactRole"
                  type="text"
                  required
                  placeholder="e.g. CTO"
                  value={editContactRole}
                  onChange={(e) => setEditContactRole(e.target.value)}
                  className="w-full px-3 py-2 bg-secondary/35 border border-border rounded-lg text-xs font-semibold text-foreground focus:bg-card focus:border-primary outline-none transition-all"
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="editMeetingType" className="text-[10px] font-extrabold text-muted-foreground uppercase block mb-1">Meeting Title / Type *</label>
                <input
                  id="editMeetingType"
                  type="text"
                  required
                  placeholder="e.g. Q2 Strategy Alignment"
                  value={editMeetingType}
                  onChange={(e) => setEditMeetingType(e.target.value)}
                  className="w-full px-3 py-2 bg-secondary/35 border border-border rounded-lg text-xs font-semibold text-foreground focus:bg-card focus:border-primary outline-none transition-all"
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="editMeetingGoal" className="text-[10px] font-extrabold text-muted-foreground uppercase block mb-1">Meeting Goal *</label>
                <input
                  id="editMeetingGoal"
                  type="text"
                  required
                  placeholder="e.g. Propose pilot, secure commitment"
                  value={editMeetingGoal}
                  onChange={(e) => setEditMeetingGoal(e.target.value)}
                  className="w-full px-3 py-2 bg-secondary/35 border border-border rounded-lg text-xs font-semibold text-foreground focus:bg-card focus:border-primary outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="editDate" className="text-[10px] font-extrabold text-muted-foreground uppercase block mb-1">Date *</label>
                <input
                  id="editDate"
                  type="text"
                  required
                  placeholder="e.g. Tomorrow or May 24, 2026"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full px-3 py-2 bg-secondary/35 border border-border rounded-lg text-xs font-semibold text-foreground focus:bg-card focus:border-primary outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="editTime" className="text-[10px] font-extrabold text-muted-foreground uppercase block mb-1">Time *</label>
                <select
                  id="editTime"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                  className="w-full px-3 py-2 bg-secondary/35 border border-border rounded-lg text-xs font-semibold text-foreground focus:bg-card focus:border-primary outline-none transition-all cursor-pointer"
                >
                  {['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'].map((t) => (
                    <option key={t} value={t} className="bg-card text-foreground">{t}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-[10px] font-extrabold text-muted-foreground uppercase block mb-2">Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'medium', 'high'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setEditPriority(p)}
                      className={`py-1.5 px-3 rounded-lg border text-center text-xs font-bold transition-all cursor-pointer uppercase tracking-wider ${
                        editPriority === p
                          ? p === 'high'
                            ? 'bg-red-500/10 border-red-500 text-red-650'
                            : p === 'medium'
                              ? 'bg-amber-500/10 border-amber-500 text-amber-650'
                              : 'bg-green-500/10 border-green-500 text-green-650'
                          : 'bg-secondary/30 border-border text-muted-foreground hover:border-border hover:text-foreground'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/50">
              <button
                onClick={() => setIsEditModalOpen(false)}
                type="button"
                className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground border border-border rounded-lg text-xs font-bold transition-colors active:scale-98 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isEditingSubmitting}
                className="px-5 py-2 bg-primary hover:bg-primary/95 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors active:scale-98 cursor-pointer disabled:opacity-75"
              >
                <span>{isEditingSubmitting ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </div>
  </div>
);
}
