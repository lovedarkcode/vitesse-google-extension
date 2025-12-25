
import React, { useState, useCallback } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { PerformanceMetrics, AppState } from './types';
import { analyzePerformance } from './services/geminiService';
import MetricCard from './components/MetricCard';
import DiagnosisPanel from './components/DiagnosisPanel';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentMetrics: null,
    history: [],
    diagnosis: null,
    isLoading: false,
  });

  const [url, setUrl] = useState('https://enterprise.vitesse.io');

  const runAudit = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate high-fidelity network profiling
    await new Promise(r => setTimeout(r, 2500));

    const newMetrics: PerformanceMetrics = {
      ttfb: Math.floor(Math.random() * 500 + 40),
      fcp: Math.floor(Math.random() * 1200 + 300),
      lcp: Math.floor(Math.random() * 3000 + 1000),
      cls: parseFloat((Math.random() * 0.4).toFixed(3)),
      fid: Math.floor(Math.random() * 150 + 2),
      loadTime: Math.floor(Math.random() * 6000 + 500),
      timestamp: Date.now()
    };

    try {
      const diagnosis = await analyzePerformance(newMetrics);
      setState(prev => ({
        ...prev,
        currentMetrics: newMetrics,
        history: [...prev.history, newMetrics].slice(-20),
        diagnosis,
        isLoading: false
      }));
    } catch (error) {
      console.error(error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const getStatus = (val: number, type: string) => {
    if (type === 'lcp') return val < 1800 ? 'good' : val < 3500 ? 'needs-improvement' : 'poor';
    if (type === 'load') return val < 2000 ? 'good' : val < 4500 ? 'needs-improvement' : 'poor';
    if (type === 'cls') return val < 0.1 ? 'good' : val < 0.2 ? 'needs-improvement' : 'poor';
    return 'good';
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <nav className="glass sticky top-0 z-50 border-b border-white/5 py-4 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40 text-white rotate-3 group-hover:rotate-0 transition-transform">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white uppercase italic">Vitesse <span className="text-blue-500 not-italic">AI</span></h1>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6] animate-pulse" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Recruiter Audit Tool</span>
              </div>
            </div>
          </div>

          <div className="flex w-full md:w-auto gap-4">
            <div className="relative flex-1 md:w-[450px] group">
              <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-white/5 border border-white/10 px-12 py-4 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 transition-all text-white placeholder-slate-600"
                placeholder="Target URL..."
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <button 
              onClick={runAudit}
              disabled={state.isLoading}
              className={`px-10 py-4 rounded-2xl font-black text-sm tracking-widest uppercase transition-all active:scale-95 shadow-2xl ${
                state.isLoading 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/20'
              }`}
            >
              {state.isLoading ? 'Analyzing...' : 'Run Audit'}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-8 md:p-12 space-y-12">
        {state.currentMetrics ? (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard label="Largest Contentful Paint" value={state.currentMetrics.lcp} unit="ms" status={getStatus(state.currentMetrics.lcp, 'lcp')} />
              <MetricCard label="End-to-End Latency" value={state.currentMetrics.loadTime} unit="ms" status={getStatus(state.currentMetrics.loadTime, 'load')} />
              <MetricCard label="Cumulative Layout Shift" value={state.currentMetrics.cls} unit="%" status={getStatus(state.currentMetrics.cls, 'cls')} />
              <MetricCard label="Time to First Byte" value={state.currentMetrics.ttfb} unit="ms" status={state.currentMetrics.ttfb < 100 ? 'good' : 'needs-improvement'} />
            </div>

            {/* AI Diagnosis Report */}
            {state.diagnosis && <DiagnosisPanel diagnosis={state.diagnosis} />}

            {/* Performance Over Time Chart */}
            <section className="glass rounded-[3rem] p-10 border-blue-500/10 overflow-hidden relative">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                 <div>
                   <h2 className="text-2xl font-black text-white tracking-tight italic">Velocity Profile</h2>
                   <p className="text-sm text-slate-500 font-medium mt-1 uppercase tracking-widest">Real-time Performance Delta</p>
                 </div>
                 <div className="flex gap-4">
                    <div className="px-4 py-2 glass rounded-xl border-emerald-500/20 text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                       Live Stream Active
                    </div>
                 </div>
               </div>

               <div className="h-96 -mx-8">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={state.history}>
                    <defs>
                      <linearGradient id="blueGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#1e293b" />
                    <XAxis dataKey="timestamp" hide />
                    <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} tickFormatter={v => `${v}ms`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '20px', color: '#f8fafc' }}
                      itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="loadTime" stroke="#3b82f6" strokeWidth={5} fill="url(#blueGlow)" animationDuration={2000} />
                   </AreaChart>
                 </ResponsiveContainer>
               </div>
            </section>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-48 text-center space-y-8">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/10 blur-[80px] rounded-full" />
              <div className="w-40 h-40 glass rounded-[2.5rem] flex items-center justify-center mb-4 relative border-blue-500/20 shadow-2xl shadow-blue-500/10 animate-pulse">
                <svg className="w-20 h-20 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
            </div>
            <div className="max-w-xl">
              <h2 className="text-5xl font-black text-white tracking-tighter mb-4 italic uppercase">Vitesse Audit Engine</h2>
              <p className="text-slate-500 text-lg leading-relaxed font-medium">
                Deep performance profiling with Gemini AI. Capture bottlenecks, analyze resource waterfalls, and generate recruiter-ready performance profiles.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-8 mt-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-4 opacity-50">
             <div className="w-8 h-8 bg-slate-800 rounded-lg" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">© 2025 Vitesse Analytics</span>
          </div>
          <div className="flex gap-12 text-[10px] font-black text-slate-600 uppercase tracking-widest">
            <a href="#" className="hover:text-blue-400 transition-colors">Documentation</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Architecture</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Recruiter Portal</a>
            <a href="#" className="hover:text-blue-400 transition-colors text-blue-500">Github</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
