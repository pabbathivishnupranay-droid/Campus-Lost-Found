import React, { useState, useEffect } from 'react';
import { FileText, Loader2, RefreshCw } from 'lucide-react';
import api from '../api/axiosInstance';
import ItemCard from './ItemCard';

export default function MyReportsView({ onClaim, onDelete, onToast }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyReports = async () => {
    setLoading(true);
    try {
      const response = await api.get('/items/my');
      setItems(response.data);
    } catch (err) {
      onToast(err.response?.data?.message || 'Failed to fetch your reported items.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReports();
  }, []);

  const handleDelete = async (itemId) => {
    await onDelete(itemId);
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  return (
    <div className="space-y-6">
      
      <div className="glass-panel p-5 rounded-2xl flex items-center justify-between border border-white/10 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">My Reported Items</h2>
            <p className="text-xs text-slate-400">
              Manage items you found and submitted to the campus registry.
            </p>
          </div>
        </div>

        <button
          onClick={fetchMyReports}
          title="Refresh Reports"
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-white/5 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-16">
          <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center border border-white/10">
          <FileText className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-semibold text-slate-300">No Items Reported</h3>
          <p className="text-xs text-slate-500 mt-1">
            You haven't reported any lost or found items yet. Click "Report Item" to add one!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onClaim={onClaim}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

    </div>
  );
}
