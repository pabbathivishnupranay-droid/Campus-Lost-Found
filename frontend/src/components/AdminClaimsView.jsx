import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Check, 
  X, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Calendar, 
  User, 
  Mail,
  Loader2,
  RefreshCw
} from 'lucide-react';
import api, { getAssetUrl } from '../api/axiosInstance';

export default function AdminClaimsView({ onToast }) {
  const [claims, setClaims] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const response = await api.get('/claims');
      setClaims(response.data);
    } catch (err) {
      onToast(err.response?.data?.message || 'Failed to fetch claims list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleUpdateStatus = async (claimId, newStatus) => {
    setProcessingId(claimId);
    try {
      const response = await api.put(`/claims/${claimId}/status`, {
        status: newStatus,
      });
      onToast(`Claim has been ${newStatus.toLowerCase()} successfully!`, 'success');
      // Update local claims state
      setClaims((prev) =>
        prev.map((c) => (c.id === claimId ? response.data : c))
      );
    } catch (err) {
      onToast(err.response?.data?.message || 'Failed to update claim status.', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredClaims = claims.filter((claim) => {
    if (filterStatus === 'ALL') return true;
    return claim.status === filterStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return {
          label: 'Pending Review',
          className: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          icon: Clock,
        };
      case 'APPROVED':
        return {
          label: 'Claim Approved',
          className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          icon: CheckCircle2,
        };
      case 'REJECTED':
        return {
          label: 'Claim Rejected',
          className: 'bg-red-500/15 text-red-300 border-red-500/30',
          icon: XCircle,
        };
      default:
        return {
          label: status,
          className: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
          icon: AlertCircle,
        };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-white/10 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Campus Security Claims Portal</h2>
            <p className="text-xs text-slate-400">
              Evaluate claimant verification proof side-by-side against reported items.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center space-x-1 bg-slate-900/60 p-1 rounded-xl border border-white/5">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterStatus === st
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            onClick={fetchClaims}
            title="Refresh Claims"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-white/5 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Claims List */}
      {loading ? (
        <div className="flex items-center justify-center p-16">
          <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
        </div>
      ) : filteredClaims.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center border border-white/10">
          <ShieldCheck className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-semibold text-slate-300">No Claims Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            There are currently no claims matching this filter status.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredClaims.map((claim) => {
            const badge = getStatusBadge(claim.status);
            const BadgeIcon = badge.icon;
            const isProcessing = processingId === claim.id;

            return (
              <div
                key={claim.id}
                className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-lg"
              >
                {/* Claim Top Bar */}
                <div className="px-5 py-3 bg-slate-900/60 border-b border-white/5 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-slate-400">Claim #{claim.id}</span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-400">Submitted: {claim.createdAt?.split('T')[0] || 'Recent'}</span>
                  </div>
                  <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.className}`}>
                    <BadgeIcon className="w-3.5 h-3.5" />
                    <span>{badge.label}</span>
                  </span>
                </div>

                {/* Side-by-Side Body */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left: Original Item Found Details */}
                  <div className="space-y-3 pr-0 md:pr-4 md:border-r border-white/5">
                    <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block">
                      Found Item Details
                    </span>

                    <div className="flex items-start space-x-3">
                      {claim.item?.imageUrl ? (
                        <img
                          src={getAssetUrl(claim.item.imageUrl)}
                          alt={claim.item.title}
                          className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center text-[10px] text-slate-500 shrink-0">
                          No Photo
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-semibold text-slate-100">{claim.item?.title}</h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{claim.item?.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-white/5">
                      <div className="flex items-center space-x-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span className="truncate">{claim.item?.locationFound}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{claim.item?.dateFound}</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-400">
                      Reported by: <span className="text-slate-300 font-medium">{claim.item?.reportedBy?.name}</span> ({claim.item?.reportedBy?.email})
                    </div>
                  </div>

                  {/* Right: Claimant & Submitted Proof */}
                  <div className="space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">
                        Claimant Verification Details
                      </span>

                      <div className="flex items-center justify-between mt-2 p-2.5 rounded-xl bg-slate-900/60 border border-white/5 text-xs">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-indigo-400" />
                          <span className="font-semibold text-slate-200">{claim.claimant?.name}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-slate-400">
                          <Mail className="w-3.5 h-3.5" />
                          <span>{claim.claimant?.email}</span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <label className="text-[11px] font-medium text-slate-400 block mb-1">
                          Proof of Ownership Statement:
                        </label>
                        <div className="p-3 rounded-xl bg-slate-950/80 border border-indigo-500/20 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                          {claim.verificationDetails}
                        </div>
                      </div>
                    </div>

                    {/* Action Controls for Staff */}
                    {claim.status === 'PENDING' ? (
                      <div className="pt-3 border-t border-white/5 flex items-center justify-end space-x-3">
                        <button
                          disabled={isProcessing}
                          onClick={() => handleUpdateStatus(claim.id, 'REJECTED')}
                          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 text-xs font-semibold transition-all disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                          <span>Reject Claim</span>
                        </button>
                        <button
                          disabled={isProcessing}
                          onClick={() => handleUpdateStatus(claim.id, 'APPROVED')}
                          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-semibold shadow-md shadow-emerald-500/10 transition-all disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          <span>Approve Ownership</span>
                        </button>
                      </div>
                    ) : (
                      <div className="pt-2 text-right">
                        <span className="text-xs text-slate-500 italic">
                          Decision recorded on this claim.
                        </span>
                      </div>
                    )}

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
