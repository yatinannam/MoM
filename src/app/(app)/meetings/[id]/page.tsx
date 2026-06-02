"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { MomRenderer } from "@/components/meeting/mom-renderer"
import { MOCK_MEETINGS } from "@/lib/mock-data"

export default function MeetingDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const meeting = MOCK_MEETINGS.find(m => m.id === parseInt(params.id)) || MOCK_MEETINGS[0]
  
  const [tab, setTab] = useState<"mom" | "summary">("mom")
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard?.writeText(meeting.mom?.replace(/\\*\\*/g, "") || "")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-8 md:p-10 max-w-4xl mx-auto w-full">
      <button 
        onClick={() => router.push("/dashboard")} 
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium mb-8"
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Back to dashboard
      </button>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight mb-2">{meeting.title}</h2>
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-slate-500">{new Date(meeting.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
            <span className="text-slate-300">·</span>
            <span className="text-[13px] text-slate-500">{meeting.participants}</span>
            <span className="text-slate-300">·</span>
            <StatusBadge status={meeting.status} />
          </div>
        </div>
        <Button variant="outline" onClick={copy} className="h-10 rounded-xl px-4 text-[13px] font-semibold border-slate-200 shadow-sm">
          {copied ? "Copied!" : "Copy MoM"}
        </Button>
      </div>

      <div className="flex gap-1 mb-6 border-b border-slate-200">
        {(["mom", "summary"] as const).map(t => (
          <button 
            key={t} 
            onClick={() => setTab(t)} 
            className={`px-5 py-3 text-[14px] font-medium border-b-2 transition-colors ${tab === t ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            {t === "mom" ? "Minutes of Meeting" : "AI Summary"}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 min-h-[400px]">
        {tab === "summary" ? (
          <p className="text-[14.5px] leading-relaxed text-slate-700">{meeting.summary}</p>
        ) : (
          <MomRenderer text={meeting.mom || ""} />
        )}
      </div>
    </div>
  )
}
