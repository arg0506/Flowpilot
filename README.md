# FlowPilot AI (Series A SaaS platform)

FlowPilot AI is an enterprise-grade, high-fidelity full-stack SaaS platform designed to coordinate automated sprint workflows, visual timelines, mouse-drawing whiteboards, and cryptographically signed audit logs using Stellar's next-gen Soroban smart contracts.

---

## 🎨 Design Philosophy & UX Highlights

Inspired by state-of-the-art platforms like Linear, Stripe, Vercel, and Framer:
- **Obsidian Dark Aesthetic**: Generous negative spacing, high-contrast borders, and custom glowing elements.
- **Micro-Interactions**: Smooth spring and easing animations powered by Framer Motion.
- **Glassmorphic Grids**: Semi-transparent responsive cards mapped using Tailwind CSS variables.
- **Simulated Freighter Wallet**: Live web connection interface to sign and audit on-chain states.

---

## 🧱 Enterprise-Grade Architecture

The application is structured as a full-stack unified Node cluster (Express + Vite + React + TypeScript):

```text
       [ Browser Client / User UI ] 
                    │
                    ▼
     [ Express Full-Stack Server API ]  ◄───►  [ Google Gemini AI Engine ]
                    │                                (gemini-3.5-flash)
                    ▼
     [ Soroban Smart Contract Cluster ] ◄───►  [ Stellar Testnet Ledger ]
```

---

## 🚀 Key Functional Modules

1. **Dashboard Analytics**: Real-time KPI trackers, bespoke vector SVG area graphs, and node telemetry indices.
2. **AI Copilot Suite**:
   - **AI Workflow Bot**: Assembles chronological steps with custom automated roles.
   - **AI Roadmap Planner**: Compiles milestone Gantt charts and initial board cards.
   - **Meeting Summarizer**: Extracts action items and participant summaries.
   - **Code Quality Auditor**: Reviews Rust Soroban and JS files, scoring vulnerability lines.
   - **Strategic Prioritizer**: Recalculates critical paths using resource constraints.
3. **Workspace Views**:
   - **Kanban Task Board**: Lane-by-lane checklist cards with full addition and status updates.
   - **Roadmap Timeline**: Gantt progress reviews.
   - **Bespoke Whiteboard**: Click-and-draw mouse sketching board with custom sizes/colors.
4. **Soroban Smart Contracts**: Compiled Rust logic, simulated ledger sequences, Freighter signatures, and event telemetry.
5. **Billing & Admin**: Stripe subscription mockups, real-time activity logs, seat provisioning, and staff feature flags.

---

## 📡 API Documentation

### 1. `POST /api/ai/generate-workflow`
Assembles a modular workflow pipeline.
- **Payload**: `{ prompt: string }`
- **Response Schema**:
  ```json
  {
    "name": "string",
    "description": "string",
    "steps": [
      { "id": "string", "title": "string", "description": "string", "agent": "string" }
    ]
  }
  ```

### 2. `POST /api/ai/plan-project`
Compiles chronological timelines and initial board backlogs.
- **Payload**: `{ name: string, description: string }`
- **Response Schema**:
  ```json
  {
    "timeline": [ { "week": "string", "milestone": "string", "status": "string" } ],
    "tasks": [ { "title": "string", "description": "string", "priority": "string", "assignee": "string" } ]
  }
  ```

### 3. `POST /api/ai/code-review`
Audits code blocks for flaws, Gas optimization, and style limits.
- **Payload**: `{ code: string, language: string }`
- **Response**: Reviews scores from 0-100, line-specific recommendation blocks, and tech lead feedback.

---

## 🛠️ Local Installation & Development Guide

### Prerequisites
- Node.js (v18+)
- NPM (v9+)

### Installation
1. Clone the repository and install all node packages:
   ```bash
   npm install
   ```
2. Setup your local secrets inside `.env` (copied from `.env.example`):
   ```bash
   cp .env.example .env
   ```
3. Boot the development servers (Express full-stack binds to Port 3000):
   ```bash
   npm run dev
   ```

---

## 🐳 Container Deployment (Cloud Run / Docker)

To compile the multi-stage production container and run it locally:
```bash
docker build -t flowpilot-ai .
docker run -p 3000:3000 --env-file .env flowpilot-ai
```

---

## 🧪 Automated Testing

We maintain 11 unit and integration test files validating authentication, blockchain sequences, and LLM payloads. Execute the test suite locally:
```bash
npm run test
```

---

## ⚖️ License
Licensed under the Apache-2.0 License. See the `LICENSE` metadata for terms.
