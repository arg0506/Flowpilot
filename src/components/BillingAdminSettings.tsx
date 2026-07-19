import React, { useState } from 'react';
import { 
  CreditCard, Check, Settings, ShieldAlert, Sparkles, 
  Trash2, Plus, ArrowRight, ToggleLeft, ToggleRight, Database, Code,
  User, Mail, Camera
} from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile, TeamMember, ActivityLog } from '../types';

interface BillingAdminSettingsProps {
  activeSection: 'billing' | 'admin' | 'settings';
  user: UserProfile;
  onUpgradeTier: (tier: 'free' | 'growth' | 'enterprise') => void;
  onUpdateUser?: (updated: Partial<UserProfile>) => void;
}

export default function BillingAdminSettings({ 
  activeSection, 
  user, 
  onUpgradeTier,
  onUpdateUser 
}: BillingAdminSettingsProps) {
  
  // 1. Billing Panel States
  const [invoices, setInvoices] = useState([
    { id: 'FP-9812-A', date: 'Jul 1, 2026', amount: '$10.00', status: 'paid' },
    { id: 'FP-8723-B', date: 'Jun 1, 2026', amount: '$10.00', status: 'paid' },
    { id: 'FP-7612-C', date: 'May 1, 2026', amount: '$10.00', status: 'paid' },
  ]);

  // 2. Admin Panel States
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', name: 'Argha Dev', email: 'argha0506@gmail.com', role: 'Admin', avatar: 'A', status: 'active' },
    { id: '2', name: 'Dave Simpson', email: 'dave@flowpilot.ai', role: 'Member', avatar: 'D', status: 'idle' },
    { id: '3', name: 'Alice Smart', email: 'alice@flowpilot.ai', role: 'Member', avatar: 'A', status: 'active' },
  ]);
  const [featureFlags, setFeatureFlags] = useState({
    enableSorobanMainnet: false,
    enableExperimentalLLM: true,
    strictMemoryPruning: true,
  });

  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'Admin' | 'Member' | 'Viewer'>('Member');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) return;

    setTeamMembers(prev => [
      ...prev,
      {
        id: String(Date.now()),
        name: newMemberName,
        email: newMemberEmail,
        role: newMemberRole,
        avatar: newMemberName.slice(0,1).toUpperCase(),
        status: 'active'
      }
    ]);
    setNewMemberName('');
    setNewMemberEmail('');
  };

  const handleDeleteMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  };

  // 3. Settings States
  const [orgName, setOrgName] = useState('Argha Labs');
  const [authToken, setAuthToken] = useState('fp_live_token_7a6d8923bc114fe83f');

  // 4. User Profile States
  const [profileName, setProfileName] = useState(user.name);
  const [profileUsername, setProfileUsername] = useState(user.username || '');
  const [profileEmail, setProfileEmail] = useState(user.email);
  const [profileAvatar, setProfileAvatar] = useState(user.avatar || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  React.useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileUsername(user.username || '');
      setProfileEmail(user.email);
      setProfileAvatar(user.avatar || '');
    }
  }, [user]);

  React.useEffect(() => {
    if (user && user.organization) {
      setOrgName(user.organization);
    }
  }, [user.organization]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="p-6 overflow-y-auto h-full max-w-7xl mx-auto selection:bg-white selection:text-black font-sans"
    >
      
      {/* 1. BILLING & SUBSCRIPTIONS */}
      {activeSection === 'billing' && (
        <div className="space-y-8">
          <div>
            <h1 className="font-display font-bold text-2xl text-white font-sans">Billing & Subscription</h1>
            <p className="text-xs text-slate-400">Manage payment structures, monthly invoices, and license scopes.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Plan Status */}
            <div className="lg:col-span-2 p-6 rounded-xl border border-neutral-850 bg-neutral-900/10 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 blur-2xl" />
              
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">ACTIVE SUBSCRIPTION</span>
                  <h3 className="text-xl font-bold text-slate-100 capitalize">
                    {user.tier === 'growth' ? 'Pro Web3 Agent' : user.tier === 'enterprise' ? 'Enterprise Agent Suite' : 'Developer Sandbox'} Tier
                  </h3>
                </div>
                <span className="text-[10px] font-mono bg-white/5 border border-white/10 text-slate-300 px-2.5 py-1 rounded font-bold uppercase">
                  ACTIVE Auto-renew
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                Your Web3 Agent license grants autonomous server-side executions, on-chain contract deployments, verified task milestones, and real-time Stellar Horizon live audits.
              </p>

              {user.tier !== 'enterprise' && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { onUpgradeTier('enterprise'); alert("Upgraded successfully! Welcome to the FlowPilot Enterprise Agent Suite."); }}
                    className="px-4 py-2 rounded-lg bg-white hover:bg-slate-200 text-black text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
                  >
                    <span>Upgrade to Enterprise Agent Suite ($25/mo)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Payment Summary */}
            <div className="p-6 rounded-xl border border-neutral-850 bg-neutral-900/10 space-y-4">
              <h3 className="font-display font-semibold text-sm text-slate-100">Payment Details</h3>
              <div className="p-4 bg-black rounded-lg border border-neutral-850 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Provider:</span>
                  <span className="text-slate-200 font-medium">Stripe Dashboard</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Card ending:</span>
                  <span className="text-slate-200 font-mono">•••• 4242</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Next charge date:</span>
                  <span className="text-slate-200">Aug 1, 2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* Invoices List */}
          <div className="p-6 rounded-xl border border-neutral-850 bg-neutral-900/10 space-y-4">
            <h3 className="font-display font-semibold text-sm text-slate-100">Receipts & Invoices History</h3>
            <div className="space-y-2.5">
              {invoices.map((inv, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-neutral-950 border border-neutral-850 text-xs font-mono">
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400">{inv.id}</span>
                    <span className="text-slate-500">{inv.date}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-200 font-bold">{inv.amount}</span>
                    <span className="text-slate-300 font-bold uppercase text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. ADMIN PANEL */}
      {activeSection === 'admin' && (
        <div className="space-y-8">
          <div>
            <h1 className="font-display font-bold text-2xl text-white">Admin Management Terminal</h1>
            <p className="text-xs text-slate-400">Provision development seats, toggle system parameters, and monitor node loads.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Team Members List */}
            <div className="lg:col-span-2 p-6 rounded-xl border border-neutral-850 bg-neutral-900/10 space-y-5">
              <h3 className="font-display font-semibold text-sm text-slate-100">Workspace User Directory</h3>
              
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex justify-between items-center p-3 rounded-lg bg-neutral-950 border border-neutral-850">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center font-bold text-xs text-white">
                        {member.avatar}
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-xs font-semibold text-slate-100">{member.name}</span>
                        <span className="block text-[10px] font-mono text-slate-400">{member.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-mono uppercase bg-black border border-neutral-850 px-2 py-0.5 rounded text-slate-300">
                        {member.role}
                      </span>
                      {member.role !== 'Admin' && (
                        <button
                          onClick={() => handleDeleteMember(member.id)}
                          className="text-slate-500 hover:text-rose-400 transition-colors"
                          title="Revoke member seats"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New User */}
              <form onSubmit={handleAddMember} className="pt-4 border-t border-neutral-850/40 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Seat name..."
                  className="px-3 py-2 rounded bg-black border border-neutral-800 text-xs text-slate-100 focus:outline-none"
                />
                <input
                  type="email"
                  required
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="Registered email..."
                  className="px-3 py-2 rounded bg-black border border-neutral-800 text-xs text-slate-100 focus:outline-none"
                />
                <button
                  type="submit"
                  className="py-2 rounded bg-white hover:bg-slate-200 text-black font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Invite Seat
                </button>
              </form>
            </div>

            {/* Feature Flags / Toggle Parameters */}
            <div className="p-6 rounded-xl border border-neutral-850 bg-neutral-900/10 space-y-4">
              <h3 className="font-display font-semibold text-sm text-slate-100">Live Feature Flags</h3>
              
              <div className="space-y-4 pt-1">
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-slate-200 block">Soroban Mainnet Router</span>
                    <span className="text-[10px] text-slate-500 block">Enforces mainnet ledger rules</span>
                  </div>
                  <button 
                    onClick={() => setFeatureFlags(prev => ({ ...prev, enableSorobanMainnet: !prev.enableSorobanMainnet }))}
                    className="text-slate-400 hover:text-white"
                  >
                    {featureFlags.enableSorobanMainnet ? <ToggleRight className="w-8 h-8 text-white" /> : <ToggleLeft className="w-8 h-8 text-neutral-800" />}
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-slate-200 block">Experimental LLM Templates</span>
                    <span className="text-[10px] text-slate-500 block">Routes requests through paid models</span>
                  </div>
                  <button 
                    onClick={() => setFeatureFlags(prev => ({ ...prev, enableExperimentalLLM: !prev.enableExperimentalLLM }))}
                    className="text-slate-400 hover:text-white"
                  >
                    {featureFlags.enableExperimentalLLM ? <ToggleRight className="w-8 h-8 text-white" /> : <ToggleLeft className="w-8 h-8 text-neutral-800" />}
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-slate-200 block">Strict Memory Pruning</span>
                    <span className="text-[10px] text-slate-500 block">Flushes inactive local buffers</span>
                  </div>
                  <button 
                    onClick={() => setFeatureFlags(prev => ({ ...prev, strictMemoryPruning: !prev.strictMemoryPruning }))}
                    className="text-slate-400 hover:text-white"
                  >
                    {featureFlags.strictMemoryPruning ? <ToggleRight className="w-8 h-8 text-white" /> : <ToggleLeft className="w-8 h-8 text-neutral-800" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SETTINGS & PROFILE */}
      {activeSection === 'settings' && (
        <div className="space-y-8">
          <div>
            <h1 className="font-display font-bold text-2xl text-white">Workspace & Profile Configuration</h1>
            <p className="text-xs text-slate-400">Modify your personal details, select a profile photo, and configure organization parameters.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT COLUMN: Profile and Org Edit Form */}
            <div className="lg:col-span-2 p-6 rounded-xl border border-neutral-850 bg-neutral-900/10 space-y-6">
              <h3 className="font-display font-semibold text-sm text-slate-100 flex items-center gap-2">
                <Settings className="w-4 h-4" /> Personal Profile Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 block flex items-center gap-1.5">
                    <User className="w-3 h-3 text-slate-500" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full px-3 py-2 rounded bg-black border border-neutral-800 text-xs text-slate-100 focus:outline-none focus:border-white font-sans transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 block flex items-center gap-1.5">
                    <span>@</span> Username
                  </label>
                  <input
                    type="text"
                    required
                    value={profileUsername}
                    onChange={(e) => setProfileUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    placeholder="e.g. arghadev"
                    className="w-full px-3 py-2 rounded bg-black border border-neutral-800 text-xs text-slate-100 focus:outline-none focus:border-white font-mono transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 block flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-slate-500" /> Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    placeholder="e.g. argha0506@gmail.com"
                    className="w-full px-3 py-2 rounded bg-black border border-neutral-800 text-xs text-slate-100 focus:outline-none focus:border-white font-sans transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 block">Workspace Organization Title</label>
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. Argha Labs"
                    className="w-full px-3 py-2 rounded bg-black border border-neutral-800 text-xs text-slate-100 focus:outline-none focus:border-white font-sans transition-colors"
                  />
                </div>
              </div>

              {/* Avatar Selector Section */}
              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-mono uppercase text-slate-400 block flex items-center gap-1.5">
                  <Camera className="w-3 h-3 text-slate-500" /> Choose Profile Avatar / Photo
                </label>
                
                <div className="grid grid-cols-6 gap-2 max-w-md">
                  {[
                    { id: 'av_1', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80', label: 'Neon Hacker' },
                    { id: 'av_2', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80', label: 'Tech Expert' },
                    { id: 'av_3', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80', label: 'Architect' },
                    { id: 'av_4', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80', label: 'Stellar Trader' },
                    { id: 'av_5', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80', label: 'Cosmic Dev' },
                    { id: 'av_6', url: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=150&h=150&q=80', label: 'Robo Core' },
                  ].map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setProfileAvatar(av.url)}
                      className={`relative aspect-square rounded-full overflow-hidden border-2 transition-all ${
                        profileAvatar === av.url 
                          ? 'border-white scale-110 shadow-lg shadow-white/15' 
                          : 'border-neutral-850 hover:border-neutral-700 opacity-70 hover:opacity-100'
                      }`}
                      title={av.label}
                    >
                      <img src={av.url} alt={av.label} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      {profileAvatar === av.url && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white font-extrabold" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-neutral-500 block">Or supply a custom image link URL:</span>
                  <input
                    type="url"
                    value={profileAvatar}
                    onChange={(e) => setProfileAvatar(e.target.value)}
                    placeholder="https://example.com/my-photo.jpg"
                    className="w-full px-3 py-1.5 rounded bg-black border border-neutral-800 text-[11px] font-mono text-slate-300 focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              {/* MFA Security Token info (retaining the read-only input from earlier configuration) */}
              <div className="pt-2 border-t border-neutral-850/40 space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400 block">MFA Verification Key (Live Token)</label>
                <input
                  type="text"
                  readOnly
                  value={authToken}
                  className="w-full max-w-md px-3 py-2 rounded bg-black border border-neutral-850 text-xs text-slate-400 font-mono focus:outline-none select-all cursor-default"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (onUpdateUser) {
                      onUpdateUser({
                        name: profileName,
                        username: profileUsername,
                        email: profileEmail,
                        organization: orgName,
                        avatar: profileAvatar
                      });
                      setSaveSuccess(true);
                      setTimeout(() => setSaveSuccess(false), 3000);
                    }
                  }}
                  className="px-5 py-2.5 rounded bg-white hover:bg-slate-200 text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Save Profile Changes</span>
                </button>

                {saveSuccess && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs text-emerald-400 font-mono flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Profile committed successfully!
                  </motion.span>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive ID Preview Card & Security Profile */}
            <div className="space-y-6">
              
              {/* INTERACTIVE PROFILE PASS */}
              <div className="relative p-6 rounded-2xl border border-neutral-800 bg-gradient-to-b from-neutral-900 to-black overflow-hidden space-y-6 shadow-xl shadow-black/40">
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/2 blur-2xl" />
                
                {/* Card Header */}
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono tracking-wider text-neutral-500 uppercase">FLOWPILOT NODE PASS</span>
                    <h4 className="text-sm font-bold text-slate-100 font-sans tracking-tight">IDENTITY CREDENTIAL</h4>
                  </div>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>ACTIVE</span>
                  </span>
                </div>

                {/* Card Center: Avatar and Main Details */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-white/40 to-white/0 opacity-70 blur" />
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border border-neutral-700 bg-neutral-900 flex items-center justify-center">
                      {profileAvatar ? (
                        <img 
                          src={profileAvatar} 
                          alt={profileName} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-white via-slate-300 to-slate-500 flex items-center justify-center text-black font-extrabold text-xl">
                          {profileName ? profileName.slice(0, 1).toUpperCase() : 'A'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-sans font-bold text-base text-white tracking-tight">{profileName || "Anonymous Node"}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-neutral-400">@{profileUsername || "noname"}</span>
                      <span className="text-[9px] font-mono bg-white/10 text-white px-1.5 py-0.2 rounded capitalize">
                        {user.tier}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono block">{profileEmail || "no-email@flowpilot.ai"}</span>
                  </div>
                </div>

                {/* Card Footer: Metadata info */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-850/50 text-[10px] font-mono">
                  <div className="space-y-1">
                    <span className="text-slate-500 uppercase block text-[8px]">Organization</span>
                    <span className="text-slate-200 block truncate font-sans font-medium">{orgName || "Independent"}</span>
                  </div>
                  <div className="space-y-1 text-right">
                    <span className="text-slate-500 uppercase block text-[8px]">Client ID</span>
                    <span className="text-slate-400 block truncate">{user.id}</span>
                  </div>
                </div>
              </div>

              {/* SECURITY PROTOCOL BOX */}
              <div className="p-6 rounded-xl border border-neutral-850 bg-neutral-900/10 space-y-4">
                <h3 className="font-display font-semibold text-sm text-slate-100 flex items-center gap-2 font-sans">
                  <Database className="w-4 h-4 text-white" /> Platform Security Protocol
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  FlowPilot AI utilizes fully server-side orchestration loops. No private keys, seed phrases, or Gemini client API secrets are parsed directly within your local client bundles.
                </p>
                <div className="p-3.5 rounded bg-black border border-neutral-850 text-[10px] font-mono text-slate-500 leading-relaxed space-y-1.5">
                  <span className="text-slate-300 block font-bold uppercase">ENV COMPLIANCE CHECKS:</span>
                  <span className="block text-slate-400">&bull; GEMINI_API_KEY: Deployed & Injected</span>
                  <span className="block text-slate-400">&bull; SOROBAN_RPC_GATEWAY: Localhost cluster</span>
                  <span className="block text-slate-400">&bull; DEVELOPMENT_MODE: fullstack (Express + Vite)</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
    </motion.div>
  );
}
