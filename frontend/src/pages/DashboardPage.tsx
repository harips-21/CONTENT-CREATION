import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CampaignService } from '../services/campaignService';
import { FullCampaignOutput } from '../types';
import { 
  Sparkles, 
  Wand2, 
  History, 
  Layers, 
  TrendingUp, 
  ArrowRight, 
  Copy, 
  Trash2, 
  ExternalLink,
  Instagram,
  Linkedin,
  Twitter,
  Video,
  Share2,
  Clock,
  BarChart3
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<FullCampaignOutput[]>([]);
  const [aiStatusInfo, setAiStatusInfo] = useState<{ provider: string; status: string; model: string }>({
    provider: 'mock',
    status: 'Demo Mode',
    model: 'N/A',
  });

  useEffect(() => {
    loadCampaigns();
    loadAIStatus();
  }, []);

  const loadAIStatus = async () => {
    const status = await CampaignService.fetchAIStatus();
    setAiStatusInfo(status);
  };

  const loadCampaigns = async () => {
    const list = await CampaignService.fetchAllCampaigns();
    setCampaigns(list);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      CampaignService.deleteCampaign(id);
      loadCampaigns();
    }
  };

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const dup = CampaignService.duplicateCampaign(id);
    if (dup) {
      loadCampaigns();
    }
  };

  // Metrics calculation
  const totalCampaigns = campaigns.length;
  const totalContentGenerated = totalCampaigns * 8; // 8 formats per campaign

  // Platform usage stats
  const platformCounts: Record<string, number> = {};
  campaigns.forEach((item) => {
    const plat = item.campaign.platform || 'Instagram';
    platformCounts[plat] = (platformCounts[plat] || 0) + 1;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-brand p-6 sm:p-8 text-white shadow-xl shadow-brand-500/20 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            AI Content Studio Workspace
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Creator'}! 👋
          </h1>
          <p className="text-brand-100 text-sm sm:text-base max-w-xl">
            Ready to convert brand ideas into 8 publish-ready content formats? Create a new campaign or pick up where you left off.
          </p>
        </div>

        <button
          onClick={() => navigate('/campaign/new')}
          className="relative z-10 shrink-0 inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white text-brand-700 font-bold text-sm shadow-lg hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Wand2 className="w-4 h-4 text-brand-600" />
          Quick Create Campaign
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Total Campaigns</span>
            <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{totalCampaigns}</div>
          <p className="text-xs text-slate-500 font-medium">Saved in history</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Content Pieces</span>
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{totalContentGenerated}</div>
          <p className="text-xs text-slate-500 font-medium">8 Formats generated each</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Top Goal</span>
            <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 truncate">
            {campaigns[0]?.campaign.goal || 'Product Launch'}
          </div>
          <p className="text-xs text-slate-500 font-medium">Primary campaign objective</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">AI Status</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              aiStatusInfo.status === 'Gemini Configured' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
            }`}>
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className={`text-2xl font-extrabold ${
            aiStatusInfo.status === 'Gemini Configured' ? 'text-emerald-600' : 'text-amber-600'
          }`}>
            {aiStatusInfo.status === 'Gemini Configured' ? 'REAL AI · Gemini' : aiStatusInfo.status === 'Demo Mode' ? 'DEMO MODE' : 'Unavailable'}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {aiStatusInfo.status === 'Gemini Configured'
              ? `Gemini configured · Model: ${aiStatusInfo.model}`
              : aiStatusInfo.status === 'Demo Mode'
                ? 'Mock provider active'
                : 'Backend status could not be reached'}
          </p>
        </div>
      </div>

      {/* Platform Usage & Recent Campaigns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Campaigns (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-600" />
              Recent Campaigns
            </h2>
            <Link
              to="/history"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {campaigns.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center space-y-4 border border-slate-200/80">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <History className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Campaigns Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Create your first marketing campaign to start generating tailored multi-platform content.
              </p>
              <button
                onClick={() => navigate('/campaign/new')}
                className="px-5 py-2.5 rounded-xl bg-gradient-brand text-white font-medium text-xs shadow-md"
              >
                Create Campaign Now
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns.slice(0, 4).map((item) => (
                <div
                  key={item.campaign.id}
                  onClick={() => navigate(`/studio/${item.campaign.id}`)}
                  className="glass-card rounded-2xl p-5 border border-slate-200/80 hover:shadow-lg hover:border-brand-300 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                        {item.campaign.brandName}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[11px] font-semibold">
                        {item.campaign.platform}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[11px] font-semibold">
                        {item.campaign.goal}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Product: <strong className="text-slate-800 font-medium">{item.campaign.productName}</strong> ({item.campaign.tone} tone)
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Created: {new Date(item.campaign.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => handleDuplicate(item.campaign.id, e)}
                      title="Duplicate Campaign"
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-xs transition-colors flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(item.campaign.id, e)}
                      title="Delete Campaign"
                      className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-brand-600 text-white font-semibold text-xs group-hover:bg-brand-700 transition-colors">
                      Open Studio
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Platform Usage Sidebar (1 col) */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-600" />
            Platform Breakdown
          </h2>

          <div className="glass-card rounded-2xl p-6 border border-slate-200/80 space-y-5">
            <p className="text-xs text-slate-500">Distribution of your campaigns by target platform:</p>

            {['Instagram', 'LinkedIn', 'X', 'TikTok', 'YouTube', 'Facebook'].map((plat) => {
              const count = platformCounts[plat] || 0;
              const percentage = totalCampaigns > 0 ? Math.round((count / totalCampaigns) * 100) : 0;

              return (
                <div key={plat} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-2">
                      {plat === 'Instagram' && <Instagram className="w-3.5 h-3.5 text-pink-500" />}
                      {plat === 'LinkedIn' && <Linkedin className="w-3.5 h-3.5 text-blue-600" />}
                      {plat === 'X' && <Twitter className="w-3.5 h-3.5 text-slate-800" />}
                      {plat === 'TikTok' && <Video className="w-3.5 h-3.5 text-purple-600" />}
                      {plat}
                    </span>
                    <span>{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-brand h-2 rounded-full transition-all duration-500"
                      style={{ width: `${totalCampaigns > 0 ? (count / totalCampaigns) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
