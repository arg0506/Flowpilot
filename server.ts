import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// --- Database / State persistence in memory ---
let userProfile = {
  id: "user_01",
  name: "Argha Dev",
  username: "arghadev",
  email: "argha0506@gmail.com",
  organization: "Argha Labs",
  tier: "growth" as "free" | "growth" | "enterprise",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
};

let tasksList = [
  {
    id: "task_1",
    title: "Configure Soroban Devnet RPC endpoints",
    description: "Setup standard Docker container routing and map Freighter sandbox keys.",
    status: "in_progress",
    priority: "high",
    createdAt: new Date().toISOString(),
  },
  {
    id: "task_2",
    title: "Implement Multi-Sig threshold rules",
    description: "Write Rust unit tests to assert signature weights on Soroban claims helper contract.",
    status: "todo",
    priority: "urgent",
    createdAt: new Date().toISOString(),
  },
  {
    id: "task_3",
    title: "Draft Series-A product specs summary",
    description: "Review workflow generation prompts and optimize paid model rate limits.",
    status: "done",
    priority: "medium",
    createdAt: new Date().toISOString(),
    onChainVerified: true,
    txHash: "hash_soroban_e3f2da91a32b918f0c4a"
  },
];

let transactionsList = [
  {
    hash: "hash_soroban_e3f2da91a32b918f0c4a",
    action: "VERIFY_TASK_MILESTONE",
    payload: '{"taskId":"task_3","title":"Draft Series-A product specs summary","status":"done"}',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    status: "confirmed" as "confirmed" | "pending" | "failed",
    contractAddress: "CCX49D012FA83F88D02C101018F0C49E3F2DA91A32B918F0C4A",
    sequenceNumber: "492210291048",
  }
];

let documentsList = [
  {
    id: "doc_1",
    title: "Soroban Token Verification Protocol PRD",
    type: "prd",
    content: `# Product Requirement Document (PRD)\n\n## Title: Soroban Verification Protocol\n\n### 1. Objective\nIntegrate cryptographic multi-sig validation with live user actions so milestones are automatically verified on-chain. This minimizes centralized bottlenecking and boosts secure audit logs.\n\n### 2. Architecture\n- **Client**: Vite / React 18, utilizing the dynamic iPhone Notch floating menu.\n- **Backend**: Express + tsx server implementing lazy-loaded Google Gemini SDK.\n- **Blockchain**: Stellar Soroban smart contracts utilizing threshold signatures.`,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  }
];

// --- API Endpoints for User Profile ---
app.get("/api/user", (req, res) => {
  res.json(userProfile);
});

app.put("/api/user", (req, res) => {
  const { name, username, email, organization, tier, avatar } = req.body;
  if (name !== undefined) userProfile.name = name;
  if (username !== undefined) userProfile.username = username;
  if (email !== undefined) userProfile.email = email;
  if (organization !== undefined) userProfile.organization = organization;
  if (tier !== undefined) userProfile.tier = tier;
  if (avatar !== undefined) userProfile.avatar = avatar;
  res.json(userProfile);
});

// --- API Endpoints for Tasks ---
app.get("/api/tasks", (req, res) => {
  res.json(tasksList);
});

app.post("/api/tasks", (req, res) => {
  const { tasks } = req.body;
  if (Array.isArray(tasks)) {
    const processed = tasks.map((t, idx) => ({
      ...t,
      id: t.id || `task_${Date.now()}_${idx}_${Math.floor(Math.random() * 1000)}`,
      createdAt: t.createdAt || new Date().toISOString(),
    }));
    tasksList.push(...processed);
    return res.status(201).json(processed);
  } else {
    const task = req.body;
    const newTask = {
      ...task,
      id: task.id || `task_${Date.now()}`,
      createdAt: task.createdAt || new Date().toISOString(),
    };
    tasksList.push(newTask);
    return res.status(201).json(newTask);
  }
});

