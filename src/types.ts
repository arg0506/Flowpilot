export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId?: string;
  assigneeId?: string;
  dueDate?: string;
  createdAt: string;
  onChainVerified?: boolean;
  txHash?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'paused' | 'completed';
  dueDate: string;
  createdAt: string;
  progress: number; // 0 to 100
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Member' | 'Viewer';
  avatar: string;
  status: 'active' | 'idle' | 'offline';
}

export interface AIWorkflowStep {
  id: string;
  title: string;
  description: string;
  agent: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  dependsOn?: string[];
}

export interface AIWorkflow {
  id: string;
  name: string;
  description: string;
  steps: AIWorkflowStep[];
  createdAt: string;
}

export interface BlockchainTx {
  hash: string;
  action: string;
  payload: string;
  timestamp: string;
  status: 'confirmed' | 'pending' | 'failed';
  contractAddress: string;
  sequenceNumber: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
  type: 'security' | 'workflow' | 'billing' | 'blockchain';
}

export interface UserProfile {
  id: string;
  name: string;
  username?: string;
  email: string;
  organization: string;
  tier: 'free' | 'growth' | 'enterprise';
  walletAddress?: string;
  avatar?: string;
}
