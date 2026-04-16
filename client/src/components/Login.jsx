import React, { useState } from 'react';
import { Users, Lock, LogIn, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

function Login({ onLogin }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      onLogin();
      toast.success('Access Granted', {
        description: 'Session initialized for Admin Protocol.'
      });
    } else {
      toast.error('Access Denied', {
        description: 'Invalid credentials. Check system logs.'
      });
    }
  };

  const inputClasses = "w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium";

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-5 duration-700">
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 bg-primary-600 rounded-[22px] flex items-center justify-center shadow-2xl shadow-primary-500/30 mb-6 group hover:rotate-6 transition-transform">
            <Users className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">LeadSync</h1>
          <p className="text-gray-500 mt-2">Enterprise Client Lead Management System</p>
        </div>

        <div className="bg-white rounded-[32px] border border-gray-100 shadow-card p-8 lg:p-10">
          <h2 className="text-xl font-bold text-gray-900 mb-8">Sign In</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-700 ml-1">Username</label>
              <div className="relative group">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  className={inputClasses}
                  placeholder="System ID"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-700 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClasses}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-sm font-medium">Keep session active</span>
              </label>
            </div>

            <button 
              type="submit" 
              className="group relative w-full flex items-center justify-center gap-2 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold shadow-xl shadow-primary-500/20 active:scale-[0.98] transition-all overflow-hidden"
            >
              <LogIn size={20} className="transition-transform group-hover:-translate-x-1" />
              <span>Initialize Authentication</span>
              <ChevronRight size={18} className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
            </button>
          </form>
        </div>
        
        <p className="text-center text-sm text-gray-400 mt-10">
          Secure terminal access restricted to authorized personnel.
        </p>
      </div>
    </div>
  );
}

export default Login;