app.put("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;
  const index = tasksList.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }
  tasksList[index] = {
    ...tasksList[index],
    ...updateFields,
  };
  res.json(tasksList[index]);
});

app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const index = tasksList.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }
  const deletedTask = tasksList.splice(index, 1)[0];
  res.json(deletedTask);
});

// --- API Endpoints for Transactions ---
app.get("/api/transactions", (req, res) => {
  res.json(transactionsList);
});

app.post("/api/transactions", (req, res) => {
  const tx = req.body;
  if (!tx.hash) {
    return res.status(400).json({ error: "Transaction hash is required" });
  }
  const newTx = {
    ...tx,
    timestamp: tx.timestamp || new Date().toISOString(),
  };
  transactionsList.unshift(newTx);
  res.status(201).json(newTx);
});

// --- API Endpoints for Generated Documents ---
app.get("/api/documents", (req, res) => {
  res.json(documentsList);
});

// Lazy-initialized Gemini client using the requested Agent API key
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    // Explicitly using the user-provided Agent API key as the core credentials
    const apiKey = "OhVcTC8CQZj2E6t91muMXMMEVFnMQno7dAys5Mx7";
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Robust wrapper with automatic exponential retries and model fallbacks for 503/429 transient errors
async function generateContentWithRetry(
  ai: GoogleGenAI,
  options: any
): Promise<any> {
  const maxRetries = 4;
  let delay = 1000;
  const originalModel = options.model || "gemini-3.5-flash";
  let currentModel = originalModel;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      options.model = currentModel;
      const response = await ai.models.generateContent(options);
      return response;
    } catch (error: any) {
      const errorMsg = error?.message || "";
      const is503 = error?.status === 503 || error?.code === 503 || errorMsg.includes("503") || errorMsg.includes("UNAVAILABLE") || errorMsg.includes("high demand") || errorMsg.includes("spikes in demand");
      const is429 = error?.status === 429 || error?.code === 429 || errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED") || errorMsg.includes("Quota exceeded");
      const isLimitZero = errorMsg.includes("limit: 0") || errorMsg.includes("limit:0") || errorMsg.includes("limit:  0") || errorMsg.includes("quotaId") || errorMsg.includes("Quota exceeded for metric");

      // If we got a hard quota error (limit: 0) on a paid/unsupported model, immediately switch to a free model and retry
      if (isLimitZero) {
        if (currentModel !== "gemini-3.1-flash-lite") {
          console.warn(`[Gemini API] Hard quota limit of 0 hit for model ${currentModel}. Immediately falling back to gemini-3.1-flash-lite...`);
          currentModel = "gemini-3.1-flash-lite";
          // Reduce attempt counter or retry immediately so we don't lose an attempt
          attempt--;
          continue;
        }
      }

      const isTransient = is503 || is429;
      
      if (isTransient && attempt < maxRetries) {
        // On attempt 2 or 3, if it fails due to high demand on flash, try falling back to gemini-3.1-flash-lite which has separate quotas
        if (attempt >= 2) {
          currentModel = currentModel === "gemini-3.5-flash" ? "gemini-3.1-flash-lite" : "gemini-3.5-flash";
          console.warn(`[Gemini API] Switching model for retry attempt ${attempt + 1} from ${options.model} to ${currentModel}`);
        }
        
        console.warn(`[Gemini API] Attempt ${attempt} failed with transient error: ${errorMsg}. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      } else {
        console.error(`[Gemini API] Permanent error or max retries reached on attempt ${attempt}:`, error);
        throw error;
      }
    }
  }
}

// 1. API Endpoint: Generate Workflow
app.post("/api/ai/generate-workflow", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    const ai = getGeminiClient();
    const response = await generateContentWithRetry(ai, {
      model: "gemini-3.5-flash",
      contents: `Generate a structured operational workflow to achieve the following goal: "${prompt}". Provide 4-6 chronological, actionable steps with dependencies. Make it look professional and team-focused.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["name", "description", "steps"],
          properties: {
            name: { type: Type.STRING, description: "Name of the workflow" },
            description: { type: Type.STRING, description: "Summary description of the workflow" },
            steps: {
              type: Type.ARRAY,
              description: "List of chronological steps",
              items: {
                type: Type.OBJECT,
                required: ["id", "title", "description", "agent"],
                properties: {
                  id: { type: Type.STRING, description: "Unique step ID, e.g. step_1" },
                  title: { type: Type.STRING, description: "Title of this step" },
                  description: { type: Type.STRING, description: "Detailed task explanation" },
                  agent: { type: Type.STRING, description: "Recommended specialist role or automation bot to execute this step" },
                  dependsOn: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Optional list of step IDs that must be completed first",
                  },
                },
              },
            },
          },
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    
    // Automatically build tasks from these steps and deploy to the backlog!
    if (result.steps && Array.isArray(result.steps)) {
      const autoTasks = result.steps.map((step: any, idx: number) => ({
        id: `task_wf_${Date.now()}_${idx}_${Math.floor(Math.random() * 1000)}`,
        title: `${result.name || "Workflow"}: ${step.title}`,
        description: `${step.description} (Agent: ${step.agent || "AI Copilot"})${step.dependsOn && step.dependsOn.length > 0 ? '. Depends on: ' + step.dependsOn.join(', ') : ''}`,
        status: "backlog",
        priority: "medium",
        createdAt: new Date().toISOString()
      }));
      tasksList.push(...autoTasks);
      result.autoDeployedTasks = autoTasks;
    }

    res.json(result);
  } catch (error: any) {
    console.error("Workflow Gen Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate workflow" });
  }
});

