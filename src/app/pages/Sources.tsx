import { useState, useEffect } from 'react';
import {
  Plus, Sparkles, Globe, Linkedin, BookOpen, FileText, Activity,
  ChevronDown, ChevronRight, ExternalLink, Tag, X, Check,
  Building2, Search, Link2, Newspaper, TrendingUp, Calendar, Clock, Users
} from 'lucide-react';
import { supabaseService } from '../../lib/supabaseService';
import { mapDbBriefToMeetingDetails, parseSignalItem, getAllMockBriefs } from '../data/meetingsDb';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Source {
  title: string;
  url: string;
  type: 'news' | 'linkedin' | 'blog' | 'report' | 'other';
  summary: string;
  tags: string[];
  addedAt?: string;
  relevance?: string;
}

interface CompanyGroup {
  company: string;
  briefId: string;
  sentiment: string;
  priority: string;
  title: string;
  date: string;
  time: string;
  contactName: string;
  sources: Source[];
  fallbackSources: Source[];
}

// ─── Constants ───────────────────────────────────────────────────────────────

const SOURCE_ICONS: Record<string, any> = {
  news: Newspaper,
  linkedin: Linkedin,
  blog: BookOpen,
  report: FileText,
  other: Globe,
};

const SOURCE_TYPE_COLORS: Record<string, string> = {
  news: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  linkedin: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  blog: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  report: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  other: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
};

const SENTIMENT_COLORS: Record<string, string> = {
  positive: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400',
  negative: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400',
  neutral: 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400',
};

const TAG_COLORS = [
  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
];

// ─── Add Source Modal ─────────────────────────────────────────────────────────

