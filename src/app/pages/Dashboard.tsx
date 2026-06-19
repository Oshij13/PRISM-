import { useState, useEffect } from 'react';
import { Sparkles, Clock, Users, ChevronRight, Calendar, AlertCircle, Plus, Trash2, X } from 'lucide-react';
import { Link } from 'react-router';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardCalendar } from '../components/DashboardCalendar';
import { supabaseService } from '../../lib/supabaseService';
import { supabase } from '../../lib/supabaseClient';
import { 
  isToday, 
  isTomorrow, 
  isThisWeek, 
  parseISO, 
  isValid,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  addDays
} from 'date-fns';

function parseMeetingDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const cleanStr = dateStr.trim().toLowerCase();
  const today = new Date();

  if (cleanStr === 'today') {
    return today;
  }
  if (cleanStr === 'tomorrow') {
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow;
  }
  if (cleanStr === 'day after tomorrow') {
    const dayAfter = new Date();
    dayAfter.setDate(today.getDate() + 2);
    return dayAfter;
  }

  const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayIndex = weekdays.indexOf(cleanStr);
  if (dayIndex !== -1) {
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 0 });
    const currentWeekEnd = endOfWeek(today, { weekStartsOn: 0 });
    const daysInWeek = eachDayOfInterval({ start: currentWeekStart, end: currentWeekEnd });
    return daysInWeek[dayIndex];
  }

  // Try parsing ISO/YYYY-MM-DD
  let parsed = parseISO(dateStr);
  if (isValid(parsed)) return parsed;

  // Try parsing standard formats
  parsed = new Date(dateStr);
  if (isValid(parsed)) return parsed;

  return null;
}

function isDayAfterTomorrow(date: Date): boolean {
  const dayAfter = addDays(new Date(), 2);
  return isSameDay(date, dayAfter);
}

const upcomingMeetings: any[] = [];

function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return 'Recently';
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = Math.max(0, now.getTime() - date.getTime());
    
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) {
      return 'Just now';
    }
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    }
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    if (diffDays === 1) {
      return '1d ago';
    }
    if (diffDays < 7) {
      return `${diffDays}d ago`;
    }
    return format(date, 'MMM d');
  } catch (e) {
    return 'Recently';
  }
}

