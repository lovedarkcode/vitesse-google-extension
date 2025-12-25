
import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit: string;
  status: 'good' | 'needs-improvement' | 'poor';
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, unit, status }) => {
  const statusGlow = {
    'good': 'border-emerald-500/30 text-emerald-400 shadow-emerald-500/5',
    'needs-improvement': 'border-amber-500/30 text-amber-400 shadow-amber-500/5',
    'poor': 'border-rose-500/30 text-rose-400 shadow-rose-500/5'
  };

  return (
    <div className={`p-6 rounded-2xl border bg-[#0f172a]/80 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-blue-500/50 glow-blue ${statusGlow[status]}`}>
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">{label}</span>
        <div className={`w-2 h-2 rounded-full animate-pulse ${status === 'good' ? 'bg-emerald-500' : status === 'needs-improvement' ? 'bg-amber-500' : 'bg-rose-500'}`} />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold tracking-tighter text-white">{value}</span>
        <span className="text-sm font-medium opacity-40">{unit}</span>
      </div>
    </div>
  );
};

export default MetricCard;
