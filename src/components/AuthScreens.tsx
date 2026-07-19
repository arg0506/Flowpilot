import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Lock, Mail, User, Shield, KeyRound, ArrowLeft, RefreshCw } from 'lucide-react';

interface AuthScreensProps {
  initialMode: 'login' | 'signup';
  onAuthSuccess: (user: { name: string; email: string; tier: 'free' | 'growth' | 'enterprise' }) => void;
  onBackToLanding: () => void;
}

export default function AuthScreens({ initialMode, onAuthSuccess, onBackToLanding }: AuthScreensProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'otp'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('argha0506@gmail.com');
  const [password, setPassword] = useState('password123');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (mode === 'login' || mode === 'signup') {
        // Switch to OTP verification
        setMode('otp');
      } else if (mode === 'forgot') {
        alert(`Password reset link sent to ${email}`);
        setMode('login');
      }
    }, 1200);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      const code = otpCode.join('');
      if (code.length < 6) {
        setError('Please enter the full 6-digit verification code.');
        return;
      }
      // Success! Log the user in
      onAuthSuccess({
        name: name || 'Argha Dev',
        email: email || 'argha0506@gmail.com',
        tier: 'growth'
      });
    }, 1000);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (isNaN(Number(val))) return;
    const nextOtp = [...otpCode];
    nextOtp[index] = val.slice(-1);
    setOtpCode(nextOtp);

    // Auto focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-white/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[250px] h-[250px] rounded-full bg-slate-400/5 blur-[80px] pointer-events-none" />

      {/* Brand logo header */}
      <div className="mb-8 flex flex-col items-center cursor-pointer" onClick={onBackToLanding}>
        <img 
          src="/src/assets/images/flowpilot_logo_1784285238524.jpg" 
          alt="FlowPilot Logo" 
          className="w-12 h-12 rounded-2xl object-cover border border-neutral-800 shadow shadow-white/10 mb-3"
          referrerPolicy="no-referrer"
        />
        <span className="font-display font-bold text-2xl tracking-tight text-white">
          FlowPilot <span className="text-slate-300 font-bold">AI</span>
        </span>
        <span className="text-xs text-slate-500 mt-1 font-mono uppercase tracking-wider">Series A Workspace Platform</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 rounded-2xl border border-neutral-850 bg-neutral-900/40 backdrop-blur-xl shadow-2xl space-y-6 relative"
      >
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* Render Form based on Mode */}
        {mode === 'login' && (
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div className="space-y-1.5 text-center">
              <h2 className="font-display font-bold text-xl text-white">Welcome Back</h2>
              <p className="text-xs text-slate-400">Sign in to your FlowPilot workspace console</p>
            </div>

            {error && <div className="p-3 text-xs text-rose-400 bg-rose-500/10 rounded border border-rose-500/25 font-mono">{error}</div>}

            <div className="space-y-3.5 pt-2">
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black border border-neutral-800 text-xs text-slate-100 focus:outline-none focus:border-white font-mono"
                    placeholder="argha0506@gmail.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Password</label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[10px] text-slate-300 hover:text-white hover:underline focus:outline-none font-mono"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black border border-neutral-800 text-xs text-slate-100 focus:outline-none focus:border-white font-mono"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 rounded-lg bg-white hover:bg-slate-200 disabled:bg-neutral-900 disabled:text-slate-500 text-black font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing Auth...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center text-xs text-slate-500 pt-2 font-sans">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-slate-300 hover:text-white hover:underline font-medium"
              >
                Sign up free
              </button>
            </div>
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div className="space-y-1.5 text-center">
              <h2 className="font-display font-bold text-xl text-white">Create Workspace</h2>
              <p className="text-xs text-slate-400">Start automating project cycles in minutes</p>
            </div>

            {error && <div className="p-3 text-xs text-rose-400 bg-rose-500/10 rounded border border-rose-500/25 font-mono">{error}</div>}

            <div className="space-y-3.5 pt-2">
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black border border-neutral-800 text-xs text-slate-100 focus:outline-none focus:border-white font-mono"
                    placeholder="Argha Dev"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black border border-neutral-800 text-xs text-slate-100 focus:outline-none focus:border-white font-mono"
                    placeholder="argha0506@gmail.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black border border-neutral-800 text-xs text-slate-100 focus:outline-none focus:border-white font-mono"
                    placeholder="At least 8 characters"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 rounded-lg bg-white hover:bg-slate-200 disabled:bg-neutral-900 disabled:text-slate-500 text-black font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Configuring Node...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center text-xs text-slate-500 pt-2 font-sans">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-slate-300 hover:text-white hover:underline font-medium"
              >
                Log In
              </button>
            </div>
          </form>
        )}

        {mode === 'forgot' && (
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div className="space-y-1.5 text-center">
              <h2 className="font-display font-bold text-xl text-white">Reset Password</h2>
              <p className="text-xs text-slate-400">We will send reset credentials to your verified inbox</p>
            </div>

            <div className="space-y-1 pt-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Registered Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black border border-neutral-800 text-xs text-slate-100 focus:outline-none focus:border-white font-mono"
                  placeholder="argha0506@gmail.com"
                />
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="flex-1 py-2.5 rounded-lg border border-neutral-800 hover:bg-neutral-900 text-slate-300 font-semibold text-xs transition-colors flex items-center justify-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded-lg bg-white hover:bg-slate-200 disabled:bg-neutral-900 disabled:text-slate-500 text-black font-bold text-xs uppercase tracking-wider transition-colors"
              >
                {loading ? 'Sending...' : 'Send Link'}
              </button>
            </div>
          </form>
        )}

        {mode === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div className="space-y-1.5 text-center">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-2 text-white animate-pulse">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="font-display font-bold text-xl text-white font-sans">Security Verification</h2>
              <p className="text-xs text-slate-400">A multi-factor authorization code has been dispatched</p>
              <div className="text-[10px] font-mono text-slate-300 bg-white/5 py-1 px-2.5 rounded border border-white/10 inline-block mt-1">
                DEMO BYPASS CODE: Any 6 digits (e.g. 1 2 3 4 5 6)
              </div>
            </div>

            {error && <div className="p-3 text-xs text-rose-400 bg-rose-500/10 rounded border border-rose-500/25 font-mono">{error}</div>}

            <div className="flex justify-between gap-2.5 py-2">
              {otpCode.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  required
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-11 h-12 rounded-lg bg-black border border-neutral-800 text-center font-mono text-lg text-white font-bold focus:outline-none focus:border-white"
                />
              ))}
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-white hover:bg-slate-200 disabled:bg-neutral-900 disabled:text-slate-500 text-black font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Security Token</span>
                    <KeyRound className="w-4 h-4 text-black" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-full py-2 text-center text-xs text-slate-500 hover:text-slate-300 font-medium"
              >
                Cancel verification
              </button>
            </div>
          </form>
        )}
      </motion.div>

      {/* Subtle landing bypass back link */}
      <button
        onClick={onBackToLanding}
        className="mt-8 text-xs text-slate-500 hover:text-slate-300 transition-colors font-medium flex items-center gap-1.5"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Landing Portal</span>
      </button>
    </div>
  );
}
