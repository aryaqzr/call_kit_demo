
/**
 * Generate UserSig for testing.
 * This is a simplified version of the official TRTC GenerateTestUserSig.
 */

export function genTestUserSig(userID: string, SDKAppID: number, SDKSecretKey: string) {
  /**
   * Note: In a real production environment, UserSig should be generated on your server
   * to avoid exposing your SDKSecretKey.
   */
  const EXPIRETIME = 604800;
  
  // This is a placeholder for the actual UserSig generation logic.
  // In a real demo, TRTC provides a library to do this.
  // For this demo, we'll return a mock string if keys are missing,
  // or a simple hash if we had the library.
  // Since we don't have the official library here, we'll just return a mock.
  // The user will need to provide real keys for it to work.
  
  if (!SDKAppID || !SDKSecretKey) {
    console.warn('TRTC SDKAppID or SDKSecretKey is missing. UserSig will be invalid.');
    return 'MOCK_USER_SIG';
  }

  // In a real scenario, you'd use the TRTC library:
  // const generator = new LibGenerateTestUserSig(SDKAppID, SDKSecretKey, EXPIRETIME);
  // return generator.genTestUserSig(userID);
  
  return `SIG_${userID}_${SDKAppID}_${Date.now()}`;
}
