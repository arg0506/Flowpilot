import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, Check, Trash2, Edit3, ArrowRightLeft, Layers, 
  Table, Calendar, Highlighter, Sparkles, Send, RefreshCw, Search, X, Bot 
} from 'lucide-react';
import { motion } from 'motion/react';
import { Task, TaskStatus, TaskPriority, BlockchainTx } from '../types';

interface WorkspaceViewsProps {
  tasks: Task[];
  transactions?: BlockchainTx[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdateTaskStatus: (id: string, status: TaskStatus) => void;
  onDeleteTask: (id: string) => void;
}

export default function WorkspaceViews({ tasks, transactions, onAddTask, onUpdateTaskStatus, onDeleteTask }: WorkspaceViewsProps) {
  const [subTab, setSubTab] = useState<'kanban' | 'table' | 'timeline' | 'whiteboard'>('kanban');
  
  // Tasks Form Controls
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
  const [newStatus, setNewStatus] = useState<TaskStatus>('todo');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // AI Chat Copilot States
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    { role: 'assistant', text: 'Greetings! I am your FlowPilot Project Assistant. How can I assist you with your Soroban contracts or automated workflows today?' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Whiteboard Canvas States
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(4);

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statuses: TaskStatus[] = ['backlog', 'todo', 'in_progress', 'in_review', 'done'];

  const getPriorityStyle = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-slate-300 bg-white/5 border-white/10';
      case 'low': return 'text-slate-500 bg-white/5 border-white/10';
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle,
      description: newDesc,
      status: newStatus,
      priority: newPriority,
    });

