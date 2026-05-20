// HMAC utility for browser (using SubtleCrypto)
// Usage: generateHmacSignature(secret, message) => Promise<string>

async function generateHmacSignature(secret, message) {
  // Encode as UTF-8
  const enc = new TextEncoder();
  const keyData = enc.encode(secret);
  const msgData = enc.encode(message);

  // Import the secret key
  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  // Sign the message
  const signature = await window.crypto.subtle.sign('HMAC', cryptoKey, msgData);

  // Convert ArrayBuffer to hex string
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
