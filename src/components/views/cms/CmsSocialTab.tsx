import React, { useState } from 'react';
import { useAcademy } from '../../../context/AcademyContext';
import {
  Share2,
  Youtube,
  Users,
  MessageSquare,
  Linkedin,
  Instagram,
  Send,
  Video,
  Save,
  Globe,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

interface CmsSocialTabProps {
  onSuccessToast: (msg: string) => void;
}

export const CmsSocialTab: React.FC<CmsSocialTabProps> = ({ onSuccessToast }) => {
  const { websiteCmsConfig, updateWebsiteCmsConfig } = useAcademy();

  const socials = websiteCmsConfig.socialLinks || {
    facebookPageUrl: 'https://facebook.com/nexgencodingacademy',
    facebookGroupUrl: 'https://facebook.com/groups/nexgendevcommunity',
    facebookGroupName: 'NexGen Coders & Tech Career Community (Dhaka)',
    facebookGroupMembersCount: '18,500+ Members',
    youtubeChannelUrl: 'https://youtube.com/@nexgencodingacademy',
    youtubeFeaturedVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    youtubeVideoTitle: 'Watch Campus Tour & Student Success Stories',
    whatsappSupportNumber: '01798444444',
    whatsappCommunityUrl: 'https://chat.whatsapp.com/sampleInviteLink',
    linkedinUrl: 'https://linkedin.com/company/nexgenacademy',
    instagramUrl: 'https://instagram.com/nexgenacademy.bd',
    telegramUrl: 'https://t.me/nexgenacademy_bd',
    tiktokUrl: 'https://tiktok.com/@nexgenacademy'
  };

  const [formData, setFormData] = useState({
    facebookPageUrl: socials.facebookPageUrl || '',
    facebookGroupUrl: socials.facebookGroupUrl || '',
    facebookGroupName: socials.facebookGroupName || 'NexGen Dev & Career Community',
    facebookGroupMembersCount: socials.facebookGroupMembersCount || '18,500+ Active Members',
    youtubeChannelUrl: socials.youtubeChannelUrl || '',
    youtubeFeaturedVideoUrl: socials.youtubeFeaturedVideoUrl || '',
    youtubeVideoTitle: socials.youtubeVideoTitle || 'Campus Tour & Student Career Transformations',
    whatsappSupportNumber: socials.whatsappSupportNumber || '01798444444',
    whatsappCommunityUrl: socials.whatsappCommunityUrl || '',
    linkedinUrl: socials.linkedinUrl || '',
    instagramUrl: socials.instagramUrl || '',
    telegramUrl: socials.telegramUrl || '',
    tiktokUrl: socials.tiktokUrl || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteCmsConfig({
      socialLinks: formData
    });
    onSuccessToast('Social media links, Facebook community group, & YouTube setup saved!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Facebook Ecosystem */}
      <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 text-blue-900 font-black text-sm pb-2 border-b border-blue-50">
          <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
            f
          </div>
          <span>Facebook Official Page & Student Community Group Setup</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Facebook Official Page URL</label>
            <input
              type="text"
              value={formData.facebookPageUrl}
              onChange={e => setFormData({ ...formData, facebookPageUrl: e.target.value })}
              placeholder="https://facebook.com/your-page"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-blue-800"
            />
            <p className="text-[10px] text-slate-400 mt-1">Official public page where updates & verified badges display.</p>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Facebook Community Group URL *</label>
            <input
              type="text"
              value={formData.facebookGroupUrl}
              onChange={e => setFormData({ ...formData, facebookGroupUrl: e.target.value })}
              placeholder="https://facebook.com/groups/your-group"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-blue-800"
            />
            <p className="text-[10px] text-slate-400 mt-1">Direct link for the public website community CTA widget.</p>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Community Group Title / Name</label>
            <input
              type="text"
              value={formData.facebookGroupName}
              onChange={e => setFormData({ ...formData, facebookGroupName: e.target.value })}
              placeholder="e.g. NexGen Coders & Tech Career Network"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Group Member Count Tag</label>
            <input
              type="text"
              value={formData.facebookGroupMembersCount}
              onChange={e => setFormData({ ...formData, facebookGroupMembersCount: e.target.value })}
              placeholder="e.g. 18,500+ Active Members"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-600"
            />
          </div>
        </div>
      </div>

      {/* YouTube Channel & Video Hub */}
      <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 text-red-900 font-black text-sm pb-2 border-b border-red-50">
          <Youtube className="w-5 h-5 text-red-600" />
          <span>YouTube Channel & Featured Video Embed Showcase</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">YouTube Channel URL</label>
            <input
              type="text"
              value={formData.youtubeChannelUrl}
              onChange={e => setFormData({ ...formData, youtubeChannelUrl: e.target.value })}
              placeholder="https://youtube.com/@yourchannel"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-red-800"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Featured Video Title</label>
            <input
              type="text"
              value={formData.youtubeVideoTitle}
              onChange={e => setFormData({ ...formData, youtubeVideoTitle: e.target.value })}
              placeholder="e.g. Live Campus Tour & Student Success Stories"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            />
          </div>

          <div className="md:col-span-2">
            <label className="font-bold text-slate-700 block mb-1">Featured Video Embed URL (YouTube Iframe link)</label>
            <input
              type="text"
              value={formData.youtubeFeaturedVideoUrl}
              onChange={e => setFormData({ ...formData, youtubeFeaturedVideoUrl: e.target.value })}
              placeholder="https://www.youtube.com/embed/dQw4w9WgXcQ"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Note: Use embed format URL (e.g. https://www.youtube.com/embed/VIDEO_ID) to render directly on the public website video player.
            </p>
          </div>
        </div>
      </div>

      {/* WhatsApp & Messaging */}
      <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 text-emerald-900 font-black text-sm pb-2 border-b border-emerald-50">
          <MessageSquare className="w-5 h-5 text-emerald-600" />
          <span>WhatsApp Hotline & Community Discussion Group</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">WhatsApp Support Phone Number</label>
            <input
              type="text"
              value={formData.whatsappSupportNumber}
              onChange={e => setFormData({ ...formData, whatsappSupportNumber: e.target.value })}
              placeholder="01798444444"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-emerald-800"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">WhatsApp Community / Group Invite Link</label>
            <input
              type="text"
              value={formData.whatsappCommunityUrl}
              onChange={e => setFormData({ ...formData, whatsappCommunityUrl: e.target.value })}
              placeholder="https://chat.whatsapp.com/..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
            />
          </div>
        </div>
      </div>

      {/* Other Social Networks */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 text-slate-900 font-black text-sm pb-2 border-b border-slate-100">
          <Share2 className="w-5 h-5 text-indigo-600" />
          <span>Additional Professional & Social Networks</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1 flex items-center space-x-1">
              <Linkedin className="w-3.5 h-3.5 text-sky-600" />
              <span>LinkedIn Company Page</span>
            </label>
            <input
              type="text"
              value={formData.linkedinUrl}
              onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })}
              placeholder="https://linkedin.com/company/..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1 flex items-center space-x-1">
              <Instagram className="w-3.5 h-3.5 text-pink-600" />
              <span>Instagram Profile</span>
            </label>
            <input
              type="text"
              value={formData.instagramUrl}
              onChange={e => setFormData({ ...formData, instagramUrl: e.target.value })}
              placeholder="https://instagram.com/..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1 flex items-center space-x-1">
              <Send className="w-3.5 h-3.5 text-blue-500" />
              <span>Telegram Channel / Group</span>
            </label>
            <input
              type="text"
              value={formData.telegramUrl}
              onChange={e => setFormData({ ...formData, telegramUrl: e.target.value })}
              placeholder="https://t.me/..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1 flex items-center space-x-1">
              <Video className="w-3.5 h-3.5 text-slate-800" />
              <span>TikTok Account URL</span>
            </label>
            <input
              type="text"
              value={formData.tiktokUrl}
              onChange={e => setFormData({ ...formData, tiktokUrl: e.target.value })}
              placeholder="https://tiktok.com/@..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md flex items-center space-x-2 transition-all hover:scale-[1.02]"
        >
          <Save className="w-4 h-4" />
          <span>Save All Social & Community Links</span>
        </button>
      </div>
    </form>
  );
};
