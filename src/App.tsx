import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import LandingPage from './components/LandingPage';
import AuthScreens from './components/AuthScreens';
import NotchNavbar from './components/NotchNavbar';
import DashboardAnalytics from './components/DashboardAnalytics';
import AIWorkspace from './components/AIWorkspace';
import WorkspaceViews from './components/WorkspaceViews';
import BlockchainHub from './components/BlockchainHub';
import BillingAdminSettings from './components/BillingAdminSettings';
import { Task, BlockchainTx, UserProfile } from './types';

export default function App() {
  const queryClient = useQueryClient();
  const [view, setView] = useState<'landing' | 'auth' | 'app'>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [activeTab, setActiveTab] = useState<string>('analytics');

  // React Query - User Profile
  const { data: user = {
    id: 'user_01',
    name: 'Argha Dev',
    email: 'argha0506@gmail.com',
    organization: 'Argha Labs',
    tier: 'growth' as const,
  } } = useQuery<UserProfile>({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await fetch('/api/user');
      if (!res.ok) throw new Error('Failed to fetch user profile');
      return res.json();
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: async (updatedUser: Partial<UserProfile>) => {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });
      if (!res.ok) throw new Error('Failed to update user profile');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    }
  });

  // React Query - Tasks
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('Failed to fetch tasks');
      return res.json();
    }
  });

  const addTasksMutation = useMutation({
    mutationFn: async (newTasks: Omit<Task, 'id' | 'createdAt'> | Omit<Task, 'id' | 'createdAt'>[]) => {
      const body = Array.isArray(newTasks) ? { tasks: newTasks } : newTasks;
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Failed to add task(s)');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, ...fields }: { id: string } & Partial<Task>) => {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields)
      });
      if (!res.ok) throw new Error('Failed to update task');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete task');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  // React Query - Transactions
  const { data: transactions = [] } = useQuery<BlockchainTx[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      const res = await fetch('/api/transactions');
      if (!res.ok) throw new Error('Failed to fetch transactions');
      return res.json();
    }
  });

  const addTransactionMutation = useMutation({
    mutationFn: async (tx: BlockchainTx) => {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tx)
      });
      if (!res.ok) throw new Error('Failed to add transaction');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
  });

  // Simulated Wallet Connection State (remains local as wallet state is transient to browser session)
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');

  // Actions: Wallet Connection
  const handleConnectWallet = () => {
    // Generate simulated Freighter public key address
    const randomHex = [...Array(44)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
    const mockAddress = `GC${randomHex.toUpperCase().slice(0, 54)}`;
    setWalletConnected(true);
    setWalletAddress(mockAddress);
  };

  const handleDisconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress('');
  };

  // Actions: Add Single Task Card
  const handleAddTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    addTasksMutation.mutate(newTask);
  };

  // Actions: Add Multiple Tasks
  const handleAddTasks = (newTasksList: Omit<Task, 'id' | 'createdAt'>[]) => {
    addTasksMutation.mutate(newTasksList);
  };

  // Actions: Add Project Milestone
  const handleAddProject = (project: any) => {
    // Storing newly generated project metadata to profile
    updateUserMutation.mutate({
      organization: `${user.organization} (${project.name})`
    });
  };

  // Actions: Shift task status
  const handleUpdateTaskStatus = (id: string, status: 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done') => {
    updateTaskMutation.mutate({ id, status });
  };

  // Actions: Delete task card
  const handleDeleteTask = (id: string) => {
    deleteTaskMutation.mutate(id);
  };

  // Actions: Submit on-chain confirmation
  const handleAddTransaction = (tx: BlockchainTx) => {
    addTransactionMutation.mutate(tx);
  };

  const handleVerifyOnChain = (taskId: string, hash: string) => {
    updateTaskMutation.mutate({ id: taskId, onChainVerified: true, txHash: hash });
  };

  // Switch Account Tier
  const handleUpgradeTier = (tier: 'free' | 'growth' | 'enterprise') => {
    updateUserMutation.mutate({ tier });
  };

  const handleEnterAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setView('auth');
  };

  const handleAuthSuccess = (sessionUser: { name: string; email: string; tier: 'free' | 'growth' | 'enterprise' }) => {
    updateUserMutation.mutate({
      name: sessionUser.name,
      email: sessionUser.email,
      tier: sessionUser.tier
    }, {
      onSuccess: () => {
        setView('app');
        setActiveTab('analytics');
      }
    });
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans relative overflow-hidden flex flex-col">
      
      {/* 1. MARKETING LANDING VIEW */}
      {view === 'landing' && (
        <LandingPage 
          onEnterApp={() => setView('app')} 
          onEnterAuth={handleEnterAuth} 
        />
      )}

      {/* 2. AUTHENTICATION SCREENS VIEW */}
      {view === 'auth' && (
        <AuthScreens 
          initialMode={authMode} 
          onAuthSuccess={handleAuthSuccess} 
          onBackToLanding={() => setView('landing')} 
        />
      )}

      {/* 3. CORE SAAS APPLICATION WORKSPACE CONSOLE */}
      {view === 'app' && (
        <div className="flex flex-1 h-screen overflow-hidden relative">
          {/* Floating iPhone Notch Shaped Navigation Bar */}
          <NotchNavbar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            user={user} 
            onLogout={() => setView('landing')}
            walletConnected={walletConnected}
            walletAddress={walletAddress}
            onConnectWallet={handleConnectWallet}
          />

          {/* Console Main Workspace Content Container */}
          <main className="flex-1 bg-black overflow-hidden flex flex-col pt-16">
            {activeTab === 'analytics' && <DashboardAnalytics />}

            {activeTab === 'ai_workspace' && (
              <AIWorkspace 
                onAddTasks={handleAddTasks} 
                onAddProject={handleAddProject} 
                activeTasks={tasks} 
                onRefreshTasks={() => queryClient.invalidateQueries({ queryKey: ['tasks'] })}
              />
            )}

            {activeTab === 'workspace' && (
              <WorkspaceViews 
                tasks={tasks} 
                transactions={transactions}
                onAddTask={handleAddTask} 
                onUpdateTaskStatus={handleUpdateTaskStatus} 
                onDeleteTask={handleDeleteTask} 
              />
            )}

            {activeTab === 'blockchain' && (
              <BlockchainHub 
                walletConnected={walletConnected} 
                walletAddress={walletAddress} 
                onConnectWallet={handleConnectWallet} 
                onDisconnectWallet={handleDisconnectWallet} 
                onAddTx={handleAddTransaction} 
                transactions={transactions} 
                tasks={tasks} 
                onVerifyOnChain={handleVerifyOnChain} 
              />
            )}

            {activeTab === 'billing' && (
              <BillingAdminSettings 
                activeSection="billing" 
                user={user} 
                onUpgradeTier={handleUpgradeTier} 
                onUpdateUser={(updatedFields) => updateUserMutation.mutate(updatedFields)}
              />
            )}

            {activeTab === 'admin' && (
              <BillingAdminSettings 
                activeSection="admin" 
                user={user} 
                onUpgradeTier={handleUpgradeTier} 
                onUpdateUser={(updatedFields) => updateUserMutation.mutate(updatedFields)}
              />
            )}

            {activeTab === 'settings' && (
              <BillingAdminSettings 
                activeSection="settings" 
                user={user} 
                onUpgradeTier={handleUpgradeTier} 
                onUpdateUser={(updatedFields) => updateUserMutation.mutate(updatedFields)}
              />
            )}
          </main>
        </div>
      )}
    </div>
  );
}
