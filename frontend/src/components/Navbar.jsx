import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, 
  PlusCircle, 
  ShieldCheck, 
  LogOut, 
  LogIn, 
  FileText, 
  PackageCheck 
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenReportModal, 
  onOpenAuthModal 
}) {
  const { user, isStaff, logout } = useAuth();

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'SECURITY':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
    }
  };

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('explore')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Campus Lost & Found
              </span>
              <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                University Portal
              </span>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'explore'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Browse Items
            </button>

            {user && (
              <>
                <button
                  onClick={() => setActiveTab('my-reports')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                    activeTab === 'my-reports'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>My Reports</span>
                </button>

                <button
                  onClick={() => setActiveTab('my-claims')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                    activeTab === 'my-claims'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>My Claims</span>
                </button>
              </>
            )}

            {isStaff && (
              <button
                onClick={() => setActiveTab('security-claims')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                  activeTab === 'security-claims'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-300 hover:text-emerald-400 hover:bg-emerald-950/30'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Security Claims Portal</span>
              </button>
            )}
          </nav>

          {/* Action CTAs & Auth Profile */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenReportModal}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-medium text-sm shadow-md shadow-sky-500/20 transition-all hover:shadow-sky-500/30 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Item</span>
            </button>

            {user ? (
              <div className="flex items-center space-x-3 pl-2 border-l border-white/10">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-sm font-medium text-slate-200">{user.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border inline-block w-fit ml-auto mt-0.5 ${getRoleBadge(user.role)}`}>
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 rounded-lg bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700/50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-600/40 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