function AddSourceModal({
  companies,
  onClose,
  onAdded,
}: {
  companies: string[];
  onClose: () => void;
  onAdded: () => void;
}) {
  const [form, setForm] = useState({
    company: companies[0] || '',
    title: '',
    url: '',
    type: 'news' as Source['type'],
    summary: '',
    tags: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company || !form.title || !form.url) {
      setError('Company, title and URL are required.');
      return;
    }
    setSaving(true);
    setError(null);
    const source: Source = {
      title: form.title,
      url: form.url,
      type: form.type,
      summary: form.summary,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    const res = await supabaseService.addSourceToCompany(form.company, source);
    setSaving(false);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => { onAdded(); onClose(); }, 1000);
    } else {
      setError(res.error || 'Failed to save source.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg p-6 relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Plus className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-base font-bold text-foreground">Add Source</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
              <Check className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="font-semibold text-foreground">Source saved successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Company */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Company *</label>
              <select
                value={form.company}
                onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {companies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Source headline or document title"
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/50"
              />
            </div>

            {/* URL */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">URL *</label>
              <input
                type="url"
                value={form.url}
                onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                placeholder="https://..."
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Type</label>
              <div className="flex flex-wrap gap-2">
                {(['news', 'linkedin', 'blog', 'report', 'other'] as Source['type'][]).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, type: t }))}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all capitalize ${
                      form.type === t
                        ? 'bg-primary text-white border-primary'
                        : 'bg-card text-muted-foreground border-border hover:border-primary/50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Summary</label>
              <textarea
                value={form.summary}
                onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
                placeholder="Brief description of what this source covers..."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Tags <span className="font-normal normal-case">(comma separated)</span></label>
              <input
                type="text"
                value={form.tags}
                onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                placeholder="funding, product launch, partnership"
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/50"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">{error}</p>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? <Activity className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Source'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Source Card ─────────────────────────────────────────────────────────────

function SourceCard({ source, index }: { source: Source; index: number }) {
  const Icon = SOURCE_ICONS[source.type] || Globe;
  return (
    <div className="bg-card border border-border/60 rounded-xl p-4 hover:shadow-md hover:border-primary/20 transition-all duration-200 group">
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${SOURCE_TYPE_COLORS[source.type] || SOURCE_TYPE_COLORS.other}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-sm font-semibold text-foreground leading-snug truncate" title={source.title}>{source.title}</h4>
            {source.url && source.url !== '#' && (
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
                title="Open source"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
          {source.summary && (
            <p className="text-xs text-muted-foreground leading-relaxed mb-2 line-clamp-2">{source.summary}</p>
          )}
          <div className="flex items-center flex-wrap gap-1.5">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${SOURCE_TYPE_COLORS[source.type] || SOURCE_TYPE_COLORS.other}`}>
              {source.type}
            </span>
            {source.tags?.map((tag, i) => (
              <span key={tag} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${TAG_COLORS[(index + i) % TAG_COLORS.length]}`}>
                {tag}
              </span>
            ))}
            {source.addedAt && (
              <span className="text-[10px] text-muted-foreground ml-auto">
                {new Date(source.addedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Company Row ─────────────────────────────────────────────────────────────

function CompanyRow({
  group,
  onAddSource,
}: {
  group: CompanyGroup;
  onAddSource: (company: string) => void;
}) {
  const [open, setOpen] = useState(false);
  
  const priorityColors: Record<string, string> = {
    high: 'bg-red-50 text-red-650 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50',
    medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50',
    low: 'bg-green-50 text-green-705 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/50',
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all duration-200">
      {/* Clickable Header formatted like Meeting Intelligence Row */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left p-5 hover:bg-muted/10 transition-all duration-200 flex items-center justify-between group"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Large badge */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-red-700 flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow-sm shadow-primary/20">
            {(group.company || '?').charAt(0)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-bold text-foreground text-base group-hover:text-primary transition-colors">{group.company}</span>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${priorityColors[group.priority || 'medium']}`}>
                {group.priority || 'medium'}
              </span>
              <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-bold">
                {group.sources.length + group.fallbackSources.length} source{group.sources.length + group.fallbackSources.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <p className="text-xs text-muted-foreground font-medium truncate">{group.title}</p>
            
            <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{group.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{group.time}</span>
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{group.contactName}</span>
            </div>
          </div>
        </div>

        <ChevronRight className={`w-5 h-5 text-muted-foreground group-hover:text-primary transition-transform duration-200 flex-shrink-0 ml-4 ${open ? 'rotate-90' : ''}`} />
      </button>

      {/* Expanded Sources list */}
      {open && (
        <div className="border-t border-border bg-muted/5 p-5 space-y-6">
          {/* SECTION 1: Verified Sources (Scanned by n8n Agent) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> Verified Sources (n8n AI Engine)
              </p>
            </div>
            {group.fallbackSources.length === 0 ? (
              <p className="text-xs text-muted-foreground italic pl-1">No AI sources cataloged for this brief.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {group.fallbackSources.map((source, i) => (
                  <SourceCard key={`${group.company}-ai-source-${i}`} source={source} index={i} />
                ))}
              </div>
            )}
          </div>

          {/* SECTION 2: Manually Added Sources */}
          <div className="space-y-3 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-500" /> Manually Contributed Sources
              </p>
              <button
                onClick={e => { e.stopPropagation(); onAddSource(group.company); }}
                className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 hover:bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/20 transition-all"
              >
                <Plus className="w-3 h-3" /> Add Source
              </button>
            </div>
            {group.sources.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center gap-2 bg-card border border-dashed border-border rounded-xl">
                <Link2 className="w-6 h-6 text-muted-foreground/30" />
                <p className="text-xs text-muted-foreground">No manually added sources yet.</p>
                <button
                  onClick={e => { e.stopPropagation(); onAddSource(group.company); }}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Click to add manual references
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {group.sources.map((source, i) => (
                  <SourceCard key={`${group.company}-manual-source-${i}`} source={source} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Sources Page ────────────────────────────────────────────────────────

export function Sources() {
  const [companyGroups, setCompanyGroups] = useState<CompanyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalCompany, setModalCompany] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const briefs = await supabaseService.getAllMeetingBriefs();
      const meetings = await supabaseService.getMeetings();

      let activeBriefs = briefs || [];
      let activeMeetings = meetings || [];

      // Fall back to mock only if both are empty
      if (activeBriefs.length === 0 && activeMeetings.length === 0) {
        activeBriefs = getAllMockBriefs();
      }

      const groups: CompanyGroup[] = [];
      const companyKeys = new Set<string>();

      activeMeetings.forEach((m: any) => {
        if (m.company?.trim()) {
          companyKeys.add(m.company.trim());
        }
      });
      activeBriefs.forEach((b: any) => {
        if (b.company?.trim()) {
          companyKeys.add(b.company.trim());
        }
      });

      for (const companyName of Array.from(companyKeys)) {
        // Find matching brief
        const briefRow = activeBriefs.find((b: any) => b.company?.trim().toLowerCase() === companyName.toLowerCase());
        // Find matching meeting
        const matchingMeeting = activeMeetings.find((m: any) => m.company?.trim().toLowerCase() === companyName.toLowerCase());

        let details: any = null;
        if (briefRow) {
          details = mapDbBriefToMeetingDetails(briefRow);
        } else {
          details = {
            id: matchingMeeting?.id || `temp-${companyName}`,
            company: companyName,
            title: matchingMeeting?.meetingType || 'Discovery Call',
            date: matchingMeeting?.date || 'Recently',
            time: matchingMeeting?.time || '10:00 AM',
            status: 'Pending Automation',
            industry: 'Enterprise Client',
            headquarters: 'Retrieved via n8n Orchestrator',
            employeeSize: 'Automated Insight',
            summary: 'n8n research brief has not been generated for this company yet. Run the orchestrator on a meeting to generate intelligence briefs.',
            keyTalkingPoints: [],
            agenda: [],
            objections: [],
            icebreakers: [],
            attendees: matchingMeeting?.contactName ? [{
              name: matchingMeeting.contactName,
              role: matchingMeeting.contactRole || 'Decision Maker',
              email: '',
              linkedin: '',
              phone: '',
              bio: '',
              insights: ''
            }] : [],
            financials: { valuation: '', funding: '', revenue: '', burnRate: '', runway: '', details: '' },
            socialMedia: { sentiment: 'neutral', summary: '', latestPost: '', engagement: '', followers: '' },
            news: [],
          };
        }

        // Parse sources column
        let sources: Source[] = [];
        if (briefRow && briefRow.sources) {
          let raw = briefRow.sources;
          if (typeof raw === 'string') { try { raw = JSON.parse(raw); } catch (e) { raw = []; } }
          if (Array.isArray(raw)) sources = raw;
        }

        // Parse verified sources from briefRow.full_brief
        const fallbackSources: Source[] = [];
        let parsedFullBrief: any = null;
        if (briefRow && briefRow.full_brief) {
          try {
            parsedFullBrief = typeof briefRow.full_brief === 'string' ? JSON.parse(briefRow.full_brief) : briefRow.full_brief;
          } catch (e) {}
        }
        
        // Helper to add parsed sources from different arrays inside full_brief
        const addSourcesFromList = (arr: any[], tag: string) => {
          if (!Array.isArray(arr)) return;
          arr.forEach((src: any) => {
            if (!src) return;
            const title = src.title || src.name || src.source || 'AI Source Document';
            const url = src.url || src.source_url || '#';
            if (url && url !== '#') {
              // Avoid duplicates
              if (!fallbackSources.some(fs => fs.url.toLowerCase() === url.toLowerCase())) {
                fallbackSources.push({
                  title,
                  url,
                  type: (src.platform?.toLowerCase().includes('linkedin') || title.toLowerCase().includes('linkedin')) ? 'linkedin' : 'news',
                  summary: src.summary || src.description || src.signal || 'Verified resource scanned by Research Agent.',
                  tags: [tag]
                });
              }
            }
          });
        };

        if (parsedFullBrief) {
          addSourcesFromList(parsedFullBrief.sources, 'AI Sourced');
          addSourcesFromList(parsedFullBrief.verified_social_sources, 'AI Sourced');
          addSourcesFromList(parsedFullBrief.verified_news_sources, 'AI Sourced');
        }

        // Also add unique sources from verified_signals
        let verifiedSignals: any[] = [];
        if (briefRow && briefRow.verified_signals) {
          let rawSig = briefRow.verified_signals;
          if (typeof rawSig === 'string') {
            try { rawSig = JSON.parse(rawSig); } catch (e) {}
          }
          if (Array.isArray(rawSig)) {
            verifiedSignals = rawSig;
          }
        }

        verifiedSignals.forEach((sigItem: any) => {
          const parsedSig = parseSignalItem(sigItem);
          if (parsedSig.source && parsedSig.source_url && parsedSig.source_url !== '#') {
            // Avoid duplicates
            if (!fallbackSources.some(fs => fs.url.toLowerCase() === parsedSig.source_url.toLowerCase())) {
              fallbackSources.push({
                title: parsedSig.source,
                url: parsedSig.source_url,
                type: 'news',
                summary: parsedSig.signal || 'Signal fetched by orchestrator.',
                tags: ['Verified Signal']
              });
            }
          }
        });

        // Determine sentiment
        const sentiment = details.socialMedia?.sentiment || 'neutral';

        groups.push({
          company: companyName,
          briefId: briefRow?.id || details.id,
          sentiment,
          priority: matchingMeeting?.priority || briefRow?.priority || 'medium',
          title: matchingMeeting?.meetingType || details.title || 'Alignment Call',
          date: matchingMeeting?.date || details.date || 'Recently',
          time: matchingMeeting?.time || details.time || '10:00 AM',
          contactName: matchingMeeting?.contactName || details.attendees?.[0]?.name || 'Decision Maker',
          sources,
          fallbackSources,
        });
      }

      setCompanyGroups(groups);
      setLoading(false);
    }
    loadData();
  }, [refreshKey]);

  const filtered = companyGroups.filter(g =>
    g.company.toLowerCase().includes(search.toLowerCase())
  );

  const totalSources = companyGroups.reduce((acc, g) => acc + g.sources.length + g.fallbackSources.length, 0);
  const manualSources = companyGroups.reduce((acc, g) => acc + g.sources.length, 0);
  const companiesCount = companyGroups.length;

  const openAddModal = (company?: string) => {
    setModalCompany(company || (companyGroups[0]?.company ?? ''));
    setShowModal(true);
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground mb-1.5 tracking-tight">Sources</h1>
          <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
            Intelligence sources aggregated per company from AI-generated research briefs. Expand any company to view and manage its sources. Add your own manually for dual-source intelligence.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => openAddModal()}
            className="flex items-center gap-2 px-4 py-2.5 border border-border bg-card rounded-xl hover:bg-muted/40 transition-all text-sm font-semibold text-foreground shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Source
          </button>
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all text-sm font-semibold shadow-sm shadow-primary/20"
          >
            <Sparkles className="w-4 h-4" /> Refresh Intelligence
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Companies Covered', value: companiesCount, icon: Building2, color: 'text-primary bg-primary/10' },
          { label: 'Total Sources', value: totalSources, icon: Globe, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400' },
          { label: 'Manually Added', value: manualSources, icon: Plus, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400' },
          { label: 'AI Intelligence', value: totalSources - manualSources, icon: Sparkles, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold text-foreground">
                  {loading ? <Activity className="w-5 h-5 animate-spin mt-1 text-muted-foreground" /> : s.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search companies..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground/50"
        />
      </div>

      {/* Company List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-card rounded-xl border border-border p-5 animate-pulse flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-muted flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-40" />
                <div className="h-3 bg-muted/60 rounded w-24" />
              </div>
              <div className="h-7 w-14 bg-muted rounded-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-muted-foreground/40" />
          </div>
          <div>
            <p className="font-bold text-foreground mb-1">No companies found</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              {search ? `No results matching "${search}"` : 'Run the n8n orchestrator on a meeting to generate intelligence briefs.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(group => (
            <CompanyRow
              key={group.briefId}
              group={group}
              onAddSource={openAddModal}
            />
          ))}
        </div>
      )}

      {/* Add Source Modal */}
      {showModal && (
        <AddSourceModal
          companies={companyGroups.map(g => g.company)}
          onClose={() => setShowModal(false)}
          onAdded={() => setRefreshKey(k => k + 1)}
        />
      )}
    </div>
  );
}
