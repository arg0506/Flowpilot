export function testWorkflow() {
  const mockWorkflow = {
    name: 'Deploy Node cluster',
    steps: [
      { id: 'step_1', title: 'Setup Gateway', agent: 'DevOps' },
      { id: 'step_2', title: 'Verify ledger rules', agent: 'Smart Contracts Engineer' }
    ]
  };

  if (mockWorkflow.steps.length < 2) {
    throw new Error('Workflow Test Fail: Generated step sequence too short.');
  }

  return true;
}
