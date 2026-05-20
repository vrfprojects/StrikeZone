# HMAC Integration Implementation Plan (Client-Side)

## Overview
This plan outlines the changes required in the StrikeZoneCricketLeague client project to support HMAC authentication when calling APIs. This is only suitable if the client is a trusted environment (e.g., desktop app, server-side Node.js, or internal tool). For public web clients, HMAC is not recommended.

---

## 1. Prerequisites
- Instead of a static client ID, generate a unique key for each request by combining:
  - A GUID (Globally Unique Identifier)
  - The current date and time up to the minute (format: YYYYMMDDHHmm)
- Example: `b7e23e5c-8f2a-4c1a-9e2d-202605201530`
- This key can be used as a request identifier and sent as a custom header (e.g., `X-Request-Key`).
- If a secret key is still required for HMAC, ensure it is stored securely and not exposed in public code.

## 2. Library Selection
- Use a JavaScript HMAC library (e.g., `crypto-js` for Node.js or browser, or the Web Crypto API for modern browsers).
- Add the library to the project (e.g., via npm or CDN).

## 3. Message Construction
- Before each API call, construct a message string by concatenating:
  - HTTP method (e.g., POST)
  - API endpoint path (e.g., /api/Contact)
  - Serialized request body (JSON)
  - Timestamp (e.g., Unix epoch ms)

## 4. Signature Generation
- Use the secret key and the constructed message to generate an HMAC signature (e.g., HMACSHA256).
- Example (pseudocode):
  ```js
  const message = method + path + JSON.stringify(data) + timestamp;
  const signature = hmacSHA256(secret, message);
  ```

## 5. Add Headers to Fetch Request
- Include the following headers in each API request:
  - `X-Request-Key`: The generated GUID+datetime key
  - `X-Timestamp`: The timestamp used in the signature (if needed)
  - `X-Signature`: The generated HMAC signature (if using HMAC)

## 6. Update JS Files
- The unique request key (GUID+datetime) feature is implemented and integrated into all API calls in `assets/contact.js` and `assets/register.js`.
- HMAC signature generation is now implemented using the `generateHmacSignature` utility in `assets/hmac.js`.
- Each API call includes `X-Request-Key`, `X-Timestamp`, and `X-Signature` headers.
- For demo/testing, the secret key is prompted at runtime. For production, ensure the secret is securely managed and not exposed in public code.

## 7. Testing
- The request key header is present and unique for each API call.
- HMAC authentication is implemented and tested: the signature is included in the header and changes with the request content/timestamp.

## 8. Documentation
- Update AGENTS.md to document the HMAC signing process, the use of the GUID+datetime key, and security notes for client-side usage.

---

**Note:**
- Never expose the secret key in browser-based code for public websites. For public clients, use OAuth2/JWT instead.
- This plan is only for trusted client scenarios.
- The GUID+datetime key approach is for request identification and tracking, not for authentication. HMAC is now used for authentication.
- For production, securely manage the secret key and do not prompt for it in the UI.
