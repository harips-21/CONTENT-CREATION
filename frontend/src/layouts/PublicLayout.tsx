import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap, Layers, FileText, Share2, ShieldCheck, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PublicLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 selection:bg-brand-500 selection:text-white">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 glass-card border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                AI Content<span className="text-gradient">Studio</span>
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                For Brands & Creators
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-brand-600 transition-colors">Features</a>
            <a href="#workflow" className="hover:text-brand-600 transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-brand-600 transition-colors">Testimonials</a>
            <a href="#pricing" className="hover:text-brand-600 transition-colors">Templates</a>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-brand text-white font-medium text-sm shadow-md shadow-brand-500/20 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-slate-700 hover:text-brand-600 font-medium text-sm transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-brand text-white font-medium text-sm shadow-md shadow-brand-500/20 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Get Started Free
                  <Sparkles className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Page Outlet */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-lg font-bold text-white">AI Content Studio</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Transform any brand or product idea into publish-ready social captions, blog outlines, email copies, video scripts, and voice-overs instantly.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Enterprise Grade Privacy & Security
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">AI Captions & Hashtags</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Video & Voice Scripts</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">AI Image Prompts</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Email & Blog Engine</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Brand Assets</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Creator Program</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Legal & Privacy</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security Overview</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Preferences</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} AI Content Studio for Brands & Creators. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Built with <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" /> for modern creators & marketers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
