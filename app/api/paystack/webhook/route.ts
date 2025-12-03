import fs from "fs"
import path from "path"
import crypto from "crypto"

const LOG_DIR = path.join(process.cwd(), "logs")
const LOG_FILE = path.join(LOG_DIR, "paystack-webhooks.log.json")
const PAYMENTS_FILE = path.join(LOG_DIR, "paystack-payments.json")

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true })
}

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("x-paystack-signature") || ""
    const bodyText = await req.text()

    // Verify signature if secret provided
    const secret = process.env.PAYSTACK_SECRET || ""
    if (secret && signature) {
      const hmac = crypto.createHmac("sha512", secret).update(bodyText).digest("hex")
      if (hmac !== signature) {
        console.warn("Invalid Paystack signature")
        return new Response(JSON.stringify({ ok: false, error: "invalid signature" }), { status: 401 })
      }
    }

    ensureLogDir()

    let parsed: any = null
    try {
      parsed = JSON.parse(bodyText)
    } catch (e) {
      parsed = null
    }

    const entry = {
      receivedAt: new Date().toISOString(),
      signature,
      body: parsed ?? bodyText,
    }

    fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + "\n")

    // Also persist to payments mapping for quick lookup
    try {
      const payments = fs.existsSync(PAYMENTS_FILE) ? JSON.parse(fs.readFileSync(PAYMENTS_FILE, "utf-8")) : {}
      // Try to extract a unique reference (common in Paystack payloads)
      const ref = parsed?.data?.reference || parsed?.data?.metadata?.orderNumber || parsed?.data?.metadata?.orderId || null
      if (ref) {
        payments[ref] = payments[ref] || []
        payments[ref].push({ receivedAt: entry.receivedAt, event: parsed })
        fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(payments, null, 2))
      }
    } catch (e) {
      console.warn("Could not persist payment mapping", e)
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch (err) {
    console.error("Webhook handler error", err)
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 })
  }
}

export async function GET() {
  try {
    ensureLogDir()
    const eventsRaw = fs.existsSync(LOG_FILE) ? fs.readFileSync(LOG_FILE, "utf-8").trim().split(/\n+/) : []
    const events = eventsRaw.filter(Boolean).map((l) => {
      try {
        return JSON.parse(l)
      } catch {
        return { receivedAt: new Date().toISOString(), body: l }
      }
    })

    const payments = fs.existsSync(PAYMENTS_FILE) ? JSON.parse(fs.readFileSync(PAYMENTS_FILE, "utf-8")) : {}

    return new Response(JSON.stringify({ ok: true, events, payments }), { status: 200 })
  } catch (err) {
    console.error("Webhook GET error", err)
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 })
  }
}
