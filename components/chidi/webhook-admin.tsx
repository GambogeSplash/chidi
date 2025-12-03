"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function WebhookAdmin({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [events, setEvents] = useState<any[]>([])
  const [paymentsMap, setPaymentsMap] = useState<Record<string, any[]>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/paystack/webhook")
        const data = await res.json()
        setEvents(data?.events || [])
        setPaymentsMap(data?.payments || {})
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Webhook Events</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">View recent Paystack webhook events captured locally.</div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => { setEvents([]); setPaymentsMap({}) }}>Clear</Button>
              <Button size="sm" variant="outline" onClick={() => { window.location.reload() }}>Refresh</Button>
            </div>
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="grid gap-3">
              {events.length === 0 && <div className="text-sm text-muted-foreground">No events recorded yet.</div>}
              {events.slice().reverse().map((ev, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle className="text-sm">{ev.body?.event || "Event"}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs overflow-auto max-h-40">{JSON.stringify(ev.body, null, 2)}</pre>
                    <div className="text-xs text-muted-foreground mt-2">Received: {ev.receivedAt}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {Object.keys(paymentsMap).length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Payments map</h4>
              <div className="grid gap-2">
                {Object.entries(paymentsMap).map(([ref, evs]) => (
                  <Card key={ref}>
                    <CardContent>
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{ref}</div>
                        <div className="text-xs text-muted-foreground">{evs.length} events</div>
                      </div>
                      <pre className="text-xs max-h-32 overflow-auto">{JSON.stringify(evs, null, 2)}</pre>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
