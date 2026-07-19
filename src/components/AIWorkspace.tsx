import React, { useState, useEffect } from 'react';
import { 
  Cpu, Bot, Sparkles, FileCode2, Clock, ListChecks, 
  Send, RefreshCw, PlusCircle, Check, Code, ShieldCheck, HelpCircle, Eye, ChevronRight,
  FileText, Search, BarChart3, TrendingUp, AlertTriangle, Activity
} from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { AIWorkflow, AIWorkflowStep, Task, Project } from '../types';

interface AIWorkspaceProps {
  onAddTasks: (tasks: Omit<Task, 'id' | 'createdAt'>[]) => void;
  onAddProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  activeTasks: Task[];
  onRefreshTasks?: () => void;
}

export default function AIWorkspace({ onAddTasks, onAddProject, activeTasks, onRefreshTasks }: AIWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<'workflow' | 'document-gen' | 'search-rag' | 'analytics-nl' | 'planner' | 'summary' | 'codereview' | 'prioritizer'>('workflow');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // 1. Workflow States
  const [workflowPrompt, setWorkflowPrompt] = useState('Create a marketing campaign for Soroban multi-sig token validation');
  const [generatedWorkflow, setGeneratedWorkflow] = useState<AIWorkflow & { autoDeployedTasks?: any[] } | null>(null);

  // 2. Planner States
  const [projectName, setProjectName] = useState('Soroban Multi-Sig Gate');
  const [projectDesc, setProjectDesc] = useState('Build a robust 2-of-3 threshold signature scheme validator on Soroban that emits events upon every state modification.');
  const [generatedPlan, setGeneratedPlan] = useState<{
    timeline: Array<{ week: string; milestone: string; status: string }>;
    tasks: Array<{ title: string; description: string; priority: string; assignee: string }>;
  } | null>(null);

  // 3. Summary States
  const [meetingNotes, setMeetingNotes] = useState(`Attendees: Argha (PM), Dave (DevOps), Alice (Smart Contracts Lead)
Notes:
- Alice completed the basic verification smart contract WASM compilation.
- Dave is blocked on configuring the freighter sandbox RPC link on Docker container ports.
- Argha requested we finalize the audit history log API and deploy it by Week 2.
- Agreement: alice will perform code-review and dave will verify sandbox settings.`);
  const [generatedSummary, setGeneratedSummary] = useState<{
    summary: string;
    actionItems: string[];
    milestones: string[];
  } | null>(null);

  // 4. Code Review States
  const [codeSnippet, setCodeSnippet] = useState(`// Rust code review test for Soroban contract vulnerabilities
fn verify_claim(env: Env, hash: BytesN<32>, claimer: Address) {
    // Unchecked signer authentication! Is this secure?
    let user_state = env.storage().instance().get(&claimer).unwrap_or(0);
    env.storage().instance().set(&claimer, &(user_state + 1));
}`);
  const [generatedReview, setGeneratedReview] = useState<{
    score: number;
    issues: Array<{ line: number; type: 'bug' | 'security' | 'warning' | 'style'; description: string; suggestion: string }>;
    overallFeedback: string;
  } | null>(null);

  // 5. Prioritization States
  const [generatedPrioritization, setGeneratedPrioritization] = useState<{
    rationale: string;
    prioritizedTaskIds: string[];
  } | null>(null);

  // 6. Document Generation States
  const [docType, setDocType] = useState<'prd' | 'report' | 'proposal'>('prd');
  const [docTopic, setDocTopic] = useState('Soroban Multi-Sig Audit Protocol');
  const [docPrompt, setDocPrompt] = useState('Create an exhaustive 4-stage validation roadmap including check conditions and Freighter sandbox validation steps.');
  const [documents, setDocuments] = useState<Array<{ id: string; title: string; type: string; content: string; createdAt: string }>>([]);
  const [selectedDoc, setSelectedDoc] = useState<{ id: string; title: string; type: string; content: string; createdAt: string } | null>(null);

  // 7. Search (RAG) States
  const [searchQuery, setSearchQuery] = useState('Who is working on Soroban multi-sig?');
  const [searchResult, setSearchResult] = useState<{
    answer: string;
    matchedTaskIds: string[];
    matchedTxHashes: string[];
    matchedDocIds: string[];
  } | null>(null);

  // 8. AI Analytics States
  const [analyticsQuery, setAnalyticsQuery] = useState('Analyze team workload bottlenecks and priority risk distribution');
  const [analyticsResult, setAnalyticsResult] = useState<{
    report: string;
    kpis: Array<{ label: string; value: string; status: 'success' | 'warning' | 'danger' | 'neutral' }>;
    chartData: Array<{ name: string; value: number }>;
  } | null>(null);

  // Fetch Documents list on mount
  useEffect(() => {
    fetch('/api/documents')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDocuments(data);
          if (data.length > 0 && !selectedDoc) {
            setSelectedDoc(data[0]);
          }
        }
      })
      .catch(err => console.error("Error loading documents database", err));
  }, []);

  const triggerAI = async (endpoint: string, payload: object, successCallback: (data: any) => void) => {
    setLoading(true);
    setStatusMsg('Consulting Gemini AI core models... Please hold.');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Server returned error status: ${response.status}`);
      }
      const data = await response.json();
      successCallback(data);
    } catch (err: any) {
      alert(`Copilot Error: ${err.message || 'Transient network failure.'}`);
    } finally {
      setLoading(false);
      setStatusMsg('');
    }
  };

  const handleGenerateWorkflow = () => {
    triggerAI('/api/ai/generate-workflow', { prompt: workflowPrompt }, (data) => {
      setGeneratedWorkflow({
        id: `wf_${Date.now()}`,
        name: data.name || 'Custom Workflow',
        description: data.description || 'Generated Workflow summary',
        steps: data.steps || [],
        createdAt: new Date().toISOString(),
        autoDeployedTasks: data.autoDeployedTasks
      });
      if (onRefreshTasks) {
        onRefreshTasks();
      }
    });
  };

  const handleGeneratePlan = () => {
    triggerAI('/api/ai/plan-project', { name: projectName, description: projectDesc }, (data) => {
      setGeneratedPlan(data);
    });
  };

  const handleSummarizeNotes = () => {
    triggerAI('/api/ai/summarize-meeting', { notes: meetingNotes }, (data) => {
      setGeneratedSummary(data);
    });
  };

  const handleCodeReview = () => {
    triggerAI('/api/ai/code-review', { code: codeSnippet, language: 'Rust' }, (data) => {
      setGeneratedReview(data);
    });
  };

  const handlePrioritize = () => {
    if (activeTasks.length === 0) {
      alert("No active tasks found in the workspace to prioritize. Please create or generate some tasks first!");
      return;
    }
    triggerAI('/api/ai/prioritize-tasks', { tasks: activeTasks }, (data) => {
      setGeneratedPrioritization(data);
    });
  };

  const handleGenerateDoc = () => {
    triggerAI('/api/ai/generate-doc', { type: docType, topic: docTopic, prompt: docPrompt }, (data) => {
      setDocuments(prev => [data, ...prev]);
      setSelectedDoc(data);
    });
  };

  const handleSearchRAG = () => {
    triggerAI('/api/ai/search', { query: searchQuery }, (data) => {
      setSearchResult(data);
    });
  };

  const handleAnalytics = () => {
    triggerAI('/api/ai/analytics', { query: analyticsQuery }, (data) => {
      setAnalyticsResult(data);
    });
  };

  // Deploy workflow steps directly to active board backlog
  const deployWorkflowTasks = () => {
    if (!generatedWorkflow) return;
    const tasksToDeploy = generatedWorkflow.steps.map(step => ({
      title: `${generatedWorkflow.name}: ${step.title}`,
      description: `${step.description} (Recommended role: ${step.agent})`,
      status: 'backlog' as const,
      priority: 'medium' as const,
    }));
    onAddTasks(tasksToDeploy);
    alert(`Successfully deployed ${tasksToDeploy.length} steps directly onto your active board backlog!`);
  };

  const deployPlanTasks = () => {
    if (!generatedPlan) return;
    const tasksToDeploy = generatedPlan.tasks.map(t => ({
      title: t.title,
      description: `${t.description} (Suggested: ${t.assignee})`,
      status: 'todo' as const,
      priority: (t.priority === 'high' ? 'high' : t.priority === 'low' ? 'low' : 'medium') as any,
    }));
    
    onAddProject({
      name: projectName,
      description: projectDesc,
      status: 'planning',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      progress: 0
    });

    onAddTasks(tasksToDeploy);
    alert(`Successfully created Project "${projectName}" and deployed ${tasksToDeploy.length} tasks directly to your Todo queue.`);
  };

  const subtabs = [
    { id: 'workflow', label: 'AI Workflow Builder', icon: Cpu },
    { id: 'document-gen', label: 'AI Doc Generator', icon: FileText },
    { id: 'search-rag', label: 'AI Search (RAG)', icon: Search },
    { id: 'analytics-nl', label: 'AI Smart Analytics', icon: BarChart3 },
    { id: 'planner', label: 'AI Roadmap Planner', icon: Bot },
    { id: 'summary', label: 'Meeting Summary', icon: Clock },
    { id: 'codereview', label: 'Code Reviewer', icon: FileCode2 },
    { id: 'prioritizer', label: 'Prioritize Tasks', icon: ListChecks },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="p-6 overflow-y-auto h-full max-w-7xl mx-auto selection:bg-white selection:text-black font-sans"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">FlowPilot Copilot</h1>
          <p className="text-xs text-slate-400">Autonomous LLM assistance running securely on server-side nodes.</p>
        </div>
      </div>

      {/* AI Subtabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-neutral-900 pb-3 mb-6">
        {subtabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${activeTab === tab.id ? 'bg-white text-black shadow-md' : 'text-slate-400 hover:text-white hover:bg-neutral-900/40'}`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Global Loading Overlay */}
      {loading && (
        <div className="p-10 rounded-xl border border-dashed border-neutral-800 bg-neutral-900/10 flex flex-col items-center justify-center space-y-3.5 mb-6 text-center animate-pulse">
          <RefreshCw className="w-8 h-8 text-slate-300 animate-spin" />
          <div className="space-y-1">
            <span className="block text-sm font-semibold text-slate-100">{statusMsg}</span>
            <span className="block text-[11px] text-slate-400 font-mono">Powered by gemini-2.5-flash model</span>
          </div>
        </div>
      )}

      {/* Workflow Builder Panel */}
      {activeTab === 'workflow' && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border border-neutral-850 bg-neutral-900/10 space-y-4">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-slate-300" /> Assemble Custom AI Workflow
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Define your core operational goals, compliance conditions, or pipeline procedures. The AI model compiles it into logical, sequential workspace task cards with dependencies.
            </p>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-slate-400 block">Workflow Objective</label>
              <textarea
                value={workflowPrompt}
                onChange={(e) => setWorkflowPrompt(e.target.value)}
                rows={4}
                className="w-full p-3.5 rounded-lg bg-black border border-neutral-800 text-xs text-slate-200 focus:outline-none focus:border-white font-sans leading-relaxed"
                placeholder="Describe your process pipeline..."
              />
            </div>

            <button
              onClick={handleGenerateWorkflow}
              className="px-5 py-2.5 rounded-lg bg-white hover:bg-slate-200 text-black text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4.5 h-4.5" />
              <span>Generate Flow</span>
            </button>
          </div>

          {/* Workflow Outputs */}
          <div className="p-6 rounded-xl border border-neutral-850 bg-neutral-900/10 flex flex-col justify-between">
            {generatedWorkflow ? (
              <div className="space-y-5">
                <div className="border-b border-neutral-850 pb-3 flex justify-between items-start">
                  <div>
                    <h3 className="font-display font-bold text-base text-white">{generatedWorkflow.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{generatedWorkflow.description}</p>
                  </div>
                  <button
                    onClick={deployWorkflowTasks}
                    className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold flex items-center gap-1 shrink-0"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Deploy Tasks
                  </button>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {generatedWorkflow.steps.map((step, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-850 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-200">{step.title}</span>
                        <span className="text-[10px] font-mono text-slate-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded uppercase">
                          {step.agent}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
                      {step.dependsOn && step.dependsOn.length > 0 && (
                        <div className="text-[10px] font-mono text-slate-500 pt-1">
                          Depends on: {step.dependsOn.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2.5">
                <Cpu className="w-10 h-10 text-slate-600 animate-pulse" />
                <span className="text-xs text-slate-400">Provide an objective prompt on the left side and request compilation to review results.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Project Planner Panel */}
      {activeTab === 'planner' && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border border-neutral-850 bg-neutral-900/10 space-y-4">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Bot className="w-4 h-4 text-slate-300" /> AI Project Roadmap Planner
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Formulate full milestone timelines and detailed sprint objectives by writing down high-level project names and initial requirements.
            </p>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400 block">Project Title</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black border border-neutral-800 text-xs text-slate-100 focus:outline-none focus:border-white font-sans"
                  placeholder="e.g., Soroban Multi-Sig Gate"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400 block">Detailed Objectives</label>
                <textarea
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  rows={4}
                  className="w-full p-3.5 rounded-lg bg-black border border-neutral-800 text-xs text-slate-200 focus:outline-none focus:border-white font-sans leading-relaxed"
                  placeholder="Detail the sprint goals..."
                />
              </div>
            </div>

            <button
              onClick={handleGeneratePlan}
              className="px-5 py-2.5 rounded-lg bg-white hover:bg-slate-200 text-black text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4.5 h-4.5" />
              <span>Compile Plan</span>
            </button>
          </div>

          {/* Planner Outputs */}
          <div className="p-6 rounded-xl border border-neutral-850 bg-neutral-900/10 flex flex-col justify-between">
            {generatedPlan ? (
              <div className="space-y-5">
                <div className="border-b border-neutral-850 pb-3 flex justify-between items-start">
                  <div>
                    <h3 className="font-display font-bold text-sm text-white">Generated Project Plan</h3>
                    <p className="text-xs text-slate-400 mt-1">Found {generatedPlan.timeline.length} milestones & {generatedPlan.tasks.length} sub-tasks.</p>
                  </div>
                  <button
                    onClick={deployPlanTasks}
                    className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold flex items-center gap-1 shrink-0"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Push to Boards
                  </button>
                </div>

                <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                  {/* Milestones timeline */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Milestone Chronology</span>
                    <div className="space-y-2">
                      {generatedPlan.timeline.map((line, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-xs">
                          <span className="font-mono text-slate-300 text-[11px] shrink-0 w-14">{line.week}</span>
                          <div className="space-y-0.5">
                            <span className="font-semibold text-slate-200 block">{line.milestone}</span>
                            <span className="text-[10px] font-mono text-slate-500 uppercase">{line.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tasks */}
                  <div className="space-y-2 pt-2 border-t border-neutral-850">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Generated Tasks</span>
                    <div className="space-y-2">
                      {generatedPlan.tasks.map((t, idx) => (
                        <div key={idx} className="p-2.5 rounded bg-black border border-neutral-850 flex justify-between items-start">
                          <div className="space-y-1 max-w-[200px]">
                            <span className="text-xs font-bold text-slate-200 block truncate">{t.title}</span>
                            <p className="text-[11px] text-slate-400 line-clamp-1">{t.description}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className="text-[9px] uppercase font-mono px-1.5 bg-neutral-900 text-slate-300 border border-neutral-800 rounded">
                              {t.assignee}
                            </span>
                            <span className="text-[9px] font-mono text-slate-300 font-bold uppercase">{t.priority}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2.5">
                <Bot className="w-10 h-10 text-slate-600 animate-pulse" />
                <span className="text-xs text-slate-400">Milestone specifications will print here after input execution.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Meeting Summary Panel */}
      {activeTab === 'summary' && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border border-neutral-850 bg-neutral-900/10 space-y-4">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-300" /> AI Meeting Summary Bot
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Paste raw scribbles, transcript lines, or quick sprint decisions. Gemini organizes them into summaries and concrete action items.
            </p>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-slate-400 block">Transcript / Scribbles</label>
              <textarea
                value={meetingNotes}
                onChange={(e) => setMeetingNotes(e.target.value)}
                rows={6}
                className="w-full p-3.5 rounded-lg bg-black border border-neutral-800 text-xs text-slate-200 focus:outline-none focus:border-white font-mono leading-relaxed"
                placeholder="Paste transcript notes..."
              />
            </div>

            <button
              onClick={handleSummarizeNotes}
              className="px-5 py-2.5 rounded-lg bg-white hover:bg-slate-200 text-black text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4.5 h-4.5" />
              <span>Summarize Transcript</span>
            </button>
          </div>

          <div className="p-6 rounded-xl border border-neutral-850 bg-neutral-900/10 flex flex-col justify-between">
            {generatedSummary ? (
              <div className="space-y-5 max-h-96 overflow-y-auto pr-1">
                <div>
                  <h3 className="font-display font-bold text-sm text-white">Formatted Summary</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1.5 bg-black p-3 rounded border border-neutral-850">
                    {generatedSummary.summary}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Action Items</span>
                  <ul className="space-y-1.5">
                    {generatedSummary.actionItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-slate-200 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Key Milestones</span>
                  <ul className="space-y-1.5">
                    {generatedSummary.milestones.map((milestone, idx) => (
                      <li key={idx} className="text-xs text-slate-400 list-disc list-inside">
                        {milestone}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2.5">
                <Clock className="w-10 h-10 text-slate-600 animate-pulse" />
                <span className="text-xs text-slate-400">Summarized lists will print here after model processing completes.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Code Review Panel */}
      {activeTab === 'codereview' && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border border-neutral-850 bg-neutral-900/10 space-y-4">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-slate-300" /> AI Code Auditor & Reviewer
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verify Soroban rust contracts, JS helper modules, or Solidity logic for vulnerabilities, overflow issues, or Gas limits before deployment.
            </p>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-slate-400 block">Rust or TypeScript Codeblock</label>
              <textarea
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                rows={8}
                className="w-full p-3.5 rounded-lg bg-black border border-neutral-800 text-xs text-slate-200 focus:outline-none focus:border-white font-mono leading-relaxed"
                placeholder="Paste code blocks..."
              />
            </div>

            <button
              onClick={handleCodeReview}
              className="px-5 py-2.5 rounded-lg bg-white hover:bg-slate-200 text-black text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4.5 h-4.5" />
              <span>Review Quality Score</span>
            </button>
          </div>

          <div className="p-6 rounded-xl border border-neutral-850 bg-neutral-900/10 flex flex-col justify-between">
            {generatedReview ? (
              <div className="space-y-5 max-h-[420px] overflow-y-auto pr-1">
                <div className="flex justify-between items-center border-b border-neutral-850 pb-3">
                  <div>
                    <h3 className="font-display font-bold text-sm text-white">Auditor Report</h3>
                    <p className="text-xs text-slate-400 mt-1">Evaluated via series-A security checklist.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">Score:</span>
                    <span className={`text-lg font-bold font-mono px-2.5 py-1 rounded ${generatedReview.score >= 80 ? 'bg-neutral-800 text-slate-200' : 'bg-neutral-900 text-slate-400'}`}>
                      {generatedReview.score}/100
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Executive Summary</span>
                  <p className="text-xs text-slate-300 leading-relaxed italic bg-black p-3 rounded border border-neutral-850">
                    "{generatedReview.overallFeedback}"
                  </p>
                </div>

                <div className="space-y-3.5">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Detected Issues & Recommendations</span>
                  {generatedReview.issues.map((issue, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-850 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-200">Line {issue.line || 'General'}</span>
                        <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-neutral-900 text-slate-300 border border-neutral-800`}>
                          {issue.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{issue.description}</p>
                      <div className="p-2 bg-black rounded border border-neutral-850 font-mono text-[10px] text-slate-200">
                        <span className="text-slate-500 block text-[9px] uppercase mb-1 font-bold">Suggested Correction</span>
                        <code>{issue.suggestion}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2.5">
                <FileCode2 className="w-10 h-10 text-slate-600 animate-pulse" />
                <span className="text-xs text-slate-400">Rust and JS code reports will compile here.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Task Prioritizer Panel */}
      {activeTab === 'prioritizer' && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border border-neutral-850 bg-neutral-900/10 space-y-4">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-slate-300" /> AI Strategic Task Prioritization
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyzes your existing board tasks (currently loaded: <span className="text-slate-200 font-mono font-bold">{activeTasks.length}</span> items) and recalculates the optimum priority order using critical path and resource constraint models.
            </p>
 
            <button
              onClick={handlePrioritize}
              className="px-5 py-2.5 rounded-lg bg-white hover:bg-slate-200 text-black text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4.5 h-4.5" />
              <span>Prioritize Active Backlog</span>
            </button>
          </div>
 
          <div className="p-6 rounded-xl border border-neutral-850 bg-neutral-900/10 flex flex-col justify-between">
            {generatedPrioritization ? (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Strategic Rationale</span>
                  <p className="text-xs text-slate-300 leading-relaxed bg-black p-3.5 rounded border border-neutral-850">
                    {generatedPrioritization.rationale}
                  </p>
                </div>
 
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Recommended Sequence Order</span>
                  <div className="space-y-1.5">
                    {generatedPrioritization.prioritizedTaskIds.map((id, index) => {
                      const task = activeTasks.find(t => t.id === id);
                      return (
                        <div key={index} className="p-2.5 rounded bg-black border border-neutral-850 flex items-center gap-3">
                          <span className="font-mono text-slate-300 font-bold text-xs">#{index + 1}</span>
                          <span className="text-xs text-slate-200 font-semibold truncate">
                            {task ? task.title : `Task ID: ${id}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2.5">
                <ListChecks className="w-10 h-10 text-slate-600 animate-pulse" />
                <span className="text-xs text-slate-400">Strategic reordering list will output here. Ensure active board tasks exist first.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Document Generation Panel */}
      {activeTab === 'document-gen' && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-6 rounded-xl border border-neutral-850 bg-neutral-900/10 space-y-4">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-300" /> AI Document Architect
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate fully structured, technical Product Requirement Documents (PRDs), Sprint Reports, or Venture funding proposals utilizing Gemini.
            </p>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400 block">Document Type</label>
                <div className="grid grid-cols-3 gap-1">
                  {(['prd', 'report', 'proposal'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setDocType(type)}
                      className={`py-1.5 rounded text-[10px] uppercase font-mono font-bold border transition-colors ${docType === type ? 'bg-white text-black border-white' : 'bg-black text-slate-400 border-neutral-800 hover:text-white'}`}
                    >
                      {type === 'prd' ? 'PRD Spec' : type === 'report' ? 'Report' : 'Proposal'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400 block">Title / Topic</label>
                <input
                  type="text"
                  value={docTopic}
                  onChange={(e) => setDocTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black border border-neutral-800 text-xs text-slate-100 focus:outline-none focus:border-white"
                  placeholder="e.g. Soroban Token Validation Protocol"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400 block">Generation Instructions</label>
                <textarea
                  value={docPrompt}
                  onChange={(e) => setDocPrompt(e.target.value)}
                  rows={4}
                  className="w-full p-3.5 rounded-lg bg-black border border-neutral-800 text-xs text-slate-200 focus:outline-none focus:border-white font-sans leading-relaxed"
                  placeholder="Detail explicit guidelines or compliance constraints for the AI Spec Writer..."
                />
              </div>
            </div>

            <button
              onClick={handleGenerateDoc}
              className="w-full py-2.5 rounded-lg bg-white hover:bg-slate-200 text-black text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Document Spec</span>
            </button>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 border border-neutral-850 rounded-xl overflow-hidden bg-neutral-900/10 min-h-[450px]">
            {/* Sidebar with document histories */}
            <div className="border-r border-neutral-850 bg-black/40 p-4 space-y-3.5">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Archived Documents</span>
              <div className="space-y-2 max-h-[360px] overflow-y-auto">
                {documents.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`w-full text-left p-2.5 rounded border transition-all flex flex-col gap-1 ${selectedDoc?.id === doc.id ? 'bg-neutral-900 border-slate-300' : 'bg-neutral-950 border-neutral-850 hover:bg-neutral-900/50'}`}
                  >
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-neutral-800 text-slate-300 border border-neutral-700 rounded self-start">
                      {doc.type}
                    </span>
                    <span className="text-xs font-bold text-slate-200 line-clamp-1">{doc.title}</span>
                    <span className="text-[9px] font-mono text-slate-500">{new Date(doc.createdAt).toLocaleDateString()}</span>
                  </button>
                ))}
                {documents.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    No documents created yet.
                  </div>
                )}
              </div>
            </div>

            {/* Main view preview with custom Markdown styling */}
            <div className="md:col-span-2 p-6 flex flex-col justify-between max-h-[450px] overflow-y-auto">
              {selectedDoc ? (
                <div className="space-y-4">
                  <div className="border-b border-neutral-800 pb-3">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Document Previewer</span>
                    <h2 className="text-base font-bold text-white mt-1">{selectedDoc.title}</h2>
                  </div>
                  <div className="text-xs text-slate-300 prose prose-invert prose-xs max-w-none leading-relaxed space-y-3">
                    <ReactMarkdown>{selectedDoc.content}</ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2.5 my-auto">
                  <FileText className="w-10 h-10 text-slate-600 animate-pulse" />
                  <span className="text-xs text-slate-400">Select an archived document or generate a new one to inspect full specifications.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Search (RAG) Panel */}
      {activeTab === 'search-rag' && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 p-6 rounded-xl border border-neutral-850 bg-neutral-900/10 space-y-4">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-300" /> AI Knowledge Search (RAG)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Query your active workflow boards, tasks, blockchain sequence signatures, and generated specification docs using deep semantic vector reasoning.
            </p>

            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-black border border-neutral-800 text-xs text-slate-100 focus:outline-none focus:border-white font-sans"
                  placeholder="Ask any question about your workspace..."
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              </div>

              <button
                onClick={handleSearchRAG}
                className="w-full py-2 rounded-lg bg-white hover:bg-slate-200 text-black text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Search Workspace</span>
              </button>
            </div>

            <div className="space-y-2 pt-2 border-t border-neutral-850">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Suggested Inquiries</span>
              <div className="space-y-1.5">
                {[
                  "Who is working on Soroban multi-sig?",
                  "Which tasks are done or completed on-chain?",
                  "Analyze our blockchain transaction sequence logs"
                ].map((pill, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSearchQuery(pill);
                      triggerAI('/api/ai/search', { query: pill }, (data) => {
                        setSearchResult(data);
                      });
                    }}
                    className="w-full text-left p-2 rounded bg-black/60 border border-neutral-850 text-[11px] text-slate-300 hover:text-white hover:border-slate-300 transition-colors truncate"
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 p-6 rounded-xl border border-neutral-850 bg-neutral-900/10 flex flex-col justify-between min-h-[400px]">
            {searchResult ? (
              <div className="space-y-5 max-h-[460px] overflow-y-auto pr-1">
                <div>
                  <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">AI Semantic Synthesis Answer</h4>
                  <div className="text-xs text-slate-200 bg-black/50 border border-neutral-850 p-4 rounded-lg leading-relaxed prose prose-invert prose-xs">
                    <ReactMarkdown>{searchResult.answer}</ReactMarkdown>
                  </div>
                </div>

                {/* Match indicators highlight */}
                <div className="space-y-3 pt-3 border-t border-neutral-850">
                  <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Relevant Highlighted References</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {/* Highlighted Tasks */}
                    {searchResult.matchedTaskIds && searchResult.matchedTaskIds.map(id => {
                      const matchedTask = activeTasks.find(t => t.id === id);
                      if (!matchedTask) return null;
                      return (
                        <div key={id} className="p-3 rounded bg-neutral-950 border border-emerald-800/40 shadow-[0_0_10px_rgba(16,185,129,0.05)] space-y-1">
                          <span className="text-[9px] font-mono text-emerald-400 uppercase block font-bold">● Active Task Match</span>
                          <span className="text-xs font-bold text-slate-200 block truncate">{matchedTask.title}</span>
                          <p className="text-[10px] text-slate-400 line-clamp-1">{matchedTask.description}</p>
                        </div>
                      );
                    })}

                    {/* Highlighted Documents */}
                    {searchResult.matchedDocIds && searchResult.matchedDocIds.map(id => {
                      const matchedDoc = documents.find(d => d.id === id);
                      if (!matchedDoc) return null;
                      return (
                        <div key={id} className="p-3 rounded bg-neutral-950 border border-indigo-800/40 shadow-[0_0_10px_rgba(99,102,241,0.05)] space-y-1">
                          <span className="text-[9px] font-mono text-indigo-400 uppercase block font-bold">● Archive Doc Match</span>
                          <span className="text-xs font-bold text-slate-200 block truncate">{matchedDoc.title}</span>
                          <span className="text-[9px] font-mono text-slate-400">Type: {matchedDoc.type}</span>
                        </div>
                      );
                    })}
                  </div>

                  {(!searchResult.matchedTaskIds || searchResult.matchedTaskIds.length === 0) &&
                   (!searchResult.matchedDocIds || searchResult.matchedDocIds.length === 0) && (
                    <span className="text-[10px] font-mono text-slate-500 block">No secondary highlighted list entities matches for this search. All feedback generated directly in answer.</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2.5 my-auto">
                <Search className="w-10 h-10 text-slate-600 animate-pulse" />
                <span className="text-xs text-slate-400">Perform a search on the left side to compile synthesis answers and matches across the workspace.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Smart Analytics Panel */}
      {activeTab === 'analytics-nl' && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-6 rounded-xl border border-neutral-850 bg-neutral-900/10 space-y-4">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-slate-300" /> AI-Powered Analytics
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ask natural language queries like <span className="text-slate-300">"Why did sales drop this month?"</span> or evaluate project bottlenecks and completion velocity scores.
            </p>

            <div className="space-y-3">
              <textarea
                value={analyticsQuery}
                onChange={(e) => setAnalyticsQuery(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-lg bg-black border border-neutral-800 text-xs text-slate-200 focus:outline-none focus:border-white leading-relaxed"
                placeholder="Query workspace metrics..."
              />

              <button
                onClick={handleAnalytics}
                className="w-full py-2.5 rounded-lg bg-white hover:bg-slate-200 text-black text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Execute Smart Analysis</span>
              </button>
            </div>

            <div className="space-y-2 pt-2 border-t border-neutral-850">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Common Queries</span>
              <div className="space-y-1.5">
                {[
                  "Why did sales drop this month?",
                  "Analyze task velocity and bottleneck risk points",
                  "Evaluate on-chain task audit coverage velocity"
                ].map((pill, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setAnalyticsQuery(pill);
                      triggerAI('/api/ai/analytics', { query: pill }, (data) => {
                        setAnalyticsResult(data);
                      });
                    }}
                    className="w-full text-left p-2 rounded bg-black/60 border border-neutral-850 text-[11px] text-slate-300 hover:text-white hover:border-slate-300 transition-colors truncate"
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </div>

            {/* Glowing KPI blocks */}
            {analyticsResult && analyticsResult.kpis && (
              <div className="space-y-2 pt-3 border-t border-neutral-850">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">AI Derived Metrics (KPIs)</span>
                <div className="grid grid-cols-2 gap-2">
                  {analyticsResult.kpis.map((kpi, idx) => (
                    <div key={idx} className="p-2.5 bg-neutral-950 border border-neutral-850 rounded flex flex-col gap-0.5">
                      <span className="text-[9px] font-mono text-slate-400 truncate">{kpi.label}</span>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs font-bold text-white font-mono">{kpi.value}</span>
                        <span className={`w-1.5 h-1.5 rounded-full ${kpi.status === 'success' ? 'bg-emerald-400' : kpi.status === 'warning' ? 'bg-amber-400' : kpi.status === 'danger' ? 'bg-rose-400' : 'bg-slate-400'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-7 p-6 rounded-xl border border-neutral-850 bg-neutral-900/10 flex flex-col justify-between min-h-[450px]">
            {analyticsResult ? (
              <div className="space-y-5 max-h-[480px] overflow-y-auto pr-1">
                <div>
                  <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">Business Intelligence Analysis Report</h4>
                  <div className="text-xs text-slate-200 bg-black/50 border border-neutral-850 p-4 rounded-lg leading-relaxed prose prose-invert prose-xs">
                    <ReactMarkdown>{analyticsResult.report}</ReactMarkdown>
                  </div>
                </div>

                {/* Responsive Recharts Display */}
                {analyticsResult.chartData && analyticsResult.chartData.length > 0 && (
                  <div className="space-y-2.5 pt-3 border-t border-neutral-850">
                    <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Analysis Distribution Metric Chart</h4>
                    <div className="h-44 w-full bg-black/30 border border-neutral-850 rounded-lg p-2 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsResult.chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', borderRadius: '6px' }}
                            labelStyle={{ color: '#ffffff', fontSize: '11px', fontWeight: 'bold' }}
                            itemStyle={{ color: '#cbd5e1', fontSize: '10px' }}
                          />
                          <Bar dataKey="value" fill="#ffffff" radius={[4, 4, 0, 0]}>
                            {analyticsResult.chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#ffffff' : '#4b5563'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2.5 my-auto">
                <BarChart3 className="w-10 h-10 text-slate-600 animate-pulse" />
                <span className="text-xs text-slate-400">Trigger analysis on the left to see advanced business intelligence, KPI predictions, and charts.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
