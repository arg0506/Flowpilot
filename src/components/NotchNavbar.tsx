import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, Bot, Layout, ShieldAlert, Settings, LogOut, 
  Radio, Sparkles, ChevronDown, User, Wallet, Activity, CreditCard, ShieldCheck
} from 'lucide-react';
import { UserProfile } from '../types';

interface NotchNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  onLogout: () => void;
  walletConnected: boolean;
  walletAddress: string;
  onConnectWallet?: () => void;
}

export default function NotchNavbar({
  activeTab,
  setActiveTab,
  user,
  onLogout,
  walletConnected,
  walletAddress,
  onConnectWallet,
}: NotchNavbarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSystemStatus, setShowSystemStatus] = useState(false);

  const menuItems = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ai_workspace', label: 'AI Copilot', icon: Bot, badge: 'Agent' },
    { id: 'workspace', label: 'Tasks Board', icon: Layout },
    { id: 'blockchain', label: 'Soroban Suite', icon: ShieldAlert },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const activeItem = menuItems.find(item => item.id === activeTab) || menuItems[0];
  const ActiveIcon = activeItem.icon;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center select-none font-sans">
      {/* Notch Outer Boundary */}
      <motion.div 
        layout
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => {
          setIsExpanded(false);
          setShowSystemStatus(false);
        }}
        onClick={() => setIsExpanded(!isExpanded)}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        className="bg-neutral-950/90 hover:bg-black/95 backdrop-blur-xl border border-neutral-800/80 hover:border-neutral-700/80 shadow-2xl rounded-[28px] overflow-hidden flex flex-col"
        style={{
          width: isExpanded ? (showSystemStatus ? '540px' : '620px') : '240px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 15px rgba(255, 255, 255, 0.03)',
        }}
      >
        {/* Notch Content */}
        <div className="px-4 py-2.5 flex items-center justify-between h-[48px] w-full">
          {/* Left Element: Brand Logo or Status indicator */}
          <div className="flex items-center space-x-2 shrink-0">
            <img 
              src="/src/assets/images/flowpilot_logo_1784285238524.jpg" 
              alt="FlowPilot Logo" 
              className="w-5.5 h-5.5 rounded-lg object-cover border border-neutral-850"
              referrerPolicy="no-referrer"
            />
            {!isExpanded && (
              <span className="text-[10px] font-mono font-bold tracking-wider text-neutral-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/10 uppercase">
                {user.tier}
              </span>
            )}
          </div>

          {/* Center Element: Toggle view or Active indicator */}
          <div className="flex-1 flex justify-center items-center px-2 overflow-hidden">
            <AnimatePresence mode="wait">
              {!isExpanded ? (
                <motion.div 
                  key="collapsed"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center space-x-2 text-slate-200 cursor-pointer"
                >
                  <ActiveIcon className="w-4 h-4 text-white" />
                  <span className="text-xs font-bold font-display tracking-tight whitespace-nowrap">
                    {activeItem.label}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                </motion.div>
              ) : (
                <motion.div 
                  key="expanded-tabs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-between w-full"
                >
                  <div className="flex items-center space-x-1.5">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTab(item.id);
                          }}
                          className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                            isActive 
                              ? 'bg-white text-black' 
                              : 'text-neutral-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline text-[11px]">{item.label}</span>
                          {item.badge && !isActive && (
                            <span className="text-[8px] bg-neutral-800 text-white px-1 py-0.2 rounded-full border border-neutral-700">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Settings quick info button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSystemStatus(!showSystemStatus);
                    }}
                    className={`p-1.5 rounded-full border ${
                      showSystemStatus 
                        ? 'bg-white/20 border-white/30 text-white' 
                        : 'border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900 text-neutral-400 hover:text-white'
                    } transition-all`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Element: System heartbeat / connection status */}
          <div className="flex items-center space-x-2 shrink-0">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            {!isExpanded && (
              <span className="text-[10px] font-mono text-neutral-500 font-medium tracking-tight">
                99ms
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Island System Expansion Sub-Panel */}
        <AnimatePresence>
          {isExpanded && showSystemStatus && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-neutral-900 bg-black/95 px-5 py-4 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Profile Overview */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-9 h-9 rounded-full object-cover border border-neutral-800"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-white via-slate-200 to-slate-400 flex items-center justify-center text-black font-extrabold text-sm shadow">
                      {user.name.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                      <span>{user.name}</span>
                      {user.username && (
                        <span className="text-[9px] font-mono text-neutral-500">@{user.username}</span>
                      )}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400 block">{user.email}</span>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-white bg-white/10 px-2 py-0.5 rounded border border-white/20 font-semibold uppercase tracking-wider">
                  {user.tier} Tier
                </span>
              </div>

              {/* Wallet and Chain Status */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded-xl bg-neutral-900/50 border border-neutral-850/80 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-neutral-500 block">SOROBAN WALLET</span>
                  <div className="mt-1">
                    {walletConnected ? (
                      <span className="text-[10px] font-mono text-white block truncate">
                        {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
                      </span>
                    ) : (
                      <button
                        onClick={onConnectWallet}
                        className="text-[10px] font-semibold text-slate-300 hover:text-white flex items-center gap-1 mt-0.5"
                      >
                        <Wallet className="w-3 h-3" /> Connect Wallet
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-900/50 border border-neutral-850/80 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-neutral-500 block">WORKSPACE NODES</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-slate-300">Soroban-RPC @ Online</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex justify-between items-center pt-2 border-t border-neutral-900">
                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setShowSystemStatus(false);
                    setIsExpanded(false);
                  }}
                  className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1"
                >
                  <Settings className="w-3.5 h-3.5" /> Workspace Configs
                </button>
                <button
                  onClick={onLogout}
                  className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" /> Log Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
