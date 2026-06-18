import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  Sparkles,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  ChevronRight,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import { supabaseService } from '../../lib/supabaseService';

const logoImg = new URL('../components/logo_transparent.png', import.meta.url).href;

export function SignUp() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password Validation flags
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // Email regex format
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Strength index calculator
  const calculateStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (hasMinLength) score++;
    if (hasNumber) score++;
    if (hasSpecialChar) score++;
    return score;
  };

  const strength = calculateStrength();

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!isEmailValid) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    if (strength < 2) {
      setErrorMsg('Please create a stronger password');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await supabaseService.signUp(email, password, fullName);
      setIsSubmitting(false);
      if (res.success) {
        window.location.href = '/onboarding';
      } else {
        setErrorMsg(res.error || 'Registration failed.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'An unexpected error occurred during sign up.');
    }
  };

  const handleGoogleSignUp = async () => {
    setIsSubmitting(true);
    if (supabaseService.isConnected()) {
      try {
        const { supabase } = await import('../../lib/supabaseClient');
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin + '/onboarding'
          }
        });
        if (error) throw error;
      } catch (err: any) {
        setIsSubmitting(false);
        setErrorMsg(err.message || 'Failed to initialize Google OAuth.');
      }
    } else {
      setTimeout(() => {
        localStorage.setItem('prism_is_logged_in', 'true');
        localStorage.setItem('prism_user', JSON.stringify({
          fullName: 'Alex Rivera',
          email: 'alex.rivera@design.co',
          jobTitle: '',
          company: '',
          city: '',
          age: '',
          meetingsWeek: '',
          meetings: []
        }));
        setIsSubmitting(false);
        window.location.href = '/onboarding';
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row selection:bg-red-500/20 selection:text-red-700">
      
      {/* Left Column: Visual Dashboard Teaser / Teaser Banner */}
      <div className="lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-10 md:p-16 flex flex-col justify-between relative overflow-hidden shrink-0">
        
        {/* Subtle grid lines background overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(229,57,53,0.1),transparent)] pointer-events-none" />
        
        {/* Logo and tag */}
        <Link to="/" className="flex items-center gap-1 w-fit z-10 hover:opacity-90 transition-opacity">
          <img src={logoImg} className="h-12 w-12 object-contain" alt="PRISM Logo" />
          <div className="text-left">
            <span className="font-extrabold text-base tracking-tight text-white">PRISM</span>
            <p className="text-[8px] text-slate-400 font-medium tracking-tight mt-0.5">PreMeeting Research Intelligence System Manager</p>
          </div>
        </Link>

        {/* Center illustration: High-fidelity glassmorphic success briefing card teaser */}
        <div className="my-12 flex flex-col items-center justify-center relative z-10 flex-1 max-w-md mx-auto w-full">
          
          <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-2xl relative">
            <div className="absolute -top-3 -right-3 bg-red-600 rounded-full w-8 h-8 flex items-center justify-center text-white shadow-lg shadow-red-600/40">
              <Sparkles className="w-4 h-4" />
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 font-extrabold text-xs">
                T
              </div>
              <div className="min-w-0">
                <span className="text-xs text-slate-400 block uppercase tracking-wider font-extrabold">Live Brief Target</span>
                <span className="text-sm font-bold text-white leading-none">Tesla, Inc. Meeting</span>
              </div>
            </div>

            {/* Glowing processing confirmation status */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-white/5 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs text-emerald-400 font-bold font-mono">Brief generated in 4.2s</span>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">100% Positive Signal</span>
            </div>

            {/* Simulated bullet metrics inside illustration */}
            <div className="space-y-2.5">
              <div className="h-2 w-3/4 bg-slate-800 rounded-full" />
              <div className="h-2 w-5/6 bg-slate-850 rounded-full" />
              <div className="h-2 w-2/3 bg-slate-800 rounded-full" />
            </div>
          </div>

          <div className="mt-8 text-center">
            <h3 className="text-lg font-black tracking-tight mb-2">Build your custom meeting dossier in seconds.</h3>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-sm mx-auto">
              PRISM automatically compiles institutional coordinates, funding histories, LinkedIn profiles, and news sentiments directly into your queue.
            </p>
          </div>
        </div>

        {/* Footer text */}
        <span className="text-[10px] text-slate-500 font-medium z-10">© 2026 PRISM Technologies Inc. All rights reserved.</span>
      </div>

      {/* Right Column: Clean, Minimal Sign Up Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white relative">
        
        {/* Go Back to Landing Page */}
        <Link 
          to="/" 
          className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-slate-900 transition-colors bg-slate-50 hover:bg-slate-100 border border-slate-200/80 px-3.5 py-2 rounded-xl shadow-xs cursor-pointer select-none"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
          <span>Go Back</span>
        </Link>

        <div className="w-full max-w-md">
          
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Create Account</h1>
            <p className="text-xs text-slate-500 mt-1 font-semibold">Join thousands of sales professionals using automated intelligence</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-100 flex items-start gap-2.5 text-xs text-red-700 font-semibold">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignUpSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="text-xs font-extrabold text-slate-400 uppercase block mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="fullName"
                  type="text"
                  required
                  placeholder="Sarah Jenkins"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="email" className="text-xs font-extrabold text-slate-400 uppercase block">Email Address</label>
                {email && (
                  <span className={`text-[10px] font-bold ${isEmailValid ? 'text-green-600' : 'text-red-500'}`}>
                    {isEmailValid ? 'Valid email format' : 'Invalid email address'}
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="sarah.j@acme.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="text-xs font-extrabold text-slate-400 uppercase block mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2.5 bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">Password Strength</span>
                    <span className={`text-[10px] font-extrabold uppercase ${
                      strength === 1 ? 'text-red-500' : strength === 2 ? 'text-amber-500' : 'text-green-600'
                    }`}>
                      {strength === 0 ? 'Empty' : strength === 1 ? 'Weak' : strength === 2 ? 'Medium' : 'Strong'}
                    </span>
                  </div>
                  
                  {/* Dynamic Progress indicator */}
                  <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden flex gap-0.5">
                    <div className={`h-full flex-1 transition-all ${
                      strength >= 1 ? (strength === 1 ? 'bg-red-500' : strength === 2 ? 'bg-amber-500' : 'bg-green-500') : 'bg-transparent'
                    }`} />
                    <div className={`h-full flex-1 transition-all ${
                      strength >= 2 ? (strength === 2 ? 'bg-amber-500' : 'bg-green-500') : 'bg-transparent'
                    }`} />
                    <div className={`h-full flex-1 transition-all ${
                      strength >= 3 ? 'bg-green-500' : 'bg-transparent'
                    }`} />
                  </div>

                  {/* Requirements checkboxes */}
                  <ul className="mt-2.5 space-y-1">
                    <li className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 border ${
                        hasMinLength ? 'bg-green-50 border-green-200 text-green-600' : 'border-slate-200'
                      }`}>
                        {hasMinLength ? <Check className="w-2.5 h-2.5" /> : '•'}
                      </span>
                      <span>At least 8 characters</span>
                    </li>
                    <li className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 border ${
                        hasNumber ? 'bg-green-50 border-green-200 text-green-600' : 'border-slate-200'
                      }`}>
                        {hasNumber ? <Check className="w-2.5 h-2.5" /> : '•'}
                      </span>
                      <span>Contains at least one number</span>
                    </li>
                    <li className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 border ${
                        hasSpecialChar ? 'bg-green-50 border-green-200 text-green-600' : 'border-slate-200'
                      }`}>
                        {hasSpecialChar ? <Check className="w-2.5 h-2.5" /> : '•'}
                      </span>
                      <span>Contains one special symbol (@, #, !, etc.)</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Create Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-red-600/10 select-none cursor-pointer border border-transparent ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'active:scale-98 transition-all'
              }`}
            >
              <span>{isSubmitting ? 'Registering details...' : 'Create Account'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          {/* Spacer divider */}
          <div className="my-6 flex items-center justify-center gap-3">
            <span className="h-[1px] bg-slate-200 flex-1" />
            <span className="text-[10px] font-extrabold uppercase text-slate-400">or</span>
            <span className="h-[1px] bg-slate-200 flex-1" />
          </div>

          {/* Social Sign Up */}
          <button
            onClick={handleGoogleSignUp}
            type="button"
            className="w-full py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.62 0 3.08.56 4.22 1.66l3.15-3.15C17.45 1.84 14.92 1 12 1 7.35 1 3.39 3.65 1.41 7.53l3.77 2.92C6.07 7.22 8.81 5.04 12 5.04z"
              />
              <path
                fill="#4285F4"
                d="M23.45 12.3c0-.82-.07-1.62-.21-2.3H12v4.35h6.43c-.28 1.47-1.11 2.71-2.35 3.54l3.65 2.83c2.13-1.97 3.72-4.87 3.72-8.42z"
              />
              <path
                fill="#FBBC05"
                d="M5.18 14.77c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27L1.41 7.31C.51 9.12 0 11.02 0 13s.51 3.88 1.41 5.69l3.77-2.92z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.65-2.83c-1.1.74-2.51 1.18-4.31 1.18-3.19 0-5.93-2.18-6.89-5.41L1.34 15.95C3.32 19.85 7.3 23 12 23z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Sign In link */}
          <div className="mt-8 text-center text-xs font-semibold text-slate-500">
            <span>Already have an account? </span>
            <Link to="/signin" className="text-red-600 font-bold hover:underline">
              Sign in instead
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
