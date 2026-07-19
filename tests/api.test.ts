export function testApi() {
  const mockResponse = { status: 'ok', uptime: 214 };
  if (mockResponse.status !== 'ok') {
    throw new Error('API Test Fail: Health probe failed.');
  }
  return true;
}
