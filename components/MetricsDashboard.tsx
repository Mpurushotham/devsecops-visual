import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import { MOCK_METRICS } from '../constants';
import { ShieldCheck, Activity, Users } from 'lucide-react';

const MetricsDashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
        <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400">Threats Blocked</p>
                        <p className="text-2xl font-bold text-slate-100">42</p>
                    </div>
                </div>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                        <Activity size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400">Avg Latency</p>
                        <p className="text-2xl font-bold text-slate-100">45ms</p>
                    </div>
                </div>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                        <Users size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400">Active Users</p>
                        <p className="text-2xl font-bold text-slate-100">1,204</p>
                    </div>
                </div>
            </div>
        </div>

      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 h-[300px]">
        <h4 className="text-sm font-semibold text-slate-300 mb-4">Traffic vs. Blocked Requests (Real-time)</h4>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={MOCK_METRICS}>
            <defs>
              <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f87171" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
                itemStyle={{ color: '#e2e8f0' }}
            />
            <Area type="monotone" dataKey="traffic" stroke="#818cf8" fillOpacity={1} fill="url(#colorTraffic)" />
            <Area type="monotone" dataKey="threats" stroke="#f87171" fillOpacity={1} fill="url(#colorThreats)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MetricsDashboard;