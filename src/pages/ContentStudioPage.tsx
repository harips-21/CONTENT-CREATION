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
  const [pendingAction, setPendingAction] = useState<ContentType | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
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
      setVersionHistory((current) => ({
        ...current,
        ...Object.fromEntries(Object.entries(data.contents).map(([type, item]) => [type, item.version])),
      }));
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

  const handleSaveEdit = async (type: ContentType) => {
    if (!campaignData) return;

    const targetItem = campaignData.contents[type];
    if (targetItem) {
      const editableFields: Partial<Record<ContentType, string>> = {
        CAPTION: 'caption',
        EMAIL: 'body',
        BLOG: 'introduction',
        IMAGE_PROMPT: 'prompt',
        VOICE_OVER: 'narration',
        AD_COPY: 'primaryText',
      };
      const field = editableFields[type];
      if (!field) return;

      setActionError(null);
      setPendingAction(type);
      const updatedContent = {
        ...(targetItem.content as Record<string, any>),
        [field]: editBuffer,
      };

      try {
        const saved = await CampaignService.updateGeneratedContent(campaign.id, type, updatedContent as GeneratedContentItem['content']);
        const updatedItem = {
          ...targetItem,
          content: updatedContent as GeneratedContentItem['content'],
          version: saved.version,
          updatedAt: saved.updatedAt,
        };
        const updatedCampaign = {
          ...campaignData,
          contents: { ...campaignData.contents, [type]: updatedItem },
        };
        setCampaignData(updatedCampaign);
        setVersionHistory(prev => ({ ...prev, [type]: saved.version }));
        CampaignService.saveCampaign(updatedCampaign);
        setEditingType(null);
      } catch (err: any) {
        setActionError(err.message || 'Unable to save this content. Please try again.');
      } finally {
        setPendingAction(null);
      }
    }
  };

  const handleRegenerate = async (type: ContentType) => {
    if (!campaignData) return;
    const targetItem = campaignData.contents[type];

    if (targetItem) {
      setActionError(null);
      setPendingAction(type);
      try {
        const regenerated = await CampaignService.regenerateFormat(campaign.id, type, campaign);
        const updatedItem = {
          ...targetItem,
          content: regenerated.output,
          version: regenerated.version ?? targetItem.version + 1,
          updatedAt: new Date().toISOString(),
        };
        const updatedCampaign = {
          ...campaignData,
          contents: { ...campaignData.contents, [type]: updatedItem },
        };
        setCampaignData(updatedCampaign);
        setVersionHistory(prev => ({ ...prev, [type]: updatedItem.version }));
        CampaignService.saveCampaign(updatedCampaign);
      } catch (err: any) {
        setActionError(err.message || 'Unable to regenerate this content. Please try again.');
      } finally {
        setPendingAction(null);
      }
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
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    let y = 20;

    const cleanText = (value: unknown): string => {
      if (typeof value === 'string') {
        const normalized = value
          .replace(/```(?:json)?/gi, '')
          .replace(/```/g, '')
          .replace(/^\s{0,3}#{1,6}\s+/gm, '')
          .replace(/\*\*(.*?)\*\*/g, '$1')
          .replace(/`/g, '')
          .trim();
        if (normalized.startsWith('{') || normalized.startsWith('[')) {
          try {
            return cleanText(JSON.parse(normalized));
          } catch {
            return normalized;
          }
        }
        return normalized;
      }
      if (typeof value === 'number') return String(value);
      if (Array.isArray(value)) return value.map(cleanText).filter(Boolean).map((item) => `• ${item}`).join('\n');
      if (value && typeof value === 'object') {
        return Object.entries(value)
          .map(([key, item]) => `${key.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase())}: ${cleanText(item)}`)
          .filter((line) => !line.endsWith(': '))
          .join('\n');
      }
      return '';
    };

    const ensureSpace = (lineHeight: number) => {
      if (y + lineHeight > pageHeight - 18) {
        doc.addPage();
        y = 20;
      }
    };

    const writeText = (
      value: unknown,
      options: { size?: number; bold?: boolean; color?: [number, number, number]; indent?: number; lineHeight?: number } = {},
    ) => {
      const text = cleanText(value);
      if (!text) return;

      const size = options.size ?? 10;
      const lineHeight = options.lineHeight ?? 5;
      const indent = options.indent ?? 0;
      doc.setFont('helvetica', options.bold ? 'bold' : 'normal');
      doc.setFontSize(size);
      doc.setTextColor(...(options.color ?? [55, 65, 81]));
      const lines = doc.splitTextToSize(text, pageWidth - margin * 2 - indent);
      lines.forEach((line: string) => {
        ensureSpace(lineHeight);
        doc.text(line, margin + indent, y);
        y += lineHeight;
      });
    };

    const addSection = (title: string) => {
      y += 5;
      ensureSpace(9);
      writeText(title, { size: 13, bold: true, color: [30, 41, 59], lineHeight: 7 });
      doc.setDrawColor(203, 213, 225);
      doc.line(margin, y, pageWidth - margin, y);
      y += 5;
    };

    const addLabel = (label: string, value: unknown) => {
      const text = cleanText(value);
      if (!text) return;
      writeText(`${label}:`, { bold: true, color: [51, 65, 85], lineHeight: 5 });
      writeText(text, { indent: 3, lineHeight: 5 });
      y += 2;
    };

    const getContent = (type: ContentType): Record<string, any> => {
      const value: unknown = contents[type]?.content;
      if (typeof value === 'string') {
        try {
          const parsed: unknown = JSON.parse(value);
          return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as Record<string, any> : { text: value };
        } catch {
          return { text: value };
        }
      }
      return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, any> : { text: value };
    };

    const flattenText = (value: unknown): string[] => {
      if (typeof value === 'string' || typeof value === 'number') return [cleanText(value)].filter(Boolean);
      if (Array.isArray(value)) return value.flatMap(flattenText);
      if (value && typeof value === 'object') return Object.values(value).flatMap(flattenText);
      return [];
    };

    const addBullets = (values: unknown) => {
      flattenText(values).forEach((value) => writeText(`• ${value}`, { indent: 3, lineHeight: 5 }));
    };

    writeText('AI CONTENT STUDIO', { size: 20, bold: true, color: [37, 99, 235], lineHeight: 9 });
    writeText('Campaign Report', { size: 14, bold: true, color: [30, 41, 59], lineHeight: 7 });
    writeText(`Generated: ${new Date().toLocaleDateString()}`, { size: 9, color: [100, 116, 139], lineHeight: 5 });

    addSection('BRAND INFORMATION');
    addLabel('Brand Name', campaign.brandName);
    addLabel('Product Name', campaign.productName);
    addLabel('Industry', campaign.industry);
    addLabel('Target Audience', campaign.audience);
    addLabel('Campaign Goal', campaign.goal);
    addLabel('Tone', campaign.tone);
    addLabel('Platform', campaign.platform);
    addLabel('Keywords', campaign.keywords);
    addLabel('Competitors', campaign.competitors);
    addLabel('Custom CTA', campaign.callToAction);

    addSection('GENERATED CONTENT');

    const caption = getContent('CAPTION');
    addSection('1. SOCIAL MEDIA CAPTION');
    writeText(caption.caption ?? caption.text);

    const hashtags = getContent('HASHTAGS');
    addSection('2. HASHTAGS');
    writeText(flattenText(hashtags).join(' '));

    const adCopy = getContent('AD_COPY');
    addSection('3. ADVERTISEMENT COPY');
    addLabel('Headline', adCopy.headline);
    addLabel('Body', adCopy.primaryText);
    addLabel('CTA', adCopy.callToAction);
    if (adCopy.shortAd) addLabel('Short Ad', adCopy.shortAd);
    if (adCopy.longAd) addLabel('Long Ad', adCopy.longAd);

    const blog = getContent('BLOG');
    addSection('4. BLOG CONTENT');
    addLabel('Title', blog.title);
    if (Array.isArray(blog.seoOutline)) {
      writeText('Outline:', { bold: true });
      addBullets(blog.seoOutline);
    }
    addLabel('Introduction', blog.introduction);
    if (Array.isArray(blog.sections)) {
      blog.sections.forEach((section: any, index: number) => {
        addLabel(section.heading || `Section ${index + 1}`, section.body);
      });
    }
    addLabel('Conclusion', blog.conclusion);

    const email = getContent('EMAIL');
    addSection('5. EMAIL MARKETING');
    addLabel('Subject', email.subjectLine);
    addLabel('Email', email.body);
    addLabel('CTA', email.callToAction);

    const imagePrompt = getContent('IMAGE_PROMPT');
    addSection('6. IMAGE PROMPT');
    writeText(imagePrompt.prompt ?? imagePrompt.text);

    const video = getContent('VIDEO_SCRIPT');
    addSection('7. VIDEO SCRIPT');
    addLabel('Hook', video.hook);
    if (Array.isArray(video.scenes)) {
      video.scenes.forEach((scene: any, index: number) => {
        const sceneLabel = scene.time ? `Scene ${index + 1} (${scene.time})` : `Scene ${index + 1}`;
        addLabel(sceneLabel, [scene.visualHook, scene.onScreenText, scene.voiceOver].filter(Boolean).join('\n'));
      });
    }
    addLabel('CTA', video.callToAction);

    const voiceOver = getContent('VOICE_OVER');
    addSection('8. VOICE-OVER SCRIPT');
    writeText(voiceOver.narration ?? voiceOver.text);

    const pageCount = doc.getNumberOfPages();
    for (let page = 1; page <= pageCount; page += 1) {
      doc.setPage(page);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('Generated with AI Content Studio. For human review before publishing.', margin, pageHeight - 9);
      doc.text(`${page} / ${pageCount}`, pageWidth - margin, pageHeight - 9, { align: 'right' });
    }
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

      {actionError && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {actionError}
        </div>
      )}

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
                  disabled={pendingAction === 'CAPTION'}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 disabled:opacity-50"
                  title="Regenerate Variation"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${pendingAction === 'CAPTION' ? 'animate-spin' : ''}`} />
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
                    disabled={pendingAction === 'CAPTION'}
                    className="px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-semibold flex items-center gap-1 disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" /> {pendingAction === 'CAPTION' ? 'Saving...' : 'Save Revision'}
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
