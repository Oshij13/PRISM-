import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  User,
  Mail,
  Briefcase,
  Building,
  MapPin,
  Calendar,
  Save,
  Upload,
  Trash2,
  Bell,
  Shield,
  Sliders,
  ChevronRight,
  CheckCircle,
  Slack,
  Sparkles
} from 'lucide-react';
import { supabaseService } from '../../lib/supabaseService';

export function Settings() {
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(true);

  // Profile fields state
  const [fullName, setFullName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@prism.ai');
  const [jobTitle, setJobTitle] = useState('Sales Executive');
  const [company, setCompany] = useState('Prism AI');
  const [city, setCity] = useState('San Francisco');
  const [age, setAge] = useState('30');
  const [meetingsWeek, setMeetingsWeek] = useState('6–10');
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);

  // Preference switches state
  const [slackAlerts, setSlackAlerts] = useState(true);
  const [emailBriefs, setEmailBriefs] = useState(true);
  const [calendarSync, setCalendarSync] = useState(true);
  const [autoModel, setAutoModel] = useState(true);

  // Get current initials based on full name
  const getInitials = (nameString: string) => {
    const clean = nameString.trim();
    if (!clean) return 'P';
    const parts = clean.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // Load existing profile details on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const u = await supabaseService.getProfile();
        if (u) {
          if (u.fullName) setFullName(u.fullName);
          if (u.email) setEmail(u.email);
          if (u.jobTitle) setJobTitle(u.jobTitle);
          if (u.company) setCompany(u.company);
          if (u.city) setCity(u.city);
          if (u.age) setAge(u.age);
          if (u.meetingsWeek) setMeetingsWeek(u.meetingsWeek);
          if (u.slackAlerts !== undefined) setSlackAlerts(u.slackAlerts);
          if (u.emailBriefs !== undefined) setEmailBriefs(u.emailBriefs);
          if (u.calendarSync !== undefined) setCalendarSync(u.calendarSync);
          if (u.autoModel !== undefined) setAutoModel(u.autoModel);
        }
      } catch (err) {
        console.error("Failed to load settings profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();

    const savedAvatar = localStorage.getItem('prism_avatar');
    if (savedAvatar) {
      setAvatarBase64(savedAvatar);
    }
  }, []);

  // Handle avatar upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setAvatarBase64(base64String);
      localStorage.setItem('prism_avatar', base64String);
      
      // Update profile avatar in database
      await supabaseService.updateProfile({ avatar_url: base64String });
      
      // Dispatch event to TopBar
      window.dispatchEvent(new Event('prism_profile_update'));
    };
    reader.readAsDataURL(file);
  };

  // Handle avatar deletion
  const removeAvatar = async () => {
    setAvatarBase64(null);
    localStorage.removeItem('prism_avatar');
    
    // Remove avatar from database
    await supabaseService.updateProfile({ avatar_url: null as any });
    
    // Dispatch event to TopBar
    window.dispatchEvent(new Event('prism_profile_update'));
  };

  // Save changes
  const saveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');

    // Keep existing meetings list
    let existingMeetings = [];
    const rawUser = localStorage.getItem('prism_user');
    if (rawUser) {
      try {
        const current = JSON.parse(rawUser);
        if (current.meetings) existingMeetings = current.meetings;
      } catch (err) {}
    }

    const updatedUser = {
      fullName,
      email,
      jobTitle,
      company,
      city,
      age,
      meetingsWeek,
      meetings: existingMeetings,
      slackAlerts,
      emailBriefs,
      calendarSync,
      autoModel
    };

    // Save profile to Supabase with automatic fallback
    const res = await supabaseService.updateProfile(updatedUser);
    
    if (res.success) {
      setSuccessMsg('Account coordinates successfully updated.');
    } else {
      setSuccessMsg('Coordinates updated locally (Supabase offline/not configured).');
    }

    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-[1200px] mx-auto animate-pulse selection:bg-red-500/20 selection:text-red-700">
        
        {/* Settings Header Skeleton */}
        <div className="mb-8 border-b border-border/60 pb-5">
          <div className="h-8 w-64 bg-muted rounded-md mb-2" />
          <div className="h-4 w-96 bg-muted/65 rounded-md" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Side Skeleton */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Avatar Panel Skeleton */}
            <div className="bg-card rounded-xl p-6 border border-border flex flex-col items-center">
              <div className="h-4.5 w-28 bg-muted rounded self-start mb-5" />
              <div className="w-24 h-24 rounded-full bg-muted mb-6" />
              <div className="h-8 w-full bg-muted/70 rounded-lg mb-4" />
              <div className="h-3.5 w-5/6 bg-muted/50 rounded mx-auto" />
            </div>

            {/* Sync Alerts Panel Skeleton */}
            <div className="bg-card rounded-xl p-6 border border-border flex flex-col gap-5">
              <div className="h-4.5 w-36 bg-muted rounded" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3.5 w-32 bg-muted rounded" />
                    <div className="h-2.5 w-48 bg-muted/50 rounded" />
                  </div>
                  <div className="w-9 h-5 bg-muted rounded-full shrink-0" />
                </div>
              ))}
            </div>

          </div>

          {/* Right Side Skeleton */}
          <div className="lg:col-span-8">
            <div className="bg-card rounded-xl p-6 border border-border">
              
              <div className="h-4.5 w-40 bg-muted rounded mb-6" />

              <div className="space-y-5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i}>
                      <div className="h-3 w-20 bg-muted rounded mb-2" />
                      <div className="h-9 w-full bg-muted/40 rounded-lg" />
                    </div>
                  ))}
                </div>

                {/* Weekly Meetings volume selector */}
                <div className="space-y-2 mt-4">
                  <div className="h-3 w-44 bg-muted rounded" />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-8 bg-muted/40 rounded-lg" />
                    ))}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-end gap-3 border-t border-border/50 pt-5 mt-6">
                  <div className="h-8 w-24 bg-muted/40 rounded-lg mr-auto" />
                  <div className="h-8 w-20 bg-muted/40 rounded-lg" />
                  <div className="h-8 w-28 bg-muted/70 rounded-lg" />
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto selection:bg-red-500/20 selection:text-red-700">
      
      {/* Settings Header */}
      <div className="mb-8 border-b border-border/60 pb-5">
        <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">Account Settings</h1>
        <p className="text-xs text-muted-foreground mt-1">Configure your personal dossier coordinates and calendar synchronization settings.</p>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 flex items-center gap-3 text-xs text-emerald-700 dark:text-emerald-400 font-bold shadow-xs">
          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Avatar & preferences switches */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Avatar Panel */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-xs flex flex-col items-center text-center">
            
            <h3 className="text-xs font-extrabold uppercase text-muted-foreground tracking-wider mb-5 self-start">Profile Image</h3>
            
            {/* Conditional Avatar renderer */}
            <div className="relative group mb-4">
              {avatarBase64 ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border shadow-md">
                  <img
                    src={avatarBase64}
                    alt="User avatar preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-red-700 flex items-center justify-center border-2 border-border/80 shadow-md text-white font-extrabold text-2xl select-none">
                  {getInitials(fullName)}
                </div>
              )}

              {/* Quick file selector overlay */}
              <label className="absolute inset-0 rounded-full bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-all duration-200">
                <Upload className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Avatar controls */}
            <div className="flex flex-col gap-2 w-full mt-2">
              <label className="w-full py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg text-xs font-bold border border-border flex items-center justify-center gap-1.5 cursor-pointer transition-colors active:scale-98">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {avatarBase64 && (
                <button
                  onClick={removeAvatar}
                  type="button"
                  className="w-full py-2 bg-red-50/50 hover:bg-red-50 text-red-650 rounded-lg text-xs font-bold border border-red-100 flex items-center justify-center gap-1.5 cursor-pointer transition-colors active:scale-98"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Custom Photo</span>
                </button>
              )}
            </div>
            
            <p className="text-[10px] text-muted-foreground mt-4 leading-normal font-semibold">
              Supports JPEG or PNG. Displays name initials dynamically when custom avatar is removed.
            </p>
          </div>

          {/* Sync Alerts Panel */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-xs flex flex-col gap-5">
            <h3 className="text-xs font-extrabold uppercase text-muted-foreground tracking-wider">Sync Integrations</h3>
            
            {/* Toggle 1 */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-foreground block">Calendar Ingest Loop</span>
                <span className="text-[10px] text-muted-foreground font-medium mt-0.5 block leading-tight">Scans calendar events dynamically.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={calendarSync}
                  onChange={(e) => setCalendarSync(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
              </label>
            </div>

            {/* Toggle 2 */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-foreground block">Automated Slack Alerts</span>
                <span className="text-[10px] text-muted-foreground font-medium mt-0.5 block leading-tight">Sends AI briefs directly to Slack channels.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={slackAlerts}
                  onChange={(e) => setSlackAlerts(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
              </label>
            </div>

            {/* Toggle 3 */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-foreground block">Email Pre-Meeting Dossiers</span>
                <span className="text-[10px] text-muted-foreground font-medium mt-0.5 block leading-tight">Sends compiled summaries 15m before syncs.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={emailBriefs}
                  onChange={(e) => setEmailBriefs(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
              </label>
            </div>

            {/* Toggle 4 */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-foreground block flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>Advanced Token Cache</span>
                </span>
                <span className="text-[10px] text-muted-foreground font-medium mt-0.5 block leading-tight">Uses low-latency contextual semantic pools.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoModel}
                  onChange={(e) => setAutoModel(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
              </label>
            </div>

          </div>

        </div>

        {/* Right Side: Profile Details form */}
        <div className="lg:col-span-8">
          <div className="bg-card rounded-xl p-6 border border-border shadow-xs">
            
            <h3 className="text-xs font-extrabold uppercase text-muted-foreground tracking-wider mb-6">Profile Parameters</h3>

            <form onSubmit={saveChanges} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Full name */}
                <div>
                  <label htmlFor="fullName" className="text-[11px] font-extrabold text-muted-foreground uppercase block mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-secondary/35 border border-border rounded-lg text-xs font-semibold text-foreground focus:bg-card focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="text-[11px] font-extrabold text-muted-foreground uppercase block mb-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-secondary/35 border border-border rounded-lg text-xs font-semibold text-foreground focus:bg-card focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Job Title */}
                <div>
                  <label htmlFor="jobTitle" className="text-[11px] font-extrabold text-muted-foreground uppercase block mb-1">Job Title</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <input
                      id="jobTitle"
                      type="text"
                      required
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-secondary/35 border border-border rounded-lg text-xs font-semibold text-foreground focus:bg-card focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="company" className="text-[11px] font-extrabold text-muted-foreground uppercase block mb-1">Company</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <Building className="w-4 h-4" />
                    </div>
                    <input
                      id="company"
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-secondary/35 border border-border rounded-lg text-xs font-semibold text-foreground focus:bg-card focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Base City */}
                <div>
                  <label htmlFor="city" className="text-[11px] font-extrabold text-muted-foreground uppercase block mb-1">Base City</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <input
                      id="city"
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-secondary/35 border border-border rounded-lg text-xs font-semibold text-foreground focus:bg-card focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Age */}
                <div>
                  <label htmlFor="age" className="text-[11px] font-extrabold text-muted-foreground uppercase block mb-1">Age</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      id="age"
                      type="number"
                      required
                      min="18"
                      max="99"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-secondary/35 border border-border rounded-lg text-xs font-semibold text-foreground focus:bg-card focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>

              </div>

              {/* Weekly Meetings volume selector */}
              <div>
                <label className="text-[11px] font-extrabold text-muted-foreground uppercase block mb-2">Weekly Meetings Target</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['1–5', '6–10', '11–20', '20+'].map((vol) => (
                    <button
                      key={vol}
                      type="button"
                      onClick={() => setMeetingsWeek(vol)}
                      className={`py-2 px-3 rounded-lg border text-center text-xs font-bold transition-all cursor-pointer ${
                        meetingsWeek === vol
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-secondary/30 border-border text-muted-foreground hover:border-border hover:text-foreground'
                      }`}
                    >
                      {vol} meetings
                    </button>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-end gap-3 border-t border-border/50 pt-5 mt-6">
                <button
                  onClick={async () => {
                    await supabaseService.signOut();
                    window.location.href = '/signin';
                  }}
                  type="button"
                  title="Sign out of your account"
                  className="mr-auto px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 dark:border-red-900/30 rounded-lg text-xs font-bold transition-all active:scale-98 cursor-pointer"
                >
                  Sign Out
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  type="button"
                  className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground border border-border rounded-lg text-xs font-bold transition-colors active:scale-98 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary hover:bg-primary/95 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors active:scale-98 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </button>
              </div>

            </form>

          </div>
        </div>

      </div>

    </div>
  );
}
