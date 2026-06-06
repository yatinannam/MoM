"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useMeetingFlow } from "@/components/meeting/meeting-context"
import { MOCK_TRANSCRIPT } from "@/lib/mock-data"

export default function TranscriptPage() {
  const router = useRouter()
  const { meetingData, setMeetingData } = useMeetingFlow()
  
  const [step, setStep] = useState<"processing" | "review">("processing")
  const [progress, setProgress] = useState(0)
  const [transcript, setTranscript] = useState(MOCK_TRANSCRIPT)
  const [edited, setEdited] = useState(false)

  useEffect(() => {
    if (step !== "processing") return
    const iv = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { 
          clearInterval(iv)
          setStep("review")
          return 100 
        }
        return p + Math.random() * 15 + 5
      })
    }, 300)
    return () => clearInterval(iv)
  }, [step])

  const handleNext = () => {
    if (meetingData) {
      setMeetingData({ ...meetingData, transcript })
      router.push("/meetings/draft-1/mom")
    }
  }

  if (step === "processing") {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-sm w-full">
          <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-500/15 flex items-center justify-center mx-auto mb-6 shadow-inner">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="text-indigo-600 dark:text-indigo-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Transcribing Audio…</h3>
          <p className="text-[14px] text-slate-500 dark:text-slate-400 mb-8">Converting speech to text using AI. This may take a moment.</p>
          <Progress value={progress} className="h-2.5 mb-3 bg-slate-100 dark:bg-slate-800" />
          <p className="text-[13px] font-mono text-indigo-600 dark:text-indigo-400 font-medium">{Math.round(progress)}%</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 md:p-10 max-w-4xl mx-auto w-full flex flex-col h-full">
      <button 
        onClick={() => router.push("/meetings/draft-1/record")} 
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors text-sm font-medium mb-8 shrink-0"
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Back
      </button>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">Review Transcript</h2>
          <p className="text-[14px] text-slate-500 dark:text-slate-400 mt-1">Check the transcript and correct any errors before generating MoM.</p>
        </div>
        {edited && (
          <Badge variant="secondary" className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-none dark:bg-amber-500/15 dark:text-amber-400 dark:hover:bg-amber-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
            Edited
          </Badge>
        )}
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 mb-6 flex flex-col min-h-[400px]">
        <div className="flex justify-between items-center mb-4 shrink-0 px-1">
          <span className="text-[14px] font-semibold text-slate-700 dark:text-slate-200">Transcript</span>
          <span className="text-[13px] text-slate-400 dark:text-slate-500">{transcript.split(/\\s+/).length} words</span>
        </div>
        <Textarea 
          value={transcript} 
          onChange={e => { setTranscript(e.target.value); setEdited(true) }}
          className="flex-1 min-h-[300px] border-none shadow-none focus-visible:ring-0 p-1 text-[14px] leading-relaxed text-slate-700 dark:text-slate-300 font-mono resize-none dark:bg-transparent"
        />
      </div>

      <div className="shrink-0 flex justify-end">
        <Button onClick={handleNext} className="h-12 px-8 rounded-xl font-semibold shadow-sm w-full sm:w-auto">
          Generate MoM
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="ml-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  )
}
