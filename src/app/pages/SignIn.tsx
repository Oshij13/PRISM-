import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  ShieldAlert,
  Clock,
  Sparkles
} from 'lucide-react';
import { supabaseService } from '../../lib/supabaseService';

const logoImg = new URL('../components/logo_transparent.png', import.meta.url).href;

export function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isEmailValid) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must contain at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await supabaseService.signIn(email, password);
      setIsSubmitting(false);
      
      if (res.success) {
        const userObj = res.user;
        // Mark onboarding complete if jobTitle and company are filled in profile
        const hasOnboarded = userObj && !!userObj.jobTitle && !!userObj.company;
        
        if (hasOnboarded) {
          localStorage.setItem('prism_onboarding_complete', 'true');
          navigate('/dashboard');
        } else {
          localStorage.setItem('prism_onboarding_complete', 'false');
          navigate('/onboarding');
        }
      } else {
        setErrorMsg(res.error || 'Invalid credentials or connection error.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'An unexpected error occurred during login.');
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    if (supabaseService.isConnected()) {
      try {
        const { supabase } = await import('../../lib/supabaseClient');
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin + '/dashboard'
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
        const isOnboarded = localStorage.getItem('prism_onboarding_complete') === 'true';
        setIsSubmitting(false);

        if (isOnboarded) {
          navigate('/dashboard');
        } else {
          navigate('/onboarding');
        }
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row selection:bg-red-500/20 selection:text-red-700">
      
      {/* Left Column: Visual Dashboard/Prep Metrics Teaser */}
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

        {/* Center illustration: High-contrast metric overlay */}
        <div className="my-12 flex flex-col items-center justify-center relative z-10 flex-1 max-w-md mx-auto w-full">
          
          <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-2xl relative">
            
            {/* Hours Saved Stats Card overlay */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/40">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-extrabold">Preparation Velocity</span>
                <span className="text-2xl font-black text-white">12,450+ Hours</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-semibold leading-relaxed mb-4">
              Saved this month by sales leaders and executives globally using automated background parsing loops.
            </p>

            <div className="h-[1px] bg-white/10 w-full mb-4" />

            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-500" />
              <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Turn meeting calendars into revenue systems</span>
            </div>
          </div>

          <div className="mt-8 text-center">
            <h3 className="text-lg font-black tracking-tight mb-2">Confidence starts before the call.</h3>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-sm mx-auto">
              Access institutional valuations, investment histories, executive posts, and recent news summaries in one centralized system.
            </p>
          </div>
        </div>

        {/* Footer text */}
        <span className="text-[10px] text-slate-500 font-medium z-10">© 2026 PRISM Technologies Inc. All rights reserved.</span>
      </div>

      {/* Right Column: Clean, Minimal Sign In Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white">
        <div className="w-full max-w-md">
          
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Sign In</h1>
            <p className="text-xs text-slate-500 mt-1 font-semibold">Enter your coordinates to access your meeting brief queue</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-100 flex items-start gap-2.5 text-xs text-red-700 font-semibold">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignInSubmit} className="space-y-4">
            
            {/* Email Address */}
            <div>
              <label htmlFor="email" className="text-xs font-extrabold text-slate-450 uppercase block mb-1">Email Address</label>
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
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="text-xs font-extrabold text-slate-450 uppercase block">Password</label>
                <button
                  type="button"
                  onClick={() => {}}
                  className="text-[10px] text-red-600 font-bold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
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
            </div>

            {/* Options: Remember Me */}
            <div className="flex items-center">
              <label className="relative flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-4 h-4 bg-slate-100 border border-slate-300 rounded-md flex items-center justify-center transition-all peer-checked:bg-red-600 peer-checked:border-red-600">
                  {rememberMe && (
                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className="text-[11px] font-bold text-slate-500">Remember Me</span>
              </label>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-red-600/10 select-none cursor-pointer border border-transparent ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'active:scale-98 transition-all'
              }`}
            >
              <span>{isSubmitting ? 'Verifying coordinates...' : 'Sign In'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center justify-center gap-3">
            <span className="h-[1px] bg-slate-200 flex-1" />
            <span className="text-[10px] font-extrabold uppercase text-slate-400">or</span>
            <span className="h-[1px] bg-slate-200 flex-1" />
          </div>

          {/* Social Sign In */}
          <button
            onClick={handleGoogleSignIn}
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

          {/* Sign Up Link */}
          <div className="mt-8 text-center text-xs font-semibold text-slate-500">
            <span>Don't have an account? </span>
            <Link to="/signup" className="text-red-600 font-bold hover:underline">
              Create New Account
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
