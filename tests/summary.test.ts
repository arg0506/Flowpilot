export function testSummary() {
  const summary = {
    text: 'SLA response times optimized',
    actionItems: ['alice to finalize review', 'dave to map ports'],
  };

  if (summary.actionItems.length !== 2) {
    throw new Error('Summary Test Fail: Mismatched action item count.');
  }

  return true;
}
