import { useState, useEffect } from 'react';
import {
  Search,
  Sun,
  Moon,
  Settings,
  LayoutDashboard,
  Calendar,
  Users,
  TrendingUp,
  FileText
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import { createPortal } from 'react-dom';
import { supabaseService } from '../../lib/supabaseService';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Calendar, label: 'Meetings', path: '/meetings' },
  { icon: Users, label: 'Contacts', path: '/contacts' },
  { icon: TrendingUp, label: 'Analytics', path: '/analytics' },
  { icon: FileText, label: 'Sources', path: '/research' },
];

const logoImg = new URL('./logo_transparent.png', import.meta.url).href;

export function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved !== null) {
      return saved === 'dark';
    }
    // Default to dark theme
    return true;
  });

  const [profileName, setProfileName] = useState('John Doe');
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);

  // Search Spotlight States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [meetings, setMeetings] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Load meetings when search modal is opened
  useEffect(() => {
    if (isSearchOpen) {
      const fetchMeetings = async () => {
        try {
          const list = await supabaseService.getMeetings();
          setMeetings(list || []);
        } catch (e) {
          console.error("Failed to fetch meetings for search:", e);
        }
      };
      fetchMeetings();
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [isSearchOpen]);

  // Handle keyboard shortcut Ctrl+K / Cmd+K, Esc, and arrow keys / Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(open => !open);
        return;
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        return;
      }

      if (!isSearchOpen) return;

      const activeList = searchQuery.trim() === '' ? meetings.slice(0, 4) : searchResults;
      if (activeList.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % activeList.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + activeList.length) % activeList.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = activeList[selectedIndex];
        if (selected) {
          setIsSearchOpen(false);
          navigate(`/meeting/${selected.id}`);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, selectedIndex, meetings, searchResults, searchQuery, navigate]);

  // Filter meetings dynamically
  useEffect(() => {
    setSelectedIndex(0);
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const query = searchQuery.toLowerCase().trim();
    const filtered = meetings.filter(m => 
      (m.company || '').toLowerCase().includes(query) ||
      (m.contactName || '').toLowerCase().includes(query) ||
      (m.contactRole || '').toLowerCase().includes(query) ||
      (m.meetingType || '').toLowerCase().includes(query)
    );
    setSearchResults(filtered);
  }, [searchQuery, meetings]);

  const getInitials = (nameString: string) => {
    const clean = nameString.trim();
    if (!clean) return 'J';
    const parts = clean.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const loadProfile = () => {
    const rawUser = localStorage.getItem('prism_user');
    if (rawUser) {
      try {
        const u = JSON.parse(rawUser);
        if (u.fullName) setProfileName(u.fullName);
      } catch (e) {}
    } else {
      setProfileName('John Doe');
    }
    const savedAvatar = localStorage.getItem('prism_avatar');
    setProfileAvatar(savedAvatar);
  };

  useEffect(() => {
    loadProfile();

    // Listen for custom profile update events
    window.addEventListener('prism_profile_update', loadProfile);
    return () => {
      window.removeEventListener('prism_profile_update', loadProfile);
    };
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`print:hidden h-16 flex items-center justify-between px-2 sticky top-0 z-50 transition-all duration-300 border-b ${isScrolled
      ? 'bg-zinc-900/5 backdrop-blur-md border-border/80 text-foreground shadow-sm shadow-zinc-200/10'
      : 'bg-transparent border-transparent text-foreground'
      }`}>
      {/* Left: Logo & Logotype */}
      <div className="flex items-center gap-1 select-none">
        <img
          src={logoImg}
          className="h-16 w-16 flex-shrink-0 object-contain hover:scale-105 transition-all duration-300"
          alt="PRISM Logo"
        />

        {/* Vertical alignment of Brand Name & Tagline */}
        <div className="flex flex-col justify-center min-w-[240px]">
          {/* Split-Color PRISM Name */}
          <div className="flex items-baseline text-xl font-extrabold leading-none">
            <span className="text-foreground">PRIS</span>
            <span className="bg-gradient-to-r from-foreground to-primary text-transparent bg-clip-text">M</span>
          </div>

          {/* Full form */}
          <span className="text-[10px] mt-1.5 whitespace-nowrap tracking-tight font-medium text-muted-foreground leading-none">
            PreMeeting Research Intelligence System Manager
          </span>
        </div>
      </div>

      {/* Center: Navigation */}
      <div className="hidden lg:flex items-center justify-center">
        <nav className="rounded-full p-1 flex items-center gap-1 border bg-secondary/80 backdrop-blur-md border-border/50">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isMeetingsPath = item.path === '/meetings' && location.pathname.startsWith('/meeting/');
            const isActive = location.pathname === item.path || isMeetingsPath;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 text-xs font-medium ${isActive
                  ? 'bg-card text-foreground border border-border/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                  }`}
              >
                <Icon className={`w-3.5 h-3.5 transition-colors duration-200 ${isActive ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right: Action Buttons & Avatar */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer border bg-secondary border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary/80"
          title="Search (Ctrl+K)"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Theme toggle: dark / light */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer border bg-secondary border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary/80"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark
            ? <Sun className="w-4 h-4 text-amber-500" />
            : <Moon className="w-4 h-4" />}
        </button>



        {/* User Avatar - Redirects to /settings */}
        <Link
          to="/settings"
          className="w-10 h-10 rounded-full overflow-hidden hover:scale-105 transition-all duration-200 cursor-pointer ml-2 border border-border hover:border-border/80 flex items-center justify-center select-none"
          title="Account Settings"
        >
          {profileAvatar ? (
            <img
              src={profileAvatar}
              alt="User profile avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-red-700 flex items-center justify-center text-white font-bold text-xs">
              {getInitials(profileName)}
            </div>
          )}
        </Link>
      </div>

      {/* Search Spotlight Modal (using Portal to bypass containing blocks) */}
      {isSearchOpen && createPortal(
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-start justify-center pt-24"
          onClick={() => setIsSearchOpen(false)}
        >
          <div 
            className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Input Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/60 bg-secondary/20">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                autoFocus
                placeholder="Search meetings, contacts, companies..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-xs font-semibold text-foreground placeholder:text-muted-foreground/50"
              />
              <span className="text-[10px] font-bold text-muted-foreground bg-muted border border-border/40 px-1.5 py-0.5 rounded shadow-xs select-none">
                ESC
              </span>
            </div>

            {/* Results body */}
            <div className="overflow-y-auto max-h-[350px] divide-y divide-border/40">
              {searchQuery.trim() === '' ? (
                <>
                  {meetings.length > 0 ? (
                    <div className="flex flex-col">
                      <div className="px-4 py-2 bg-muted/30 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/20">
                        Upcoming Meetings
                      </div>
                      {meetings.slice(0, 4).map((m, idx) => (
                        <Link
                          key={m.id}
                          to={`/meeting/${m.id}`}
                          onClick={() => setIsSearchOpen(false)}
                          className={`flex items-center justify-between p-4 transition-all duration-150 group text-foreground hover:no-underline border-l-4 ${
                            idx === selectedIndex 
                              ? 'bg-primary/10 border-l-primary' 
                              : 'bg-transparent border-l-transparent hover:bg-secondary/40'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-bold transition-colors ${idx === selectedIndex ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>
                                {m.company}
                              </span>
                              <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                                m.priority === 'high'
                                  ? 'bg-red-50 dark:bg-red-950/30 text-red-650 dark:text-red-400 border border-red-100 dark:border-red-900/50'
                                  : m.priority === 'medium'
                                    ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-650 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50'
                                    : 'bg-green-50 dark:bg-green-950/30 text-green-650 dark:text-green-400 border border-green-100 dark:border-green-900/50'
                              }`}>
                                {m.priority}
                              </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground font-medium truncate">
                              {m.meetingType || `${m.contactRole || 'Contact'} Alignment`} Call — {m.contactName}
                            </p>
                          </div>
                          <div className="text-[10px] font-bold text-muted-foreground text-right shrink-0 ml-4">
                            {m.date}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-10 text-center text-xs text-muted-foreground font-medium flex flex-col items-center justify-center gap-2">
                      <Search className="w-8 h-8 text-muted-foreground/35 animate-pulse" />
                      <p>Type a company name, contact, role, or meeting title...</p>
                    </div>
                  )}
                </>
              ) : searchResults.length > 0 ? (
                searchResults.map((m, idx) => (
                  <Link
                    key={m.id}
                    to={`/meeting/${m.id}`}
                    onClick={() => setIsSearchOpen(false)}
                    className={`flex items-center justify-between p-4 transition-all duration-150 group text-foreground hover:no-underline border-l-4 ${
                      idx === selectedIndex 
                        ? 'bg-primary/10 border-l-primary' 
                        : 'bg-transparent border-l-transparent hover:bg-secondary/40'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold transition-colors ${idx === selectedIndex ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>
                          {m.company}
                        </span>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                          m.priority === 'high'
                            ? 'bg-red-50 dark:bg-red-950/30 text-red-650 dark:text-red-450 border border-red-105 dark:border-red-900/50'
                            : m.priority === 'medium'
                              ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-650 dark:text-amber-450 border border-amber-105 dark:border-amber-900/50'
                              : 'bg-green-50 dark:bg-green-950/30 text-green-650 dark:text-green-455 border border-green-105 dark:border-green-900/50'
                        }`}>
                          {m.priority}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground font-medium truncate">
                        {m.meetingType || `${m.contactRole || 'Contact'} Alignment`} Call — {m.contactName}
                      </p>
                    </div>
                    <div className="text-[10px] font-bold text-muted-foreground text-right shrink-0 ml-4">
                      {m.date}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-10 text-center text-xs text-muted-foreground font-medium flex flex-col items-center justify-center gap-2">
                  <p>No meetings matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
