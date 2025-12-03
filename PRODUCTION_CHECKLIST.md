# PRODUCTION CHECKLIST

This document summarizes what is implemented, what is missing, and recommended next steps to get the app production-ready. Use this as the single source of truth while we wire and verify features.

---

## #2 - Messaging & Integration

- [ ] WhatsApp Business API — missing (needs account, webhook + message sync)
- [ ] Instagram DM integration — missing (platform API + webhooks)
- [ ] SMS integration — missing (provider + credentials)
- [ ] Unified inbox — missing (UI + sync logic)
- [⚠️] Real message sync — simulated only (currently messages are local or simulated)

Notes / relevant files:
- Conversations UI: `components/chidi/conversations-page.tsx`
- Core message utilities: `lib/chidi-core.ts`

---

## #3 - Product Management

- [x] CSV bulk import — component created: `components/chidi/bulk-csv-import.tsx`
- [x] Photo upload UI — `components/chidi/catalog-tab.tsx`
- [ ] Product variants — designed but not fully implemented (UI + data model)
- [⚠️] Stock tracking — basic implementation present; needs audits & background updates
- [ ] Auto-catalog from chat — not implemented (needs NLP -> product creation pipeline)

Relevant files:
- `components/chidi/catalog-tab.tsx`
- `components/chidi/add-product-page.tsx`, `add-product-modal.tsx`
- CSV parsing: `lib/chidi-core.ts` (parseCSV)

---

## #4 - Order Management

- [x] Conversational order creation — `components/chidi/create-order-flow.tsx`, `detectOrderFromMessage` in `lib/chidi-core.ts`
- [x] Auto-order detection — `lib/chidi-core.ts`
- [x] Order status tracking — `components/chidi/orders-tab.tsx`
- [⚠️] Automated status updates — basic notification only (no webhook-driven updates)

---

## #5 - Payment Integration

- [x] Paystack integration (client-side flow / link generation): `lib/paystack-integration.ts`, `components/chidi/payment-link-generator.tsx`, `components/chidi/payment-checkout.tsx`
- [x] Invoice generation — `components/chidi/invoice-generator.tsx` and `lib/chidi-core.ts` `formatInvoice`
- [⚠️] Payment status tracking — needs webhook support (server route + persistence)

Note: to track payment status reliably we need a server endpoint and webhook secret.

---

## #6 - Customer Management

- [x] Auto-customer profiles — `lib/chidi-core.ts` (`autoProfileCustomer`)
- [x] Customer communication history — `components/chidi/conversations-page.tsx`
- [ ] Segmentation — `components/chidi/customer-segmentation.tsx` created but not integrated into UI/workflows
- [ ] Lifetime value calculation — partially in `lib/analytics.ts`

---

## #7 - Analytics

- [x] Analytics dashboard created: `components/chidi/analytics-dashboard.tsx`
- [x] Metrics calculation — `lib/analytics.ts` (`calculateBusinessMetrics`)
- [ ] Line graphs — Recharts integration needed (chart components import present but not wired)
- [ ] Export reports — not implemented (CSV / PDF export)

---

## #9 - Business Configuration

- [x] Business hours config — `components/chidi/business-hours-config.tsx`
- [x] Profile management — `components/chidi/settings-tab.tsx`
# PRODUCTION CHECKLIST

This document summarizes what is implemented, what is missing, and recommended next steps to get the app production-ready. Use this as the single source of truth while we wire and verify features.

---

## #2 - Messaging & Integration

- [ ] WhatsApp Business API — missing (needs account, webhook + message sync)
- [ ] Instagram DM integration — missing (platform API + webhooks)
- [ ] SMS integration — missing (provider + credentials)
- [ ] Unified inbox — missing (UI + sync logic)
- [⚠️] Real message sync — simulated only (currently messages are local or simulated)

Notes / relevant files:
- Conversations UI: `components/chidi/conversations-page.tsx`
- Core message utilities: `lib/chidi-core.ts`

---

## #3 - Product Management

- [x] CSV bulk import — component created: `components/chidi/bulk-csv-import.tsx`
- [x] Photo upload UI — `components/chidi/catalog-tab.tsx`
- [x] Product variants — structured UI added in `components/chidi/add-product-modal.tsx`; variants are persisted with products and displayed in catalog & product detail views
- [⚠️] Stock tracking — basic implementation present; needs audits & background updates
- [ ] Auto-catalog from chat — not implemented (needs NLP -> product creation pipeline)

Relevant files:
- `components/chidi/catalog-tab.tsx`
- `components/chidi/add-product-page.tsx`, `add-product-modal.tsx`
- CSV parsing: `lib/chidi-core.ts` (parseCSV)

---

## #4 - Order Management

- [x] Conversational order creation — `components/chidi/create-order-flow.tsx`, `detectOrderFromMessage` in `lib/chidi-core.ts`
- [x] Auto-order detection — `lib/chidi-core.ts`
- [x] Order status tracking — `components/chidi/orders-tab.tsx`
- [⚠️] Automated status updates — basic notification only (no webhook-driven updates)

---

## #5 - Payment Integration

- [x] Paystack integration (client-side flow / link generation): `lib/paystack-integration.ts`, `components/chidi/payment-link-generator.tsx`, `components/chidi/payment-checkout.tsx`
- [x] Invoice generation — `components/chidi/invoice-generator.tsx` and `lib/chidi-core.ts` `formatInvoice`
- [⚠️] Payment status tracking — webhook stub added at `app/api/paystack/webhook/route.ts` (logs events). Basic signature verification implemented (env `PAYSTACK_SECRET`) and client-side application of events is wired; further hardening and server-side persistence optional.

