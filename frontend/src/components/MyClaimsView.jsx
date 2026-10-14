import React, { useState, useEffect, useCallback } from 'react';
import { PackageCheck, Clock, CheckCircle2, XCircle, MapPin, Loader2, RefreshCw } from 'lucide-react';
import api, { getAssetUrl } from '../api/axiosInstance';

export default function MyClaimsView({ onToast }) {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyClaims = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/claims/my');
      setClaims(response.data);
    } catch (err) {
      onToast(err.response?.data?.message || 'Failed to fetch your claims.', 'error');
    } finally {
      setLoading(false);
    }
  }, [onToast]);

  useEffect(() => {
    fetchMyClaims();
  }, [fetchMyClaims]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return {
          label: 'Pending Review',
          className: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          icon: Clock,
          desc: 'Your claim is currently under review by Campus Security.',
        };
      case 'APPROVED':
        return {
          label: 'Approved',
          className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          icon: CheckCircle2,
          desc: 'Claim approved! Visit Campus Security Desk with your ID to collect.',
        };
      case 'REJECTED':
        return {
          label: 'Rejected',
          className: 'bg-red-500/15 text-red-300 border-red-500/30',
          icon: XCircle,
          desc: 'Claim was not approved based on the provided verification details.',
        };
      default:
        return {
          label: status,
          className: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
          icon: Clock,
          desc: '',
        };
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="glass-panel p-5 rounded-2xl flex items-center justify-between border border-white/10 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <PackageCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">My Ownership Claims</h2>
            <p className="text-xs text-slate-400">
              Track verification status and updates for your claimed belongings.
            </p>
          </div>
        </div>

        <button
          onClick={fetchMyClaims}
          title="Refresh Claims"
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-white/5 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-16">
          <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
        </div>
      ) : claims.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center border border-white/10">
          <PackageCheck className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-semibold text-slate-300">No Claims Submitted Yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            When you claim an item from the browse feed, tracking details will show here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {claims.map((claim) => {
            const badge = getStatusBadge(claim.status);
            const BadgeIcon = badge.icon;

            return (
              <div
                key={claim.id}
                className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between shadow-lg space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-slate-400">Claim #{claim.id}</span>
                    <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.className}`}>
                      <BadgeIcon className="w-3.5 h-3.5" />
                      <span>{badge.label}</span>
                    </span>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/60 border border-white/5 mb-3">
                    {claim.item?.imageUrl ? (
                      <img
                        src={getAssetUrl(claim.item.imageUrl)}
                        alt={claim.item.title}
                        className="w-14 h-14 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] text-slate-500 shrink-0">
                        No Photo
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-100">{claim.item?.title}</h4>
                      <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
                        <MapPin className="w-3 h-3 text-sky-400" />
                        <span>{claim.item?.locationFound}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-medium text-slate-400">
                      Your Verification Statement:
                    </span>
                    <p className="p-2.5 rounded-lg bg-slate-950/60 text-xs text-slate-300 border border-white/5 line-clamp-3">
                      {claim.verificationDetails}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 text-xs text-slate-400 flex items-center justify-between">
                  <span>{badge.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
