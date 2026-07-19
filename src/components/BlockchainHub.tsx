import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Wallet, RefreshCw, Layers, CheckCircle, 
  Sparkles, Terminal, Cpu, Clock, Code, Play, ArrowRight 
} from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { BlockchainTx, Task } from '../types';

interface BlockchainHubProps {
  walletConnected: boolean;
  walletAddress?: string;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  onAddTx: (tx: BlockchainTx) => void;
  transactions: BlockchainTx[];
  tasks: Task[];
  onVerifyOnChain: (taskId: string, txHash: string) => void;
}

export default function BlockchainHub({ 
  walletConnected, walletAddress, onConnectWallet, onDisconnectWallet, 
  onAddTx, transactions, tasks, onVerifyOnChain 
}: BlockchainHubProps) {
  
  const [loading, setLoading] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [deployLoading, setDeployLoading] = useState(false);
  const [deployHash, setDeployHash] = useState('');

  // Real Web3 Live Task Auditor state
  const [auditAddress, setAuditAddress] = useState('GBH656J3KRE6B7I5B6RNS76SFT85K8EFSY62X69CSX997C89F829F8S9');
  const [auditNetwork, setAuditNetwork] = useState<'testnet' | 'mainnet'>('testnet');
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<{
    success: boolean;
    publicKey: string;
    network: string;
    found: boolean;
    balances: Array<{ asset: string; issuer: string; balance: string }>;
    sequence: string | null;
    auditReport: string;
  } | null>(null);

  // Auto-fill audit address with connected wallet key if available
  useEffect(() => {
    if (walletConnected && walletAddress) {
      setAuditAddress(walletAddress);
    }
  }, [walletConnected, walletAddress]);

  const handleLiveAudit = async () => {
    if (!auditAddress.trim()) {
      alert("Please enter a valid Stellar public key address.");
      return;
    }
    setAuditLoading(true);
    try {
      const response = await fetch('/api/blockchain/analyze-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicKey: auditAddress.trim(),
          network: auditNetwork
        })
      });
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const data = await response.json();
      setAuditResult(data);
    } catch (err: any) {
      alert(`Live Audit Error: ${err.message || 'Transient network failure.'}`);
    } finally {
      setAuditLoading(false);
    }
  };

  const [contractCode, setContractCode] = useState(`// Rust Soroban smart contract skeleton
#![no_std]
use soroban_sdk::{contract, contractimpl, Env, Symbol, Address, BytesN};

#[contract]
pub struct VerificationTracker;

#[contractimpl]
impl VerificationTracker {
    pub fn commit_audit(env: Env, hash: BytesN<32>, signer: Address) {
        signer.require_auth();
        env.events().publish((Symbol::new("audit_commit"), hash), signer);
    }
}`);

  const handleConnect = () => {
    onConnectWallet();
  };

  const handleDeployContract = () => {
    setDeployLoading(true);
    setTimeout(() => {
      setDeployLoading(false);
      const randomHex = [...Array(16)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
      setDeployHash(`C${randomHex.toUpperCase()}`);
      alert("Soroban contract deployed successfully! Address generated and saved to session log.");
    }, 1500);
  };

  // Sign and submit transaction
  const handleSubmitTx = async () => {
    if (!walletConnected) {
      alert("Please connect your simulated Freighter Wallet before committing ledger actions.");
      return;
    }
    if (!selectedTaskId) {
      alert("Please select a task to verify on-chain.");
      return;
    }

    const task = tasks.find(t => t.id === selectedTaskId);
    if (!task) return;

    setLoading(true);
    try {
      const response = await fetch('/api/blockchain/verify-tx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'VERIFY_TASK_MILESTONE',
          payload: { taskId: task.id, title: task.title, status: task.status },
          walletAddress
        }),
      });

      const data = await response.json();
      onAddTx({
        hash: data.hash,
        action: data.action,
        payload: data.payload,
        timestamp: data.timestamp,
        status: 'confirmed',
        contractAddress: data.contractAddress,
        sequenceNumber: data.sequenceNumber,
      });

      // Mark task as verified
      onVerifyOnChain(task.id, data.hash);
      alert(`Ledger transaction confirmed in block #${data.stellarLedger}! Gas spent: ${data.gasUsed} CPU instructions.`);
    } catch (err: any) {
      alert("Failed to submit Soroban transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="p-6 overflow-y-auto h-full max-w-7xl mx-auto selection:bg-white selection:text-black font-sans"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Soroban Smart Contract Suite</h1>
          <p className="text-xs text-slate-400">Cryptographically audit team sprint merges, deployments, and task sign-offs on Stellar.</p>
        </div>

        {/* Wallet Connection Trigger */}
        {walletConnected ? (
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2.5 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-slate-300 animate-pulse" />
            <span className="text-xs font-mono text-slate-300 truncate max-w-[150px]">{walletAddress}</span>
            <button 
              onClick={onDisconnectWallet}
              className="text-[10px] text-slate-400 hover:text-white hover:underline focus:outline-none font-mono"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={handleConnect}
            className="px-4 py-2.5 rounded-lg bg-white hover:bg-slate-200 text-black font-bold text-xs flex items-center gap-2 transition-transform hover:scale-[1.01] shadow shadow-white/5"
          >
            <Wallet className="w-4 h-4" />
            <span>Connect Freighter Wallet</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Smart Contract Code compiler */}
        <div className="lg:col-span-2 p-6 rounded-xl border border-neutral-850 bg-neutral-900/10 space-y-4">
          <div className="flex justify-between items-center border-b border-neutral-850 pb-3">
            <h3 className="font-display font-semibold text-sm text-slate-100 flex items-center gap-2">
              <Code className="w-4 h-4 text-white" /> Rust Contract Editor
            </h3>
            {deployHash ? (
              <span className="text-[10px] font-mono bg-white/5 border border-white/10 text-slate-300 px-2 py-0.5 rounded uppercase">
                Active: {deployHash.slice(0, 8)}...
              </span>
            ) : (
              <button
                onClick={handleDeployContract}
                disabled={deployLoading}
                className="px-3 py-1 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded font-mono text-[10px] uppercase font-bold flex items-center gap-1.5 transition-colors"
              >
                {deployLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
                <span>Compile & Deploy WASM</span>
              </button>
            )}
          </div>

          <textarea
            value={contractCode}
            onChange={(e) => setContractCode(e.target.value)}
            rows={10}
            className="w-full p-4 rounded bg-black border border-neutral-800 text-xs text-slate-300 font-mono focus:outline-none focus:border-white leading-relaxed"
          />

          <div className="flex justify-between text-[11px] font-mono text-slate-500">
            <span>Compiler: rustc 1.78-wasm32-unknown-unknown</span>
            <span>WASM size: ~12.4 KB</span>
          </div>
        </div>

        {/* Ledger actions launcher */}
        <div className="p-6 rounded-xl border border-neutral-850 bg-neutral-900/10 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-sm text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-white" /> Sign & Lock Ledger States
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verify an active board task. Signing cryptographically seals the task title and completion status on-chain.
            </p>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400">Select Task to Audit</label>
                <select
                  value={selectedTaskId}
                  onChange={(e) => setSelectedTaskId(e.target.value)}
                  className="w-full px-2 py-2 rounded bg-black border border-neutral-800 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="">-- Choose Task --</option>
                  {tasks.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.status})
                    </option>
                  ))}
                </select>
              </div>

              {selectedTaskId && (
                <div className="p-3.5 rounded bg-black border border-neutral-850 space-y-1 text-xs">
                  <span className="text-slate-400 font-mono text-[10px] block uppercase">Ledger Payload Preview:</span>
                  <div className="text-[11px] font-mono text-slate-300 truncate">
                    {JSON.stringify({ taskId: selectedTaskId, action: 'VERIFY_MILESTONE' })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleSubmitTx}
            disabled={loading || !walletConnected || !selectedTaskId}
            className="w-full py-3 rounded-lg bg-white hover:bg-slate-200 disabled:bg-neutral-900 disabled:text-slate-500 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors mt-6"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Signing Transaction...</span>
              </>
            ) : (
              <>
                <span>Sign & submit to Soroban</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Real Web3 Agent Tools & Ledger History Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left column: Live Stellar Horizon Audit Agent */}
        <div className="p-6 rounded-xl border border-neutral-850 bg-neutral-900/10 space-y-4">
          <div className="flex justify-between items-center border-b border-neutral-850 pb-3">
            <h3 className="font-display font-semibold text-sm text-slate-100 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-white animate-pulse" /> Autonomous Web3 Agent: Horizon Live Scan
            </h3>
            <div className="flex gap-1">
              <button
                onClick={() => setAuditNetwork('testnet')}
                className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold transition-all uppercase ${auditNetwork === 'testnet' ? 'bg-white text-black' : 'bg-white/5 text-slate-400 border border-white/5 hover:text-white'}`}
              >
                Testnet
              </button>
              <button
                onClick={() => setAuditNetwork('mainnet')}
                className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold transition-all uppercase ${auditNetwork === 'mainnet' ? 'bg-white text-black' : 'bg-white/5 text-slate-400 border border-white/5 hover:text-white'}`}
              >
                Mainnet
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Deploy your autonomous AI agent to query and inspect active on-chain public addresses. This tool queries public Stellar Horizon API gateways in real-time, fetching live asset ledger metrics.
          </p>

          <div className="space-y-3 pt-1">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-slate-500">Stellar Public Key Address (G...)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={auditAddress}
                  onChange={(e) => setAuditAddress(e.target.value)}
                  placeholder="e.g. GCS676NRYCD88Y5A367SF..."
                  className="flex-1 px-3 py-2 bg-black border border-neutral-800 rounded text-xs text-slate-200 font-mono focus:outline-none focus:border-white truncate"
                />
                <button
                  onClick={handleLiveAudit}
                  disabled={auditLoading}
                  className="px-4 bg-white hover:bg-slate-200 text-black rounded text-xs font-bold uppercase transition-colors flex items-center gap-1"
                >
                  {auditLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Scan</span>
                </button>
              </div>
            </div>

            {/* Audit Output results */}
            {auditLoading && (
              <div className="p-10 border border-dashed border-neutral-800 rounded bg-neutral-950/20 text-center space-y-2 animate-pulse">
                <RefreshCw className="w-5 h-5 text-slate-400 animate-spin mx-auto" />
                <p className="text-[11px] text-slate-400 font-mono">Agent analyzing live ledger states on Stellar {auditNetwork}...</p>
              </div>
            )}

            {!auditLoading && auditResult && (
              <div className="space-y-4 pt-1">
                {/* Micro KPIs */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-black border border-neutral-850 rounded">
                    <span className="text-[9px] font-mono uppercase text-slate-500 block">Ledger Status</span>
                    <span className={`text-xs font-bold font-mono ${auditResult.found ? 'text-green-400' : 'text-amber-400'}`}>
                      {auditResult.found ? 'Funded & Active' : 'Unfunded / New Address'}
                    </span>
                  </div>
                  <div className="p-3 bg-black border border-neutral-850 rounded">
                    <span className="text-[9px] font-mono uppercase text-slate-500 block">Horizon Seq</span>
                    <span className="text-xs font-bold font-mono text-slate-200">
                      {auditResult.sequence || 'Inactive'}
                    </span>
                  </div>
                </div>

                {auditResult.found && auditResult.balances.length > 0 && (
                  <div className="p-3 bg-black border border-neutral-850 rounded space-y-1.5">
                    <span className="text-[9px] font-mono uppercase text-slate-500 block">Verified Asset Balances</span>
                    <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                      {auditResult.balances.map((b, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs font-mono">
                          <span className="text-slate-400">{b.asset}</span>
                          <span className="text-slate-100 font-bold">{parseFloat(b.balance).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Markdown audit report */}
                <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-850 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block border-b border-neutral-850 pb-1.5">
                    AI Agent Security & Audit Assessment Report:
                  </span>
                  <div className="text-xs text-slate-300 leading-relaxed max-h-72 overflow-y-auto pr-1 markdown-body font-sans">
                    <ReactMarkdown>{auditResult.auditReport}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column: On-Chain Audit History logs */}
        <div className="p-6 rounded-xl border border-neutral-850 bg-neutral-900/10 space-y-4">
          <div className="flex justify-between items-center border-b border-neutral-850 pb-3">
            <h3 className="font-display font-semibold text-sm text-slate-100 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-white" /> Soroban On-Chain Audit History
            </h3>
            <span className="text-[10px] font-mono text-slate-500">{transactions.length} confirmed events</span>
          </div>

          {transactions.length > 0 ? (
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {transactions.map((tx, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-850 space-y-2.5 text-xs font-mono">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <span className="text-white font-bold text-[11px]">{tx.action}</span>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <span>Seq: #{tx.sequenceNumber}</span>
                      <span>&bull;</span>
                      <span>{new Date(tx.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 leading-relaxed bg-black p-2 rounded border border-neutral-850">
                    <span className="text-slate-600 font-bold text-[9px] uppercase block mb-1">Contract Invocation:</span>
                    <span className="break-all">{tx.payload}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between text-[10px] text-slate-500 gap-1 pt-1 border-t border-neutral-850/40">
                    <span className="truncate">Contract: {tx.contractAddress}</span>
                    <span className="text-slate-300 text-right select-all truncate max-w-[150px]">TX: {tx.hash}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 space-y-2 text-slate-500">
              <Terminal className="w-8 h-8 text-slate-700 mx-auto" />
              <p className="text-xs">No transactions currently confirmed on this session ledger.</p>
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
