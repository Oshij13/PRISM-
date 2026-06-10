import { useState, useEffect } from 'react';
import { Search, Plus, Sparkles, Clock, ExternalLink, Tag, ChevronRight, BookOpen, Globe, Linkedin, FileText, Activity, Star } from 'lucide-react';
import { supabaseService } from '../../lib/supabaseService';
import { mapDbBriefToMeetingDetails } from '../data/meetingsDb';

const sourceIcons: Record<string, any> = {
  news: Globe,
  linkedin: Linkedin,
  blog: BookOpen,
  report: FileText,
};

const relevanceColors: Record<string, string> = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-zinc-100 text-zinc-600',
};

const tagColors = [
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-green-100 text-green-700',
  'bg-rose-100 text-rose-700',
  'bg-indigo-100 text-indigo-700',
];

export function Research() {
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [researchItems, setResearchItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const briefs = await supabaseService.getAllMeetingBriefs();
      const extractedItems: any[] = [];
      let idCounter = 1;

      for (const row of briefs) {
        const details = mapDbBriefToMeetingDetails(row);
        
        let hasNews = false;
        if (details.news && details.news.length > 0) {
          hasNews = true;
          details.news.forEach(newsItem => {
            extractedItems.push({
              id: String(idCounter++),
              company: details.company,
              title: newsItem.title,
              source: newsItem.source,
              sourceType: 'news',
              url: '#',
              summary: newsItem.summary,
              relevance: newsItem.sentiment === 'positive' ? 'High' : 'Medium',
              aiComment: `Extracted from ${details.company} intelligence brief`,
              tags: [newsItem.sentiment],
              savedAt: details.date,
              meeting: details.title,
              starred: false
            });
          });
        }

        // Fallback to rawDocument news if not properly mapped
        if (!hasNews && details.rawDocument?.recent_news_that_matters) {
          const rawNews = details.rawDocument.recent_news_that_matters;
          const newsList = Array.isArray(rawNews) ? rawNews : [rawNews];
          newsList.forEach(newsItem => {
            const text = typeof newsItem === 'string' ? newsItem : JSON.stringify(newsItem);
            extractedItems.push({
              id: String(idCounter++),
              company: details.company,
              title: `Intelligence Signal: ${details.company}`,
              source: 'AI Feed',
              sourceType: 'news',
              url: '#',
              summary: text,
              relevance: 'High',
              aiComment: `Automated orchestrator signal for ${details.company}`,
              tags: ['Signal'],
              savedAt: details.date,
              meeting: details.title,
              starred: false
            });
          });
        }
      }
      setResearchItems(extractedItems);
      setLoading(false);
    }
    loadData();
  }, []);

  const companies = ['All', ...Array.from(new Set(researchItems.map(r => r.company)))];

  const filtered = researchItems.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.company.toLowerCase().includes(search.toLowerCase()) ||
      r.summary.toLowerCase().includes(search.toLowerCase());
    const matchCompany = selectedCompany === 'All' || r.company === selectedCompany;
    return matchSearch && matchCompany;
  });

  const toggleStar = (id: string) => {
    setResearchItems(researchItems.map(r => r.id === id ? { ...r, starred: !r.starred } : r));
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="mb-2">Research</h1>
          <p className="text-muted-foreground max-w-3xl">This feed automatically aggregates and continuously displays intelligence sources parsed directly from your AI-generated meeting briefs, eliminating the need for manual data entry.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-border bg-card rounded-lg hover:bg-muted/40 transition-colors text-sm font-medium text-foreground">
            <Plus className="w-4 h-4" />
            Add Source
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Run AI Research
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Starred Articles', value: researchItems.filter(r => r.starred).length, icon: Star },
          { label: 'High Relevance', value: researchItems.filter(r => r.relevance === 'High').length, icon: Sparkles },
          { label: 'Companies Covered', value: new Set(researchItems.map(r => r.company)).size, icon: Globe },
          { label: 'Total Added', value: researchItems.length, icon: Clock },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold">{loading ? <Activity className="w-5 h-5 animate-spin mt-1" /> : s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search + Company Filter */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search research..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {companies.map(company => (
            <button
              key={company}
              onClick={() => setSelectedCompany(company)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${selectedCompany === company
                ? 'bg-primary text-white border-primary'
                : 'bg-card text-muted-foreground border-border hover:border-border'
              }`}
            >
              {company}
            </button>
          ))}
        </div>
      </div>

      {/* Research Cards */}
      <div className="space-y-4">
        {filtered.map(item => {
          const SourceIcon = sourceIcons[item.sourceType] || Globe;
          return (
            <div key={item.id} className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Source + company row */}
                  <div className="flex items-center gap-2 mb-2">
                    <SourceIcon className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">{item.source}</span>
                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground">{item.company}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold text-foreground mb-2 leading-snug">{item.title}</h3>

                  {/* Summary */}
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{item.summary}</p>

                  {/* AI Comment */}
                  <div className="flex items-start gap-2 bg-primary/5 border border-primary/15 rounded-lg px-3 py-2 mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-primary font-medium leading-relaxed">{item.aiComment}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                    {item.tags.map((tag: string, i: number) => (
                      <span key={tag} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${tagColors[i % tagColors.length]}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right column */}
                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleStar(item.id)}
                      className={`p-1.5 rounded-lg transition-all ${item.starred ? 'text-amber-400 bg-amber-50' : 'text-muted-foreground hover:bg-muted'}`}
                    >
                      <Star className={`w-4 h-4 ${item.starred ? 'fill-amber-400' : ''}`} />
                    </button>
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${relevanceColors[item.relevance]}`}>
                      {item.relevance} Relevance
                    </span>
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary font-medium hover:underline"
                  >
                    View Source <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 mt-2 border-t border-border text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Saved {item.savedAt}
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  Linked to: <span className="font-medium text-foreground ml-1">{item.meeting}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
