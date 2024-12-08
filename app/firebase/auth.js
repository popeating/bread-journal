export function generateVerificationToken() {
  // Generate a random string of 32 characters
  return Array.from(crypto.getRandomValues(new Uint8Array(24)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
