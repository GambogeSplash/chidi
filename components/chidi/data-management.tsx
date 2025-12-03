"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Upload, Trash2, Database, Loader2 } from "lucide-react"

interface DataManagementProps {
  lastBackup?: Date
  dataSize?: number
}

export function DataManagement({ lastBackup, dataSize = 2.5 }: DataManagementProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)

  const handleExportData = async () => {
    setIsExporting(true)
    try {
      // Simulate data export
      const data = {
        exportDate: new Date().toISOString(),
        version: "1.0",
        includes: ["products", "customers", "orders", "conversations"],
      }

      const element = document.createElement("a")
      element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2)))
      element.setAttribute("download", `chidi-backup-${Date.now()}.json`)
      element.style.display = "none"
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    } finally {
      setIsExporting(false)
    }
  }

  const handleAutoBackup = () => {
    // Simulate automatic backup
    alert("Automatic backups are enabled. Your data is backed up daily.")
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Data Management</h3>
      </div>

      {/* Storage Info */}
      <div className="bg-muted/50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <p className="font-medium text-sm">Storage Used</p>
          <Badge variant="outline">{dataSize}MB / 5GB</Badge>
        </div>
        <div className="w-full bg-border rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${(dataSize / 5000) * 100}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">{((dataSize / 5000) * 100).toFixed(1)}% used</p>
      </div>

      {/* Backup Info */}
      <div className="border border-border rounded-lg p-4">
        <p className="font-medium text-sm mb-2">Automatic Backups</p>
        <p className="text-xs text-muted-foreground mb-3">
          {lastBackup ? `Last backup: ${lastBackup.toLocaleDateString()}` : "Never backed up"}
        </p>
        <Button size="sm" onClick={handleAutoBackup} className="w-full mb-2">
          Enable Daily Backups
        </Button>
      </div>

      {/* Export/Import */}
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleExportData} disabled={isExporting} className="flex-1 bg-transparent">
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </>
          )}
        </Button>
        <Button variant="outline" disabled={isRestoring} className="flex-1 bg-transparent">
          {isRestoring ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </>
          )}
        </Button>
      </div>

      {/* Danger Zone */}
      <div className="border border-red-200 bg-red-50 rounded-lg p-4">
        <p className="font-medium text-sm text-red-900 mb-2">Danger Zone</p>
        <p className="text-xs text-red-700 mb-3">Delete all your business data permanently. This cannot be undone.</p>
        <Button variant="destructive" size="sm" className="w-full">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete All Data
        </Button>
      </div>
    </Card>
  )
}
