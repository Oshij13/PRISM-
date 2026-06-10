import { useState } from 'react';
import { Link } from 'react-router';
import {
  ArrowRight,
  Mail,
  MessageSquare,
  Handshake,
  LifeBuoy,
  Send,
  Linkedin,
  Twitter,
  Github,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

import { SharedHeader, SharedFooter } from '../components/SharedPageLayout';

const contactChannels = [
  {
    icon: Mail,
    label: 'General Inquiries',
    description: 'For general questions, product feedback, or partnership discussions.',
    email: 'hello@prism.ai',
    color: 'bg-red-50 text-red-600 border-red-100',
    hoverBorder: 'hover:border-red-200',
  },
  {
    icon: Handshake,
    label: 'Product Demo & Collaborations',
    description: 'Interested in seeing the platform in action or exploring collaboration opportunities?',
    email: 'partnerships@prism.ai',
    color: 'bg-violet-50 text-violet-600 border-violet-100',
    hoverBorder: 'hover:border-violet-200',
  },
  {
    icon: LifeBuoy,
    label: 'Support',
    description: 'Experiencing an issue or need help with the platform?',
    email: 'support@prism.ai',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    hoverBorder: 'hover:border-emerald-200',
  },
];

const socialLinks = [
  {
    icon: Linkedin,
    label: 'LinkedIn',
    handle: 'PRISM Technologies',
    href: '#',
    color: 'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700',
  },
  {
    icon: Twitter,
    label: 'X (Twitter)',
    handle: '@prism_ai',
    href: '#',
    color: 'hover:bg-slate-100 hover:border-slate-300 hover:text-slate-900',
  },
  {
    icon: Github,
    label: 'GitHub',
    handle: 'prism-ai',
    href: '#',
    color: 'hover:bg-slate-100 hover:border-slate-300 hover:text-slate-900',
  },
];

export function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1400);
  };

  return (
    <div className="bg-[#f8fafc] text-[#0f172a] min-h-screen font-sans">
      <SharedHeader />

      {/* Hero */}
      <section className="relative py-20 px-6 md:px-12 max-w-5xl mx-auto text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-50/60 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100/80 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
            <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider">Get In Touch</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.1] mb-6">
            We'd Love to{' '}
            <span className="bg-gradient-to-r from-red-600 to-red-800 text-transparent bg-clip-text">
              Hear From You.
            </span>
          </h1>
          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Whether you have questions, feedback, partnership opportunities, or simply want to learn more
            about what we're building — we'd be happy to connect.
          </p>
        </div>
      </section>

      {/* Contact Channels */}
      <section className="pb-10 px-6 md:px-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {contactChannels.map((channel, i) => (
            <div
              key={i}
              className={`bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 hover:shadow-md ${channel.hoverBorder}`}
            >
              <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${channel.color}`}>
                <channel.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 mb-1">{channel.label}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mb-3">{channel.description}</p>
                <a
                  href={`mailto:${channel.email}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition-colors group"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{channel.email}</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content: Form + Social */}
      <section className="py-10 px-6 md:px-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Contact Form */}
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Send Us a Message</h2>
                <p className="text-xs text-slate-500 font-medium">We typically respond within 24 hours.</p>
              </div>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">Message Sent!</h3>
                <p className="text-sm text-slate-500 font-medium max-w-xs leading-relaxed">
                  Thanks for reaching out. We'll get back to you at <strong className="text-slate-700">{formData.email}</strong> as soon as possible.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', company: '', subject: '', message: '' }); }}
                  className="mt-2 px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-bold text-slate-700 mb-1.5">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-company" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Company <span className="text-slate-400 font-medium">(Optional)</span>
                  </label>
                  <input
                    id="contact-company"
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your company or organization"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
                  />
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="contact-subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select a subject...</option>
                    <option value="general">General Inquiry</option>
                    <option value="demo">Request a Demo</option>
                    <option value="partnership">Partnership / Collaboration</option>
                    <option value="support">Platform Support</option>
                    <option value="feedback">Product Feedback</option>
                    <option value="press">Press / Media</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us what's on your mind..."
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  id="contact-submit-btn"
                  className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold text-sm rounded-xl transition-all hover:scale-[1.01] active:scale-100 shadow-md shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Side: Social + Mission */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Connect With Us */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="text-sm font-extrabold text-slate-900 mb-1">Connect With Us</h3>
              <p className="text-xs text-slate-500 font-medium mb-5 leading-relaxed">
                Follow our journey and stay updated as we continue building the future of AI-powered sales intelligence.
              </p>
              <div className="space-y-3">
                {socialLinks.map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-3 rounded-xl border border-slate-200 transition-all duration-200 group text-slate-600 ${social.color}`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:border-current transition-all">
                      <social.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">{social.label}</span>
                      <span className="text-[10px] font-medium text-slate-400">{social.handle}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>

            {/* Mission Card */}
            <div className="bg-gradient-to-br from-red-600 to-red-800 text-white rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.08),transparent)] pointer-events-none" />
              <div className="relative z-10">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-4">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-extrabold mb-2">Our Mission</h3>
                <p className="text-xs text-red-100/90 leading-relaxed font-medium mb-4">
                  We're building an AI-powered sales intelligence platform that helps sales professionals
                  spend less time researching and more time building meaningful customer relationships.
                </p>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-xs text-red-100/70 italic font-medium">
                    Have an idea, suggestion, or question? We'd love to hear from you.
                  </p>
                </div>
              </div>
            </div>

            {/* Response time badge */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-green-500 shrink-0 animate-pulse" />
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">We're Active</span>
                <span className="text-[10px] text-slate-500 font-medium">Average response time: &lt; 24 hours</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      <SharedFooter />
    </div>
  );
}
