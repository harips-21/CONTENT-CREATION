import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CampaignService } from '../services/campaignService';
import { FullCampaignOutput, ContentType, GeneratedContentItem } from '../types';
import jsPDF from 'jspdf';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Edit3, 
  RefreshCw, 
  Download, 
  FileText, 
  FileCode, 
  MessageSquareText, 
  Tag, 
  ImageIcon, 
  Video, 
  Mic, 
  Mail, 
  TrendingUp,
  ArrowLeft,
  Save,
  X,
  History,
  Share2
} from 'lucide-react';

export const ContentStudioPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [campaignData, setCampaignData] = useState<FullCampaignOutput | null>(null);
  const [activeTab, setActiveTab] = useState<ContentType | 'ALL'>('ALL');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [editingType, setEditingType] = useState<ContentType | null>(null);
  const [editBuffer, setEditBuffer] = useState<string>('');
  const [versionHistory, setVersionHistory] = useState<Record<ContentType, number>>({
    CAPTION: 1,
    HASHTAGS: 1,
    AD_COPY: 1,
    BLOG: 1,
    EMAIL: 1,
    IMAGE_PROMPT: 1,
    VIDEO_SCRIPT: 1,
    VOICE_OVER: 1,
  });

  useEffect(() => {
    if (id) {
      loadCampaign(id);
    }
  }, [id]);

  const loadCampaign = async (campaignId: string) => {
    const data = await CampaignService.getCampaignById(campaignId);
    if (data) {
      setCampaignData(data);
    } else {
      navigate('/dashboard');
    }
  };

  if (!campaignData) {
    return (
      <div className="py-20 text-center space-y-4">
        <Sparkles className="w-10 h-10 text-brand-600 animate-spin mx-auto" />
        <p className="text-slate-600 font-medium">Loading Content Studio...</p>
      </div>
    );
  }

  const { campaign, contents } = campaignData;

  // Copy helper
  const handleCopy = (type: ContentType, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Inline edit handlers
  const handleStartEdit = (type: ContentType, currentText: string) => {
    setEditingType(type);
    setEditBuffer(currentText);
  };

  const handleSaveEdit = (type: ContentType) => {
    if (!campaignData) return;

    const updatedContents = { ...campaignData.contents };
    const targetItem = updatedContents[type];

    if (targetItem) {
      // Increment version
      const newVersion = targetItem.version + 1;
      targetItem.version = newVersion;
      targetItem.updatedAt = new Date().toISOString();

      if (type === 'CAPTION') {
        (targetItem.content as any).caption = editBuffer;
      } else if (type === 'EMAIL') {
        (targetItem.content as any).body = editBuffer;
      } else if (type === 'BLOG') {
        (targetItem.content as any).introduction = editBuffer;
      } else if (type === 'IMAGE_PROMPT') {
        (targetItem.content as any).prompt = editBuffer;
      } else if (type === 'VOICE_OVER') {
        (targetItem.content as any).narration = editBuffer;
      } else if (type === 'AD_COPY') {
        (targetItem.content as any).primaryText = editBuffer;
      }

      setVersionHistory(prev => ({ ...prev, [type]: newVersion }));
      CampaignService.saveCampaign(campaignData);
    }

    setEditingType(null);
  };

  const handleRegenerate = (type: ContentType) => {
    if (!campaignData) return;
    // Simulate targeted regeneration and version increment
    const updatedContents = { ...campaignData.contents };
    const targetItem = updatedContents[type];

    if (targetItem) {
      const newVersion = targetItem.version + 1;
      targetItem.version = newVersion;
      targetItem.updatedAt = new Date().toISOString();

      // Slightly mutate copy to show fresh variation
      if (type === 'CAPTION') {
        (targetItem.content as any).caption = `🔥 [Variation ${newVersion}] ${ (targetItem.content as any).caption }`;
      } else if (type === 'AD_COPY') {
        (targetItem.content as any).headline = `✨ [New Angle] ${ (targetItem.content as any).headline }`;
      }

      setVersionHistory(prev => ({ ...prev, [type]: newVersion }));
      CampaignService.saveCampaign(campaignData);
    }
  };

  // Download TXT
  const downloadTXT = (type: ContentType, text: string) => {
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${campaign.brandName}_${type}_v${versionHistory[type]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Download PDF Report
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235); // Brand Blue
    doc.text(`AI Content Studio Report`, 14, 22);

    doc.setFontSize(12);
    doc.setTextColor(51, 65, 85);
    doc.text(`Brand: ${campaign.brandName}`, 14, 32);
    doc.text(`Product: ${campaign.productName}`, 14, 39);
    doc.text(`Platform: ${campaign.platform} | Goal: ${campaign.goal} | Tone: ${campaign.tone}`, 14, 46);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 53);

    doc.line(14, 58, 196, 58);

    let y = 68;

    Object.entries(contents).forEach(([typeKey, item]) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text(`[${typeKey}] (v${item.version})`, 14, y);
      y += 8;

      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      const stringified = typeof item.content === 'string' ? item.content : JSON.stringify(item.content, null, 2);
      const lines = doc.splitTextToSize(stringified, 180);
      doc.text(lines, 14, y);
      y += lines.length * 5 + 10;
    });

    doc.save(`${campaign.brandName}_Full_Campaign_Report.pdf`);
  };

  const tabs = [
    { id: 'ALL', label: 'All Formats (8)', icon: Sparkles },
    { id: 'CAPTION', label: 'Caption', icon: MessageSquareText },
    { id: 'HASHTAGS', label: 'Hashtags', icon: Tag },
    { id: 'AD_COPY', label: 'Ad Copy', icon: TrendingUp },
    { id: 'BLOG', label: 'Blog Outline', icon: FileText },
    { id: 'EMAIL', label: 'Email', icon: Mail },
    { id: 'IMAGE_PROMPT', label: 'Image Prompt', icon: ImageIcon },
    { id: 'VIDEO_SCRIPT', label: 'Video Script', icon: Video },
    { id: 'VOICE_OVER', label: 'Voice-over', icon: Mic },
  ];

  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {campaign.brandName} Studio
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold">
                {campaign.platform}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold">
                {campaign.goal}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Product: <strong className="text-slate-800 font-medium">{campaign.productName}</strong> • Tone: {campaign.tone}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={downloadPDF}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-brand-300 hover:text-brand-600 font-medium text-xs shadow-xs transition-all"
          >
            <Download className="w-4 h-4 text-brand-600" />
            Download Full PDF Report
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 border ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-300' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Formats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. SOCIAL MEDIA CAPTION */}
        {(activeTab === 'ALL' || activeTab === 'CAPTION') && (
          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 space-y-4 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-brand-600 font-bold text-sm">
                <MessageSquareText className="w-4 h-4" />
                <span>1. Social Media Caption</span>
                <span className="text-[10px] bg-brand-50 text-brand-700 px-2 py-0.5 rounded border border-brand-200 font-normal">
                  v{contents.CAPTION?.version || 1}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  onClick={() => handleRegenerate('CAPTION')}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100"
                  title="Regenerate Variation"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleCopy('CAPTION', (contents.CAPTION?.content as any)?.caption)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100"
                  title="Copy Caption"
                >
                  {copiedType === 'CAPTION' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => downloadTXT('CAPTION', (contents.CAPTION?.content as any)?.caption)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100"
                  title="Download TXT"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {editingType === 'CAPTION' ? (
              <div className="space-y-3">
                <textarea
                  value={editBuffer}
                  onChange={(e) => setEditBuffer(e.target.value)}
                  rows={6}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-sans text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingType(null)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveEdit('CAPTION')}
                    className="px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-semibold flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Revision
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                  {(contents.CAPTION?.content as any)?.caption}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Character count: {(contents.CAPTION?.content as any)?.characterCount || 0}</span>
                  <button
                    onClick={() => handleStartEdit('CAPTION', (contents.CAPTION?.content as any)?.caption)}
                    className="text-brand-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Edit3 className="w-3 h-3" /> Edit Inline
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. HASHTAG CLUSTERS */}
        {(activeTab === 'ALL' || activeTab === 'HASHTAGS') && (
          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 space-y-4 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-sm">
                <Tag className="w-4 h-4" />
                <span>2. Trending Hashtags</span>
              </div>
              <button
                onClick={() => {
                  const h = contents.HASHTAGS?.content as any;
                  const all = [...(h?.trending || []), ...(h?.niche || []), ...(h?.brand || []), ...(h?.campaign || [])].join(' ');
                  handleCopy('HASHTAGS', all);
                }}
                className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-slate-100"
              >
                {copiedType === 'HASHTAGS' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-semibold text-slate-700 block mb-1">Trending:</span>
                <div className="flex flex-wrap gap-1.5">
                  {((contents.HASHTAGS?.content as any)?.trending || []).map((tag: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 font-mono text-[11px]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">Niche:</span>
                <div className="flex flex-wrap gap-1.5">
                  {((contents.HASHTAGS?.content as any)?.niche || []).map((tag: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[11px]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">Brand & Campaign:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[...((contents.HASHTAGS?.content as any)?.brand || []), ...((contents.HASHTAGS?.content as any)?.campaign || [])].map((tag: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-pink-50 text-pink-700 border border-pink-200 font-mono text-[11px]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. AD COPY */}
        {(activeTab === 'ALL' || activeTab === 'AD_COPY') && (
          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 space-y-4 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-pink-600 font-bold text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>3. High-Converting Ad Copy</span>
              </div>
              <button
                onClick={() => handleCopy('AD_COPY', (contents.AD_COPY?.content as any)?.primaryText)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-pink-600 hover:bg-slate-100"
              >
                {copiedType === 'AD_COPY' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-pink-50/50 border border-pink-200/60">
                <span className="font-bold text-pink-700 block text-[11px] uppercase tracking-wider mb-1">Headline:</span>
                <p className="font-bold text-slate-900 text-sm">{(contents.AD_COPY?.content as any)?.headline}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-600 block text-[11px] uppercase tracking-wider mb-1">Primary Ad Text:</span>
                <p className="text-slate-800 leading-relaxed">{(contents.AD_COPY?.content as any)?.primaryText}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>CTA Button: <strong className="text-slate-800 font-semibold">{(contents.AD_COPY?.content as any)?.callToAction}</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* 4. SEO BLOG OUTLINE */}
        {(activeTab === 'ALL' || activeTab === 'BLOG') && (
          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 space-y-4 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <FileText className="w-4 h-4" />
                <span>4. SEO Blog Content Outline</span>
              </div>
              <button
                onClick={() => handleCopy('BLOG', (contents.BLOG?.content as any)?.title)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100"
              >
                {copiedType === 'BLOG' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <h3 className="font-extrabold text-slate-900 text-sm">{(contents.BLOG?.content as any)?.title}</h3>
              <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/60">
                <span className="font-bold text-emerald-800 block text-[11px] uppercase mb-1">SEO Structure:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  {((contents.BLOG?.content as any)?.seoOutline || []).map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <p className="text-slate-600 italic">{(contents.BLOG?.content as any)?.introduction}</p>
            </div>
          </div>
        )}

        {/* 5. EMAIL MARKETING */}
        {(activeTab === 'ALL' || activeTab === 'EMAIL') && (
          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 space-y-4 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                <Mail className="w-4 h-4" />
                <span>5. Email Marketing Campaign</span>
              </div>
              <button
                onClick={() => handleCopy('EMAIL', (contents.EMAIL?.content as any)?.body)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100"
              >
                {copiedType === 'EMAIL' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 text-white space-y-1">
                <span className="text-[10px] text-slate-400 font-mono block">SUBJECT LINE:</span>
                <p className="font-bold text-sm text-brand-300">{(contents.EMAIL?.content as any)?.subjectLine}</p>
                <p className="text-slate-300 text-[11px]">Preview: {(contents.EMAIL?.content as any)?.previewText}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 whitespace-pre-wrap text-slate-800 leading-relaxed font-sans">
                {(contents.EMAIL?.content as any)?.body}
              </div>
            </div>
          </div>
        )}

        {/* 6. AI IMAGE PROMPT */}
        {(activeTab === 'ALL' || activeTab === 'IMAGE_PROMPT') && (
          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 space-y-4 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-cyan-600 font-bold text-sm">
                <ImageIcon className="w-4 h-4" />
                <span>6. AI Visual Prompt (DALL-E & Midjourney)</span>
              </div>
              <button
                onClick={() => handleCopy('IMAGE_PROMPT', (contents.IMAGE_PROMPT?.content as any)?.prompt)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-600 hover:bg-slate-100"
              >
                {copiedType === 'IMAGE_PROMPT' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900 text-cyan-300 font-mono text-[11px] leading-relaxed border border-slate-800">
                {(contents.IMAGE_PROMPT?.content as any)?.prompt}
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div>Lighting: <strong className="text-slate-800 font-medium">{(contents.IMAGE_PROMPT?.content as any)?.lighting}</strong></div>
                <div>Angle: <strong className="text-slate-800 font-medium">{(contents.IMAGE_PROMPT?.content as any)?.cameraAngle}</strong></div>
              </div>
            </div>
          </div>
        )}

        {/* 7. SHORT VIDEO SCRIPT */}
        {(activeTab === 'ALL' || activeTab === 'VIDEO_SCRIPT') && (
          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 space-y-4 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                <Video className="w-4 h-4" />
                <span>7. Short Video Script (TikTok & Reels)</span>
              </div>
              <button
                onClick={() => handleCopy('VIDEO_SCRIPT', JSON.stringify((contents.VIDEO_SCRIPT?.content as any)?.scenes))}
                className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100"
              >
                {copiedType === 'VIDEO_SCRIPT' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-semibold">
                🔥 HOOK (0:00-0:04): {(contents.VIDEO_SCRIPT?.content as any)?.hook}
              </div>

              <div className="space-y-2">
                {((contents.VIDEO_SCRIPT?.content as any)?.scenes || []).map((scene: any, i: number) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                    <div className="flex justify-between font-bold text-indigo-600 text-[11px]">
                      <span>Scene {i + 1} ({scene.time})</span>
                      <span className="text-slate-500 font-mono">TEXT: {scene.onScreenText}</span>
                    </div>
                    <p className="text-slate-700"><strong>Visual:</strong> {scene.visualHook}</p>
                    <p className="text-slate-800 italic"><strong>Voiceover:</strong> "{scene.voiceOver}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 8. VOICE-OVER SCRIPT */}
        {(activeTab === 'ALL' || activeTab === 'VOICE_OVER') && (
          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 space-y-4 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                <Mic className="w-4 h-4" />
                <span>8. Voice-over Script with Pauses</span>
              </div>
              <button
                onClick={() => handleCopy('VOICE_OVER', (contents.VOICE_OVER?.content as any)?.narration)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-700 hover:bg-slate-100"
              >
                {copiedType === 'VOICE_OVER' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-900 text-slate-100 leading-relaxed font-sans text-xs">
                {(contents.VOICE_OVER?.content as any)?.narration}
              </div>

              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200/60 text-indigo-900">
                <span className="font-bold block text-[11px]">Emphasis Guide:</span>
                {(contents.VOICE_OVER?.content as any)?.emphasisGuide}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
