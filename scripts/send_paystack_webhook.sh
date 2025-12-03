#!/usr/bin/env bash
# Usage: ./send_paystack_webhook.sh [URL] [SECRET]
# Example: ./send_paystack_webhook.sh http://localhost:3000/api/paystack/webhook mysecret

URL=${1:-http://localhost:3000/api/paystack/webhook}
SECRET=${2:-}
EVENT_FILE="$(dirname "$0")/sample_paystack_event.json"

if [ ! -f "$EVENT_FILE" ]; then
  echo "Sample event not found: $EVENT_FILE"
  exit 1
fi

BODY=$(cat "$EVENT_FILE")

if [ -n "$SECRET" ]; then
  # Compute HMAC SHA512 signature in hex
  SIG=$(printf "%s" "$BODY" | openssl dgst -sha512 -hmac "$SECRET" -binary | xxd -p -c 256)
  echo "Sending webhook to $URL with signature: $SIG"
  curl -X POST "$URL" \
    -H "Content-Type: application/json" \
    -H "x-paystack-signature: $SIG" \
    -d "$BODY"
else
  echo "Sending webhook to $URL without signature"
  curl -X POST "$URL" -H "Content-Type: application/json" -d "$BODY"
fi

echo "\nDone."
