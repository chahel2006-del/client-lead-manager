import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { 
  Mail, Globe, Trash2, Send, Inbox, Filter, 
  Calendar, Edit2, ChevronDown, ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, getLeadStatus } from '../lib/utils';
import { StatusBadge } from './StatusBadge';

const BASE_URL = import.meta.env.VITE_API_URL || "https://clm-backend-2wzs.onrender.com";
const API_URL = `${BASE_URL}/api/leads`;

console.log("ENV URL:", import.meta.env.VITE_API_URL);
console.log("BASE_URL:", BASE_URL);
console.log("API_URL:", API_URL);

function LeadList({ leads = [], isLoading, onRefresh, externalSearchTerm = '' }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const handleUpdate = async (id, payload) => {
    console.log(`[API] Updating lead ${id} at: ${API_URL}/${id}`);
    try {
      await axios.put(`${API_URL}/${id}`, payload);
      toast.success('Lead updated');
      onRefresh(); 
    } catch (error) {
      console.error("[API Error] Update failed:", error);
      toast.error('Update failed');
    }
  };

  const handleAddNote = async (id, noteText) => {
    console.log(`[API] Adding note to lead ${id} at: ${API_URL}/${id}/notes`);
    try {
      await axios.post(`${API_URL}/${id}/notes`, { text: noteText });
      toast.success('Activity updated');
      onRefresh();
    } catch (error) {
      console.error("[API Error] Note addition failed:", error);
      toast.error('Activity log failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Purge this lead from system?")) return;
    console.log(`[API] Deleting lead ${id} at: ${API_URL}/${id}`);
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success('Lead purged');
      onRefresh();
    } catch (error) {
      console.error("[API Error] Deletion failed:", error);
      toast.error('Deletion failed');
    }
  };

  const filteredLeads = useMemo(() => {
    const term = (externalSearchTerm || '').toLowerCase();
    return leads.filter((lead) => {
      const matchesSearch = 
        (lead.name || '').toLowerCase().includes(term) || 
        (lead.email || '').toLowerCase().includes(term);
      
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    }).sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'priority') {
        const p = { high: 1, medium: 2, low: 3 };
        return (p[a.priority] || 4) - (p[b.priority] || 4);
      }
      return 0;
    });
  }, [leads, externalSearchTerm, statusFilter, priorityFilter, sortBy]);

  const selectClasses = "bg-white border border-gray-200 rounded-lg py-1.5 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary-500/10 active:scale-95 transition-all cursor-pointer hover:border-gray-300";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
           <Filter size={16} className="text-gray-400" />
           <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pipeline Filters</span>
        </div>

        <div className="flex gap-2 flex-wrap">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClasses}>
            <option value="all">Statuses: All</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
          </select>

          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className={selectClasses}>
            <option value="all">Priority: Any</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={selectClasses}>
            <option value="newest">Sort: Recency</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="name">Sort: A-Z</option>
            <option value="priority">Sort: Priority</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-[250px] bg-white rounded-[24px] border border-gray-100 animate-pulse shadow-soft" />
          ))}
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-soft p-20 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 mb-4 animate-bounce">
            <Inbox size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Zero Matrix Return</h3>
          <p className="text-gray-500 mt-2 max-w-xs text-sm">Target parameters returned zero results. Adjust your data filters or search queries.</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredLeads.map(lead => (
              <LeadItem 
                key={lead._id} 
                lead={lead} 
                onUpdate={handleUpdate}
                onAddNote={handleAddNote}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

function LeadItem({ lead, onUpdate, onAddNote, onDelete }) {
  const [newNote, setNewNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  
  const [editForm, setEditForm] = useState({
    name: lead.name || '',
    email: lead.email || '',
    source: lead.source || '',
    status: lead.status || 'new',
    priority: lead.priority || 'medium',
    tags: lead.tags ? lead.tags.join(', ') : '',
    nextFollowUpDate: lead.nextFollowUpDate ? lead.nextFollowUpDate.split('T')[0] : ''
  });

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(lead._id, newNote);
      setNewNote('');
    }
  };

  const handleSaveEdit = () => {
    onUpdate(lead._id, {
      ...editForm,
      tags: editForm.tags.split(',').map(t => t.trim()).filter(Boolean)
    });
    setIsEditing(false);
  };

  const statusInfo = getLeadStatus(lead.nextFollowUpDate, lead.status);

  if (isEditing) {
    return (
      <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-[24px] border-2 border-primary-500 p-5 shadow-2xl relative z-10 space-y-4">
        <div className="flex flex-col gap-3">
          <input type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl p-3 font-bold text-gray-900" placeholder="Name" />
          <input type="email" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm" placeholder="Email" />
          <div className="grid grid-cols-2 gap-3">
             <select value={editForm.priority} onChange={(e) => setEditForm({...editForm, priority: e.target.value})} className="bg-gray-50 border-none rounded-xl p-3 text-xs font-bold">
               <option value="high">High</option>
               <option value="medium">Medium</option>
               <option value="low">Low</option>
             </select>
             <input type="date" value={editForm.nextFollowUpDate} onChange={(e) => setEditForm({...editForm, nextFollowUpDate: e.target.value})} className="bg-gray-50 border-none rounded-xl p-3 text-xs" />
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 py-3 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors" onClick={() => setIsEditing(false)}>Abandon</button>
          <button className="flex-1 py-3 text-xs font-bold bg-primary-600 text-white rounded-xl hover:bg-primary-700 active:scale-95 transition-all shadow-lg shadow-primary-500/20" onClick={handleSaveEdit}>Commit</button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }}
      className="bg-white rounded-[28px] border border-gray-100 p-6 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col h-full relative group">
      
      <div className="flex justify-between items-start mb-5">
        <div className="space-y-1">
          <StatusBadge label={statusInfo.label} color={statusInfo.color} />
          <h3 className="text-lg font-extrabold text-gray-900 leading-tight pt-2">{lead.name}</h3>
          <div className="flex items-center gap-2 text-gray-400 font-medium">
            <Mail size={13} />
            <span className="text-xs truncate max-w-[160px]">{lead.email}</span>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl" onClick={() => setIsEditing(true)}>
            <Edit2 size={15} />
          </button>
          <button className="p-2 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-xl" onClick={() => onDelete(lead._id)}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 py-4 border-y border-gray-50 mb-5 relative overflow-hidden">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Weight</span>
          <div className="flex items-center gap-2">
             <div className={cn("w-2 h-2 rounded-full", lead.priority === 'high' ? "bg-error-500" : lead.priority === 'medium' ? "bg-warning-500" : "bg-gray-400")} />
             <span className="text-xs font-bold text-gray-700 uppercase">{lead.priority}</span>
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Acquisition</span>
          <div className="flex items-center gap-2 text-gray-700">
             <Globe size={13} className="text-gray-400" />
             <span className="text-xs font-bold truncate">{lead.source}</span>
          </div>
        </div>
      </div>

      {lead.tags && lead.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {lead.tags.map((tag, i) => (
            <span key={i} className="px-2.5 py-1 bg-gray-50 text-[10px] font-bold text-gray-500 rounded-lg border border-gray-100 uppercase tracking-tight">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto space-y-4 pt-2">
        <div className="flex items-center justify-between text-gray-500 font-bold">
           <div className="flex items-center gap-2">
             <Calendar size={14} className="text-primary-600" />
             <span className="text-[11px]">{lead.nextFollowUpDate ? new Date(lead.nextFollowUpDate).toLocaleDateString() : 'NO SCHEDULE'}</span>
           </div>
           <select 
             className="text-[11px] bg-gray-50 border-none rounded-lg px-2 py-1 focus:ring-0 cursor-pointer text-gray-700 uppercase tracking-tighter"
             value={lead.status}
             onChange={(e) => onUpdate(lead._id, { status: e.target.value })}
           >
             <option value="new">STG: NEW</option>
             <option value="contacted">STG: CONT</option>
             <option value="converted">STG: CONV</option>
           </select>
        </div>

        <div className="relative group/note">
          <input type="text" placeholder="Dispatch note..." value={newNote} onChange={(e) => setNewNote(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-4 pr-10 text-[11px] focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-300 transition-all font-medium placeholder:font-normal" />
          <button onClick={handleAddNote} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-primary-600 transition-colors">
            <Send size={14} />
          </button>
        </div>

        <button onClick={() => setShowTimeline(!showTimeline)} className="w-full py-1 text-[10px] font-bold text-gray-400 hover:text-primary-600 flex items-center justify-center gap-2 transition-all uppercase tracking-widest">
          {showTimeline ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {showTimeline ? 'Conceal Trace' : 'Reveal Log'}
        </button>

        <AnimatePresence>
          {showTimeline && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="pt-4 space-y-4 pl-3 border-l-2 border-gray-100 ml-1">
                {(lead.activityLog || []).slice().reverse().map((log, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[18px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 border-primary-500 shadow-sm" />
                    <div className="text-[10px] text-gray-400 font-bold mb-1 uppercase">{new Date(log.date).toLocaleString()}</div>
                    <div className="text-[11px] text-gray-600 leading-snug font-medium italic">"{log.description}"</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default LeadList;