// 2. API Endpoint: Plan Project
app.post("/api/ai/plan-project", async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Project name is required." });
    }

    const ai = getGeminiClient();
    const prompt = `Create a complete project plan, timeline milestones, and initial task breakdowns for a project called "${name}" described as follows: "${description || "General development"}".`;

    const response = await generateContentWithRetry(ai, {
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["timeline", "tasks"],
          properties: {
            timeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["week", "milestone", "status"],
                properties: {
                  week: { type: Type.STRING, description: "Timeframe e.g. 'Week 1', 'Week 2'" },
                  milestone: { type: Type.STRING, description: "Target milestone goal" },
                  status: { type: Type.STRING, description: "Initial milestone status e.g. 'planning', 'upcoming'" },
                },
              },
            },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["title", "description", "priority", "assignee"],
                properties: {
                  title: { type: Type.STRING, description: "Actionable task name" },
                  description: { type: Type.STRING, description: "Task description and requirements" },
                  priority: { type: Type.STRING, description: "e.g. 'high', 'medium', 'low'" },
                  assignee: { type: Type.STRING, description: "Suggested assignee role e.g. Frontend Engineer, DevOps" },
                },
              },
            },
          },
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Project Planner Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate project plan" });
  }
});

// 3. API Endpoint: Prioritize Tasks
app.post("/api/ai/prioritize-tasks", async (req, res) => {
  try {
    const { tasks } = req.body;
    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ error: "A list of tasks is required." });
    }

    const ai = getGeminiClient();
    const response = await generateContentWithRetry(ai, {
      model: "gemini-3.5-flash",
      contents: `Prioritize the following project tasks from most critical to least critical, and provide a professional explanation / strategy for this sequence:\n${JSON.stringify(tasks)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["rationale", "prioritizedTaskIds"],
          properties: {
            rationale: { type: Type.STRING, description: "A detailed strategic review of why this order is critical" },
            prioritizedTaskIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "The task IDs in the recommended chronological execution order",
            },
          },
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Task Prioritize Error:", error);
    res.status(500).json({ error: error.message || "Failed to prioritize tasks" });
  }
});

// 4. API Endpoint: Summarize Meeting Notes
app.post("/api/ai/summarize-meeting", async (req, res) => {
  try {
    const { notes } = req.body;
    if (!notes) {
      return res.status(400).json({ error: "Meeting notes are required." });
    }

    const ai = getGeminiClient();
    const response = await generateContentWithRetry(ai, {
      model: "gemini-3.5-flash",
      contents: `Summarize these meeting transcript or rough notes into clean, actionable takeaways and specific action items:\n"${notes}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["summary", "actionItems", "milestones"],
          properties: {
            summary: { type: Type.STRING, description: "An executive high-level summary of the meeting highlights" },
            actionItems: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Explicit tasks assigned to individuals or teams",
            },
            milestones: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Key deadlines, milestones, or dates agreed upon",
            },
          },
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Meeting Summary Error:", error);
    res.status(500).json({ error: error.message || "Failed to summarize notes" });
  }
});

