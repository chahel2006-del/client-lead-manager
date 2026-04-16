import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { 
  Users, LogOut, Search, 
  Bell, X, History, Archive, Briefcase, Sparkles 
} from 'lucide-react';
import { toast } from 'sonner';
import LeadForm from './LeadForm';
import LeadList from './LeadList';
import { StatsBoard } from './StatsBoard';
import ErrorBoundary from './ErrorBoundary';
import { cn } from '../lib/utils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/leads';

function Dashboard({ onLogout }) {
  const [leads, setLeads] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'activities', 'archive'
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_URL);
      if (response && response.data && Array.isArray(response.data)) {
        setLeads(response.data);
      } else {
        setLeads([]);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error("Failed to sync pipeline data");
      setLeads([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleLeadAdded = () => {
    fetchLeads();
    setActiveTab('overview');
  };

  const allActivities = useMemo(() => {
    if (!leads || !Array.isArray(leads)) return [];
    try {
      return leads.flatMap(lead => 
        (lead?.activityLog || []).map(log => ({
          ...log,
          leadName: lead?.name || 'Unknown',
          leadId: lead?._id
        }))
      ).sort((a, b) => {
        const dateA = a?.date ? new Date(a.date).getTime() : 0;
        const dateB = b?.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });
    } catch (err) {
      return [];
    }
  }, [leads]);

  const renderTabContent = () => {
    switch(activeTab) {
      case 'activities':
        return (
          <ErrorBoundary>
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-soft p-8">
              <div className="flex items-center gap-3 mb-8">
                <History size={24} className="text-primary-600" />
                <h3 className="text-xl font-bold text-gray-900">System Activity Log</h3>
              </div>
              <div className="space-y-6">
                {(allActivities || []).length > 0 ? allActivities.map((activity, i) => (
                  <div key={i} className="flex gap-4 items-start relative pb-6 last:pb-0">
                    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                      <Sparkles size={16} />
                    </div>
                    {i < (allActivities || []).length - 1 && <div className="absolute left-5 top-10 w-[2px] h-full bg-gray-100" />}
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-bold text-gray-900">{activity.leadName}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">
                          {activity.date ? new Date(activity.date).toLocaleString() : 'N/A'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed">{activity.description}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-center text-gray-500 py-20">No recent activities found.</p>
                )}
              </div>
            </div>
          </ErrorBoundary>
        );
      case 'archive':
        const archivedLeads = (leads || []).filter(l => l?.status === 'converted');
        return (
          <ErrorBoundary>
            <div className="space-y-6">
              <div className="bg-white rounded-[32px] border border-gray-100 shadow-soft p-8 text-center">
                <Archive size={32} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900">Lead Archive</h3>
                <p className="text-sm text-gray-500 mt-1">Viewing all successfully converted targets.</p>
              </div>
              <LeadList 
                leads={archivedLeads} 
                isLoading={isLoading} 
                onRefresh={fetchLeads} 
                externalSearchTerm={searchTerm}
              />
            </div>
          </ErrorBoundary>
        );
      default:
        return (
          <div className="space-y-8">
            {/* Top Section: Three Horizontal Graphs */}
            <ErrorBoundary>
              <StatsBoard leads={leads || []} layout="grid" />
            </ErrorBoundary>

            {/* Bottom Section: Split Two-Column Layout */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Left Column: Create Lead Form (Sticky) */}
              <div className="w-full lg:w-[35%] lg:sticky lg:top-24 h-fit transition-all duration-300">
                <ErrorBoundary>
                  <LeadForm onLeadAdded={handleLeadAdded} />
                </ErrorBoundary>
              </div>
              
              {/* Right Column: Lead Registry (Scrolls Normally) */}
              <div className="w-full lg:w-[65%]">
                <ErrorBoundary>
                  <LeadList 
                    leads={leads || []} 
                    isLoading={isLoading} 
                    onRefresh={fetchLeads} 
                    externalSearchTerm={searchTerm}
                  />
                </ErrorBoundary>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Users className="text-white" size={20} />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold tracking-tight text-gray-900 leading-none">LeadSync</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Enterprise Dashboard</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 md:gap-6">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 focus-within:border-primary-500 transition-all">
            <Search size={15} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Filter entire system..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-[13px] text-gray-900 w-48 font-medium placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={cn(
                "p-2.5 rounded-xl transition-all relative",
                showNotifications ? "bg-primary-50 text-error-600" : "text-gray-400 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-6 w-[1px] bg-gray-200 mx-2" />
            <button className="flex items-center gap-2 pl-2 pr-1.5 py-1.5 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 active:scale-95" onClick={onLogout}>
              <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs uppercase shadow-sm">AD</div>
              <LogOut size={16} className="text-gray-400 group-hover:text-error-600 transition-colors" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1700px] mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Briefcase size={18} className="text-primary-600" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Main Pipeline</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Command Interface</h2>
          </div>
          
          <div className="flex bg-white border border-gray-100 p-1.5 rounded-2xl gap-2 h-fit shadow-soft">
            <button onClick={() => setActiveTab('overview')} className={cn("px-6 py-2 text-[11px] font-bold rounded-xl transition-all", activeTab === 'overview' ? "bg-primary-600 text-white shadow-lg shadow-primary-500/30" : "text-gray-500 hover:bg-gray-50")}>Overview</button>
            <button onClick={() => setActiveTab('activities')} className={cn("px-6 py-2 text-[11px] font-bold rounded-xl transition-all", activeTab === 'activities' ? "bg-primary-600 text-white shadow-lg shadow-primary-500/30" : "text-gray-500 hover:bg-gray-50")}>Activities</button>
            <button onClick={() => setActiveTab('archive')} className={cn("px-6 py-2 text-[11px] font-bold rounded-xl transition-all", activeTab === 'archive' ? "bg-primary-600 text-white shadow-lg shadow-primary-500/30" : "text-gray-500 hover:bg-gray-50")}>Archive</button>
          </div>
        </div>

        <div className="mt-6">
          {renderTabContent()}
        </div>
      </main>

      {showNotifications && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute top-20 right-6 w-80 bg-white border border-gray-100 rounded-2xl shadow-2xl pointer-events-auto animate-in slide-in-from-right-10 overflow-hidden">
            <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h5 className="font-bold text-sm text-gray-900">Live Telemetry</h5>
              <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600"><X size={14} /></button>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {(allActivities || []).slice(0, 5).map((n, i) => (
                <div key={i} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <p className="text-[11px] text-gray-700 font-bold leading-tight">{n.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[9px] text-primary-600 font-bold uppercase">{n.leadName}</span>
                    <span className="text-[9px] text-gray-400 font-medium">{n.date ? new Date(n.date).toLocaleTimeString() : 'N/A'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
