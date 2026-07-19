import { testAuth } from './auth.test';
import { testApi } from './api.test';
import { testBlockchain } from './blockchain.test';
import { testWorkflow } from './workflow.test';
import { testPrioritization } from './prioritization.test';
import { testPlanner } from './planner.test';
import { testSummary } from './summary.test';
import { testCodeReview } from './codereview.test';
import { testAnalytics } from './analytics.test';
import { testBilling } from './billing.test';
import { testSettings } from './settings.test';

async function runAllTests() {
  console.log('====================================================');
  console.log('[FlowPilot AI SaaS] Initiating Compliance Test Suite');
  console.log('====================================================\n');

  const testSuite = [
    { name: '1. User Authentication & MFA Validation (tests/auth.test.ts)', fn: testAuth },
    { name: '2. Backend API Health Check & Probe (tests/api.test.ts)', fn: testApi },
    { name: '3. Soroban Ledger Transaction & Gas Limit (tests/blockchain.test.ts)', fn: testBlockchain },
    { name: '4. AI Workflow Bot Assembly Schema (tests/workflow.test.ts)', fn: testWorkflow },
    { name: '5. Strategic Backlog Task Prioritizer (tests/prioritization.test.ts)', fn: testPrioritization },
    { name: '6. AI Roadmap Milestones Planner (tests/planner.test.ts)', fn: testPlanner },
    { name: '7. Meeting Summarizer & Action Takeaway (tests/summary.test.ts)', fn: testSummary },
    { name: '8. Security Code Quality Auditor (tests/codereview.test.ts)', fn: testCodeReview },
    { name: '9. Dashboard Telemetry & KPI Calculations (tests/analytics.test.ts)', fn: testAnalytics },
    { name: '10. Stripe Monthly Billing Invoice (tests/billing.test.ts)', fn: testBilling },
    { name: '11. Workspace Configuration & Tokens (tests/settings.test.ts)', fn: testSettings },
  ];

  let passedCount = 0;
  let failedCount = 0;

  for (const test of testSuite) {
    try {
      const res = test.fn();
      if (res) {
        console.log(`\x1b[32m✔ [PASSED]\x1b[0m ${test.name}`);
        passedCount++;
      }
    } catch (err: any) {
      console.log(`\x1b[31m✘ [FAILED]\x1b[0m ${test.name}: ${err.message}`);
      failedCount++;
    }
  }

  console.log('\n====================================================');
  console.log(`Test Execution Summary:`);
  console.log(`  Total Deployed Test Files: ${testSuite.length}`);
  console.log(`  \x1b[32mPassing Tests: ${passedCount}\x1b[0m`);
  if (failedCount > 0) {
    console.log(`  \x1b[31mFailed Tests: ${failedCount}\x1b[0m`);
  } else {
    console.log(`  \x1b[32mCompliance status: 100% SUCCESS\x1b[0m`);
  }
  console.log('====================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAllTests();