    setNewTitle('');
    setNewDesc('');
    setNewPriority('medium');
    setNewStatus('todo');
    setShowForm(false);
  };

  // AI Chat Submit Handler
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg,
          history: chatMessages,
          tasks: tasks,
          transactions: transactions
        }),
      });
      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'assistant', text: data.text || "No response received." }]);
    } catch (err: any) {
      setChatMessages(prev => [...prev, { role: 'assistant', text: "Copilot Error: Failed to connect to AI server nodes." }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Whiteboard Canvas Actions
  useEffect(() => {
    if (subTab === 'whiteboard' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [subTab]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex w-full h-full max-w-7xl mx-auto selection:bg-white selection:text-black font-sans relative overflow-hidden"
    >
      
      {/* Main Views Container */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl text-white">Interactive Workspaces</h1>
            <p className="text-xs text-slate-400">Backlog reviews, board management, and shared visual whiteboard grids.</p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search board tasks..."
                className="pl-9 pr-4 py-2 rounded-lg bg-black border border-neutral-800 text-xs text-slate-200 focus:outline-none focus:border-white font-mono w-48 sm:w-64"
              />
            </div>
            
            <button
              onClick={() => setCopilotOpen(!copilotOpen)}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Chat Copilot</span>
            </button>
          </div>
        </div>

        {/* Workspace views navbar subtabs */}
        <div className="flex flex-wrap items-center gap-1 border-b border-neutral-900 pb-2">
          <button 
            onClick={() => setSubTab('kanban')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-all ${subTab === 'kanban' ? 'bg-neutral-900 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            <Layers className="w-4 h-4 text-white" />
            <span>Kanban Board</span>
          </button>
          <button 
            onClick={() => setSubTab('table')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-all ${subTab === 'table' ? 'bg-neutral-900 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            <Table className="w-4 h-4 text-white" />
            <span>Table Review</span>
          </button>
          <button 
            onClick={() => setSubTab('timeline')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-all ${subTab === 'timeline' ? 'bg-neutral-900 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            <Calendar className="w-4 h-4 text-white" />
            <span>Timeline Roadmap</span>
          </button>
          <button 
            onClick={() => setSubTab('whiteboard')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-all ${subTab === 'whiteboard' ? 'bg-neutral-900 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            <Highlighter className="w-4 h-4 text-white" />
            <span>Whiteboard Canvas</span>
          </button>
        </div>

        {/* Task Creator Form drawer overlay modal */}
        {showForm && (
          <div className="p-5 rounded-xl border border-neutral-850 bg-neutral-900/90 max-w-lg space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-850 pb-2">
              <h4 className="text-xs font-bold text-slate-200">Create Workspace Task</h4>
              <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black border border-neutral-800 text-xs text-slate-100 focus:outline-none focus:border-white font-sans"
                  placeholder="e.g. Audit Rust claims verification logic"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400">Description</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded bg-black border border-neutral-800 text-xs text-slate-200 focus:outline-none focus:border-white font-sans"
                  placeholder="Task instructions and guidelines..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                    className="w-full px-2 py-1.5 rounded bg-black border border-neutral-800 text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400">Status Lane</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as TaskStatus)}
                    className="w-full px-2 py-1.5 rounded bg-black border border-neutral-800 text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="backlog">Backlog</option>
                    <option value="todo">Todo</option>
                    <option value="in_progress">In Progress</option>
                    <option value="in_review">In Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded bg-white hover:bg-slate-200 text-black font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Insert Task Card
              </button>
            </form>
          </div>
        )}

        {/* 1. KANBAN VIEW PANEL */}
        {subTab === 'kanban' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-mono text-slate-400">Interactive Lane Management</span>
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-200 text-black font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Task Card
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
              {statuses.map((status, sIdx) => {
                const laneTasks = filteredTasks.filter(t => t.status === status);
                return (
                  <motion.div 
                    key={status} 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: sIdx * 0.05, duration: 0.4 }}
                    className="p-4 rounded-xl border border-neutral-850 bg-neutral-900/10 flex flex-col h-[520px] shrink-0 min-w-[200px]"
                  >
                    <div className="flex justify-between items-center pb-3 border-b border-neutral-850/40 mb-3">
                      <span className="text-xs font-bold text-slate-200 capitalize font-display">
                        {status.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-neutral-950 border border-neutral-850 text-slate-400 px-1.5 rounded">
                        {laneTasks.length}
                      </span>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                      {laneTasks.map(task => (
                        <motion.div 
                          key={task.id} 
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.02, borderColor: '#ffffff' }}
                          transition={{ duration: 0.2 }}
                          className="p-3.5 rounded-lg border border-neutral-850 bg-neutral-900/30 space-y-2.5 shadow transition-colors relative group"
                        >
                          <div className="space-y-1">
                            <span className="text-xs font-semibold text-slate-100 block leading-tight">{task.title}</span>
                            <p className="text-[11px] text-slate-400 leading-relaxed">{task.description}</p>
                          </div>

                          <div className="flex justify-between items-center pt-1.5 border-t border-neutral-900 text-[10px]">
                            <span className={`px-1.5 py-0.5 rounded border uppercase text-[9px] font-bold font-mono ${getPriorityStyle(task.priority)}`}>
                              {task.priority}
                            </span>
                            
                            <div className="flex gap-1 opacity-65 group-hover:opacity-100 transition-opacity">
                              {/* Status shifting */}
                              <select
                                value={task.status}
                                onChange={(e) => onUpdateTaskStatus(task.id, e.target.value as TaskStatus)}
                                className="bg-black border border-neutral-850 rounded font-mono text-[9px] p-0.5 text-slate-400"
                              >
                                {statuses.map(s => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>

                              <button 
                                onClick={() => onDeleteTask(task.id)}
                                className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                                title="Delete task card"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. TABLE VIEW PANEL */}
        {subTab === 'table' && (
          <div className="p-4 rounded-xl border border-neutral-850 bg-neutral-900/10 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-850 font-mono text-slate-400 text-[10px] uppercase">
                <tr>
                  <th className="py-3 px-4">Task Name</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Verification State</th>
                  <th className="py-3 px-4 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-850 text-slate-300">
                {filteredTasks.map((t, index) => (
                  <tr key={index} className="hover:bg-neutral-900/20">
                    <td className="py-3 px-4 font-semibold text-slate-100">{t.title}</td>
                    <td className="py-3 px-4 capitalize font-mono text-[11px]">{t.status.replace('_', ' ')}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-mono uppercase ${getPriorityStyle(t.priority)}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {t.onChainVerified ? (
                        <span className="text-[10px] font-mono text-slate-200 bg-white/5 border border-white/10 px-2 py-0.5 rounded flex items-center gap-1.5 w-max">
                          <span className="w-1.5 h-1.5 rounded-full bg-white" /> Verified
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-500">Uncommitted</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => onDeleteTask(t.id)} className="text-slate-500 hover:text-rose-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. TIMELINE VIEW ROADMAP */}
        {subTab === 'timeline' && (
          <div className="p-6 rounded-xl border border-neutral-850 bg-neutral-900/10 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-semibold text-sm text-slate-100">Chronological Roadmap</h3>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Interactive Sprint Chart</span>
            </div>

            <div className="space-y-4">
              {filteredTasks.map((t, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-3 text-xs font-semibold text-slate-200 truncate">{t.title}</div>
                  <div className="col-span-9 h-6 bg-black rounded border border-neutral-850 relative overflow-hidden">
                    {/* Width and offsets calculated based on priority simulation */}
                    <div 
                      className={`h-full rounded absolute transition-all ${t.status === 'done' ? 'bg-white/20 border-l-4 border-white' : 'bg-slate-800 border-l-4 border-slate-400'}`}
                      style={{ 
                        left: `${(index * 12) % 60}%`, 
                        width: `${Math.max(25, 100 - (index * 15) % 80)}%` 
                      }}
                    >
                      <span className="text-[9px] font-mono uppercase text-slate-300 pl-2 align-middle block leading-6">
                        {t.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. WHITEBOARD CANVAS PANEL */}
        {subTab === 'whiteboard' && (
          <div className="p-6 rounded-xl border border-neutral-850 bg-neutral-900/10 space-y-4 flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="space-y-1">
                <h3 className="font-display font-semibold text-sm text-slate-100">Collaborative Whiteboard Sandbox</h3>
                <p className="text-[11px] text-slate-400">Sketch wireframes, flow diagrams, and task maps. Cleared when session resets.</p>
              </div>

              <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 p-1.5 rounded-lg">
                {/* Custom Color Selector */}
                <div className="flex gap-1.5">
                  {['#ffffff', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155'].map(color => (
                    <button
                      key={color}
                      onClick={() => setBrushColor(color)}
                      className={`w-4 h-4 rounded-full transition-transform ${brushColor === color ? 'scale-125 border border-white' : ''}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <div className="h-4 w-px bg-neutral-800" />

                <button
                  onClick={clearCanvas}
                  className="px-2 py-1 bg-black hover:bg-neutral-900 text-rose-400 hover:text-rose-300 font-bold font-mono text-[10px] uppercase rounded border border-rose-500/15"
                >
                  Clear Sketch
                </button>
              </div>
            </div>

            {/* Drawing Canvas */}
            <div className="border border-neutral-850 rounded-lg overflow-hidden bg-black h-96 relative">
              <canvas
                ref={canvasRef}
                width={800}
                height={384}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full h-full cursor-crosshair"
              />
            </div>
          </div>
        )}
      </div>

      {/* Side Chat Copilot (Slide-out panel) */}
      {copilotOpen && (
        <div className="w-80 bg-neutral-950 border-l border-neutral-850 flex flex-col h-screen shrink-0 relative">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-white via-slate-300 to-slate-500" />
          
          <div className="p-4 border-b border-neutral-850 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="w-4.5 h-4.5 text-white animate-pulse" />
              <span className="font-display font-bold text-xs text-white">FlowPilot AI Chat</span>
            </div>
            <button onClick={() => setCopilotOpen(false)} className="text-slate-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-3 rounded-lg text-xs leading-relaxed max-w-[90%] ${msg.role === 'user' ? 'bg-white text-black font-semibold rounded-tr-none' : 'bg-neutral-900 border border-neutral-850 text-slate-300 rounded-tl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {chatLoading && (
              <div className="flex items-center gap-2 text-slate-500 text-[11px] font-mono">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Thinking...</span>
              </div>
            )}
          </div>

          {/* Chat Form input */}
          <form onSubmit={handleChatSubmit} className="p-3.5 border-t border-neutral-850 bg-black flex gap-2">
            <input
              type="text"
              required
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask Copilot something..."
              className="flex-1 px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-slate-200 focus:outline-none focus:border-white"
            />
            <button
              type="submit"
              disabled={chatLoading}
              className="p-2.5 rounded-lg bg-white hover:bg-slate-200 text-black font-bold transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </motion.div>
  );
}
