# AI Coding Agent Instructions for StrikeZoneCricketLeague

## JavaScript and API Usage

This project uses JavaScript for client-side interactivity and form handling. The main JS files are in the `assets/` directory. Key patterns and conventions for API consumption and JS usage are as follows:

### API Consumption
- All API calls use the `fetch` API with `POST` requests and JSON payloads.
- Endpoints are external (e.g., `https://ex.bakerly.co.za/api/Contact` and `/api/Contact/player-registration`).
- Standard headers: `Content-Type: application/json`, `Accept: */*`.
- All API requests include:
	- `X-Request-Key`: Unique per-request key (GUID + datetime to minute)
	- `X-Timestamp`: Millisecond timestamp for the request
	- `X-Signature`: HMAC SHA-256 signature of the request (see hmac.js)
- Error handling: If the response status is not 200, the error is surfaced to the user and logged to the console. The UI is updated to show error or success messages.
- All API requests serialize data using `JSON.stringify`.

### JavaScript Conventions
- JS files are organized by feature: `contact.js`, `register.js`, `index.js`, `common.js`.
- DOM manipulation is done using `document.getElementById` and `classList`.
- Form validation is performed before API calls; errors are shown inline.
- Success and error UI states are managed by toggling classes and updating text content.

### Recommendations for AI Agents
- When adding new API calls, follow the existing `fetch` pattern for consistency.
- Always handle non-200 responses and provide user feedback.
- Use the `generateRequestKey()` utility from `common.js` for request keys.
- Use the `generateHmacSignature()` utility from `hmac.js` for HMAC signatures.
- Place new JS files in the `assets/` directory and keep code modular by feature.
- Link to this file for JS/API conventions; do not duplicate content in other docs.

---

This file helps AI coding agents quickly understand how JavaScript and API consumption are handled in this project. For more details, see the code in the `assets/` directory, especially `common.js` and `hmac.js` for request key and HMAC logic.
