import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { Target, TrendingUp, Users } from 'lucide-react';

export function StatsBoard({ leads = [], layout = 'grid' }) {
  // Use a safe leads array
  const safeLeads = Array.isArray(leads) ? leads : [];

  // Aggregate data for Status Breakdown (Pie Chart)
  const statusData = useMemo(() => {
    const counts = safeLeads.reduce((acc, lead) => {
      if (lead && lead.status) {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
      }
      return acc;
    }, {});
    
    return [
      { name: 'On Track', value: counts.new || counts.on_track || 0, color: '#446df6' },
      { name: 'Contacted', value: counts.contacted || 0, color: '#f79009' },
      { name: 'Converted', value: counts.converted || 0, color: '#12b76a' }
    ].filter(d => d.value > 0);
  }, [safeLeads]);

  // Aggregate data for Priority Breakdown (Bar Chart)
  const priorityData = useMemo(() => {
    const counts = safeLeads.reduce((acc, lead) => {
      if (lead && lead.priority) {
        acc[lead.priority] = (acc[lead.priority] || 0) + 1;
      }
      return acc;
    }, {});
    
    return [
      { name: 'High', count: counts.high || 0, fill: '#f04438' },
      { name: 'Medium', count: counts.medium || 0, fill: '#f79009' },
      { name: 'Low', count: counts.low || 0, fill: '#667085' }
    ];
  }, [safeLeads]);

  // Lead Generation Timeline (Area Chart)
  const timelineData = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const counts = safeLeads.reduce((acc, lead) => {
      const date = lead?.createdAt ? lead.createdAt.split('T')[0] : '';
      if (date) acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return last7Days.map(date => ({
      date: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      leads: counts[date] || 0
    }));
  }, [safeLeads]);

  if (safeLeads.length === 0) return null;

  const containerClasses = layout === 'vertical' 
    ? "flex flex-col gap-6" 
    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10";

  return (
    <div className={containerClasses}>
      {/* Lead Velocity Chart */}
      <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-soft h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-primary-600" />
            <h4 className="text-sm font-bold text-gray-900">Lead Velocity</h4>
          </div>
          <span className="text-[10px] font-bold text-success-600 bg-success-50 px-2 py-0.5 rounded-full uppercase">Realtime</span>
        </div>
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#446df6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#446df6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="leads" stroke="#446df6" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pipeline Storage (Pie Chart) */}
      <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-soft h-full">
        <div className="flex items-center gap-2 mb-6">
          <Target size={18} className="text-warning-600" />
          <h4 className="text-sm font-bold text-gray-900">Pipeline Storage</h4>
        </div>
        <div className="h-[180px] w-full flex items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 ml-4 shrink-0">
            {statusData.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Priority Distribution (Bar Chart) */}
      <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-soft h-full">
        <div className="flex items-center gap-2 mb-6">
          <Users size={18} className="text-error-600" />
          <h4 className="text-sm font-bold text-gray-900">Priority Distribution</h4>
        </div>
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
               />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
