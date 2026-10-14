import React from 'react';
import { 
  MapPin, 
  Calendar, 
  User, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Tag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAssetUrl } from '../api/axiosInstance';

export default function ItemCard({ item, onClaim, onDelete }) {
  const { user, isStaff } = useAuth();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'UNCLAIMED':
        return {
          label: 'Unclaimed',
          icon: AlertCircle,
          className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        };
      case 'CLAIM_PENDING':
        return {
          label: 'Claim Pending',
          icon: Clock,
          className: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        };
      case 'CLAIMED':
        return {
          label: 'Claimed',
          icon: CheckCircle2,
          className: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
        };
      default:
        return {
          label: status,
          icon: AlertCircle,
          className: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
        };
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'ELECTRONICS': return 'Electronics';
      case 'ACCESSORIES': return 'Accessories & Bags';
      case 'IDS_CARDS': return 'IDs & Cards';
      case 'BOOKS': return 'Books & Stationery';
      default: return 'Other';
    }
  };

  const statusInfo = getStatusBadge(item.status);
  const StatusIcon = statusInfo.icon;
  const isReporter = user?.id === item.reportedBy?.id;
  const canDelete = isReporter || isStaff;

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group h-full">
      
      {/* Image Preview */}
      <div className="relative aspect-video w-full bg-slate-900/80 overflow-hidden flex items-center justify-center border-b border-white/5">
        {item.imageUrl ? (
          <img
            src={getAssetUrl(item.imageUrl)}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=600&auto=format&fit=crop&q=80';
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-500 p-4 text-center">
            <Tag className="w-10 h-10 mb-1 opacity-40 text-sky-400" />
            <span className="text-xs">No Photo Uploaded</span>
          </div>
        )}

        {/* Status Chip Overlay */}
        <div className="absolute top-3 right-3 flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md border shadow-md leading-none"
             style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)' }}>
          <span className={`inline-flex items-center space-x-1 ${statusInfo.className.split(' ')[1]}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{statusInfo.label}</span>
          </span>
        </div>

        {/* Category Pill */}
        <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-950/70 backdrop-blur-md text-sky-300 border border-sky-400/20">
          {getCategoryLabel(item.category)}
        </div>
      </div>

      {/* Item Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-100 group-hover:text-sky-300 transition-colors line-clamp-1 mb-1.5">
            {item.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {item.description}
          </p>

          {/* Metadata Details */}
          <div className="space-y-1.5 text-xs text-slate-300 mb-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="truncate">{item.locationFound}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Found: {item.dateFound}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">Reported by: {item.reportedBy?.name || 'Anonymous'}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
          {item.status === 'CLAIMED' ? (
            <span className="text-xs font-medium text-slate-500 italic py-1.5">
              Item has been claimed
            </span>
          ) : isReporter ? (
            <span className="text-xs font-medium text-sky-400/80 py-1.5 bg-sky-500/10 px-2.5 rounded-lg border border-sky-500/20">
              Reported by you
            </span>
          ) : (
            <button
              onClick={() => onClaim(item)}
              className="flex-1 py-1.5 px-3 rounded-lg bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-white border border-sky-500/30 text-xs font-semibold transition-all shadow-sm active:scale-95"
            >
              Claim This Item
            </button>
          )}

          {canDelete && (
            <button
              onClick={() => onDelete(item.id)}
              title="Delete Item"
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700/50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
