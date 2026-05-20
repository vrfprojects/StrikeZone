# HMAC Authentication Implementation Plan for .NET API

## Overview
This plan describes how to implement HMAC authentication for API endpoints in a .NET backend and how to adapt the client-side code (if using a trusted client). It also highlights security considerations and required code changes.

---

## 1. Secret Management
- Store a unique secret key for each client (e.g., in a secure database or Azure Key Vault).
- Never expose the secret key in browser-based JavaScript.

## 2. Client-Side Changes (for trusted clients only)
- Before making an API request:
  1. Serialize the request body (e.g., JSON).
  2. Generate a timestamp (e.g., Unix epoch milliseconds).
  3. Concatenate the HTTP method, endpoint path, serialized body, and timestamp to form the message.
  4. Use the secret key to compute the HMAC signature (e.g., HMACSHA256).
  5. Add the following headers to the request:
     - `X-Client-Id`: Unique client identifier
     - `X-Timestamp`: Timestamp used in the signature
     - `X-Signature`: The computed HMAC signature
- Use a secure HMAC library (e.g., crypto-js for Node.js or SubtleCrypto for browsers).

## 3. .NET API Changes
- For each protected endpoint:
  1. Extract `X-Client-Id`, `X-Timestamp`, and `X-Signature` from headers.
  2. Retrieve the secret key for the client ID.
  3. Reconstruct the message using the same logic as the client.
  4. Compute the expected HMAC signature using the secret key.
  5. Compare the computed signature with the one from the header (use a constant-time comparison).
  6. Validate the timestamp (e.g., allow a 5-minute window) to prevent replay attacks.
  7. Reject requests with invalid signatures or expired timestamps.
- Use `System.Security.Cryptography.HMACSHA256` for signature validation.

## 4. Security Considerations
- Only use HMAC for trusted clients (e.g., server-to-server, mobile apps).
- For browser-based clients, use OAuth2/JWT instead.
- Protect secret keys and never log them.
- Use HTTPS for all API traffic.

## 5. Example Header Structure
```
X-Client-Id: my-client-id
X-Timestamp: 1716200000000
X-Signature: 2f4a... (HMACSHA256 signature)
```

## 6. Files to Update
- Backend (.NET):
  - Controllers handling API endpoints (add HMAC validation logic)
  - Secret key storage/retrieval logic
- Client (trusted only):
  - API call logic (e.g., contact.js, register.js if used in a trusted environment)

## 7. Documentation
- Update AGENTS.md with HMAC usage and security notes.
- Document the signing process for future maintainers.

---

This plan ensures secure HMAC authentication for your .NET API and trusted clients. For public web clients, use token-based authentication instead.
