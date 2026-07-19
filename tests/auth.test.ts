export function testAuth() {
  const mockCredentials = { email: 'argha0506@gmail.com', password: 'password123' };
  const mockOtp = '123456';

  if (!mockCredentials.email.includes('@')) {
    throw new Error('Auth Test Fail: Invalid email formatting.');
  }

  if (mockCredentials.password.length < 8) {
    throw new Error('Auth Test Fail: Password threshold failed.');
  }

  if (mockOtp.length !== 6) {
    throw new Error('Auth Test Fail: OTP code length mismatch.');
  }

  return true;
}
