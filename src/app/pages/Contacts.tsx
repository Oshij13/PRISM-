import { useState, useEffect } from 'react';
import { Search, Plus, Phone, Mail, Linkedin, Building2, Star, Filter, MoreHorizontal, Activity } from 'lucide-react';
import { supabaseService } from '../../lib/supabaseService';
import { mapDbBriefToMeetingDetails } from '../data/meetingsDb';

const tagColors: Record<string, string> = {
  'Hot Lead': 'bg-red-100 text-red-700',
  'Decision Maker': 'bg-purple-100 text-purple-700',
  'C-Suite': 'bg-indigo-100 text-indigo-700',
  'Active': 'bg-green-100 text-green-700',
  'Warm Lead': 'bg-amber-100 text-amber-700',
  'Champion': 'bg-blue-100 text-blue-700',
};

const getAvatarColor = (name: string) => {
  const colors = ['#dc2626', '#2563eb', '#7c3aed', '#059669', '#d97706', '#0891b2', '#0d9488', '#4f46e5'];
  const charCode = name.charCodeAt(0) || 0;
  return colors[charCode % colors.length];
};

export function Contacts() {
  const [search, setSearch] = useState('');
  const [starredFilter, setStarredFilter] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [briefs, manualMeetings] = await Promise.all([
        supabaseService.getAllMeetingBriefs(),
        supabaseService.getMeetings()
      ]);

      const extractedContacts: any[] = [];
      const seenContacts = new Set<string>();
      let idCounter = 1;

      // 1. Process AI Generated Briefs
      for (const row of briefs) {
        const details = mapDbBriefToMeetingDetails(row);
        
        details.attendees.forEach(att => {
          const uniqueKey = `${att.name}-${details.company}`.toLowerCase();
          if (seenContacts.has(uniqueKey)) return;
          seenContacts.add(uniqueKey);

          let priorityTag = 'Active';
          if (details.title.toLowerCase().includes('high') || row.priority === 'high') priorityTag = 'Hot Lead';
          else if (att.role.toLowerCase().includes('decision')) priorityTag = 'Decision Maker';
          else if (att.role.toLowerCase().includes('chief') || att.role.toLowerCase().includes('ceo') || att.role.toLowerCase().includes('vp') || att.role.toLowerCase().includes('head')) priorityTag = 'C-Suite';

          extractedContacts.push({
            id: String(idCounter++),
            name: att.name,
            title: att.role,
            company: details.company,
            email: att.email || `${att.name.toLowerCase().replace(/\s+/g, '.')}@${details.company.toLowerCase().replace(/\s+/g, '')}.com`,
            phone: att.phone || '+1 (---) --- ----',
            linkedin: att.linkedin || `linkedin.com/in/${att.name.toLowerCase().replace(/\s+/g, '')}`,
            tags: [priorityTag],
            lastContact: details.date,
            meetings: 1,
            starred: false,
            avatar: att.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
            color: getAvatarColor(att.name)
          });
        });
      }

      // 2. Process Manually Added Meetings (from Dashboard)
      manualMeetings.forEach((meeting: any) => {
        if (!meeting.contactName) return;
        
        const uniqueKey = `${meeting.contactName}-${meeting.company}`.toLowerCase();
        if (seenContacts.has(uniqueKey)) return; // Already extracted from AI brief
        seenContacts.add(uniqueKey);

        let priorityTag = 'Active';
        if (meeting.priority === 'high') priorityTag = 'Hot Lead';
        else if (meeting.contactRole?.toLowerCase().includes('decision')) priorityTag = 'Decision Maker';
        else if (meeting.contactRole?.toLowerCase().match(/chief|ceo|vp|head/)) priorityTag = 'C-Suite';

        extractedContacts.push({
          id: String(idCounter++),
          name: meeting.contactName,
          title: meeting.contactRole || 'Stakeholder',
          company: meeting.company,
          email: `${meeting.contactName.toLowerCase().replace(/\s+/g, '.')}@${meeting.company.toLowerCase().replace(/\s+/g, '')}.com`,
          phone: '+1 (---) --- ----',
          linkedin: `linkedin.com/in/${meeting.contactName.toLowerCase().replace(/\s+/g, '')}`,
          tags: [priorityTag],
          lastContact: meeting.date,
          meetings: 1,
          starred: false,
          avatar: meeting.contactName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
          color: getAvatarColor(meeting.contactName)
        });
      });

      setContacts(extractedContacts);
      setLoading(false);
    }
    loadData();
  }, []);

  const filtered = contacts.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase());
    const matchStarred = starredFilter ? c.starred : true;
    return matchSearch && matchStarred;
  });

  const toggleStar = (id: string) => {
    setContacts(contacts.map(c => c.id === id ? { ...c, starred: !c.starred } : c));
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="mb-2">Contacts</h1>
          <p className="text-muted-foreground">Manage your key stakeholders and decision makers.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" />
          Add Contact
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Contacts', value: contacts.length },
          { label: 'Hot Leads', value: contacts.filter(c => c.tags.includes('Hot Lead')).length },
          { label: 'Starred', value: contacts.filter(c => c.starred).length },
          { label: 'Active This Week', value: contacts.length > 0 ? Math.min(3, contacts.length) : 0 },
        ].map((stat, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-5">
            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground">
              {loading ? <Activity className="w-5 h-5 animate-spin mt-1 text-primary" /> : stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search & Filter bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search contacts or companies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <button
          onClick={() => setStarredFilter(!starredFilter)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${starredFilter ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-card border-border text-muted-foreground hover:border-border'}`}
        >
          <Star className={`w-4 h-4 ${starredFilter ? 'fill-amber-400 text-amber-400' : ''}`} />
          Starred
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border bg-card border-border text-muted-foreground hover:border-border transition-all">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(contact => (
          <div key={contact.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all duration-200 group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ backgroundColor: contact.color }}
                >
                  {contact.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{contact.name}</p>
                  <p className="text-xs text-muted-foreground">{contact.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => toggleStar(contact.id)}
                  className={`p-1.5 rounded-lg transition-all ${contact.starred ? 'text-amber-400 opacity-100' : 'text-muted-foreground opacity-0 group-hover:opacity-100'}`}
                >
                  <Star className={`w-4 h-4 ${contact.starred ? 'fill-amber-400' : ''}`} />
                </button>
                <button className="p-1.5 rounded-lg text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-muted transition-all">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mb-3">
              <Building2 className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              <p className="text-xs text-muted-foreground">{contact.company}</p>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {contact.tags.map((tag: string) => (
                <span key={tag} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${tagColors[tag] || 'bg-zinc-100 text-zinc-600'}`}>
                  {tag}
                </span>
              ))}
            </div>

            <div className="space-y-1.5 mb-4">
              <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-3.5 h-3.5" />
                {contact.email}
              </a>
              <div className="flex items-center gap-2 text-xs text-muted-foreground hover:text-blue-600 transition-colors cursor-pointer">
                <Linkedin className="w-3.5 h-3.5" />
                {contact.linkedin}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground">
              <span>Last contact: {contact.lastContact}</span>
              <span>{contact.meetings} meeting{contact.meetings !== 1 ? 's' : ''}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
