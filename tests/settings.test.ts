export function testSettings() {
  const settings = {
    orgName: 'Argha Labs',
    authToken: 'fp_live_token_7a6d8923bc114fe83f',
  };

  if (!settings.orgName) {
    throw new Error('Settings Test Fail: Organization name cannot be blank.');
  }

  return true;
}
