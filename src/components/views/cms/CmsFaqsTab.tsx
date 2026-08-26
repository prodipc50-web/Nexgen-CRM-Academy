import React, { useState } from 'react';
import { useAcademy } from '../../../context/AcademyContext';
import { WebsiteFaqItem } from '../../../types';
import { HelpCircle, Plus, Edit2, Trash2, Save } from 'lucide-react';

interface CmsFaqsTabProps {
  onSuccessToast: (msg: string) => void;
}

export const CmsFaqsTab: React.FC<CmsFaqsTabProps> = ({ onSuccessToast }) => {
  const { websiteFaqs, addWebsiteFaq, updateWebsiteFaq, deleteWebsiteFaq } = useAcademy();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General'
  });

  const handleStartAdd = () => {
    setEditingId(null);
    setIsAdding(true);
    setFormData({
      question: '',
      answer: '',
      category: 'General'
    });
  };

  const handleStartEdit = (faq: WebsiteFaqItem) => {
    setEditingId(faq.id);
    setIsAdding(false);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || 'General'
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question || !formData.answer) return;

    if (editingId) {
      updateWebsiteFaq(editingId, formData);
      onSuccessToast('FAQ question updated!');
    } else {
      addWebsiteFaq(formData);
      onSuccessToast('New FAQ added to public website!');
    }

    setEditingId(null);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wider">
              Frequently Asked Questions (FAQ) Manager
            </h4>
            <p className="text-[11px] text-indigo-700">
              Answer common student queries about course prerequisites, lab access, certificate verification, and job placements.
            </p>
          </div>
        </div>
        <button
          onClick={handleStartAdd}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add FAQ</span>
        </button>
      </div>

      {/* Editor Modal/Box */}
      {(isAdding || editingId) && (
        <form onSubmit={handleSave} className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-black text-xs uppercase text-slate-800">
              {isAdding ? 'Add FAQ Item' : 'Edit FAQ Item'}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
              }}
              className="text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Question *</label>
              <input
                type="text"
                required
                value={formData.question}
                onChange={e => setFormData({ ...formData, question: e.target.value })}
                placeholder="e.g. Can I attend classes online if I live outside Dhaka?"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Answer *</label>
              <textarea
                rows={3}
                required
                value={formData.answer}
                onChange={e => setFormData({ ...formData, answer: e.target.value })}
                placeholder="Provide a clear and helpful explanation..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save FAQ</span>
            </button>
          </div>
        </form>
      )}

      {/* FAQs List */}
      <div className="space-y-3">
        {(websiteFaqs || []).map(faq => (
          <div
            key={faq.id}
            className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1.5"
          >
            <div className="flex items-start justify-between">
              <h4 className="font-black text-slate-900 text-xs flex items-center space-x-2">
                <span className="text-indigo-600 font-black">Q:</span>
                <span>{faq.question}</span>
              </h4>
              <div className="flex items-center space-x-1 shrink-0 ml-2">
                <button
                  onClick={() => handleStartEdit(faq)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    deleteWebsiteFaq(faq.id);
                    onSuccessToast('FAQ item deleted.');
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pl-4">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
