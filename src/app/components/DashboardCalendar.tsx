import { useState } from 'react';
import { Link } from 'react-router';
import { 
  format, 
  isSameDay, 
  isToday, 
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isSameMonth
} from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, Users as UsersIcon, Calendar as CalendarIcon, Sparkles } from 'lucide-react';

interface Meeting {
  id: string;
  company: string;
  title: string;
  time: string;
  hour: number;
  attendees: string[];
  priority: 'high' | 'medium' | 'low';
}

interface DashboardCalendarProps {
  meetings?: any[];
}

const isMeetingOnDate = (meetingDateStr: string, calendarDate: Date): boolean => {
  const cleanStr = meetingDateStr.trim().toLowerCase();
  const today = new Date();
  
  // 1. Check "today"
  if (cleanStr === 'today' || cleanStr === format(today, 'yyyy-MM-dd').toLowerCase()) {
    return isSameDay(calendarDate, today);
  }
  
  // 2. Check "tomorrow"
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  if (cleanStr === 'tomorrow' || cleanStr === format(tomorrow, 'yyyy-MM-dd').toLowerCase()) {
    return isSameDay(calendarDate, tomorrow);
  }
  
  // 2b. Check "day after tomorrow"
  const dayAfter = new Date();
  dayAfter.setDate(today.getDate() + 2);
  if (cleanStr === 'day after tomorrow' || cleanStr === format(dayAfter, 'yyyy-MM-dd').toLowerCase()) {
    return isSameDay(calendarDate, dayAfter);
  }
  
  // 3. Check weekday names (e.g. "monday", "tuesday", etc.)
  const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayIndex = weekdays.indexOf(cleanStr);
  if (dayIndex !== -1) {
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 0 });
    const currentWeekEnd = endOfWeek(today, { weekStartsOn: 0 });
    const daysInWeek = eachDayOfInterval({ start: currentWeekStart, end: currentWeekEnd });
    const matchingDayInCurrentWeek = daysInWeek[dayIndex];
    return isSameDay(calendarDate, matchingDayInCurrentWeek);
  }
  
  // 4. Try parsing as full date string (e.g. "June 8, 2026", "2026-06-08")
  try {
    const parsedDate = new Date(meetingDateStr);
    if (!isNaN(parsedDate.getTime())) {
      return isSameDay(calendarDate, parsedDate);
    }
  } catch (e) {}
  
  return false;
};

