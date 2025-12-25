
import React from 'react';
import { Diagnosis } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DiagnosisPanelProps {
  diagnosis: Diagnosis;
}

const DiagnosisPanel: React.FC<DiagnosisPanelProps> = ({ diagnosis }) => {
  const data = diagnosis.waterfall.map(w => ({
    name: w.name,
    duration: w.duration,
    color: w.color
  }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* Top Summary: Critical Status & Score */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 glass rounded-3xl p-8 flex flex-col justify-between border-blue-500/20 shadow-blue-500/10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                diagnosis.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                diagnosis.status === 'Warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                System Status: {diagnosis.status}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Technical Breakdown</h2>
            <p className="text-slate-400 leading-relaxed max-w-2xl text-lg">
              {diagnosis.summary}
            </p>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-800">
             <div className="flex justify-between items-end mb-2">
               <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Technical Performance Debt</span>
               <span className="text-2xl font-black text-white">{diagnosis.technicalDebt}</span>
             </div>
             <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-1000" 
                  style={{ width: `${diagnosis.score}%` }} 
                />
             </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-8 bg-blue-600/10 border-blue-500/30 flex flex-col items-center justify-center text-center">
          <div className="relative mb-6">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
              <circle 
                cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="12" fill="transparent" 
                strokeDasharray={464.7}
                strokeDashoffset={464.7 - (464.7 * diagnosis.score) / 100}
                strokeLinecap="round"
                className="text-blue-500" 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-white">{diagnosis.score}</span>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Health Index</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 px-4">Recruiter Insight: This index measures resource efficiency and frontend architectural hygiene.</p>
        </div>
      </div>

      {/* Resource Latency Graph */}
      <div className="glass rounded-3xl p-8 border-blue-500/10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-white">Resource Latency Profile</h3>
            <p className="text-xs text-slate-500 mt-1">Detailed timing analysis of the critical request chain.</p>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={100} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="duration" radius={[0, 8, 8, 0]} barSize={32}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recruiter Recommendation Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass rounded-3xl p-8 border-blue-500/10">
           <h3 className="text-blue-400 font-black uppercase tracking-widest text-xs mb-6">Optimization Pipeline</h3>
           <div className="space-y-4">
             {diagnosis.recommendations.map((rec, i) => (
               <div key={i} className="group p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/30 transition-all">
                 <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-white group-hover:text-blue-400 transition-colors">{rec.title}</span>
                    <div className="flex gap-2">
                       <span className="text-[9px] px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full font-bold uppercase">{rec.impact} Impact</span>
                       <span className="text-[9px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full font-bold uppercase">{rec.effort} Effort</span>
                    </div>
                 </div>
                 <p className="text-sm text-slate-400 leading-relaxed">{rec.description}</p>
               </div>
             ))}
           </div>
        </div>

        <div className="glass rounded-3xl p-8 bg-blue-500/5 border-blue-500/20">
           <div className="flex items-center gap-3 mb-6">
             <div className="p-2 bg-blue-500 rounded-lg shadow-lg shadow-blue-500/20">
               <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.040L3 6.247a11.955 11.955 0 003.462 7.977a11.954 11.954 0 007.413 3.476 11.952 11.952 0 007.413-3.476 11.954 11.954 0 003.462-7.977l-.382-.203z" /></svg>
             </div>
             <h3 className="text-xl font-bold text-white">Recruiter's Perspective</h3>
           </div>
           <p className="text-lg text-slate-300 italic leading-relaxed mb-8">
             "{diagnosis.recruiterInsight}"
           </p>
           
           <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Anomalies Detected</h4>
              <div className="grid gap-3">
                {diagnosis.potentialCauses.map((cause, i) => (
                  <div key={i} className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                    {cause}
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisPanel;