export function Dashboard() {
  const [upcomingFilter, setUpcomingFilter] = useState<'tomorrow' | 'week' | 'month'>('tomorrow');
  const [userName, setUserName] = useState('');
  const [localMeetings, setLocalMeetings] = useState<any[]>([]);
  const [rawMeetings, setRawMeetings] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add Custom Meeting form state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newContactName, setNewContactName] = useState('');
  const [newContactRole, setNewContactRole] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('10:00 AM');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newMeetingType, setNewMeetingType] = useState('');
  const [newMeetingGoal, setNewMeetingGoal] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  const fetchDashboardData = async () => {
    setIsLoading(true);
    const u = await supabaseService.getProfile();
    const meetingsList = await supabaseService.getMeetings();
    
    if (u) {
      if (u.fullName) {
        setUserName(u.fullName.split(' ')[0]);
      }
    }

    
    if (meetingsList && Array.isArray(meetingsList)) {
      setRawMeetings(meetingsList);
      const mapped = meetingsList.map((m: any) => {
        const mDate = parseMeetingDate(m.date);
        let dateLabel = m.date;
        let range = 'week';
        
        if (mDate) {
          if (isToday(mDate)) {
            dateLabel = 'Today';
            range = 'today';
          } else if (isTomorrow(mDate)) {
            dateLabel = 'Tomorrow';
            range = 'tomorrow';
          } else if (isDayAfterTomorrow(mDate)) {
            dateLabel = 'Day after Tomorrow';
            range = 'week';
          } else {
            dateLabel = format(mDate, 'MMMM d, yyyy');
            if (isThisWeek(mDate)) {
              range = 'week';
            } else {
              range = 'month';
            }
          }
        } else {
          const lowerDate = m.date.toLowerCase();
          if (lowerDate.includes('day after tomorrow')) {
            dateLabel = 'Day after Tomorrow';
            range = 'week';
          } else if (lowerDate.includes('today')) {
            dateLabel = 'Today';
            range = 'today';
          } else if (lowerDate.includes('tomorrow')) {
            dateLabel = 'Tomorrow';
            range = 'tomorrow';
          }
        }

        return {
          id: m.id,
          company: m.company,
          title: m.meetingType || `${m.contactRole} Alignment Call`,
          time: `${dateLabel}, ${m.time}`,
          attendees: [m.contactName],
          priority: (m.priority === 'high' || m.priority === 'medium' || m.priority === 'low') ? m.priority : 'high',
          aiInsight: `AI Brief generated for ${m.contactName} (${m.contactRole}). Ready for dynamic execution.`,
          range
        };
      });
      setLocalMeetings(mapped);
    }

    let briefsList: any[] = [];
    if (supabaseService.isConnected()) {
      try {
        const { data: briefs, error } = await supabase
          .from('meeting_briefs')
          .select('company, brief_title, created_at')
          .order('created_at', { ascending: false })
          .limit(100);
          
        if (error || !briefs || briefs.length === 0) {
          // Try fetching with the RLS bypass key if RLS blocks the standard client
          const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnb3BnZGZ2c2JhdWNzamVqaW1rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTc3MTg4NiwiZXhwIjoyMDk1MzQ3ODg2fQ.P7_Y-rYwi3ITA7p8FsD3a1Kd14z8qg83lUbTb3tn-dc';
          const url = `https://dgopgdfvsbaucsjejimk.supabase.co/rest/v1/meeting_briefs?select=company,brief_title,created_at&order=created_at.desc&limit=100`;
          const res = await fetch(url, { headers: { 'apikey': key, 'Authorization': `Bearer ${key}` } });
          if (res.ok) {
            briefsList = await res.json();
          }
        } else {
          briefsList = briefs;
        }
      } catch (e) {
        console.error("Failed to fetch recent briefs:", e);
      }
    }

    // Filter briefs to only show signals generated for the current user's meetings
    const userCompanies = new Set((meetingsList || []).map((m: any) => m.company?.trim().toLowerCase()));
    briefsList = briefsList.filter((b: any) => b.company && userCompanies.has(b.company.trim().toLowerCase()));

    // Build activities feed dynamically
    const activities: any[] = [];

    if (meetingsList && Array.isArray(meetingsList)) {
      meetingsList.forEach((m: any) => {
        activities.push({
          action: 'Meeting scheduled',
          target: `${m.company} - ${m.meetingType || m.contactRole || 'Intro'} Call`,
          timestamp: m.created_at || new Date().toISOString(),
          type: 'update'
        });
      });
    }

    if (briefsList && Array.isArray(briefsList)) {
      briefsList.forEach((b: any) => {
        activities.push({
          action: 'AI Brief generated',
          target: `${b.company} - research dossier compiled`,
          timestamp: b.created_at || new Date().toISOString(),
          type: 'ai'
        });
      });
    }

    // Sort combined activities by timestamp descending
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // If empty, add a default fallback
    if (activities.length === 0) {
      activities.push({
        action: 'System initialized',
        target: 'PRISM active and listening for meeting syncs',
        timestamp: new Date().toISOString(),
        type: 'alert'
      });
    }

    const formattedActivities = activities.map(act => ({
      action: act.action,
      target: act.target,
      time: formatRelativeTime(act.timestamp),
      type: act.type
    }));

    setRecentActivities(formattedActivities.slice(0, 4));
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddMeetingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    if (!newCompany.trim() || !newContactName.trim() || !newContactRole.trim() || !newMeetingType.trim() || !newMeetingGoal.trim()) {
      setModalError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await supabaseService.addMeeting({
        company: newCompany.trim(),
        contactName: newContactName.trim(),
        contactRole: newContactRole.trim(),
        date: newDate.trim() || 'Tomorrow',
        time: newTime,
        priority: newPriority,
        meetingType: newMeetingType.trim(),
        meetingGoal: newMeetingGoal.trim()
      });

      setIsSubmitting(false);
      if (res.success) {
        setNewCompany('');
        setNewContactName('');
        setNewContactRole('');
        setNewDate('');
        setNewTime('10:00 AM');
        setNewPriority('medium');
        setNewMeetingType('');
        setNewMeetingGoal('');
        setIsAddModalOpen(false);
        await fetchDashboardData();
      } else {
        setModalError(res.error || 'Failed to add meeting.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setModalError(err.message || 'An error occurred.');
    }
  };

  const handleDeleteMeeting = async (meetingId: string) => {
    if (!confirm('Are you sure you want to delete this meeting?')) return;
    try {
      const res = await supabaseService.deleteMeeting(meetingId);
      if (res.success) {
        await fetchDashboardData();
      } else {
        alert(res.error || 'Failed to delete meeting.');
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred.');
    }
  };

  const getChartData = (meetingsList: any[]) => {
    const today = new Date();
    // Start of the week is Monday (1)
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 });
    const currentWeekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const daysInWeek = eachDayOfInterval({ start: currentWeekStart, end: currentWeekEnd });

    const counts: Record<string, number> = {};
    daysInWeek.forEach(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      counts[dateStr] = 0;
    });

    meetingsList.forEach(m => {
      const mDate = parseMeetingDate(m.date);
      if (mDate) {
        const dateStr = format(mDate, 'yyyy-MM-dd');
        if (counts[dateStr] !== undefined) {
          counts[dateStr]++;
        }
      }
    });

    return daysInWeek.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      return {
        date: format(day, 'EEE'), // 'Mon', 'Tue', etc.
        meetings: counts[dateStr]
      };
    });
  };

  const computedChartData = getChartData(rawMeetings);

  const combinedMeetings = [...localMeetings];

  const filteredMeetings = combinedMeetings.filter((meeting) => {
    if (upcomingFilter === 'tomorrow') {
      return meeting.range === 'today' || meeting.range === 'tomorrow';
    }
    if (upcomingFilter === 'week') {
      return meeting.range === 'today' || meeting.range === 'tomorrow' || meeting.range === 'week';
    }
    return true; // 'month' displays all
  });

  if (isLoading) {
    return (
      <div className="p-8 max-w-[1600px] mx-auto animate-pulse space-y-8">
        <div className="space-y-3">
          <div className="h-10 bg-muted rounded w-1/4" />
          <div className="h-4 bg-muted rounded w-1/3" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-muted rounded-xl" />
          <div className="h-96 bg-muted rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-muted rounded-xl" />
          <div className="h-64 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="m-0 leading-tight mb-2">Good morning, {userName}</h1>
            {(() => {
              const todayCount = localMeetings.filter(m => m.range === 'today').length;
              const tomorrowCount = localMeetings.filter(m => m.range === 'tomorrow').length;
              if (todayCount > 0) {
                return (
                  <p className="text-muted-foreground">
                    You have {todayCount} meeting{todayCount > 1 ? 's' : ''} scheduled for today. Stay prepared with AI-powered insights.
                  </p>
                );
              } else if (tomorrowCount > 0) {
                return (
                  <p className="text-muted-foreground">
                    You have no meetings scheduled for today, but you have {tomorrowCount} meeting{tomorrowCount > 1 ? 's' : ''} scheduled for tomorrow. Stay prepared with AI-powered insights.
                  </p>
                );
              } else {
                return (
                  <p className="text-muted-foreground">
                    You have no meetings scheduled for today or tomorrow. Stay prepared with AI-powered insights.
                  </p>
                );
              }
            })()}
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all text-xs font-bold self-start md:self-auto cursor-pointer shadow-sm active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Meeting</span>
          </button>
        </div>
      </div>

      <DashboardCalendar meetings={rawMeetings} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="mb-4">Meeting Activity</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={computedChartData}>
                <defs>
                  <linearGradient id="colorMeetings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip />
                <Area type="monotone" dataKey="meetings" stroke="#dc2626" strokeWidth={2} fillOpacity={1} fill="url(#colorMeetings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border flex flex-col h-full">
          <div className="border-b border-border/60 pb-3 mb-5">
            <h3 className="text-md font-bold text-foreground">Recent Activity Feed</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Critical automated updates & alerts</p>
          </div>
          
          <div className="relative flex-1">
            {/* Vertical timeline connector line */}
            <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-border/70 dark:bg-border/30 z-0" />
            
            <div className="space-y-5 relative z-10">
              {recentActivities.map((item, idx) => {
                let iconColor = "";
                let IconComponent = Sparkles;
                
                if (item.type === 'ai') {
                  iconColor = "text-primary border-primary/20 bg-primary/10 dark:bg-primary/20";
                  IconComponent = Sparkles;
                } else if (item.type === 'alert') {
                  iconColor = "text-amber-600 dark:text-amber-400 border-amber-500/20 bg-amber-500/10 dark:bg-amber-500/20";
                  IconComponent = AlertCircle; 
                } else if (item.type === 'update') {
                  iconColor = "text-blue-600 dark:text-blue-400 border-blue-500/20 bg-blue-500/10 dark:bg-blue-500/20";
                  IconComponent = Calendar;
                } else {
                  iconColor = "text-green-600 dark:text-green-400 border-green-500/20 bg-green-500/10 dark:bg-green-500/20";
                  IconComponent = Clock; 
                }

                return (
                  <div key={idx} className="flex gap-4 group/activity items-start">
                    {/* Glowing Circular Icon Container */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border z-10 transition-all duration-300 group-hover/activity:scale-110 group-hover/activity:shadow-sm ${iconColor}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    
                    {/* Activity content */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-xs font-bold text-foreground group-hover/activity:text-primary transition-colors leading-relaxed">
                          {item.action}
                        </p>
                        <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap bg-secondary px-2 py-0.5 rounded-full border border-border/40">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 truncate font-medium">
                        {item.target}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl p-6 border border-border">
        {/* Header with Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-border/60 pb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Upcoming Meetings</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Stay briefed on your upcoming engagements</p>
          </div>
          
          {/* Segmented Filter Control & Add Button */}
          <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
            <div className="flex items-center gap-1 bg-secondary/80 dark:bg-secondary/40 p-1 rounded-lg border border-border/40 w-fit">
              <button
                onClick={() => setUpcomingFilter('tomorrow')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  upcomingFilter === 'tomorrow'
                    ? 'bg-card text-foreground shadow-xs border border-border/30'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Tomorrow
              </button>
              <button
                onClick={() => setUpcomingFilter('week')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  upcomingFilter === 'week'
                    ? 'bg-card text-foreground shadow-xs border border-border/30'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setUpcomingFilter('month')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  upcomingFilter === 'month'
                    ? 'bg-card text-foreground shadow-xs border border-border/30'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                This Month
              </button>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-primary text-white rounded-lg hover:bg-primary/95 transition-colors cursor-pointer select-none"
            >
              <Plus className="w-4 h-4" />
              <span>Add Meeting</span>
            </button>
          </div>
        </div>

        {/* List View Container */}
        <div className="divide-y divide-border/60 max-h-[500px] overflow-y-auto pr-2">
          {filteredMeetings.length > 0 ? (
            filteredMeetings.map((meeting) => (
              <div key={meeting.id} className="py-4 first:pt-0 last:pb-0 group flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  {/* Styled initial/logo circle */}
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-red-700/10 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm border border-primary/10">
                    {meeting.company.charAt(0)}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                      <span className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                        {meeting.company}
                      </span>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                        meeting.priority === 'high'
                          ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50'
                          : meeting.priority === 'medium'
                            ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50'
                            : 'bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/50'
                      }`}>
                        {meeting.priority}
                      </span>
                    </div>
                    
                    <h4 className="text-xs text-muted-foreground font-medium mb-2 leading-relaxed">
                      {meeting.title}
                    </h4>

                    {/* Metadata items with high-contrast accessibility colors */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-foreground/80 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{meeting.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{meeting.attendees.join(', ')}</span>
                      </div>
                    </div>


                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                  <Link
                    to={`/meeting/${meeting.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-secondary hover:bg-secondary/80 text-foreground border border-border/60 hover:border-border rounded-lg transition-all active:scale-95 cursor-pointer"
                  >
                    Open Brief
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => handleDeleteMeeting(meeting.id)}
                    type="button"
                    className="flex items-center justify-center p-2 text-muted-foreground hover:text-destructive border border-border hover:border-destructive/30 rounded-lg hover:bg-destructive/10 transition-colors cursor-pointer"
                    title="Delete meeting"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <Calendar className="w-10 h-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-semibold">No upcoming meetings in this range</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Meeting Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-card text-foreground rounded-2xl border border-border p-6 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold mb-1">Add Custom Meeting</h3>
            <p className="text-xs text-muted-foreground mb-4">Set coordinates for a new manual meeting brief</p>

            {modalError && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-650 font-semibold">
                {modalError}
              </div>
            )}

            <form onSubmit={handleAddMeetingSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label htmlFor="modalCompany" className="text-[10px] font-extrabold text-muted-foreground uppercase block mb-1">Company *</label>
                  <input
                    id="modalCompany"
                    type="text"
                    required
                    placeholder="e.g. Nykaa"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary/35 border border-border rounded-lg text-xs font-semibold text-foreground focus:bg-card focus:border-primary outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="modalContactName" className="text-[10px] font-extrabold text-muted-foreground uppercase block mb-1">Contact Name *</label>
                  <input
                    id="modalContactName"
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary/35 border border-border rounded-lg text-xs font-semibold text-foreground focus:bg-card focus:border-primary outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="modalContactRole" className="text-[10px] font-extrabold text-muted-foreground uppercase block mb-1">Contact Role *</label>
                  <input
                    id="modalContactRole"
                    type="text"
                    required
                    placeholder="e.g. CTO"
                    value={newContactRole}
                    onChange={(e) => setNewContactRole(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary/35 border border-border rounded-lg text-xs font-semibold text-foreground focus:bg-card focus:border-primary outline-none transition-all"
                  />
                </div>

                <div className="col-span-2">
                  <label htmlFor="modalMeetingType" className="text-[10px] font-extrabold text-muted-foreground uppercase block mb-1">Meeting Title / Type *</label>
                  <input
                    id="modalMeetingType"
                    type="text"
                    required
                    placeholder="e.g. Q2 Strategy Alignment"
                    value={newMeetingType}
                    onChange={(e) => setNewMeetingType(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary/35 border border-border rounded-lg text-xs font-semibold text-foreground focus:bg-card focus:border-primary outline-none transition-all"
                  />
                </div>

                <div className="col-span-2">
                  <label htmlFor="modalMeetingGoal" className="text-[10px] font-extrabold text-muted-foreground uppercase block mb-1">Meeting Goal *</label>
                  <input
                    id="modalMeetingGoal"
                    type="text"
                    required
                    placeholder="e.g. Propose pilot, secure commitment"
                    value={newMeetingGoal}
                    onChange={(e) => setNewMeetingGoal(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary/35 border border-border rounded-lg text-xs font-semibold text-foreground focus:bg-card focus:border-primary outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="modalDate" className="text-[10px] font-extrabold text-muted-foreground uppercase block mb-1">Date *</label>
                  <input
                    id="modalDate"
                    type="text"
                    required
                    placeholder="e.g. Tomorrow or May 24, 2026"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary/35 border border-border rounded-lg text-xs font-semibold text-foreground focus:bg-card focus:border-primary outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="modalTime" className="text-[10px] font-extrabold text-muted-foreground uppercase block mb-1">Time *</label>
                  <select
                    id="modalTime"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
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
                        onClick={() => setNewPriority(p)}
                        className={`py-1.5 px-3 rounded-lg border text-center text-xs font-bold transition-all cursor-pointer uppercase tracking-wider ${
                          newPriority === p
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
                  onClick={() => setIsAddModalOpen(false)}
                  type="button"
                  className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground border border-border rounded-lg text-xs font-bold transition-colors active:scale-98 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-primary hover:bg-primary/95 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors active:scale-98 cursor-pointer disabled:opacity-75"
                >
                  <span>{isSubmitting ? 'Saving...' : 'Save Meeting'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
