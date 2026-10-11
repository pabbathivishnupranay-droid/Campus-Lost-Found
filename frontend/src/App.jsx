import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import FilterBar from './components/FilterBar';
import ItemCard from './components/ItemCard';
import ReportItemModal from './components/ReportItemModal';
import ClaimModal from './components/ClaimModal';
import AdminClaimsView from './components/AdminClaimsView';
import MyClaimsView from './components/MyClaimsView';
import MyReportsView from './components/MyReportsView';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import api from './api/axiosInstance';
import { useAuth } from './context/AuthContext';
import { Loader2, PackageOpen, Sparkles, AlertCircle } from 'lucide-react';

export default function App() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'my-reports' | 'my-claims' | 'security-claims'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedClaimItem, setSelectedClaimItem] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  }, []);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery.trim()) params.query = searchQuery.trim();
      if (selectedCategory !== 'ALL') params.category = selectedCategory;
      if (selectedStatus !== 'ALL') params.status = selectedStatus;

      const response = await api.get('/items', { params });
      setItems(response.data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to fetch items feed.', 'error');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedStatus, showToast]);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchItems();
    }, 300);

    return () => clearTimeout(handler);
  }, [fetchItems]);

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/items/${itemId}`);
      showToast('Item deleted successfully.', 'success');
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete item.', 'error');
    }
  };

  const handleOpenReportModal = () => {
    if (!user) {
      showToast('Please sign in first to report an item.', 'info');
      setIsAuthModalOpen(true);
      return;
    }
    setIsReportModalOpen(true);
  };

  const handleOpenClaimModal = (item) => {
    if (!user) {
      showToast('Please sign in first to submit an ownership claim.', 'info');
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedClaimItem(item);
  };

  const handleItemCreated = (newItem) => {
    setItems((prev) => [newItem, ...prev]);
  };

  const handleClaimSuccess = (claim) => {
    // Update local item status to CLAIM_PENDING if currently UNCLAIMED
    setItems((prev) =>
      prev.map((i) =>
        i.id === claim.item.id ? { ...i, status: 'CLAIM_PENDING' } : i
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReportModal={handleOpenReportModal}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Banner Section */}
        {activeTab === 'explore' && (
          <div className="mb-8 p-6 sm:p-8 rounded-3xl glass-panel relative overflow-hidden border border-white/10 shadow-2xl">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Smart Campus Recovery Registry</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
                Lost something on campus? <br />
                <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  Let's get it back to you.
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Browse verified campus lost and found listings with high-speed keyword search, 
                filter by location or category, and submit instant ownership verification claims.
              </p>
            </div>
          </div>
        )}

        {/* View Switcher */}
        {activeTab === 'explore' && (
          <>
            <FilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
            />

            {loading ? (
              <div className="flex items-center justify-center p-24">
                <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
              </div>
            ) : items.length === 0 ? (
              <div className="glass-panel rounded-3xl p-16 text-center border border-white/10">
                <PackageOpen className="w-14 h-14 text-slate-500 mx-auto mb-4 opacity-40" />
                <h3 className="text-lg font-bold text-slate-200">No Items Found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  No lost or found items matched your search query or filters. Try adjusting keywords or clearing category filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onClaim={handleOpenClaimModal}
                    onDelete={handleDeleteItem}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'my-reports' && (
          <MyReportsView
            onClaim={handleOpenClaimModal}
            onDelete={handleDeleteItem}
            onToast={showToast}
          />
        )}

        {activeTab === 'my-claims' && (
          <MyClaimsView onToast={showToast} />
        )}

        {activeTab === 'security-claims' && (
          <AdminClaimsView onToast={showToast} />
        )}

      </main>

      {/* Modals */}
      <ReportItemModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onItemCreated={handleItemCreated}
        onToast={showToast}
      />

      <ClaimModal
        isOpen={!!selectedClaimItem}
        item={selectedClaimItem}
        onClose={() => setSelectedClaimItem(null)}
        onClaimSuccess={handleClaimSuccess}
        onToast={showToast}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onToast={showToast}
      />

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
