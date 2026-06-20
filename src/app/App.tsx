import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import { TopBar } from './components/TopBar';
import { Dashboard } from './pages/Dashboard';
import { MeetingIntelligence } from './pages/MeetingIntelligence';
import { Contacts } from './pages/Contacts';
import { Analytics } from './pages/Analytics';
import { Sources } from './pages/Sources';
import { LandingPage } from './pages/LandingPage';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { Onboarding } from './pages/Onboarding';
import { Settings } from './pages/Settings';
import { AboutUs } from './pages/AboutUs';
import { ContactUs } from './pages/ContactUs';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { FeaturesPage } from './pages/FeaturesPage';
import { PricingPage } from './pages/PricingPage';
import { SecurityPage } from './pages/SecurityPage';
import { SupportPage } from './pages/SupportPage';

function AppContent() {
  const location = useLocation();

  // Hide dashboard TopBar on Landing, Sign In, Sign Up, and Onboarding routes
  const hideTopBarPaths = ['/', '/signin', '/signup', '/onboarding', '/about', '/contact', '/privacy', '/terms', '/features', '/pricing', '/security', '/support'];
  const showTopBar = !hideTopBarPaths.includes(location.pathname);

  useEffect(() => {
    // Reset scroll positions of both the scrollable <main> container and the window on page changes
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    // Dynamically manage the global dark mode class on document element.
    // Public landing pages are strictly light-themed, so we disable dark mode class on them.
    // Internal pages restore the user's stored preference (defaulting to dark mode).
    const isPublicPath = hideTopBarPaths.includes(location.pathname);
    if (isPublicPath) {
      document.documentElement.classList.remove('dark');
    } else {
      const savedTheme = localStorage.getItem('theme');
      const shouldBeDark = savedTheme !== 'light';
      document.documentElement.classList.toggle('dark', shouldBeDark);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {showTopBar && <TopBar />}
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/meeting/:id" element={<MeetingIntelligence />} />
          <Route path="/meetings" element={<MeetingIntelligence />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/research" element={<Sources />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/support" element={<SupportPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}