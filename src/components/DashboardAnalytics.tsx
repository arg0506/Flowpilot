import React from 'react';
import { 
  TrendingUp, Users, Cpu, ShieldCheck, Clock, Layers, ArrowUpRight, CheckCircle, Flame 
} from 'lucide-react';
import { motion } from 'motion/react';

export default function DashboardAnalytics() {
  const kpis = [
    { label: 'Workflows Executed', val: '2,891', change: '+24.5%', trend: 'up', icon: Cpu, color: 'text-white bg-white/5 border border-white/10' },
    { label: 'Soroban Gas Spent', val: '0.041 XLM', change: '-12.3%', trend: 'down', icon: ShieldCheck, color: 'text-white bg-white/5 border border-white/10' },
    { label: 'Average SLA Response', val: '14.2 min', change: '-34.8%', trend: 'down', icon: Clock, color: 'text-white bg-white/5 border border-white/10' },
    { label: 'Sprint Tasks Completed', val: '142 / 160', change: '+92.1%', trend: 'up', icon: Layers, color: 'text-white bg-white/5 border border-white/10' }
  ];

  const recentEvents = [
    { text: 'Milestone "v1.0.0 Stable" verified on Soroban chain', time: '12 min ago', author: 'Argha (Admin)', tx: '0x9fa1...831a' },
    { text: 'AI Workflow Copilot compiled 5 custom action blocks', time: '42 min ago', author: 'WorkflowBot', tx: null },
    { text: 'Growth subscription renewed successfully via Stripe API', time: '2 hours ago', author: 'Billing Service', tx: null },
    { text: 'Soroban Smart Contract state verified: verification_ledger_v1', time: '4 hours ago', author: 'System Sentinel', tx: '0xcb12...ef89' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants: any = {
    hidden: { y: 16, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 p-6 overflow-y-auto h-full max-w-7xl mx-auto selection:bg-white selection:text-black font-sans"
    >
      {/* Upper header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Workspace Analytics</h1>
          <p className="text-xs text-slate-400">Real-time telemetry, model outputs, and blockchain transaction audits.</p>
        </div>
        <div className="flex items-center space-x-2 text-[11px] font-mono bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg text-slate-400">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span>Soroban Testnet: Block #4,922,012</span>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div 
              key={idx} 
              whileHover={{ y: -3, borderColor: '#ffffff' }}
              className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/20 shadow-sm relative group transition-colors duration-300"
            >
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">{kpi.label}</span>
                <div className={`p-2 rounded-lg ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-100 font-display">{kpi.val}</span>
                <span className="text-[10px] font-bold font-mono text-slate-300">
                  {kpi.change}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Line Chart representing productivity output */}
        <div className="lg:col-span-2 p-6 rounded-xl border border-neutral-850 bg-neutral-900/10 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-display font-semibold text-sm text-slate-100">Workflow Automation Load</h3>
              <p className="text-[11px] text-slate-400">Cumulative AI agent executions vs manual completions</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-mono">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white" /> AI Agent</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-600" /> Manual</span>
            </div>
          </div>

          {/* Bespoke SVG chart representing telemetry stats over 6 periods */}
          <div className="h-60 w-full relative">
            <svg viewBox="0 0 500 200" className="w-full h-full">
              {/* Grid Lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="#262626" strokeDasharray="3" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="#262626" strokeDasharray="3" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="#262626" strokeDasharray="3" />
              <line x1="0" y1="190" x2="500" y2="190" stroke="#262626" strokeDasharray="3" />

              {/* Area Under the Line Gradient fill */}
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* AI Path (White) */}
              <path
                d="M 10 160 Q 90 120, 180 140 T 300 80 T 400 60 T 490 30"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 10 160 Q 90 120, 180 140 T 300 80 T 400 60 T 490 30 L 490 200 L 10 200 Z"
                fill="url(#chartGlow)"
              />

              {/* Manual Path (Gray) */}
              <path
                d="M 10 180 Q 90 160, 180 170 T 300 150 T 400 140 T 490 130"
                fill="none"
                stroke="#404040"
                strokeWidth="1.5"
                strokeDasharray="4"
              />

              {/* Hotspots */}
              <circle cx="300" cy="80" r="4" fill="#000" stroke="#ffffff" strokeWidth="2" />
              <circle cx="400" cy="60" r="4" fill="#000" stroke="#ffffff" strokeWidth="2" />
              <circle cx="490" cy="30" r="4" fill="#000" stroke="#ffffff" strokeWidth="2" />
            </svg>

            {/* Hover tooltip simulation */}
            <div className="absolute top-4 right-1/4 bg-neutral-950 border border-neutral-800 p-2.5 rounded shadow text-[10px] font-mono space-y-0.5">
              <span className="text-slate-400 block">Peak Execution (July 17)</span>
              <span className="text-white font-bold block">AI Load: 94.2%</span>
            </div>
          </div>

          <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-neutral-850">
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul (Current)</span>
          </div>
        </div>

        {/* Circular active efficiency index */}
        <div className="p-6 rounded-xl border border-neutral-850 bg-neutral-900/10 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="font-display font-semibold text-sm text-slate-100">Verification Ledger Index</h3>
            <p className="text-[11px] text-slate-400">Ratio of cryptographically locked tasks to total actions.</p>
          </div>

          <div className="flex justify-center items-center py-6 relative">
            <svg className="w-32 h-32" viewBox="0 0 100 100">
              {/* Back Circle */}
              <circle cx="50" cy="50" r="40" stroke="#262626" strokeWidth="8" fill="transparent" />
              {/* Active arc */}
              <motion.circle 
                cx="50" cy="50" r="40" 
                stroke="#ffffff" strokeWidth="8" 
                fill="transparent" 
                strokeDasharray="188.4 251.2" /* 75% arc length */
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                initial={{ strokeDasharray: "0 251.2" }}
                animate={{ strokeDasharray: "188.4 251.2" }}
                transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold text-white font-display">75%</span>
              <span className="text-[9px] font-mono text-slate-500">Immutable Target</span>
            </div>
          </div>

          <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-850 text-[10px] text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>On-Chain Locks:</span>
              <span className="font-mono text-slate-200">106 Tasks</span>
            </div>
            <div className="flex justify-between">
              <span>Verified Merges:</span>
              <span className="font-mono text-slate-200">36 Pull Requests</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Activity and logs section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-neutral-850 bg-neutral-900/10 space-y-4">
          <h3 className="font-display font-semibold text-sm text-slate-100">Live Workspace Activity Logs</h3>
          <div className="space-y-3.5">
            {recentEvents.map((ev, idx) => (
              <div key={idx} className="flex justify-between items-start gap-4 border-b border-neutral-850 pb-3 last:border-0 last:pb-0">
                <div className="space-y-1">
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">{ev.text}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                    <span>by {ev.author}</span>
                    <span>&bull;</span>
                    <span>{ev.time}</span>
                  </div>
                </div>

                {ev.tx && (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 select-all tracking-tight cursor-help" title="Stellar Soroban Transaction Hash">
                    {ev.tx}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Simulated System Health/Telemetry */}
        <div className="p-6 rounded-xl border border-neutral-850 bg-neutral-900/10 space-y-4">
          <h3 className="font-display font-semibold text-sm text-slate-100">Distributed Node Telemetry</h3>
          <div className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>Gemini API Ingress</span>
                <span className="text-slate-200">Healthy (214ms)</span>
              </div>
              <div className="h-1.5 bg-neutral-950 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-white" 
                  initial={{ width: 0 }}
                  animate={{ width: '94%' }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>Stellar Soroban RPC</span>
                <span className="text-slate-300">Stable (1.2s ping)</span>
              </div>
              <div className="h-1.5 bg-neutral-950 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-neutral-600" 
                  initial={{ width: 0 }}
                  animate={{ width: '88%' }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>Node memory consumption</span>
                <span className="text-slate-400">214MB / 1024MB</span>
              </div>
              <div className="h-1.5 bg-neutral-950 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-neutral-800" 
                  initial={{ width: 0 }}
                  animate={{ width: '25%' }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] text-slate-300 flex items-start gap-2.5">
              <Flame className="w-4.5 h-4.5 text-white shrink-0 mt-0.5" />
              <span>
                **System Flag**: All developer actions are currently routing via our pre-allocated Series-A testnet clusters. On-chain validation behaves smoothly.
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
