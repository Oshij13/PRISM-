import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Building,
  MapPin,
  Calendar,
  User,
  CheckCircle,
  Plus,
  Trash2,
  Edit,
  Clock,
  Save,
  Check
} from 'lucide-react';
import { supabaseService } from '../../lib/supabaseService';

const logoImg = new URL('../components/logo_transparent.png', import.meta.url).href;

interface ManualMeeting {
  id: string;
  company: string;
  contactName: string;
  contactRole: string;
  date: string;
  time: string;
  priority: 'low' | 'medium' | 'high';
  meetingType: string;
}

export function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form Fields State
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [city, setCity] = useState('');
  const [age, setAge] = useState('');
  const [meetingsWeek, setMeetingsWeek] = useState('');
  
  // Meetings Management State
  const [meetings, setMeetings] = useState<ManualMeeting[]>([
    {
      id: '1',
      company: 'Tesla',
      contactName: 'Sarah Johnson',
      contactRole: 'VP Sales',
      date: 'Tomorrow',
      time: '11:00 AM',
      priority: 'high',
      meetingType: 'Q2 Strategy Review'
    },
    {
      id: '2',
      company: 'Microsoft',
      contactName: 'David Miller',
      contactRole: 'Director Partnerships',
      date: 'Friday',
      time: '3:00 PM',
      priority: 'medium',
      meetingType: 'Partnership Alignment'
    }
  ]);

  // Inline meeting editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCompany, setEditCompany] = useState('');
  const [editContact, setEditContact] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('10:00 AM');
  const [editPriority, setEditPriority] = useState<'low' | 'medium' | 'high'>('high');
  const [editMeetingType, setEditMeetingType] = useState('');

  // Meeting adding state
  const [isAdding, setIsAdding] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('10:00 AM');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('high');
  const [newMeetingType, setNewMeetingType] = useState('');

  // Auto pre-fill values from signup if available
  useEffect(() => {
    const rawUser = localStorage.getItem('prism_user');
    if (rawUser) {
      try {
        const u = JSON.parse(rawUser);
        if (u.fullName && !jobTitle && step === 1) {
          // Keep active session track
        }
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Quick Select Capsules for Step 1
  const jobTitleExamples = [
    'Sales Manager',
    'Account Executive',
    'Business Development Representative',
    'Founder'
  ];

  // Suggestions for Step 2
  const companySuggestions = [
    'Stripe',
    'Tesla',
    'Microsoft',
    'Salesforce',
    'Google'
  ];

  // Suggestions for Step 3
  const citySuggestions = [
    'San Francisco',
    'New York',
    'London',
    'Austin',
    'Seattle'
  ];

  // Weekly meetings options for Step 5
  const meetingVolumeOptions = [
    { label: '1–5 meetings / week', value: '1–5' },
    { label: '6–10 meetings / week', value: '6–10' },
    { label: '11–20 meetings / week', value: '11–20' },
    { label: '20+ meetings / week', value: '20+' }
  ];

  // Step Navigations
  const handleNext = () => {
    if (step < 6) {
      setStep((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  // Step Input Validation Checks
  const isNextDisabled = () => {
    if (step === 1 && !jobTitle.trim()) return true;
    if (step === 2 && !company.trim()) return true;
    if (step === 3 && !city.trim()) return true;
    if (step === 4 && (!age || parseInt(age) <= 0)) return true;
    if (step === 5 && !meetingsWeek) return true;
    if (step === 6 && meetings.length === 0) return true;
    return false;
  };

  // Editing manual meeting
  const startEdit = (m: ManualMeeting) => {
    setEditingId(m.id);
    setEditCompany(m.company);
    setEditContact(m.contactName);
    setEditRole(m.contactRole);
    setEditDate(m.date);
    setEditTime(m.time);
    setEditPriority(m.priority);
    setEditMeetingType(m.meetingType);
  };

  const saveEdit = (id: string) => {
    if (!editCompany.trim() || !editContact.trim() || !editRole.trim() || !editMeetingType.trim()) return;
    setMeetings((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              company: editCompany,
              contactName: editContact,
              contactRole: editRole,
              date: editDate,
              time: editTime,
              priority: editPriority,
              meetingType: editMeetingType
            }
          : m
      )
    );
    setEditingId(null);
  };

  // Deleting manual meeting
  const deleteMeeting = (id: string) => {
    setMeetings((prev) => prev.filter((m) => m.id !== id));
  };

  // Adding manual meeting
  const addMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newContact.trim() || !newRole.trim() || !newMeetingType.trim()) return;

    const added: ManualMeeting = {
      id: Date.now().toString(),
      company: newCompany,
      contactName: newContact,
      contactRole: newRole,
      date: newDate || 'Tomorrow',
      time: newTime || '10:00 AM',
      priority: newPriority,
      meetingType: newMeetingType
    };

    setMeetings((prev) => [...prev, added]);
    setNewCompany('');
    setNewContact('');
    setNewRole('');
    setNewDate('');
    setNewTime('10:00 AM');
    setNewPriority('high');
    setNewMeetingType('');
    setIsAdding(false);
  };

  // Finish setup
  const handleFinish = () => {
    // Blast confetti!
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#dc2626', '#ef4444', '#fca5a5', '#0f172a']
    });

    setIsSuccess(true);
  };

  const saveToDashboard = async () => {
    // Save onboarding details to localStorage and Supabase
    const rawUser = localStorage.getItem('prism_user');
    let fullName = 'John Doe';
    let userEmail = 'john.doe@prism.ai';
    if (rawUser) {
      try {
        const u = JSON.parse(rawUser);
        if (u.fullName) fullName = u.fullName;
        if (u.email) userEmail = u.email;
      } catch (e) {}
    }

    const updatedUser = {
      fullName,
      email: userEmail,
      jobTitle,
      company,
      city,
      age,
      meetingsWeek,
      meetings // custom onboarded meetings
    };

    // Save profile to Supabase (internally syncs to local storage)
    await supabaseService.updateProfile(updatedUser);

    // Save meetings to the dedicated meetings table in Supabase
    await supabaseService.saveOnboardingMeetings(meetings);
    
    localStorage.setItem('prism_onboarding_complete', 'true');
    navigate('/dashboard');
  };

  // Render step elements
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-red-600 shrink-0" />
                <span>What is your job title?</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-semibold">We use this to customize the conversational triggers in your executive briefs.</p>
            </div>

            <div className="relative">
              <input
                type="text"
                required
                placeholder="Sales Manager"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
              />
            </div>

            {/* Quick Pills */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">Common job titles</span>
              <div className="flex flex-wrap gap-2">
                {jobTitleExamples.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setJobTitle(item)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                      jobTitle === item
                        ? 'bg-red-50 text-red-700 border-red-300 ring-1 ring-red-500'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Building className="w-6 h-6 text-red-600 shrink-0" />
                <span>What company do you work for?</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-semibold">Allows our query agents to separate external prospect reports from internal briefs.</p>
            </div>

            <div className="relative">
              <input
                type="text"
                required
                placeholder="Acme Corp"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <MapPin className="w-6 h-6 text-red-650 shrink-0" />
                <span>Which city are you based in?</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-semibold">Establishes local time-zone signals for calendar parsing loops.</p>
            </div>

            <div className="relative">
              <input
                type="text"
                required
                placeholder="San Francisco"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <User className="w-6 h-6 text-red-650 shrink-0" />
                <span>How old are you?</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-semibold">Assists our background analytical templates in matching relevant styling guidelines.</p>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="number"
                required
                placeholder="30"
                min="18"
                max="99"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-32 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Calendar className="w-6 h-6 text-red-650 shrink-0" />
                <span>How many meetings do you typically have each week?</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-semibold">Optimizes token ingestion ceilings based on weekly queue requirements.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {meetingVolumeOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setMeetingsWeek(opt.value)}
                  className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all duration-200 hover:shadow-xs hover:border-slate-350 cursor-pointer ${
                    meetingsWeek === opt.value
                      ? 'bg-red-50/40 border-red-500 ring-1 ring-red-500'
                      : 'bg-white border-slate-200/80'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-800">{opt.label}</span>
                  {meetingsWeek === opt.value && (
                    <span className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-red-650 shrink-0" />
                  <span>Let's add a few upcoming meetings</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-semibold">Since your calendar is not integrated yet, customize your manual dashboard queue below.</p>
              </div>

              {!isAdding && !editingId && (
                <button
                  onClick={() => setIsAdding(true)}
                  type="button"
                  className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer shadow-xs active:scale-95 transition-transform"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Custom Meeting</span>
                </button>
              )}
            </div>

            {/* Inlining adding form */}
            {isAdding && (
              <form onSubmit={addMeeting} className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-extrabold uppercase text-slate-400">New Meeting Parameters</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Company</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Corp"
                      value={newCompany}
                      onChange={(e) => setNewCompany(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:border-red-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Contact Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={newContact}
                      onChange={(e) => setNewContact(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:border-red-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Contact Role</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CTO"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:border-red-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Meeting Type / Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Initial Discovery Call"
                      value={newMeetingType}
                      onChange={(e) => setNewMeetingType(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:border-red-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Priority</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:border-red-600 outline-none cursor-pointer"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Date</label>
                      <input
                        type="text"
                        placeholder="e.g. Tomorrow"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:border-red-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Time</label>
                      <select
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:border-red-600 outline-none cursor-pointer"
                      >
                        {['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'].map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-200/60 pt-3">
                  <button
                    onClick={() => setIsAdding(false)}
                    type="button"
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-200/60 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Save Meeting
                  </button>
                </div>
              </form>
            )}

            {/* Inlining editing form */}
            {editingId && (
              <div className="bg-slate-50 border border-red-100 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-extrabold uppercase text-red-600">Modify Meeting coordinates</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Company</label>
                    <input
                      type="text"
                      value={editCompany}
                      onChange={(e) => setEditCompany(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:border-red-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Contact Name</label>
                    <input
                      type="text"
                      value={editContact}
                      onChange={(e) => setEditContact(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:border-red-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Contact Role</label>
                    <input
                      type="text"
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:border-red-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Meeting Type / Title</label>
                    <input
                      type="text"
                      value={editMeetingType}
                      onChange={(e) => setEditMeetingType(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:border-red-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Priority</label>
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:border-red-600 outline-none cursor-pointer"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Date</label>
                      <input
                        type="text"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:border-red-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Time</label>
                      <select
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:border-red-600 outline-none cursor-pointer"
                      >
                        {['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'].map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-200/60 pt-3">
                  <button
                    onClick={() => setEditingId(null)}
                    type="button"
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-200/60 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => saveEdit(editingId)}
                    type="button"
                    className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Display meetings queue */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {meetings.map((m) => (
                <div
                  key={m.id}
                  className="bg-white border border-slate-200/85 hover:border-slate-350 p-4 rounded-xl flex items-center justify-between gap-4 transition-all duration-200"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 text-red-600 flex items-center justify-center font-extrabold text-xs shrink-0 uppercase">
                      {m.company.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2">
                        <span className="text-xs font-extrabold text-slate-900">{m.company}</span>
                        {m.meetingType && (
                          <span className="text-[9px] bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded font-bold">{m.meetingType}</span>
                        )}
                        {m.priority && (
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                            m.priority === 'high'
                              ? 'bg-red-50 text-red-600 border border-red-100'
                              : m.priority === 'medium'
                                ? 'bg-amber-50 text-amber-600 border border-amber-100'
                                : 'bg-green-50 text-green-600 border border-green-100'
                          }`}>{m.priority}</span>
                        )}
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{m.date} at {m.time}</span>
                      </div>
                      <p className="text-[11px] font-semibold text-slate-500 mt-0.5 truncate">
                        {m.contactName} — <span className="italic">{m.contactRole}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => startEdit(m)}
                      disabled={isAdding || editingId !== null}
                      type="button"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 border border-slate-200/60 hover:bg-slate-50 transition-colors disabled:opacity-40 cursor-pointer"
                      title="Edit details"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteMeeting(m.id)}
                      disabled={isAdding || editingId !== null}
                      type="button"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-450 hover:text-red-600 border border-slate-200/60 hover:bg-red-50/50 transition-colors disabled:opacity-40 cursor-pointer"
                      title="Delete meeting"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Main UI render
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-8 px-6 selection:bg-red-500/20 selection:text-red-700">
      
      {/* Onboarding Header */}
      <header className="max-w-2xl mx-auto w-full flex items-center justify-between gap-6 border-b border-slate-200/60 pb-4 mb-4 shrink-0">
        <div className="flex items-center gap-1">
          <img src={logoImg} className="h-10 w-10 object-contain" alt="PRISM Logo" />
          <div className="text-left leading-none">
            <span className="font-extrabold text-slate-800 text-sm">PRISM</span>
            <p className="text-[8px] text-slate-400 font-medium tracking-tight mt-0.5">PreMeeting Research Intelligence System Manager</p>
          </div>
        </div>

        {!isSuccess && (
          <div className="text-right">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Step {step} of 6</span>
            <div className="text-xs font-extrabold text-slate-800 mt-0.5">Onboarding Progress</div>
          </div>
        )}
      </header>

      {/* Progress Bar (Hidden on success screen) */}
      {!isSuccess && (
        <div className="max-w-2xl mx-auto w-full bg-slate-200 h-1 rounded-full overflow-hidden mb-6 shrink-0">
          <div
            className="bg-red-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      )}

      {/* Main Card Container */}
      <main className="flex-1 flex items-center justify-center max-w-2xl mx-auto w-full my-6">
        
        {isSuccess ? (
          
          /* Success Screen Card */
          <div className="w-full bg-white border border-slate-200 shadow-xl rounded-2xl p-8 md:p-12 text-center space-y-6">
            
            <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mx-auto">
              <CheckCircle className="w-10 h-10 text-red-650" />
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">🎉 You're all set!</h1>
              <p className="text-xs text-slate-500 mt-2 font-semibold leading-relaxed max-w-md mx-auto">
                PRISM is ready to generate AI-powered meeting intelligence for your upcoming meetings. Stop manual preparation.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row gap-4 items-center justify-center">
              <button
                onClick={saveToDashboard}
                className="w-full sm:w-auto px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-red-660/10 cursor-pointer active:scale-98 transition-all"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setStep(6);
                }}
                className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 border border-slate-250 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center cursor-pointer transition-colors"
              >
                <span>Add Another Meeting</span>
              </button>
            </div>
          </div>

        ) : (

          /* Onboarding steps card */
          <div className="w-full bg-white border border-slate-200/80 shadow-md rounded-2xl p-6 md:p-10 min-h-[380px] flex flex-col justify-between">
            
            {/* Step form contents */}
            <div className="flex-1">
              {renderStepContent()}
            </div>

            {/* Stepper Footer Controls */}
            <div className="flex items-center justify-between border-t border-slate-200/60 pt-6 mt-8 shrink-0">
              
              {/* Back Button */}
              {step > 1 ? (
                <button
                  onClick={handleBack}
                  disabled={editingId !== null}
                  type="button"
                  className="px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 disabled:opacity-40 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {/* Continue / Finish button */}
              <button
                onClick={handleNext}
                disabled={isNextDisabled() || editingId !== null}
                type="button"
                className={`px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm shadow-red-600/10 transition-all ${
                  isNextDisabled() || editingId !== null
                    ? 'opacity-50 cursor-not-allowed'
                    : 'active:scale-95'
                }`}
              >
                <span>{step === 6 ? 'Finish Setup' : 'Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          </div>
        )}
      </main>

      {/* Onboarding Footer */}
      <footer className="text-center text-[10px] text-slate-400 font-semibold shrink-0">
        <span>Empowered by PRISM Security Protocols. Secure data loop.</span>
      </footer>

    </div>
  );
}
