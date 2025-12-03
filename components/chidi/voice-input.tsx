"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Square, Loader2 } from "lucide-react"

interface VoiceInputProps {
  onTranscribe: (text: string) => void
}

export function VoiceInput({ onTranscribe }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const mediaRecorderRef = useRef<null | { mediaRecorder: MediaRecorder; stream: MediaStream }>(null)
  const recognitionRef = useRef<any>(null)

  const startRecording = async () => {
    try {
      if (!isRecording) {
        // Prefer Web Speech API (SpeechRecognition) when available
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
        if (SpeechRecognition) {
          const r = new SpeechRecognition()
          r.lang = "en-US"
          r.interimResults = false
          r.maxAlternatives = 1
          r.onstart = () => setIsRecording(true)
          r.onresult = (ev: any) => {
            try {
              const transcript = ev.results[0][0].transcript
              onTranscribe(transcript)
            } catch (e) {
              console.error("SpeechRecognition result parse error", e)
            }
          }
          r.onerror = (ev: any) => {
            console.error("SpeechRecognition error", ev)
            setIsRecording(false)
          }
          r.onend = () => {
            setIsRecording(false)
          }
          r.start()
          recognitionRef.current = r
        } else {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
          setIsRecording(true)

          const mediaRecorder = new MediaRecorder(stream)
          const chunks: Blob[] = []

          mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
          mediaRecorder.onstop = async () => {
            setIsProcessing(true)
            const blob = new Blob(chunks, { type: "audio/webm" })

            // Simulate voice-to-text conversion (replace with real STT later)
            const mockTranscription = "I want to order 2 blue dresses in size 10"
            onTranscribe(mockTranscription)

            setIsProcessing(false)
            setIsRecording(false)
            stream.getTracks().forEach((t) => t.stop())
          }

          mediaRecorder.start()
          mediaRecorderRef.current = { mediaRecorder, stream }
        }
      } else {
        // Stop recording
        // stop SpeechRecognition if active
        const r = recognitionRef.current
        if (r && typeof r.stop === "function") {
          try {
            r.stop()
          } catch (e) {
            console.warn("Could not stop recognition", e)
          }
          recognitionRef.current = null
        }

        const m = mediaRecorderRef.current
        if (m?.mediaRecorder && m.mediaRecorder.state !== "inactive") {
          m.mediaRecorder.stop()
        }
      }
    } catch (err) {
      console.error("Microphone access denied")
    }
  }

  // Cleanup on unmount
  // (Optional in this simple component — kept for safety)
  ;(function attachCleanup() {
    if (typeof window === "undefined") return
    // no-op; React will unmount component and GC should cleanup streams. If needed, add effect.
  })()

  return (
    <Button
      variant={isRecording ? "destructive" : "outline"}
      size="sm"
      onClick={startRecording}
      disabled={isProcessing}
      className="w-full"
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : isRecording ? (
        <>
          <Square className="w-4 h-4 mr-2 animate-pulse" />
          Stop Recording
        </>
      ) : (
        <>
          <Mic className="w-4 h-4 mr-2" />
          Voice Input
        </>
      )}
    </Button>
  )
}
