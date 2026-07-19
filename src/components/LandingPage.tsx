import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, Shield, Zap, Sparkles, Database, ChevronDown, Check, 
  Layers, Lock, Play, Cpu, AlertCircle, HelpCircle, Users, Globe 
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  onEnterAuth: (mode: 'login' | 'signup') => void;
}

export default function LandingPage({ onEnterApp, onEnterAuth }: LandingPageProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const pricingTiers = [
    {
      name: 'Developer Sandbox',
      price: billingPeriod === 'monthly' ? '$0' : '$0',
      description: 'For testing and trial deployments.',
      features: [
        '50 AI Agent task runs / mo',
        '2 active Kanban workspace boards',
        'Basic Horizon API account queries',
        'Simulated Freighter wallet connections',
        'Standard Discord support'
      ],
      cta: 'Get Started Free',
      popular: false
    },
    {
      name: 'Pro Web3 Agent',
      price: billingPeriod === 'monthly' ? '$10' : '$8',
      periodSuffix: '/ mo',
      description: 'Full autonomous agent features for developers.',
      features: [
        'Unlimited Autonomous Web3 AI Agent execution',
        'Real-time Stellar/Soroban Horizon Live audits',
        'Automatic smart contract bug patching & security checks',
        'On-chain transaction automated signing simulations',
        'Priority 24/7 system node access'
      ],
      cta: 'Upgrade to Pro Agent',
      popular: true
    },
    {
      name: 'Enterprise Agent Suite',
      price: billingPeriod === 'monthly' ? '$25' : '$20',
      periodSuffix: '/ mo',
      description: 'Complete multi-agent coordination on-chain.',
      features: [
        'Everything in Pro Agent, plus dedicated relay nodes',
        'Autonomous multi-sig milestone sign-off contracts',
        'Enterprise-grade Stellar Mainnet deployment pipeline',
        'Custom fine-tuned security review LLMs',
        'SLA guaranteed execution & dedicated support'
      ],
      cta: 'Upgrade to Enterprise',
      popular: false
    }
  ];

  const faqs = [
    {
      question: 'What is FlowPilot AI and how does it automate workflows?',
      answer: 'FlowPilot AI is a modern SaaS platform designed to unify task boards, timeline roadmaps, and AI assistants. It integrates deep generative language capabilities (powered by Gemini) with secure cryptographic ledger states to generate actions, code, and project specifications in real time.'
    },
    {
      question: 'How do Soroban smart contracts fit into project coordination?',
      answer: 'We utilize Stellar’s Soroban smart contract framework to record critical authorization actions on-chain. This provides tamper-proof, multi-sig verifiable proof of milestone sign-offs, deploy criteria, or financial agreements directly linked to your sprint cycles.'
    },
    {
      question: 'Do I need a real Stellar wallet like Freighter to test this?',
      answer: 'No, FlowPilot AI provides a built-in interactive simulator for the Freighter wallet! You can connect, sign, and review detailed Stellar transaction logs and contract address invocations directly in the browser interface.'
    },
    {
      question: 'How are API keys managed securely?',
      answer: 'All Gemini API and third-party keys are handled entirely on our server side. Your credentials are never exposed to client-side bundles or browser inspector logs, conforming to strict security protocols.'
    }
  ];

  // 1. Mouse coordinate tracking hook for spotlight aura
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  // 1b. 3D Tilt state for hero dashboard teaser
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    setTilt({
      x: (yc - y) / 35,
      y: (x - xc) / 35
    });
  };

  const handleCardMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 2. Interactive Canvas Particle Connections system
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
    }> = [];

    // Scale particle count to screen size
    const pCount = Math.min(80, Math.floor((width * height) / 20000));

    for (let i = 0; i < pCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.8 + 0.8,
        alpha: Math.random() * 0.4 + 0.2
      });
    }

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    const animateParticles = () => {
      ctx.clearRect(0, 0, width, height);

      // Render custom subtle grid lines to reinforce technical SaaS aesthetic
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.012)';
      ctx.lineWidth = 1;
      const gridSize = 48;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce or wrap edge bounds
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Mouse gravity push attraction / repulsion
        const dx = mousePos.x - p.x;
        const dy = mousePos.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          // Gently guide away from user cursor
          p.x -= (dx / dist) * force * 1.2;
          p.y -= (dy / dist) * force * 1.2;
        }

        // Draw particle nodes
        ctx.fillStyle = idx % 2 === 0 
          ? `rgba(255, 255, 255, ${p.alpha * 0.9})` 
          : `rgba(163, 163, 163, ${p.alpha * 0.75})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect neighboring nodes inside proximity thresholds
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distance = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (distance < 110) {
            const alphaFactor = (110 - distance) / 110 * 0.15;
            ctx.strokeStyle = idx % 3 === 0 
              ? `rgba(255, 255, 255, ${alphaFactor})` 
              : `rgba(148, 163, 184, ${alphaFactor})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(animateParticles);
    };

    animateParticles();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mousePos.x, mousePos.y]);

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-white selection:text-black relative overflow-hidden">
      {/* Background canvas for interactive micro-particles system */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Modern Mouse spotlight glow filter overlay (Silver / Platinum theme) */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(750px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.08), rgba(148, 163, 184, 0.035), transparent 80%)`
        }}
      />
      {/* Aurora Ambient Background Orbs (Silver & White Chrome) */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-white/5 blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-slate-400/5 blur-[100px] pointer-events-none animate-pulse-slow" />
      
      {/* Floating iPhone Notch Shaped Navigation system */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex justify-center w-full max-w-[95vw] px-4">
        <motion.header
          layout
          onMouseEnter={() => setIsNavExpanded(true)}
          onMouseLeave={() => setIsNavExpanded(false)}
          onClick={() => setIsNavExpanded(!isNavExpanded)}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className="bg-neutral-950/90 hover:bg-black/95 backdrop-blur-xl border border-neutral-800/80 hover:border-neutral-700/80 shadow-2xl rounded-[28px] overflow-hidden flex items-center justify-between h-[52px] select-none"
          style={{
            width: isNavExpanded ? '680px' : '260px',
            maxWidth: '100%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 15px rgba(255, 255, 255, 0.03)',
          }}
        >
          {/* Logo Section */}
          <div className="flex items-center space-x-2 px-4 shrink-0 cursor-pointer" onClick={(e) => { e.stopPropagation(); onEnterApp(); }}>
            <img 
              src="/src/assets/images/flowpilot_logo_1784285238524.jpg" 
              alt="FlowPilot Logo" 
              className="w-6 h-6 rounded-lg object-cover border border-neutral-800"
              referrerPolicy="no-referrer"
            />
            {isNavExpanded && (
              <motion.span 
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-display font-bold text-sm tracking-tight text-white"
              >
                FlowPilot <span className="text-[9px] font-mono text-neutral-400 bg-white/5 border border-white/10 px-1 py-0.2 rounded align-middle ml-1">AI</span>
              </motion.span>
            )}
          </div>

          {/* Navigation Links - Centered inside notch when expanded */}
          <div className="flex-1 flex justify-center items-center px-2 overflow-hidden">
            {isNavExpanded ? (
              <motion.nav 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="flex items-center space-x-6 text-[10px] font-bold uppercase tracking-wider text-neutral-400"
              >
                <a href="#features" className="hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>Features</a>
                <a href="#soroban" className="hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>Soroban</a>
                <a href="#pricing" className="hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>Pricing</a>
                <a href="#faq" className="hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>FAQ</a>
              </motion.nav>
            ) : (
              <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase animate-pulse">
                EXPLORE FLOW
              </span>
            )}
          </div>

          {/* CTA Actions Section */}
          <div className="flex items-center space-x-2 px-3 shrink-0">
            {isNavExpanded ? (
              <motion.div 
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2"
              >
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEnterAuth('login');
                  }}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors font-semibold"
                >
                  Log In
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEnterApp();
                  }}
                  className="px-4 py-1.5 rounded-full bg-white hover:bg-slate-200 text-black font-bold text-[11px] transition-all duration-300 shadow flex items-center space-x-1"
                >
                  <span>Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ) : (
              <div className="flex items-center space-x-1 text-slate-500 font-mono text-[10px] tracking-tight">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span>Active</span>
              </div>
            )}
          </div>
        </motion.header>
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto text-center">
        {/* Floating Geometric Elements (Silver Chrome Theme) */}
        <motion.div
          className="absolute top-12 left-6 w-14 h-14 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm pointer-events-none hidden md:block"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-16 right-8 w-18 h-18 rounded-full border border-slate-400/10 bg-slate-400/5 backdrop-blur-sm pointer-events-none hidden md:block"
          animate={{
            y: [0, 25, 0],
            rotate: [360, 180, 0],
            scale: [1, 0.95, 1]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-[12%] w-10 h-10 rounded-lg border border-slate-300/10 bg-slate-300/5 backdrop-blur-sm pointer-events-none hidden lg:block"
          animate={{
            x: [0, 15, 0],
            y: [0, -15, 0],
            rotate: [0, 90, 180],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/15 text-slate-200 text-xs font-mono mb-2">
            <Zap className="w-3.5 h-3.5 text-slate-300 animate-pulse" />
            <span>Series A Launch Proposal: Platinum Black & Silver Edition</span>
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.05] max-w-5xl mx-auto text-white">
            Automate Workflows with <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">AI Copilot</span> and Soroban Smart Contracts
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            Unify tasks, roadmap boards, automated workflow agents, and cryptographically signed audit logs on Stellar Soroban's lightning-fast ledger.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
            <button 
              onClick={onEnterApp}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-white to-slate-200 text-black font-bold text-base transition-transform hover:scale-[1.03] shadow-xl shadow-white/5 flex items-center justify-center space-x-2"
            >
              <span>Launch Live Console</span>
              <Play className="w-4.5 h-4.5 fill-current" />
            </button>
            <button 
              onClick={() => onEnterAuth('signup')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-black border border-slate-800 hover:bg-neutral-900 text-slate-200 font-semibold text-base transition-colors flex items-center justify-center space-x-2"
            >
              <span>Sign Up Free</span>
              <ArrowRight className="w-4.5 h-4.5 text-slate-400" />
            </button>
          </div>
        </motion.div>

        {/* Dynamic Interactive Animated Hero Visualizer (Interactive Chrome 3D Dashboard Mockup) */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
          style={{
            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.005)`,
            transition: 'transform 0.1s ease-out',
            transformStyle: 'preserve-3d',
          }}
          className="mt-16 relative rounded-2xl border border-neutral-800/80 bg-neutral-950 p-2 shadow-2xl overflow-hidden shadow-white/5 max-w-5xl mx-auto cursor-pointer glow-silver"
        >
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-slate-300 to-transparent animate-pulse" />
          <div className="rounded-xl overflow-hidden bg-neutral-950 border border-neutral-900 p-6 text-left relative">
            
            {/* Interactive animated background grid simulation overlay inside card */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] opacity-60 pointer-events-none" />

            <div className="flex items-center justify-between border-b border-neutral-900 pb-4 mb-4 relative z-10">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-slate-800 animate-pulse" />
                <span className="w-3 h-3 rounded-full bg-slate-600" />
                <span className="w-3 h-3 rounded-full bg-white" />
                <span className="text-xs font-mono text-slate-500 ml-2">flowpilot_console_v1.0.2</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 border border-white/10 text-slate-200 px-2.5 py-1 rounded text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping mr-1" />
                <span>Simulated Freighter: Connected (GCX4...A98F)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              <div className="space-y-4 p-4 rounded-lg bg-neutral-900/50 border border-neutral-800/80">
                <h4 className="font-mono text-xs text-slate-400 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-slate-300" /> ACTIVE WORKFLOW ROBOT
                </h4>
                <div className="p-3 bg-neutral-950 rounded border border-neutral-800 space-y-2">
                  <div className="font-semibold text-sm text-white">Deploy Web3 API Gateway</div>
                  <div className="text-xs text-slate-400 mt-1">Configuring Soroban endpoint clusters and auto-generating Rust interfaces.</div>
                  <div className="mt-3 flex justify-between items-center text-xs font-mono text-white">
                    <span>Status: Running</span>
                    <span>Step 2 of 4</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-4 rounded-lg bg-neutral-900/50 border border-neutral-800/80">
                <h4 className="font-mono text-xs text-slate-400 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-slate-300" /> ON-CHAIN IMMUTABLE LOG
                </h4>
                <div className="p-3 bg-neutral-950 rounded border border-neutral-800 space-y-2">
                  <div className="text-xs font-mono text-slate-300 overflow-hidden text-ellipsis">
                    TX: 0x9f4a...83d2
                  </div>
                  <div className="text-xs text-slate-400">
                    Verifying authorization state "Release Candidate Approved"
                  </div>
                  <div className="h-1 bg-neutral-900 rounded overflow-hidden mt-2">
                    <div className="h-full bg-white w-3/4 rounded animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-4 rounded-lg bg-neutral-900/50 border border-neutral-800/80">
                <h4 className="font-mono text-xs text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-slate-300" /> COPILOT ANALYTICS
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs text-slate-400 border-b border-neutral-800 pb-1.5">
                    <span>AI Tasks Executed</span>
                    <span className="font-mono text-slate-200">1,492 / mo</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-400 border-b border-neutral-800 pb-1.5">
                    <span>Ledger Gas Spent</span>
                    <span className="font-mono text-slate-200">0.023 XLM</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Platform Efficiency</span>
                    <span className="font-mono text-white font-semibold">+42.8%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-24 border-t border-neutral-900 bg-neutral-950/40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
              Series-A Standard Workspace Modules
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              FlowPilot AI unifies deep semantic planning with rigorous blockchain verification to provide a single workspace hub.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-neutral-900/30 border border-neutral-800/80 hover:border-slate-400/50 transition-all duration-300 space-y-4 hover:shadow-lg hover:shadow-white/5 group">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="font-display font-semibold text-xl text-white group-hover:text-slate-200 transition-colors">AI Workflow Bot Assembly</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Describe your business logic goal and our generative model will architect a modular workflow with discrete steps, automated instructions, and custom assignee suggestions.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-neutral-900/30 border border-neutral-800/80 hover:border-slate-400/50 transition-all duration-300 space-y-4 hover:shadow-lg hover:shadow-white/5 group">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-display font-semibold text-xl text-white group-hover:text-slate-200 transition-colors">Soroban Cryptographic Logging</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Commit critical milestone transitions and user authorizations to on-chain Stellar smart contracts. Never worry about audit fraud or team compliance disputes.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-neutral-900/30 border border-neutral-800/80 hover:border-slate-400/50 transition-all duration-300 space-y-4 hover:shadow-lg hover:shadow-white/5 group">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-display font-semibold text-xl text-white group-hover:text-slate-200 transition-colors">Kanban, Timeline & Whiteboard</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Switch seamlessly between clean backlog grids, chronological timeline Gantt charts, tabular reviews, and an open whiteboard canvas that maps tasks collaboratively.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Soroban Contracts Feature Spot */}
      <section id="soroban" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/15 text-slate-200 text-xs font-mono">
              STELLAR NETWORK
            </div>
            <h2 className="font-display font-bold text-3.5xl sm:text-4xl leading-tight">
              State-of-the-art Soroban Smart Contracts
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Soroban is Stellar's next-gen smart contract framework designed for performance, modularity, and extremely low execution gas costs.
            </p>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <Check className="w-4.5 h-4.5 text-slate-200 shrink-0 mt-0.5" />
                <span>**Inter-contract verification**: Automatically chain verification checks across multiple deployed security layers.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4.5 h-4.5 text-slate-200 shrink-0 mt-0.5" />
                <span>**Simulated Freighter Wallet**: Standard integration template out-of-the-box. Signature signing requires zero gas on local dev sandboxes.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4.5 h-4.5 text-slate-200 shrink-0 mt-0.5" />
                <span>**Decentralized Role-based control**: Enforce that actions (like deploying code, merging code reviews, or spending budget) are ledger-signed.</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 font-mono text-xs text-slate-300 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <span className="text-slate-400">VerificationContract.rs</span>
              <span className="text-slate-200 text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10">Soroban Smart Contract</span>
            </div>
            <pre className="overflow-x-auto text-slate-400">
{`#[contractimpl]
impl VerificationContract {
    pub fn verify_action(env: Env, hash: BytesN<32>, signer: Address) -> bool {
        signer.require_auth();
        
        let mut history = env.storage().instance().get(&Symbol::new("history"))
            .unwrap_or_else(|| Map::new(&env));
            
        history.set(hash.clone(), signer.clone());
        env.storage().instance().set(&Symbol::new("history"), &history);
        
        env.events().publish((Symbol::new("verified_action"), hash), signer);
        true
    }
}`}
            </pre>
            <div className="border-t border-neutral-800 pt-3 flex justify-between text-[11px] text-slate-500">
              <span>Optimized WASM target</span>
              <span>Gas Limit: 10,000,000 CPU</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 border-t border-neutral-900 bg-neutral-950/20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
              Predictable, Transparent Pricing
            </h2>
            <p className="text-slate-400 max-w-md mx-auto">
              Empower your developers, builders, and managers with AI assistance and secure ledger logging.
            </p>

            <div className="inline-flex items-center gap-1.5 p-1 rounded-lg bg-neutral-900/80 border border-neutral-800 mt-6">
              <button 
                onClick={() => setBillingPeriod('monthly')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${billingPeriod === 'monthly' ? 'bg-white text-black shadow' : 'text-slate-400 hover:text-white'}`}
              >
                Monthly Billing
              </button>
              <button 
                onClick={() => setBillingPeriod('yearly')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${billingPeriod === 'yearly' ? 'bg-white text-black shadow' : 'text-slate-400 hover:text-white'}`}
              >
                Yearly Billing (Save 20%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier, idx) => (
              <div 
                key={idx} 
                className={`p-8 rounded-2xl border flex flex-col justify-between transition-all duration-300 relative ${tier.popular ? 'bg-neutral-900/70 border-white/25 shadow-lg shadow-white/5 hover:scale-[1.01]' : 'bg-neutral-900/30 border-neutral-800/80'}`}
              >
                {tier.popular && (
                  <span className="absolute top-0 right-6 -translate-y-1/2 px-2.5 py-1 rounded-full bg-white text-black font-mono text-[10px] font-bold tracking-wider uppercase">
                    MOST POPULAR
                  </span>
                )}
                <div>
                  <h3 className="font-display font-bold text-lg text-white mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-4xl font-extrabold text-white font-display">{tier.price}</span>
                    <span className="text-xs text-slate-400 font-mono">{tier.periodSuffix}</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-6 font-normal leading-relaxed">{tier.description}</p>
                  
                  <ul className="space-y-3.5 mb-8 text-xs text-slate-300">
                    {tier.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-slate-200 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button 
                  onClick={onEnterApp}
                  className={`w-full py-3 rounded-lg font-semibold text-xs transition-all ${tier.popular ? 'bg-white hover:bg-slate-200 text-black shadow-md shadow-white/10' : 'bg-neutral-800 hover:bg-neutral-700 text-slate-200'}`}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 max-w-4xl mx-auto">
        <div className="space-y-4 text-center mb-16">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">Frequently Asked Questions</h2>
          <p className="text-slate-400">Everything you need to know about FlowPilot AI SaaS features.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border-b border-neutral-850 pb-4">
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full py-3 flex justify-between items-center text-left text-base font-semibold hover:text-white transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${openFaq === idx ? 'rotate-180 text-white' : ''}`} />
              </button>
              {openFaq === idx && (
                <p className="text-slate-400 text-sm mt-2 leading-relaxed pl-1">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl border border-neutral-850 bg-gradient-to-b from-neutral-900 to-black text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
          <h2 className="font-display font-bold text-3xl text-white">Subscribe to FlowPilot AI Updates</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Get early notifications on Soroban mainnet deployments, brand new automated AI templates, and weekly engineering deep-dives.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); alert("Successfully subscribed! Welcome aboard."); }} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2.5 pt-2">
            <input 
              type="email" 
              required
              placeholder="argha0506@gmail.com" 
              className="flex-1 px-4 py-3 rounded-lg bg-black border border-neutral-800 text-sm text-slate-200 focus:outline-none focus:border-white transition-all font-mono"
            />
            <button 
              type="submit"
              className="px-6 py-3 rounded-lg bg-white hover:bg-slate-200 text-black font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-black py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/src/assets/images/flowpilot_logo_1784285238524.jpg" 
                alt="FlowPilot Logo" 
                className="w-7 h-7 rounded-lg object-cover border border-neutral-850"
                referrerPolicy="no-referrer"
              />
              <span className="font-display font-bold text-lg text-white">FlowPilot AI</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Cryptographically secure, AI-powered developer workflows. Uncompromising design, modular coordination.
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><a href="#features" className="hover:text-white transition-colors">Workspace Views</a></li>
              <li><a href="#soroban" className="hover:text-white transition-colors">Soroban Ledger</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing Options</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><span className="hover:text-white transition-colors cursor-pointer" onClick={onEnterApp}>Interactive Console</span></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Faq Docs</a></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Technical Spec</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><span className="hover:text-white transition-colors">About Team</span></li>
              <li><span className="hover:text-white transition-colors">Join Careers</span></li>
              <li><span className="hover:text-white transition-colors">Security Policy</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-neutral-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-4">
          <span>&copy; {new Date().getFullYear()} FlowPilot AI Inc. All rights reserved. Built with Gemini 3.5 & Soroban Smart Contracts.</span>
          <div className="flex space-x-4">
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