export function DashboardCalendar({ meetings = [] }: DashboardCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

  const getMeetingsForDate = (date: Date): Meeting[] => {
    if (!meetings || !Array.isArray(meetings)) return [];
    
    return meetings
      .filter((m) => isMeetingOnDate(m.date || '', date))
      .map((m, idx) => ({
        id: m.id || `m-${idx}`,
        company: m.company || 'Unknown Company',
        title: m.meetingType || `${m.contactRole || 'Contact'} Alignment Call`,
        time: m.time || '10:00 AM',
        hour: 10,
        attendees: m.contactName ? [m.contactName] : [],
        priority: (m.priority === 'high' || m.priority === 'medium' || m.priority === 'low') ? m.priority : 'high'
      }));
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth((prev) => {
      const newMonth = direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1);
      setSelectedDate(startOfMonth(newMonth));
      return newMonth;
    });
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  
  const gridCells = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const selectedDayMeetings = getMeetingsForDate(selectedDate);
  const monthMeetingsCount = gridCells
    .filter((d) => isSameMonth(d, currentMonth))
    .reduce((acc, d) => acc + getMeetingsForDate(d).length, 0);

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-8 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8">
        
        {/* Left Side: Monthly Calendar Selector (Apple Style Grid) */}
        <div className="flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between mb-4">
              {/* Apple Calendar Month & Year display */}
              <div className="flex items-baseline select-none">
                <span className="text-xl font-extrabold text-foreground">
                  {format(currentMonth, 'MMMM')}
                </span>
                <span className="text-sm font-semibold text-zinc-400 ml-2">
                  {format(currentMonth, 'yyyy')}
                </span>
              </div>
              
              {/* Apple-style Red Navigation triggers */}
              <div className="flex items-center gap-4 text-primary font-bold text-xs select-none">
                <button 
                  onClick={() => navigateMonth('prev')}
                  className="p-1 hover:bg-secondary rounded-md transition-all cursor-pointer"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4 text-primary" />
                </button>
                <button 
                  onClick={() => {
                    const todayDate = new Date();
                    setCurrentMonth(todayDate);
                    setSelectedDate(todayDate);
                  }}
                  className="hover:bg-secondary px-2 py-1 rounded-md transition-all cursor-pointer active:scale-95 text-xs tracking-wide"
                >
                  Today
                </button>
                <button 
                  onClick={() => navigateMonth('next')}
                  className="p-1 hover:bg-secondary rounded-md transition-all cursor-pointer"
                  title="Next Month"
                >
                  <ChevronRight className="w-4 h-4 text-primary" />
                </button>
              </div>
            </div>

            {/* Apple Calendar Style Layout with Borders */}
            <div className="flex flex-col mt-2">
              {/* Weekday labels (Sunday-first, Sun in red) */}
              <div className="grid grid-cols-7 border-t border-l border-border/60 rounded-t-xl overflow-hidden bg-secondary/50">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayLabel, idx) => (
                  <div 
                    key={idx} 
                    className={`text-center text-[10px] uppercase font-bold tracking-wider py-2 border-r border-b border-border/60 select-none ${
                      idx === 0 ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {dayLabel}
                  </div>
                ))}
              </div>
              
              {/* Days grid of the month including leading/trailing muted days */}
              <div className="grid grid-cols-7 border-l border-border/60 rounded-b-xl overflow-hidden shadow-sm">
                {gridCells.map((day, idx) => {
                  const isSelected = isSameDay(day, selectedDate);
                  const isTodayDate = isToday(day);
                  const dayMeetings = getMeetingsForDate(day);
                  const hasMeetings = dayMeetings.length > 0;
                  const isCurrentMonth = isSameMonth(day, currentMonth);

                  return (
                    <div 
                      key={idx} 
                      className={`group border-r border-b border-border/60 h-[68px] flex items-center justify-center bg-card relative transition-all duration-200 cursor-pointer hover:bg-secondary/30 select-none ${
                        isSelected ? 'bg-primary/5 dark:bg-primary/10' : ''
                      }`}
                      onClick={() => setSelectedDate(day)}
                    >
                      <button
                        className={`w-9 h-9 rounded-full flex items-center justify-center relative text-xs font-bold pointer-events-none select-none ${
                          isSelected 
                            ? 'bg-primary text-white shadow-md shadow-primary/30 scale-105 z-10' 
                            : isTodayDate
                              ? 'border-2 border-primary text-primary font-bold bg-primary/10'
                              : isCurrentMonth
                                ? 'text-foreground group-hover:text-primary group-hover:scale-110 transition-all duration-200'
                                : 'text-muted-foreground/35 group-hover:text-foreground/60 transition-all duration-200'
                        }`}
                      >
                        <span>{format(day, 'd')}</span>
                        
                        {/* Event Indicator dynamic capsule under the day number */}
                        {hasMeetings && (
                          <span className={`absolute bottom-1.5 h-1 rounded-full transition-all duration-200 ${
                            isSelected 
                              ? 'bg-white w-3 group-hover:w-4' 
                              : isTodayDate
                                ? 'bg-primary w-3 group-hover:w-4'
                                : isCurrentMonth
                                  ? 'bg-primary/80 dark:bg-primary/95 w-3 group-hover:w-4'
                                  : 'bg-muted-foreground/20 w-2.5 group-hover:w-3.5'
                          }`} />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick stats for the month */}
          <div className="mt-6 pt-4 border-t border-border/60 hidden lg:block">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span>
                You have <strong>{monthMeetingsCount} meetings</strong> scheduled for this month.
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Detailed Scheduled Meetings View */}
        <div className="min-w-0 border-t lg:border-t-0 lg:border-l border-border/80 pt-6 lg:pt-0 lg:pl-8">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h4 className="text-sm font-bold text-foreground truncate min-w-0" title={format(selectedDate, 'EEEE, MMMM d, yyyy')}>
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h4>
            <span className="text-xs font-semibold px-3 py-1 bg-muted rounded-full text-muted-foreground flex items-center gap-2 shrink-0">
              <CalendarIcon className="w-3.5 h-3.5" />
              {selectedDayMeetings.length} {selectedDayMeetings.length === 1 ? 'Meeting' : 'Meetings'}
            </span>
          </div>

          <div className="relative min-h-[320px] max-h-[368px] overflow-y-auto pr-2">
            {selectedDayMeetings.length > 0 ? (
              <div className="space-y-4">
                {selectedDayMeetings.map((meeting) => (
                  <Link
                    key={meeting.id}
                    to={`/meeting/${meeting.id}`}
                    className="w-full relative group flex items-stretch cursor-pointer hover:no-underline select-none"
                  >
                    {/* Meeting Details Card */}
                    <div className="w-full p-4 bg-muted/30 hover:bg-muted/50 border border-muted hover:border-primary/25 rounded-xl transition-all duration-200">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <span className="text-xs font-semibold text-primary/95 block mb-0.5">
                            {meeting.company}
                          </span>
                          <h5 className="text-sm font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                            {meeting.title}
                          </h5>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          meeting.priority === 'high' 
                            ? 'bg-red-50 text-red-600 border border-red-100' 
                            : meeting.priority === 'medium'
                              ? 'bg-amber-50 text-amber-600 border border-amber-100'
                              : 'bg-green-50 text-green-600 border border-green-100'
                        }`}>
                          {meeting.priority}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground mt-2">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground/80" />
                          <span>{meeting.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <UsersIcon className="w-3.5 h-3.5 text-muted-foreground/80" />
                          <span className="truncate max-w-[200px]">
                            {meeting.attendees.join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[320px] text-center p-6 border border-dashed border-border rounded-xl bg-muted/10">
                <div className="w-12 h-12 rounded-full bg-muted/60 flex items-center justify-center mb-4">
                  <CalendarIcon className="w-6 h-6 text-muted-foreground/80" />
                </div>
                <h5 className="text-sm font-bold text-foreground mb-2">No Meetings Scheduled</h5>
                <p className="text-xs text-muted-foreground max-w-[280px]">
                  Take advantage of this open time to catch up on research, update CRM notes, or organize leads.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
