"use client"

import { useEffect, useState } from "react"

// One-file, one-section landing like Luma — dark mode + soft pastel gradient
// TailwindCSS expected in the environment

function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-xs text-zinc-500 ring-1 ring-inset ring-zinc-200 hover:bg-zinc-50 dark:text-zinc-400 dark:ring-zinc-800 dark:hover:bg-zinc-900"
          >
            close
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function ChidiLanding() {
  const [dark, setDark] = useState(true)
  const [open, setOpen] = useState(null) // 'demo' | 'beta' | 'terms' | 'privacy' | 'security' | 'contact' | 'help'
  const [betaSubmitted, setBetaSubmitted] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    if (dark) root.classList.add("dark")
    else root.classList.remove("dark")
  }, [dark])

  const link = (key) => (e) => {
    e.preventDefault()
    setOpen(key)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl opacity-60 dark:opacity-40"
          style={{
            background:
              "radial-gradient(circle at center, #C7D2FE 0%, rgba(199,210,254,0.8) 30%, rgba(199,210,254,0.4) 50%, rgba(199,210,254,0) 70%), radial-gradient(circle at 30% 30%, #FBCFE8 0%, rgba(251,207,232,0.6) 40%, rgba(251,207,232,0) 70%)",
          }}
        />
        <div
          className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full blur-3xl opacity-60 dark:opacity-40"
          style={{
            background:
              "radial-gradient(circle at center, #A7F3D0 0%, rgba(167,243,208,0.8) 30%, rgba(167,243,208,0.4) 50%, rgba(167,243,208,0) 70%), radial-gradient(circle at 70% 70%, #DDD6FE 0%, rgba(221,214,254,0.6) 40%, rgba(221,214,254,0) 70%)",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-30 dark:opacity-20"
          style={{
            background:
              "radial-gradient(circle at center, #FBBF24 0%, rgba(251,191,36,0.4) 40%, rgba(251,191,36,0) 70%)",
          }}
        />
      </div>

      {/* Container */}
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 sm:px-8">
        {/* Top bar */}
        <header className="flex items-center justify-between py-6">
          {/* Logo area — swap the SVG for your final mark */}
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-zinc-100 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
              {/* Orbital C placeholder */}
              <svg viewBox="0 0 48 48" className="h-6 w-6">
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C7D2FE" />
                    <stop offset="50%" stopColor="#FBCFE8" />
                    <stop offset="100%" stopColor="#A7F3D0" />
                  </linearGradient>
                </defs>
                <path
                  d="M30 10a15 15 0 1 0 0 28"
                  fill="none"
                  stroke="url(#grad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="34" cy="10" r="3" fill="#DDD6FE" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight">chidi</span>
          </div>

          {/* Minimal top nav (help + pricing badge) */}
          <nav className="hidden gap-6 text-sm text-zinc-600 dark:text-zinc-400 sm:flex">
            <a href="#" onClick={link("help")} className="hover:text-zinc-900 dark:hover:text-zinc-100">
              help
            </a>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 ring-1 ring-inset ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-800">
              pricing · soon
            </span>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDark(!dark)}
              className="rounded-xl px-3 py-2 text-xs ring-1 ring-inset ring-zinc-300 transition hover:bg-zinc-100 dark:ring-zinc-700 dark:hover:bg-zinc-900"
            >
              {dark ? "light" : "dark"} mode
            </button>
            <a
              href="#beta"
              onClick={link("beta")}
              className="rounded-xl bg-zinc-900 px-4 py-2 text-sm text-zinc-50 shadow-sm transition hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900"
            >
              request early access
            </a>
          </div>
        </header>

        {/* One and only section */}
        <main className="grid flex-1 content-center gap-10 py-10 sm:py-16 md:grid-cols-2 md:gap-12">
          {/* Copy block */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              your marketplace,
              <br /> on autopilot.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              Set up Chidi, connect your store, and let inventory, orders, and reports run quietly in the background
              while you grow.
            </p>

            <div className="mt-7 flex items-center gap-3">
              <a
                href="#beta"
                onClick={link("beta")}
                className="rounded-2xl bg-zinc-900 px-5 py-3 text-sm text-zinc-50 shadow-sm transition hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900"
              >
                join private beta
              </a>
              <a
                href="#demo"
                onClick={link("demo")}
                className="text-sm text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300"
              >
                watch a demo
              </a>
            </div>

            <p className="mt-4 text-xs text-zinc-600 dark:text-zinc-400">
              onboarding our first 100 stores · built with ❤️ in Lagos
            </p>
          </div>

          {/* Imagery block — replace with your mockup/video */}
          <div className="relative">
            <div
              className="absolute -inset-6 -z-10 rounded-3xl opacity-80 blur-2xl dark:opacity-60"
              style={{
                background:
                  "linear-gradient(135deg, rgba(199,210,254,0.5), rgba(251,207,232,0.4), rgba(167,243,208,0.4), rgba(221,214,254,0.3))",
              }}
            />
            {/* Demo placeholder */}
            <div className="aspect-video w-full overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-zinc-100 shadow-xl dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-900">
              <div className="flex h-full w-full items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">demo mockup placeholder</p>
                  <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                    suggested GIF: "inventory low → auto-sync order → daily report card"
                  </p>
                </div>
              </div>
            </div>

            <ul className="mt-4 grid grid-cols-3 gap-3 text-xs text-zinc-700 dark:text-zinc-300">
              <li className="rounded-xl bg-white/80 p-3 ring-1 ring-inset ring-white/20 backdrop-blur-md shadow-sm dark:bg-white/10 dark:ring-white/10">
                📦 effortless inventory
              </li>
              <li className="rounded-xl bg-white/80 p-3 ring-1 ring-inset ring-white/20 backdrop-blur-md shadow-sm dark:bg-white/10 dark:ring-white/10">
                🛒 automated orders
              </li>
              <li className="rounded-xl bg-white/80 p-3 ring-1 ring-inset ring-white/20 backdrop-blur-md shadow-sm dark:bg-white/10 dark:ring-white/10">
                📊 instant reports
              </li>
            </ul>
          </div>
        </main>

        {/* Footer (tiny) */}
        <footer className="flex items-center justify-between py-6 text-xs text-zinc-600 dark:text-zinc-500">
          <div>© 2025 chidi</div>
          <div className="flex gap-5">
            <a href="#" onClick={link("terms")} className="hover:text-zinc-900 dark:hover:text-zinc-300">
              terms
            </a>
            <a href="#" onClick={link("privacy")} className="hover:text-zinc-900 dark:hover:text-zinc-300">
              privacy
            </a>
            <a href="#" onClick={link("security")} className="hover:text-zinc-900 dark:hover:text-zinc-300">
              security
            </a>
            <a href="#" onClick={link("contact")} className="hover:text-zinc-900 dark:hover:text-zinc-300">
              contact
            </a>
            <a href="#" onClick={link("help")} className="hover:text-zinc-900 dark:hover:text-zinc-300">
              help
            </a>
          </div>
        </footer>
      </div>

      {/* DEMO MODAL */}
      <Modal open={open === "demo"} onClose={() => setOpen(null)} title="watch a demo">
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Storyboard</p>
            <ol className="mt-2 list-decimal space-y-2 pl-5">
              <li>
                <span className="font-medium">Inventory drops below threshold</span> → Chidi raises a low-stock alert.
              </li>
              <li>
                <span className="font-medium">Auto-sync orders</span> → new orders are tagged, confirmations sent.
              </li>
              <li>
                <span className="font-medium">Daily summary</span> → a clean report card with revenue, top SKUs, and
                trends.
              </li>
            </ol>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Placeholder</p>
            <div className="aspect-video w-full rounded-lg bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 grid place-items-center">
              <div className="text-center">
                <p className="text-sm">drop a 10–15s GIF/video here</p>
                <p className="text-xs text-zinc-500">
                  hint: show a single uninterrupted flow (inventory → order → report)
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">What to capture</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Real store UI if possible (or high-fidelity mockup).</li>
              <li>Subtle cursor moves, no jump cuts, 1x speed.</li>
              <li>End on the report card with a gentle highlight glow.</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* BETA MODAL */}
      <Modal
        open={open === "beta"}
        onClose={() => {
          setOpen(null)
          setBetaSubmitted(false)
        }}
        title="request early access"
      >
        {!betaSubmitted ? (
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault()
              setBetaSubmitted(true)
            }}
          >
            <div>
              <label className="text-xs text-zinc-500 dark:text-zinc-400">Name</label>
              <input
                required
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 dark:text-zinc-400">Email</label>
              <input
                type="email"
                required
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 dark:text-zinc-400">Business type</label>
              <input
                placeholder="e.g., fashion, electronics, grocery"
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900"
              />
            </div>
            <button className="mt-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900">
              request access
            </button>
            <p className="text-xs text-zinc-500">
              By requesting access you agree to our{" "}
              <a href="#" onClick={link("terms")} className="underline">
                terms
              </a>{" "}
              and{" "}
              <a href="#" onClick={link("privacy")} className="underline">
                privacy
              </a>
              .
            </p>
          </form>
        ) : (
          <div className="space-y-2">
            <p className="text-sm">Thanks — you're on the waitlist. We'll reach out as we onboard stores in batches.</p>
            <p className="text-xs text-zinc-500">
              You can reply to our email to share your current stack and any must-have workflows.
            </p>
          </div>
        )}
      </Modal>

      {/* TERMS */}
      <Modal open={open === "terms"} onClose={() => setOpen(null)} title="terms of service">
        <div className="space-y-3">
          <p>
            <span className="font-medium">Beta use.</span> Chidi is in private beta and provided “as is.” Features may
            change and uptime may vary.
          </p>
          <p>
            <span className="font-medium">Acceptable use.</span> Don’t misuse the product or attempt to access data that
            isn’t yours.
          </p>
          <p>
            <span className="font-medium">Ownership.</span> You retain rights to your data; we retain rights to the
            service and brand.
          </p>
          <p>
            <span className="font-medium">Feedback.</span> Suggestions you share can be used to improve Chidi without
            obligation.
          </p>
          <p>
            <span className="font-medium">Liability.</span> To the extent permitted by law, we’re not liable for
            indirect or consequential losses.
          </p>
          <p className="text-xs text-zinc-500">Effective: Sep 25, 2025</p>
        </div>
      </Modal>

      {/* PRIVACY */}
      <Modal open={open === "privacy"} onClose={() => setOpen(null)} title="privacy policy">
        <div className="space-y-3">
          <p>
            <span className="font-medium">Data we collect.</span> Account info (name, email), store metadata, usage
            analytics, and logs to improve reliability.
          </p>
          <p>
            <span className="font-medium">How we use data.</span> To operate features (inventory sync, order automation,
            reports), improve the product, and support you.
          </p>
          <p>
            <span className="font-medium">Third parties.</span> We may use trusted processors for hosting, analytics,
            and email. No selling of personal data.
          </p>
          <p>
            <span className="font-medium">Security.</span> Encryption in transit, scoped access, audit logs, and
            least-privilege keys (see Security).
          </p>
          <p>
            <span className="font-medium">Your choices.</span> Request export or deletion of your data at any time by
            contacting us.
          </p>
          <p className="text-xs text-zinc-500">Effective: Sep 25, 2025</p>
        </div>
      </Modal>

      {/* SECURITY */}
      <Modal open={open === "security"} onClose={() => setOpen(null)} title="security overview">
        <div className="space-y-3">
          <p>
            <span className="font-medium">Practices.</span> TLS everywhere, hashed credentials, role-based access, and
            scoped API tokens.
          </p>
          <p>
            <span className="font-medium">Data isolation.</span> Tenant-separated data layers; production access is
            tightly controlled and audited.
          </p>
          <p>
            <span className="font-medium">Backups.</span> Encrypted backups with rotation and disaster recovery testing.
          </p>
          <p>
            <span className="font-medium">Reporting.</span> Email{" "}
            <a href="#" onClick={link("contact")} className="underline">
              security@chidi.app
            </a>{" "}
            for vulnerabilities. We aim to respond within 72 hours.
          </p>
        </div>
      </Modal>

      {/* CONTACT */}
      <Modal open={open === "contact"} onClose={() => setOpen(null)} title="contact">
        <div className="space-y-2">
          <p className="text-sm">We’d love to hear from you.</p>
          <ul className="list-disc pl-5 text-sm">
            <li>Email: hello@chidi.app</li>
            <li>Security: security@chidi.app</li>
            <li>Press/partners: partnerships@chidi.app</li>
          </ul>
        </div>
      </Modal>

      {/* HELP */}
      <Modal open={open === "help"} onClose={() => setOpen(null)} title="help center">
        <div className="space-y-3">
          <p className="text-sm">Quick answers:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <span className="font-medium">Does Chidi work with my platform?</span> In beta we support a small set of
              stores; tell us your stack in the request form.
            </li>
            <li>
              <span className="font-medium">Can I export reports?</span> Yes — CSV and scheduled email summaries are in
              testing.
            </li>
            <li>
              <span className="font-medium">Can I cancel?</span> You can leave the beta at any time; we’ll remove your
              data upon request.
            </li>
          </ul>
        </div>
      </Modal>
    </div>
  )
}
