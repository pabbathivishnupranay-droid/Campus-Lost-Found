import React, { useState } from 'react';
import { X, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

export default function ClaimModal({ isOpen, onClose, item, onClaimSuccess, onToast, onOpenAuthModal }) {
  const { user } = useAuth();
  const [verificationDetails, setVerificationDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      onToast('Please log in first to submit a claim.', 'error');
      onOpenAuthModal();
      return;
    }

    if (!verificationDetails.trim()) {
      onToast('Please provide verification details to prove ownership.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post('/claims', {
        itemId: item.id,
        verificationDetails: verificationDetails.trim(),
      });

      onToast('Ownership claim submitted! Security/staff will verify your details.', 'success');
      onClaimSuccess(response.data);
      onClose();
      setVerificationDetails('');
    } catch (err) {
      onToast(err.response?.data?.message || 'Failed to submit claim.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Claim Item Ownership</h2>
              <p className="text-xs text-slate-400">
                Verify you are the legitimate owner of this item
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item Summary Preview */}
        <div className="p-5 space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex gap-3 items-center">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-14 h-14 rounded-lg object-cover border border-white/10 shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-slate-800 flex items-center justify-center text-xs text-slate-500 shrink-0">
                No Photo
              </div>
            )}
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-slate-200 truncate">{item.title}</h4>
              <p className="text-xs text-slate-400 truncate">Found at: {item.locationFound}</p>
              <p className="text-[11px] text-slate-500">Date: {item.dateFound}</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-2.5 items-start text-xs text-amber-300/90 leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <div>
              Provide specific confidential details only the true owner would know (e.g. lockscreen photo, scratches/stickers, case color, student ID name on card, contents inside).
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Verification Details *
              </label>
              <textarea
                required
                rows={4}
                value={verificationDetails}
                onChange={(e) => setVerificationDetails(e.target.value)}
                placeholder="Describe:
- Unique distinguishing marks, stickers, or scratches
- Exact wallpaper or lockscreen imagery
- Items or cards inside the wallet/bag
- Serial numbers or device passwords (for live in-person unlock)"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-slate-100 placeholder-slate-500 outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="pt-2 flex items-center justify-end space-x-3 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-sky-500/20 disabled:opacity-50 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Ownership Claim</span>
                )}
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
}
