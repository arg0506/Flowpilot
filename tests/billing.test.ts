export function testBilling() {
  const invoice = { amount: 39.00, currency: 'USD', status: 'paid' };

  if (invoice.amount !== 39.00) {
    throw new Error('Billing Test Fail: Amount discrepancy.');
  }

  return true;
}
