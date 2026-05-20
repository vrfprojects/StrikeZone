# Generic Request Key Feature Implementation Plan

## Overview
This plan describes how to implement a generic feature for generating and attaching a unique request key (GUID + datetime to the minute) to every API call in the client project. This feature can be reused across all API requests for tracking, idempotency, or additional security layers.

---

## 1. Feature Purpose
- Generate a unique key for each API request.
- Key format: `{GUID}-{YYYYMMDDHHmm}` (e.g., `b7e23e5c-8f2a-4c1a-9e2d-202605201530`).
- Attach this key as a custom header (e.g., `X-Request-Key`) to every outgoing API request.
- Make the feature reusable for all API calls in the project.

## 2. Implementation Steps

### a. Utility Function
- Create a utility function (e.g., `generateRequestKey()`) that:
  - Generates a GUID (use a standard JS function or library).
  - Gets the current date/time up to the minute (format: YYYYMMDDHHmm).
  - Returns the combined string.

### b. Integration with API Calls
- Refactor API call logic (e.g., in `contact.js`, `register.js`, and any other API modules) to:
  - Call `generateRequestKey()` before each fetch/AJAX request.
  - Add the result as the `X-Request-Key` header.
- Optionally, centralize API call logic in a helper module for easier maintenance.

### c. Testing
- Ensure every outgoing API request includes a unique `X-Request-Key` header.
- Validate the format and uniqueness of the key.
- Test with multiple API endpoints and concurrent requests.

### d. Documentation
- Update AGENTS.md and relevant docs to describe the generic request key feature and its usage.

---

## 3. Files to Update
- `assets/common.js` (utility function)
- `assets/contact.js`, `assets/register.js`, and any other files making API calls (integration)
- `AGENTS.md` (document the feature)

---

## 4. Security & Usage Notes
- This feature is for request identification, tracking, or idempotency—not for authentication.
- For authentication, combine with HMAC or other secure methods as needed.
- The approach is safe for public clients, as no secrets are exposed.

---

This plan enables a reusable, generic request key feature for all API calls in your client project.