Note: to track payment status reliably we need a server endpoint and webhook secret. The stub lets you inspect raw webhook payloads during development.

---

## #6 - Customer Management

- [x] Auto-customer profiles — `lib/chidi-core.ts` (`autoProfileCustomer`)
- [x] Customer communication history — `components/chidi/conversations-page.tsx`
- [ ] Segmentation — `components/chidi/customer-segmentation.tsx` created but not integrated into UI/workflows
- [ ] Lifetime value calculation — partially in `lib/analytics.ts`

---

## #7 - Analytics

- [x] Analytics dashboard created: `components/chidi/analytics-dashboard.tsx`
- [x] Metrics calculation — `lib/analytics.ts` (`calculateBusinessMetrics`)
- [x] Line graphs — Recharts line chart added and wired (revenue trend) in `components/chidi/analytics-dashboard.tsx`
- [ ] Export reports — not implemented (CSV / PDF export)

---

## #9 - Business Configuration

- [x] Business hours config — `components/chidi/business-hours-config.tsx`
- [x] Profile management — `components/chidi/settings-tab.tsx`
- [ ] Auto-responses — not implemented
- [ ] FAQ management — not implemented

---

## #10 - AI Coaching

- [x] Whisper mode panel created — `components/chidi/whisper-mode-panel.tsx`
- [x] Upsell suggestions — present in whisper flow
- [ ] Pricing optimization — not implemented

---

## #11 - Voice & Media

- [x] Voice input UI — `components/chidi/voice-input.tsx` (UI integrated into `HomeTab`)
- [⚠️] Photo enhancer — planned, not implemented

Notes: `VoiceInput` now prefers the browser Web Speech API (SpeechRecognition) when available and falls back to MediaRecorder + simulated transcription. Server-side STT remains an option for more robust coverage.

---

## #12 - Content Generation

- [x] Content generation library: `lib/content-generation.ts`
- [x] Instagram caption generation — implemented
- [ ] Product description generation — not implemented

---

## #13 - Customer Recovery

- [x] Customer recovery component — `components/chidi/customer-recovery.tsx`
- [ ] Win-back campaigns — not implemented

---

## #15 - Language & Personality

- [x] Nigerian Gen-Z personality — `lib/ai-engine.ts`, `components/chidi/home-tab.tsx` uses personality switch
- [ ] Language translation (Yoruba, Igbo, Hausa) — not implemented
- [x] Local currency support — Naira displayed throughout the UI

---

## #16 - Mobile + Desktop

- [x] Mobile-first responsive design — UI uses responsive classes
- [⚠️] PWA — planned (service worker exists), not fully implemented
- [ ] Push notifications — not implemented
- [ ] Deep linking — not implemented

---

## #17 - Integrations

- [ ] Shipping API integration — not implemented
- [ ] Email service (SendGrid) — not implemented
- [ ] SMS provider — not implemented
- [ ] Analytics export — not implemented

---

## #18 - Data Security

- [ ] Encryption — not implemented (at-rest / in-transit considerations)
- [x] localStorage backups (basic) — implemented in `lib/storage.ts`
- [ ] GDPR compliance — needs data deletion, export, and privacy flow
- [ ] 2FA — not implemented

---

## The Real Problem

Most components already exist but are not consistently wired into the visible UI. Root causes:

1. Some client-only components (icons, hooks) were initially imported in server components — caused runtime/build errors.
2. A syntax error in `lib/chidi-core.ts` prevented builds — fixed.
3. Some components were created but not exposed via the header/sidebar or page routes, so they are hidden.
4. A few UI/UX decisions remain (where to surface features permanently vs experimental/dev surface).

---

## Recommendation & Prioritized Next Steps (short)

Immediate (1-3 days):
- Wire the remaining user-facing modals/pages into the header/sidebar (Profile Edit, Bulk Import, Invoice, Payment Checkout, Whisper Mode) — DONE for header quick actions.
- Replace simulated voice transcription with Web Speech API (client-side) for a quick, real mic -> text experience. (Implemented)
- Add product-variant UI and simple variant data model. (UI added; persistence pending)

Short term (1-2 weeks):
- Add payment webhook endpoint stub and local simulation for Paystack webhooks. (Stub implemented)
- Integrate segmentation and lifetime value into Customer page and analytics.
- Add Recharts graphs for analytics line charts and wire into dashboard. (Implemented)

Medium term (2-6 weeks):
- Build unified inbox (requires integration with WhatsApp, Instagram, SMS or 3rd-party aggregator).
- Add email/SMS providers and shipping integration.
- Implement export reports and scheduled report generation.

Security & Compliance (ongoing):
- Plan data retention, GDPR flows, and at-rest encryption for sensitive fields.
- Add optional 2FA for account security.

---

## Run & Test (local)

Start dev server:

```bash
cd "$(pwd)"
pnpm install
pnpm dev  # runs on next free port (3001 if 3000 busy)
```

Production build check:

```bash
pnpm build
```

---

## Want me to do next?

I can pick the top-priority items and implement them in this order:
1. Persist product variants into the catalog/storage and show them in product listings/detail pages.
2. Implement Paystack webhook signature verification and update order/payment state on verified events.
3. Add a friendly variants editor UI (form-based) instead of raw JSON in the Add Product modal.
4. Add webhook testing docs + a small test script to POST sample Paystack events (curl/ngrok).

Reply with a number (1-4) or tell me a different priority and I will start implementing it.
