import React from 'react';
import { 
  Sparkles, BarChart3, Bot, Layout, ShieldAlert, CreditCard, 
  Settings, LogOut, ChevronRight, Globe, Radio, ShieldCheck 
} from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  onLogout: () => void;
  walletConnected: boolean;
  walletAddress?: string;
}

export default function Sidebar({ activeTab, setActiveTab, user, onLogout, walletConnected, walletAddress }: SidebarProps) {
  const menuItems = [
    { id: 'analytics', label: 'Dashboard Analytics', icon: BarChart3, badge: null },
    { id: 'ai_workspace', label: 'AI Pilot Suite', icon: Bot, badge: 'New' },
    { id: 'workspace', label: 'Interactive Boards', icon: Layout, badge: null },
    { id: 'blockchain', label: 'Soroban Contracts', icon: ShieldCheck, badge: walletConnected ? 'Active' : 'Offline' },
    { id: 'billing', label: 'Billing & Invoices', icon: CreditCard, badge: null },
    { id: 'admin', label: 'Admin Terminal', icon: ShieldAlert, badge: 'Staff' },
    { id: 'settings', label: 'Workspace Config', icon: Settings, badge: null },
  ];

  return (
    <motion.aside 
      initial={{ x: -24, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-64 bg-black border-r border-neutral-900 flex flex-col h-screen shrink-0 selection:bg-white selection:text-black font-sans"
    >
      {/* Brand Workspace Selector */}
      <div className="p-5 border-b border-neutral-900 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <img 
            src="/src/assets/images/flowpilot_logo_1784285238524.jpg" 
            alt="FlowPilot Logo" 
            className="w-8 h-8 rounded-lg object-cover border border-neutral-800"
            referrerPolicy="no-referrer"
          />
          <div>
            <span className="font-display font-bold text-sm text-slate-100 block">FlowPilot Console</span>
            <span className="text-[10px] font-mono text-slate-400 block tracking-wide">argha_workspace_01</span>
          </div>
        </div>
        <div className="w-2 h-2 rounded-full bg-white animate-ping" />
      </div>

      {/* Network / Connection Telemetry */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mx-4 mt-4 p-3 rounded-lg bg-neutral-900/40 border border-neutral-850/80 space-y-1.5"
      >
        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <Radio className="w-3 h-3 text-slate-300 animate-pulse" /> Network Nodes
          </span>
          <span className="text-slate-300 font-mono font-medium">Synced</span>
        </div>
        
        {walletConnected ? (
          <div className="text-[10px] font-mono text-slate-200 flex items-center justify-between bg-white/5 px-1.5 py-0.5 rounded border border-white/10 overflow-hidden">
            <span className="truncate max-w-[120px]">{walletAddress}</span>
            <span className="text-[9px] uppercase tracking-wider text-slate-300 font-semibold shrink-0">Soroban</span>
          </div>
        ) : (
          <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-900">
            <span>No Stellar Signer</span>
            <span className="text-[9px] uppercase tracking-wider font-semibold">Freighter</span>
          </div>
        )}
      </motion.div>

      {/* Menu Options */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              initial={{ x: -12, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.04 + 0.1, duration: 0.3, ease: 'easeOut' }}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${isActive ? 'bg-white/5 border-l-2 border-white text-white' : 'text-slate-400 hover:text-white hover:bg-neutral-900/40'}`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold tracking-wider ${item.badge === 'New' ? 'bg-white/10 text-slate-200 border border-white/15' : item.badge === 'Staff' ? 'bg-neutral-800 text-slate-300 border border-neutral-700' : 'bg-slate-900 text-slate-300 border border-slate-800'}`}>
                  {item.badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer Profile Details */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="p-4 border-t border-neutral-900 bg-neutral-950 space-y-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-white via-slate-200 to-slate-400 flex items-center justify-center text-black font-bold text-sm shadow-md">
            {user.name.slice(0, 1).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <span className="block text-xs font-semibold text-slate-200 truncate">{user.name}</span>
            <span className="block text-[10px] font-mono text-slate-500 truncate">{user.email}</span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 bg-white/10 px-1.5 py-0.5 rounded font-mono border border-white/15 shrink-0">
            {user.tier}
          </span>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out Session</span>
        </button>
      </motion.div>
    </motion.aside>
  );
}