// 5. API Endpoint: AI Code Review
app.post("/api/ai/code-review", async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code) {
      return res.status(400).json({ error: "Code snippet is required." });
    }

    const ai = getGeminiClient();
    const response = await generateContentWithRetry(ai, {
      model: "gemini-3.5-flash",
      contents: `Perform a rigorous developer code review for security vulnerabilities, memory issues, bugs, and performance optimization on this ${language || "TypeScript"} snippet:\n\`\`\`\n${code}\n\`\`\``,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["score", "issues", "overallFeedback"],
          properties: {
            score: { type: Type.INTEGER, description: "Review score from 0 (terrible, unsafe) to 100 (flawless)" },
            issues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["line", "type", "description", "suggestion"],
                properties: {
                  line: { type: Type.INTEGER, description: "Line number of interest, or 0 if general" },
                  type: { type: Type.STRING, description: "Severity or category: 'bug', 'security', 'warning', 'style'" },
                  description: { type: Type.STRING, description: "Detailed description of the issue" },
                  suggestion: { type: Type.STRING, description: "Explicit recommendation or corrected code snippet" },
                },
              },
            },
            overallFeedback: { type: Type.STRING, description: "A high-level review summary from an expert Tech Lead perspective" },
          },
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Code Review Error:", error);
    res.status(500).json({ error: error.message || "Failed to complete code review" });
  }
});

// 6. API Endpoint: General AI chat assistant with multi-turn conversation and deep workspace context
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history, tasks, transactions } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const ai = getGeminiClient();

    // Dynamically compile workspace context for deep state-awareness
    let workspaceStateContext = "";
    if (tasks && Array.isArray(tasks) && tasks.length > 0) {
      workspaceStateContext += `\nCURRENT ACTIVE TASKS in the Kanban / Roadmap:\n` + tasks.map((t: any) => 
        `- [${t.status}] ${t.title} (${t.priority} priority)${t.onChainVerified ? ' [ON-CHAIN VERIFIED]' : ''}: ${t.description}`
      ).join('\n');
    } else {
      workspaceStateContext += `\nCurrently, there are no tasks created in this workspace backlog.`;
    }

    if (transactions && Array.isArray(transactions) && transactions.length > 0) {
      workspaceStateContext += `\n\nRECENT ON-CHAIN STELLAR TRANSACTIONS:\n` + transactions.slice(0, 5).map((tx: any) =>
        `- Tx ${tx.hash} [${tx.status}]: Deployed/signed "${tx.actionName}" with Ledger Seq ${tx.ledgerSeq || 'unknown'}`
      ).join('\n');
    }

    const systemInstruction = 
      `You are the FlowPilot AI Co-pilot: a highly sophisticated, technical Series-A startup engineering and project management advisor. ` +
      `You have real-time read access to the developer's current active workspace boards, tasks, and Stellar blockchain transactions. ` +
      `Be crisp, professional, precise, and extremely helpful. Here is the current live workspace context: ${workspaceStateContext}`;

    // Construct correct message contents sequence for multi-turn chat support
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        // Exclude the greeting to keep context clean
        if (msg.text && !msg.text.startsWith("Greetings! I am your FlowPilot")) {
          contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          });
        }
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await generateContentWithRetry(ai, {
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: error.message || "Failed to process chat message" });
  }
});

