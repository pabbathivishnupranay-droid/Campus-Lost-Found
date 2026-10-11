import React, { useState } from 'react';
import { X, Lock, Mail, User, Shield, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, onToast }) {
  const { login, register, loading } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      onToast('Please enter both email and password.', 'error');
      return;
    }

    if (mode === 'login') {
      const res = await login(email.trim(), password);
      if (res.success) {
        onToast('Signed in successfully!', 'success');
        onClose();
      } else {
        onToast(res.message, 'error');
      }
    } else {
      if (!name.trim()) {
        onToast('Please enter your name.', 'error');
        return;
      }
      const res = await register(name.trim(), email.trim(), password, role);
      if (res.success) {
        onToast('Account created and signed in!', 'success');
        onClose();
      } else {
        onToast(res.message, 'error');
      }
    }
  };

  const handleQuickLogin = (demoRole) => {
    if (demoRole === 'STUDENT') {
      setName('Alex Student');
      setEmail('student@campus.edu');
      setPassword('password123');
      setRole('STUDENT');
    } else {
      setName('Officer Johnson');
      setEmail('security@campus.edu');
      setPassword('password123');
      setRole('SECURITY');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="glass-panel w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Tabs */}
        <div className="flex border-b border-white/10 relative">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-3.5 text-xs font-bold transition-colors ${
              mode === 'login'
                ? 'text-sky-400 border-b-2 border-sky-400 bg-sky-500/10'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-3.5 text-xs font-bold transition-colors ${
              mode === 'register'
                ? 'text-sky-400 border-b-2 border-sky-400 bg-sky-500/10'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
          <button
            onClick={onClose}
            className="absolute right-3 top-3 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Alex Morgan"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl glass-input text-xs text-slate-100 placeholder-slate-500 outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Campus Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., alex@campus.edu"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl glass-input text-xs text-slate-100 placeholder-slate-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl glass-input text-xs text-slate-100 placeholder-slate-500 outline-none"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Account Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('STUDENT')}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center space-x-1.5 transition-all ${
                    role === 'STUDENT'
                      ? 'bg-sky-500/20 text-sky-300 border-sky-400/40 shadow-sm'
                      : 'bg-slate-900/50 text-slate-400 border-white/5 hover:text-white'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('SECURITY')}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center space-x-1.5 transition-all ${
                    role === 'SECURITY'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-sm'
                      : 'bg-slate-900/50 text-slate-400 border-white/5 hover:text-white'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Campus Security</span>
                </button>
              </div>
            </div>
          )}

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-sky-500/20 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
            )}
          </button>

          {/* Quick Demo Credentials Assistant */}
          <div className="pt-3 border-t border-white/10">
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mb-2">
              <Sparkles className="w-3 h-3 text-sky-400" />
              <span>Quick Demo Fill:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('STUDENT')}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] text-sky-300 border border-sky-500/20 transition-colors"
              >
                Fill Student Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('SECURITY')}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] text-emerald-300 border border-emerald-500/20 transition-colors"
              >
                Fill Security Demo
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
