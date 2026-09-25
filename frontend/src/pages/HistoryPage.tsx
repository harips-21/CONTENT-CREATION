import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CampaignService } from '../services/campaignService';
import { FullCampaignOutput } from '../types';
import { 
  History, 
  Search, 
  Filter, 
  ExternalLink, 
  Copy, 
  Trash2, 
  PlusCircle, 
  Sparkles,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<FullCampaignOutput[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('ALL');
  const [selectedGoal, setSelectedGoal] = useState<string>('ALL');

  useEffect(() => {
    loadCampaigns();
  }, []);

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

  // Filtering
  const filteredCampaigns = campaigns.filter((item) => {
    const matchSearch =
      item.campaign.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.campaign.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.campaign.industry.toLowerCase().includes(searchQuery.toLowerCase());

    const matchPlatform = selectedPlatform === 'ALL' || item.campaign.platform === selectedPlatform;
    const matchGoal = selectedGoal === 'ALL' || item.campaign.goal === selectedGoal;

    return matchSearch && matchPlatform && matchGoal;
  });

  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <History className="w-8 h-8 text-brand-600" />
            Campaign History
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Search, filter, open, duplicate, or manage all your generated brand campaigns.
          </p>
        </div>

        <button
          onClick={() => navigate('/campaign/new')}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-brand text-white font-bold text-xs shadow-md shadow-brand-500/20 hover:opacity-95 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Campaign
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by brand, product, or industry..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        {/* Platform filter */}
        <div className="w-full sm:w-auto">
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none bg-white"
          >
            <option value="ALL">All Platforms</option>
            <option value="Instagram">Instagram</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="X">X (Twitter)</option>
            <option value="TikTok">TikTok</option>
            <option value="YouTube">YouTube</option>
            <option value="Facebook">Facebook</option>
          </select>
        </div>

        {/* Goal filter */}
        <div className="w-full sm:w-auto">
          <select
            value={selectedGoal}
            onChange={(e) => setSelectedGoal(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none bg-white"
          >
            <option value="ALL">All Goals</option>
            <option value="Product Launch">Product Launch</option>
            <option value="Brand Awareness">Brand Awareness</option>
            <option value="Sales">Sales</option>
            <option value="Engagement">Engagement</option>
            <option value="Event Promotion">Event Promotion</option>
          </select>
        </div>
      </div>

      {/* Campaigns List */}
      {filteredCampaigns.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center space-y-4 border border-slate-200/80">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Campaigns Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || selectedPlatform !== 'ALL' || selectedGoal !== 'ALL'
              ? 'Try clearing your search filters to view past campaigns.'
              : 'You haven’t created any campaigns yet. Start your first campaign!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredCampaigns.map((item) => (
            <div
              key={item.campaign.id}
              onClick={() => navigate(`/studio/${item.campaign.id}`)}
              className="glass-card rounded-2xl p-6 border border-slate-200/80 hover:shadow-xl hover:border-brand-300 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {item.campaign.brandName}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">
                      {item.campaign.productName}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-2.5 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[11px] font-semibold">
                      {item.campaign.platform}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-[11px]">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                    Goal: {item.campaign.goal}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-medium">
                    Tone: {item.campaign.tone}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                    8 Formats Generated
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2">
                  Target Audience: {item.campaign.audience}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(item.campaign.createdAt).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDuplicate(item.campaign.id, e)}
                    title="Duplicate Campaign"
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(item.campaign.id, e)}
                    title="Delete Campaign"
                    className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-600 text-white font-semibold text-xs group-hover:bg-brand-700 transition-colors">
                    Open Studio
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
