import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CampaignService } from '../services/campaignService';
import { AIGeneratorEngine } from '../services/aiGenerator';
import { CampaignInput, CampaignGoal, ToneType, PlatformType } from '../types';
import { 
  Sparkles, 
  Wand2, 
  Target, 
  MessageSquare, 
  Share2, 
  Briefcase, 
  Tag, 
  Users, 
  Megaphone,
  Loader2,
  CheckCircle2,
  Zap,
  HelpCircle
} from 'lucide-react';

export const CreateCampaignPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CampaignInput>({
    brandName: '',
    productName: '',
    industry: 'Consumer Tech',
    audience: '',
    goal: 'Product Launch',
    tone: 'Professional',
    platform: 'Instagram',
    keywords: '',
    competitors: '',
    callToAction: '',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const goals: CampaignGoal[] = ['Product Launch', 'Brand Awareness', 'Sales', 'Engagement', 'Event Promotion'];
  const tones: ToneType[] = ['Professional', 'Friendly', 'Luxury', 'Funny', 'Bold', 'Minimal', 'Emotional'];
  const platforms: PlatformType[] = ['Instagram', 'LinkedIn', 'X', 'Facebook', 'YouTube', 'TikTok'];

  // Preset Handlers
  const handlePreset = (presetType: 'tech' | 'beverage' | 'saas') => {
    if (presetType === 'tech') {
      setFormData({
        brandName: 'Aura Luxe',
        productName: 'Aura Smart Watch Series V',
        industry: 'Wearable Technology',
        audience: 'Tech enthusiasts, fitness lovers, and minimalist professionals aged 22-45',
        goal: 'Product Launch',
        tone: 'Luxury',
        platform: 'Instagram',
        keywords: 'SmartWatch, LuxuryTech, FitnessTracker, MinimalistDesign',
        competitors: 'Apple Watch Ultra, Garmin Epix',
        callToAction: 'Order now to receive exclusive launch pricing and complimentary leather strap.',
      });
    } else if (presetType === 'beverage') {
      setFormData({
        brandName: 'GreenFlow Organics',
        productName: 'Cold-Pressed Match Vitality Cleanse',
        industry: 'Health & Wellness',
        audience: 'Health-conscious millennials, yoga practitioners, and busy urban professionals',
        goal: 'Sales',
        tone: 'Friendly',
        platform: 'TikTok',
        keywords: 'MatchaCleanse, OrganicJuice, Detox2026, HealthyLifestyle',
        competitors: 'Suja Organic, Pressed Juicery',
        callToAction: 'Use code VITALITY20 for 20% off your first 3-day cleanse bundle!',
      });
    } else if (presetType === 'saas') {
      setFormData({
        brandName: 'CodeCraft AI',
        productName: 'DevFlow Copilot v3',
        industry: 'Software & Developer Tools',
        audience: 'Full-stack software engineers, DevOps leads, and AI startup founders',
        goal: 'Brand Awareness',
        tone: 'Bold',
        platform: 'LinkedIn',
        keywords: 'AIStudio, DevTools, CodeGenerator, TypeScript',
        competitors: 'GitHub Copilot, Cursor',
        callToAction: 'Claim your 14-day unlimited free developer trial now.',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brandName || !formData.productName || !formData.audience) {
      alert('Please fill in Brand Name, Product Name, and Target Audience.');
      return;
    }

    setGenerationError(null);
    setIsGenerating(true);
    try {
      const fullOutput = await CampaignService.createCampaign(formData);
      setIsGenerating(false);
      navigate(`/studio/${fullOutput.campaign.id}`);
    } catch (err: any) {
      console.warn("Backend creation failed. Using client fallback engine:", err);
      try {
        const fallbackOutput = AIGeneratorEngine.generateFullCampaign(formData, user?.id || 'demo-user');
        CampaignService.saveCampaign(fallbackOutput);
        setIsGenerating(false);
        navigate(`/studio/${fallbackOutput.campaign.id}`);
      } catch (fallbackErr: any) {
        setGenerationError('Unable to generate content right now. Please check form inputs and try again.');
        setIsGenerating(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold">
          <Wand2 className="w-3.5 h-3.5" />
          AI Campaign Engine
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Create New Content Campaign
        </h1>
        <p className="text-sm text-slate-600">
          Provide basic details about your brand and product. Our AI engine will generate 8 publish-ready content formats tailored to your platform and goal.
        </p>
      </div>

      {/* Quick Presets Toolbar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-subtle">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>Quick Demo Presets:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handlePreset('tech')}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-brand-400 text-slate-700 hover:text-brand-600 text-xs font-medium transition-all shadow-xs"
          >
            ⌚ Aura Luxe Watch
          </button>
          <button
            type="button"
            onClick={() => handlePreset('beverage')}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-brand-400 text-slate-700 hover:text-brand-600 text-xs font-medium transition-all shadow-xs"
          >
            🍵 GreenFlow Matcha
          </button>
          <button
            type="button"
            onClick={() => handlePreset('saas')}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-brand-400 text-slate-700 hover:text-brand-600 text-xs font-medium transition-all shadow-xs"
          >
            ⚡ CodeCraft AI Dev
          </button>
        </div>
      </div>

      {/* Generating Overlay Modal */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl border border-slate-100 animate-slide-up">
            <div className="w-16 h-16 rounded-2xl bg-gradient-brand text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-500/30">
              <Sparkles className="w-8 h-8 animate-spin" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900">Generating AI Content</h3>
              <p className="text-xs text-slate-500">Sending your campaign details to the AI provider...</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Campaign Input Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Core Brand Info */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-200/80 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-brand-600" />
            1. Brand & Product Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Brand Name *
              </label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                placeholder="e.g. Aura Luxe"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Product or Service Name *
              </label>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                placeholder="e.g. Smart Watch Series V"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Industry / Category
              </label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="e.g. Wearable Technology, SaaS, Fashion"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Target Audience *
              </label>
              <input
                type="text"
                value={formData.audience}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                placeholder="e.g. Minimalist professionals & fitness lovers aged 22-45"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Campaign Goals, Tone, and Platform */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-200/80 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            2. Campaign Objective & Tone Strategy
          </h2>

          {/* Campaign Goal Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Campaign Goal
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {goals.map((goal) => (
                <button
                  type="button"
                  key={goal}
                  onClick={() => setFormData({ ...formData, goal })}
                  className={`py-3 px-3 rounded-xl text-xs font-semibold text-center border transition-all ${
                    formData.goal === goal
                      ? 'bg-gradient-brand text-white border-transparent shadow-md shadow-brand-500/20'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          {/* Tone Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Brand Voice & Tone
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {tones.map((tone) => (
                <button
                  type="button"
                  key={tone}
                  onClick={() => setFormData({ ...formData, tone })}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold text-center border transition-all ${
                    formData.tone === tone
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          {/* Target Platform */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Primary Distribution Platform
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
              {platforms.map((plat) => (
                <button
                  type="button"
                  key={plat}
                  onClick={() => setFormData({ ...formData, platform: plat })}
                  className={`py-3 px-3 rounded-xl text-xs font-semibold text-center border transition-all ${
                    formData.platform === plat
                      ? 'bg-brand-50 border-brand-500 text-brand-700 ring-2 ring-brand-500/20 font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {plat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Optional Enhancements */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-200/80 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Tag className="w-5 h-5 text-emerald-600" />
            3. Optional Call-to-Action & Keywords
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Keywords / Tags
              </label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="e.g. SmartWatch, Titanium, Fitness"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Key Competitors
              </label>
              <input
                type="text"
                value={formData.competitors}
                onChange={(e) => setFormData({ ...formData, competitors: e.target.value })}
                placeholder="e.g. Apple Watch, Garmin"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Custom Call-to-Action
              </label>
              <input
                type="text"
                value={formData.callToAction}
                onChange={(e) => setFormData({ ...formData, callToAction: e.target.value })}
                placeholder="e.g. Order now for VIP launch pricing"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
          </div>
        </div>

        {generationError && (
          <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {generationError}
          </div>
        )}

        {/* Submit Action */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isGenerating}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-brand text-white font-bold text-base shadow-xl shadow-brand-500/25 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {isGenerating ? 'Generating...' : 'Generate Content Studio'}
          </button>
        </div>
      </form>
    </div>
  );
};
