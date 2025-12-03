# Webhook Testing

This repo includes a small webhook stub for Paystack at `/api/paystack/webhook` that logs events to `logs/paystack-webhooks.log.json` and keeps a payments mapping in `logs/paystack-payments.json`.

Quick test with provided script (macOS / Linux):

1. Make sure the dev server is running (see project README). Default local URL: `http://localhost:3000` (Next picks next free port, e.g. 3001).

2. Send the sample event using the included script:

```bash
# without signature
./scripts/send_paystack_webhook.sh http://localhost:3000/api/paystack/webhook

# with signature (computes HMAC SHA-512 using PAYSTACK_SECRET)
./scripts/send_paystack_webhook.sh http://localhost:3000/api/paystack/webhook your_paystack_secret
```

3. Inspect logged events:
- Local file: `logs/paystack-webhooks.log.json` (newline-delimited JSON entries)
- Payments mapping: `logs/paystack-payments.json`
- Or, open the app > Settings > Integrations > "View Webhooks" to view events in the UI.

Notes:
- The script uses `openssl` to compute the signature. If your environment lacks it, compute the signature in your language/tooling and supply it via `-H "x-paystack-signature: <sig>"`.
- For external webhook delivery (from Paystack), expose your local server via `ngrok` and configure the Paystack dashboard to point to the public URL. Keep `PAYSTACK_SECRET` set in environment for signature verification.

Example curl (without signature):

```bash
curl -X POST http://localhost:3000/api/paystack/webhook \
  -H "Content-Type: application/json" \
  -d @scripts/sample_paystack_event.json
```

Example curl (compute signature using openssl):

```bash
BODY=$(cat scripts/sample_paystack_event.json)
SIG=$(printf "%s" "$BODY" | openssl dgst -sha512 -hmac "your_secret" -binary | xxd -p -c 256)
curl -X POST http://localhost:3000/api/paystack/webhook \
  -H "Content-Type: application/json" \
  -H "x-paystack-signature: $SIG" \
  -d "$BODY"
```