// 7. Blockchain Action Simulation: Sign & Verify
app.post("/api/blockchain/verify-tx", (req, res) => {
  const { action, payload, walletAddress } = req.body;
  if (!action || !payload) {
    return res.status(400).json({ error: "Action and payload are required to commit on-chain." });
  }

  // Generate real-looking Soroban transaction sequence and hash
  const randomHex = (size: number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
  const txHash = `hash_soroban_${randomHex(32)}`;
  const contractAddress = `C${randomHex(1).toUpperCase()}${randomHex(54).toUpperCase()}`;
  const sequenceNumber = Math.floor(100000000000 + Math.random() * 900000000000).toString();

  res.json({
    hash: txHash,
    action,
    payload: typeof payload === "string" ? payload : JSON.stringify(payload),
    timestamp: new Date().toISOString(),
    status: "confirmed",
    contractAddress,
    sequenceNumber,
    gasUsed: Math.floor(25000 + Math.random() * 15000),
    stellarLedger: Math.floor(45229000 + Math.random() * 50000),
  });
});

// 7b. Real Web3 Live Task: Autonomous Account Auditor via Stellar Horizon API
app.post("/api/blockchain/analyze-account", async (req, res) => {
  try {
    const { publicKey, network } = req.body;
    if (!publicKey) {
      return res.status(400).json({ error: "Public key is required to perform live Stellar analysis." });
    }

    const horizonUrl = network === "mainnet" 
      ? `https://horizon.stellar.org/accounts/${publicKey}`
      : `https://horizon-testnet.stellar.org/accounts/${publicKey}`;

    console.log(`[Web3 Agent] Fetching live account data from Stellar Horizon API: ${horizonUrl}`);
    
    let accountData: any = null;
    try {
      const horizonRes = await fetch(horizonUrl);
      if (horizonRes.ok) {
        accountData = await horizonRes.json();
      } else {
        console.warn(`[Web3 Agent] Horizon lookup failed with status: ${horizonRes.status}`);
      }
    } catch (fetchErr) {
      console.error("[Web3 Agent] Error calling Horizon API:", fetchErr);
    }

    // Prepare prompt for the AI Agent
    const ai = getGeminiClient();
    let prompt = "";
    if (accountData) {
      prompt = `You are an elite Autonomous Web3 AI Security Agent. You are auditing a live Stellar Account on the ${network.toUpperCase()} network.
Here is the real live data fetched from the Horizon API for address "${publicKey}":
- Sequence Number: ${accountData.sequence}
- Subentry Count: ${accountData.subentry_count}
- Balances: ${JSON.stringify(accountData.balances.map((b: any) => ({ asset: b.asset_type === "native" ? "XLM" : `${b.asset_code}:${b.asset_issuer}`, balance: b.balance })))}
- Signers: ${JSON.stringify(accountData.signers)}
- Thresholds: ${JSON.stringify(accountData.thresholds)}

Perform a professional on-chain audit and security check of this account. Detail:
1. Balance summary.
2. Signers and threshold scheme security (e.g. is it single-sig or multi-sig, is it safe?).
3. Technical recommendation steps to secure the wallet on-chain.
Provide your response in professional, polished Markdown format. Make it technical, concise, and highly realistic.`;
    } else {
      prompt = `You are an elite Autonomous Web3 AI Security Agent. The user requested an audit for Stellar address "${publicKey}" on the ${network.toUpperCase()} network, but it is currently un-funded or does not exist on the ledger.
Explain:
1. Why this address is un-funded or inactive on-chain.
2. How the user can fund it using the Stellar Friendbot (if testnet) or by sending at least 1 XLM (if mainnet) to activate it.
3. Best security practices for initializing a new Stellar wallet.
Provide your response in professional, polished Markdown format. Make it technical, concise, and highly realistic.`;
    }

    const response = await generateContentWithRetry(ai, {
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({
      success: true,
      publicKey,
      network,
      found: !!accountData,
      balances: accountData ? accountData.balances.map((b: any) => ({
        asset: b.asset_type === "native" ? "XLM" : `${b.asset_code}`,
        issuer: b.asset_issuer || "Native",
        balance: b.balance
      })) : [],
      sequence: accountData ? accountData.sequence : null,
      auditReport: response.text || "Failed to generate audit report."
    });
  } catch (error: any) {
    console.error("Stellar Audit Error:", error);
    res.status(500).json({ error: error.message || "Failed to complete live audit." });
  }
});

// 8. API Endpoint: AI Document Generation
app.post("/api/ai/generate-doc", async (req, res) => {
  try {
    const { type, topic, prompt } = req.body;
    if (!type || !topic) {
      return res.status(400).json({ error: "Document type and topic are required." });
    }

    const ai = getGeminiClient();
    const systemPrompt = `You are an elite business analyst, product manager, and senior developer relations manager.
Generate a comprehensive, expert-level document of type "${type}" (e.g., Product Requirement Document (PRD), Project Status Report, or Venture Proposal) on the following topic/prompt: "${prompt || topic}".
The document should be formatted using professional Markdown with clear structured hierarchy, tables where appropriate, checklists, and concise technical specifications.
Make it highly detailed, realistic, and tailored to the startup: FlowPilot AI (which builds developer workflows and integrates with Soroban Smart Contracts on Stellar).`;

    const response = await generateContentWithRetry(ai, {
      model: "gemini-3.5-flash",
      contents: systemPrompt,
    });

    const newDoc = {
      id: `doc_${Date.now()}`,
      title: `${type.toUpperCase()}: ${topic}`,
      type: type,
      content: response.text || "Failed to generate document content.",
      createdAt: new Date().toISOString()
    };

    documentsList.unshift(newDoc);
    res.status(201).json(newDoc);
  } catch (error: any) {
    console.error("Doc Gen Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate document" });
  }
});

// 9. API Endpoint: AI Search (RAG)
app.post("/api/ai/search", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Search query is required." });
    }

    const ai = getGeminiClient();

    // Compile active context corpus
    let corpus = `FLOWPILOT CO-PILOT WORKSPACE SEARCH CORPUS\n\n`;
    corpus += `USER INFORMATION:\n- Name: ${userProfile.name}\n- Username: @${userProfile.username}\n- Email: ${userProfile.email}\n- Organization: ${userProfile.organization}\n- Tier: ${userProfile.tier}\n\n`;
    
    corpus += `TASKS IN BACKLOG/ROADMAP:\n`;
    tasksList.forEach(t => {
      corpus += `- [ID: ${t.id}] Title: "${t.title}" | Status: ${t.status} | Priority: ${t.priority} | Description: "${t.description}"\n`;
    });

    corpus += `\nON-CHAIN TRANSACTION HISTORIES:\n`;
    transactionsList.forEach(tx => {
      corpus += `- [Hash: ${tx.hash}] Action: ${tx.action} | Status: ${tx.status} | Payload: ${tx.payload} | Sequence: ${tx.sequenceNumber || 'N/A'}\n`;
    });

    corpus += `\nINTERNAL SAVED DOCUMENTS:\n`;
    documentsList.forEach(d => {
      corpus += `- [Doc ID: ${d.id}] Title: "${d.title}" | Type: ${d.type} | Summary: "${d.content.slice(0, 150)}..."\n`;
    });

    const prompt = `You are the FlowPilot AI Intelligent Search Engine. You perform semantic, state-aware RAG search queries.
The user is asking: "${query}".
Using the provided Workspace Search Corpus, answer their query directly, factually, and helpfully in elegant markdown format.

Then, analyze which specific objects are highly relevant to their query and return their IDs/Hashes.
You MUST reply strictly with the following JSON schema representation:
{
  "answer": "Your comprehensive markdown answer...",
  "matchedTaskIds": ["list of matching task IDs e.g. task_1, task_2"],
  "matchedTxHashes": ["list of matching transaction hashes"],
  "matchedDocIds": ["list of matching document IDs"]
}

Here is the Workspace Search Corpus:
${corpus}`;

    const response = await generateContentWithRetry(ai, {
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["answer", "matchedTaskIds", "matchedTxHashes", "matchedDocIds"],
          properties: {
            answer: { type: Type.STRING, description: "Detailed semantic search response answering the user's query using the corpus." },
            matchedTaskIds: { type: Type.ARRAY, items: { type: Type.STRING } },
            matchedTxHashes: { type: Type.ARRAY, items: { type: Type.STRING } },
            matchedDocIds: { type: Type.ARRAY, items: { type: Type.STRING } },
          }
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("AI Search Error:", error);
    res.status(500).json({ error: error.message || "Failed to complete AI Search" });
  }
});

// 10. API Endpoint: AI Analytics
app.post("/api/ai/analytics", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required." });
    }

    const ai = getGeminiClient();

    // Compile active metrics
    const metrics = {
      totalTasks: tasksList.length,
      todoTasks: tasksList.filter(t => t.status === "todo").length,
      inProgressTasks: tasksList.filter(t => t.status === "in_progress").length,
      doneTasks: tasksList.filter(t => t.status === "done").length,
      backlogTasks: tasksList.filter(t => t.status === "backlog").length,
      urgentTasks: tasksList.filter(t => t.priority === "urgent").length,
      highTasks: tasksList.filter(t => t.priority === "high").length,
      onChainVerifiedTasks: tasksList.filter((t: any) => t.onChainVerified).length,
      totalTransactions: transactionsList.length,
      confirmedTransactions: transactionsList.filter(t => t.status === "confirmed").length,
      userTier: userProfile.tier
    };

    const prompt = `You are the FlowPilot AI Lead Business Intelligence & Analytics Expert.
Analyze the user's inquiry: "${query}".
Using standard Scrum, Kanban, operational, and development telemetry, provide a rich analytical review based on the following real-time workspace metrics:
${JSON.stringify(metrics, null, 2)}

Provide:
1. A detailed, multi-paragraph markdown analysis report answering the query. Be specific, highlight metrics, identify trends or bottleneck risk.
2. A list of 4 key-value KPIs (metrics) with an alert status (success, warning, danger, neutral).
3. A list of chart data points (name and value) that are relevant to the user query so we can build a chart based on this.

You MUST reply strictly in the following JSON schema structure:
{
  "report": "detailed markdown text...",
  "kpis": [
    { "label": "e.g. Backlog Density", "value": "e.g. 33%", "status": "success" }
  ],
  "chartData": [
    { "name": "Todo", "value": 3 }
  ]
}`;

    const response = await generateContentWithRetry(ai, {
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["report", "kpis", "chartData"],
          properties: {
            report: { type: Type.STRING, description: "Detailed markdown response containing the analysis." },
            kpis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["label", "value", "status"],
                properties: {
                  label: { type: Type.STRING },
                  value: { type: Type.STRING },
                  status: { type: Type.STRING, description: "One of: success, warning, danger, neutral" }
                }
              }
            },
            chartData: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["name", "value"],
                properties: {
                  name: { type: Type.STRING },
                  value: { type: Type.INTEGER }
                }
              }
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("AI Analytics Error:", error);
    res.status(500).json({ error: error.message || "Failed to run AI Analytics" });
  }
});

// Vite Server Integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FlowPilot AI Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
