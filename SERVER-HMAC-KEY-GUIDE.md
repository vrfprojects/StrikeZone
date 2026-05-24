## 7. Example API Payloads and HTTP Details

Below are the expected HTTP verb, endpoint, and JSON payloads for the two main API calls from the client. The backend should accept these payloads and validate the headers as described above.

### 7.1 Contact Form Submission
- **HTTP Verb:** POST
- **Endpoint:** `/api/Contact`
- **Headers:**
  - `Content-Type: application/json`
  - `Accept: */*`
  - `X-Request-Key`: (see above)
  - `X-Timestamp`: (see above)
  - `X-Signature`: (see above)
- **JSON Body Example:**
```json
{
  "name": "John Doe",
  "emailAddress": "john@example.com",
  "phoneNumber": "1234567890",
  "subject": "Strike Zone website contact form message",
  "message": "Hello, I am interested in your league."
}
```

### 7.2 Player Registration Submission
- **HTTP Verb:** POST
- **Endpoint:** `/api/Contact/player-registration`
- **Headers:**
  - `Content-Type: application/json`
  - `Accept: */*`
  - `X-Request-Key`: (see above)
  - `X-Timestamp`: (see above)
  - `X-Signature`: (see above)
- **JSON Body Example:**
```json
{
  "playerFullName": "Jane Smith",
  "ageGroup": "U13",
  "playerRole": "Batsman",
  "parentGuardianName": "Mary Smith",
  "whatsAppNumber": "9876543210",
  "emailAddress": "jane@example.com",
  "howDidYouHearAboutUs": "Friend"
}
```

---
# API HMAC & Request Key Implementation Guide

## Overview
This document describes how to implement support for the following headers in your .NET API:
- `X-Request-Key`: Unique per-request key (GUID + datetime to minute)
- `X-Timestamp`: Millisecond timestamp for the request
- `X-Signature`: HMAC SHA-256 signature of the request

These headers are sent by the client for every API call. The server must validate them for request integrity, authenticity, and replay protection.

---

## 1. Header Details
- **X-Request-Key**: A unique string for each request, format: `{GUID}-{YYYYMMDDHHmm}` (e.g., `b7e23e5c-8f2a-4c1a-9e2d-202605201530`).
- **X-Timestamp**: The UTC timestamp (in ms) when the request was created.
- **X-Signature**: HMAC SHA-256 signature of the request, generated using a shared secret, the HTTP method, URL, serialized body, and timestamp.

---

## 2. Server-Side Validation Steps
1. **Extract Headers**: Read `X-Request-Key`, `X-Timestamp`, and `X-Signature` from the request headers.
2. **Replay Protection**: Optionally, store and check `X-Request-Key` to prevent replay attacks (each key should be accepted only once within a time window).
3. **Timestamp Validation**: Ensure `X-Timestamp` is within an acceptable window (e.g., ±5 minutes of server time).
4. **Signature Verification**:
   - Reconstruct the message string as the client does:
     - `message = HTTP_METHOD + URL + JSON_BODY + X-Timestamp`
   - Retrieve the shared secret for the client (from config, DB, or Key Vault).
   - Compute the HMAC SHA-256 signature of the message using the secret.
   - Compare the computed signature to the value in `X-Signature` (use constant-time comparison).
5. **Reject** requests with missing/invalid headers, expired timestamps, or signature mismatches.

---

## 3. .NET Example (C#)
```csharp
using System.Security.Cryptography;
using System.Text;

string ComputeHmacSignature(string secret, string message)
{
    var key = Encoding.UTF8.GetBytes(secret);
    var msg = Encoding.UTF8.GetBytes(message);
    using (var hmac = new HMACSHA256(key))
    {
        var hash = hmac.ComputeHash(msg);
        return BitConverter.ToString(hash).Replace("-", "").ToLower();
    }
}
```

**Message Construction:**
```csharp
string message = method + url + jsonBody + timestamp;
string signature = ComputeHmacSignature(secret, message);
```

---

## 4. Security Notes
- Store secrets securely (e.g., Azure Key Vault, environment variables).
- Use HTTPS for all API traffic.
- Never log or expose the secret key.
- For public APIs, consider additional authentication (OAuth2/JWT).

---

## 5. Error Handling
- Respond with 401 Unauthorized for invalid/missing signatures.
- Respond with 400 Bad Request for missing/invalid headers or expired timestamps.

---

## 6. References
- [HMACSHA256 .NET Docs](https://learn.microsoft.com/en-us/dotnet/api/system.security.cryptography.hmacsha256)
- [Replay Attack Prevention](https://owasp.org/www-community/attacks/Replay_attack)

---

This guide ensures your API can validate and trust requests from clients using the request key and HMAC signature approach.
