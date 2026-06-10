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
import { Link, useLocation } from 'react-router';
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
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer border bg-secondary border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary/80"
          title="Search"
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
    </div>
  );
}
