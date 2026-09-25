import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Wand2, 
  ArrowRight, 
  MessageSquareText, 
  Image as ImageIcon, 
  Video, 
  Mic, 
  Share2, 
  CheckCircle2, 
  Star, 
  TrendingUp, 
  Zap, 
  FileText,
  Mail,
  ShieldCheck,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleStart = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="space-y-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Background Subtle Gradient Blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-brand-300/30 to-purple-400/20 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-pink-300/20 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs sm:text-sm font-semibold shadow-xs animate-fade-in">
            <Sparkles className="w-4 h-4 text-brand-600 animate-pulse" />
            <span>Next-Gen AI Content Studio for Brands & Creators</span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-brand-400" />
            <span className="hidden sm:inline text-brand-600 font-bold">Version 2.0 Released</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Turn Any Brand Idea Into <br />
            <span className="text-gradient">Publish-Ready Content</span> In Seconds
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-600 font-normal leading-relaxed">
            Generate tailored social captions, trending hashtags, high-converting ad copy, SEO blog outlines, email newsletters, AI image prompts, video scripts, and natural voice-overs in one click.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={handleStart}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-brand text-white font-semibold text-base shadow-xl shadow-brand-500/30 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Start Generating Free
              <Wand2 className="w-5 h-5" />
            </button>
            <a
              href="#workflow"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-base shadow-sm hover:bg-slate-50 transition-all"
            >
              See How It Works
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          {/* Trust badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              8 Multi-platform formats
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Export TXT & PDF
            </div>
          </div>

          {/* App Studio Preview Mockup */}
          <div className="pt-8 max-w-5xl mx-auto">
            <div className="glass-card rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/80 ring-1 ring-slate-900/5 backdrop-blur-xl">
              <div className="bg-slate-900 rounded-xl overflow-hidden text-left p-4 sm:p-6 text-slate-100 shadow-inner">
                {/* Mock studio window bar */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                    <span className="ml-2 font-mono text-slate-400">AI Content Studio v2.0 - Active Generation</span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 text-[11px] font-medium">
                    ⚡ 8 Formats Generated
                  </span>
                </div>

                {/* Grid preview of outputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-slate-800/80 border border-slate-700/60 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-brand-400">
                      <span className="flex items-center gap-1.5"><MessageSquareText className="w-3.5 h-3.5" /> Instagram Caption</span>
                      <span className="text-[10px] text-slate-400">140 words</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      "Unlock your creative potential with our next-gen AI Studio ✨ Transform rough product specs into high-converting posts in seconds. 🚀 #ContentCreator #AIMarketing"
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-800/80 border border-slate-700/60 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-purple-400">
                      <span className="flex items-center gap-1.5"><Video className="w-3.5 h-3.5" /> 30s TikTok Script</span>
                      <span className="text-[10px] text-slate-400">Hook + 4 Scenes</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      <strong className="text-amber-300">[Hook]:</strong> "Stop writing captions manually!" <br />
                      <strong className="text-purple-300">[Visual]:</strong> Fast zoom cut of creator clicking 'Generate'.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-800/80 border border-slate-700/60 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-pink-400">
                      <span className="flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5" /> Midjourney v6 Prompt</span>
                      <span className="text-[10px] text-slate-400">DALL-E Ready</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-mono text-[11px]">
                      "Hyper-realistic product photograph of sleek matte black audio headphones, neon purple studio rim lighting, 8k resolution, cinematic depth of field --ar 16:9"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600">Complete AI Suite</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            One Click. 8 Tailored Content Formats.
          </p>
          <p className="text-slate-600 text-base sm:text-lg">
            Every piece of content is engineered to match your target platform's algorithm, tone of voice, and campaign objective.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="glass-card p-6 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-4 border border-slate-200/80">
            <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
              <MessageSquareText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">AI Captions & Hashtags</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Generate platform-optimized captions for Instagram, LinkedIn, X, Facebook, and TikTok alongside curated hashtag clusters (trending, niche, and brand).
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-card p-6 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-4 border border-slate-200/80">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">AI Visual Prompts</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Create detailed, professional prompts for Midjourney, DALL-E 3, and Stable Diffusion including lighting, composition, colors, camera angles, and style notes.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-card p-6 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-4 border border-slate-200/80">
            <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Short Video Scripts</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Complete 15-30 second viral TikTok and Reels script blueprints with high-retention hooks, scene breakdowns, on-screen text overlays, and CTAs.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="glass-card p-6 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-4 border border-slate-200/80">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Voice-over Scripts</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Conversational audio narration scripts with exact pause markers `[pause 1s]` and emphasis suggestions for ElevenLabs, podcasts, and video voice-overs.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="glass-card p-6 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-4 border border-slate-200/80">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">High-Converting Ad Copy</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Catchy headlines, persuasive primary text, short & long-form variations tailored to drive sales for Meta Ads, Google Ads, and LinkedIn Ads.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="glass-card p-6 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-4 border border-slate-200/80">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">SEO Blog Outlines</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Comprehensive blog structure with meta descriptions, engaging introductions, H2/H3 subheadings, and strategic conclusions optimized for search rankings.
            </p>
          </div>

          {/* Feature 7 */}
          <div className="glass-card p-6 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-4 border border-slate-200/80">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Email Marketing</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              High open-rate subject lines, catchy preview text, structured body copy, and irresistible call-to-action buttons for email sequences.
            </p>
          </div>

          {/* Feature 8 */}
          <div className="glass-card p-6 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-4 border border-slate-200/80">
            <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Export as TXT & PDF</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Download clean, beautifully formatted PDF reports or plain text files ready to hand off to clients, copywriters, or scheduling tools.
            </p>
          </div>
        </div>
      </section>

      {/* WORKFLOW SECTION (4 Steps) */}
      <section id="workflow" className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-400">Seamless Workflow</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              From Idea to Published in 4 Steps
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              No complex prompt engineering needed. Just answer 4 basic prompts and let AI handle the heavy lifting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-4">
              <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center font-bold text-white text-base">
                1
              </div>
              <h3 className="text-xl font-bold text-white">Enter Brand Idea</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Provide your brand name, product name, industry, and target audience overview.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-4">
              <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center font-bold text-white text-base">
                2
              </div>
              <h3 className="text-xl font-bold text-white">Select Tone & Goal</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Choose your brand tone (Luxury, Friendly, Bold, etc.) and campaign goal (Launch, Sales, Awareness).
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-4">
              <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center font-bold text-white text-base">
                3
              </div>
              <h3 className="text-xl font-bold text-white">Instant Generation</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Our multi-engine AI generates all 8 content formats simultaneously in under 5 seconds.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative p-6 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-4">
              <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center font-bold text-white text-base">
                4
              </div>
              <h3 className="text-xl font-bold text-white">Edit & Export</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Inline edit content, save versions, copy to clipboard, or download structured TXT/PDF files.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Loved by Marketers</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Trusted by 10,000+ Creators & Agencies
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-sm text-slate-700 italic leading-relaxed">
              "AI Content Studio saved us over 20 hours a week on client campaign assets. Generating TikTok video scripts alongside matching Instagram captions and Midjourney image prompts is pure magic."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm">
                SF
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Sarah Foster</h4>
                <p className="text-xs text-slate-500">Head of Growth @ DigitalSpark Agency</p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-sm text-slate-700 italic leading-relaxed">
              "The voice-over scripts with pause markers and emphasis guides make creating podcast intros and YouTube voiceovers effortless. The PDF export is fantastic for client approvals!"
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center font-bold text-sm">
                MC
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Marcus Chen</h4>
                <p className="text-xs text-slate-500">E-Commerce Brand Creator (120k Followers)</p>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-sm text-slate-700 italic leading-relaxed">
              "The tone tailoring is spot on. Whether I need a 'Luxury' tone for a high-end apparel drop or a 'Funny' tone for a viral X thread, AI Content Studio delivers publish-ready copy."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center font-bold text-sm">
                EL
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Elena Rostova</h4>
                <p className="text-xs text-slate-500">Social Media Director @ Velocity SaaS</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-brand p-8 sm:p-12 text-white text-center space-y-6 shadow-2xl shadow-brand-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to Supercharge Your Content Creation?
          </h2>
          <p className="max-w-2xl mx-auto text-brand-100 text-base sm:text-lg">
            Join thousands of creators, brand managers, and marketers scaling their content output today.
          </p>
          <div className="pt-2">
            <button
              onClick={handleStart}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-brand-700 font-bold text-base shadow-lg hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Launch Studio Now
              <Wand2 className="w-5 h-5 text-brand-600" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
