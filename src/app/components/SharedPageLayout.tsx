import { Link } from 'react-router';
import { ArrowLeft, Sparkles } from 'lucide-react';

const logoImg = new URL('./logo_transparent.png', import.meta.url).href;

/** Minimal header shown on all public info pages — no nav links, just logo + back button */
export function SharedHeader() {
  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 md:px-12 transition-all duration-300">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-1 select-none">
        <img src={logoImg} className="h-14 w-14 flex-shrink-0 object-contain" alt="PRISM Logo" />
        <div className="flex flex-col">
          <div className="flex items-baseline text-lg font-extrabold leading-none tracking-tight">
            <span>PRIS</span>
            <span className="text-red-600">M</span>
          </div>
          <span className="text-[9px] mt-1 text-slate-500 font-medium tracking-tight">
            PreMeeting Research Intelligence System Manager
          </span>
        </div>
      </Link>

      {/* Back to Home — the only nav element */}
      <Link
        to="/"
        className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-red-600 transition-all px-4 py-2 rounded-xl hover:bg-red-50 border border-slate-200 hover:border-red-200 group"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        <span>Back to Home</span>
      </Link>
    </header>
  );
}

/** Full 4-column footer — Product, Company, Legal columns + copyright bar */
export function SharedFooter() {
  return (
    <footer className="border-t border-slate-200/70 bg-white pt-14 pb-8 px-6 md:px-12 text-xs font-semibold text-slate-400">
      <div className="max-w-6xl mx-auto">

        {/* Top: Logo + columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link to="/" className="flex items-center gap-1 mb-3">
              <img src={logoImg} className="h-10 w-10 object-contain grayscale opacity-60" alt="PRISM Logo" />
              <div className="text-left leading-none">
                <span className="font-extrabold text-slate-500 text-sm">PRISM</span>
                <p className="text-[8px] text-slate-400 mt-0.5">PreMeeting Research Intelligence System Manager</p>
              </div>
            </Link>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed max-w-[180px]">
              AI-powered meeting intelligence for modern sales teams.
            </p>
          </div>

          {/* Product */}
          <div>
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-4">Product</span>
            <ul className="space-y-3">
              <li><Link to="/features" className="hover:text-red-600 transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-red-600 transition-colors">Pricing</Link></li>
              <li><Link to="/security" className="hover:text-red-600 transition-colors">Security</Link></li>
              <li><Link to="/support" className="hover:text-red-600 transition-colors">Support</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-4">Company</span>
            <ul className="space-y-3">
              <li><Link to="/about" className="hover:text-red-600 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-red-600 transition-colors">Contact Us</Link></li>
              <li>
                <a
                  href="https://status.prism.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-600 transition-colors flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  System Status
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-4">Legal</span>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="hover:text-red-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-red-600 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom: copyright + CTA */}
        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[10px] font-medium text-slate-400">
            © 2026 PRISM Technologies. All rights reserved. Built at BITS School of Management.
          </span>
          <Link
            to="/signup"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[11px] font-bold transition-all hover:-translate-y-0.5 shadow-sm shadow-red-600/10 flex items-center gap-1.5 whitespace-nowrap"
          >
            <Sparkles className="w-3 h-3" />
            <span>Get Started Free</span>
          </Link>
        </div>

      </div>
    </footer>
  );
}
